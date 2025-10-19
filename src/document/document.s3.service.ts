import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class DocumentS3Service {
  private s3Client: S3Client;

  constructor() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials are required: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
    }

    const config: any = {
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };

    // Add endpoint configuration for MinIO or custom S3-compatible services
    if (process.env.AWS_S3_ENDPOINT) {
      config.endpoint = process.env.AWS_S3_ENDPOINT;
      config.forcePathStyle = true; // Required for MinIO
    }

    this.s3Client = new S3Client(config);
  }

  async uploadFile(bucket: string, key: string, buffer: Buffer, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);
  }

  async deleteFile(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  async getPresignedUrl(bucket: string, key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }
}