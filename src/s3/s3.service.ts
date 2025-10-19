import { Injectable, Inject, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CopyObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Config from './s3.config';
import { Readable } from 'stream';

export interface UploadOptions {
  folder?: string;
  fileName?: string;
  contentType?: string;
  metadata?: Record<string, string>;
  tags?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  size: number;
  contentType: string;
  etag?: string;
}

export interface FileInfo {
  key: string;
  size: number;
  lastModified: Date;
  contentType: string;
  etag: string;
}

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;

  constructor(
    @Inject(s3Config.KEY)
    private readonly config: ConfigType<typeof s3Config>,
  ) {
    this.s3Client = new S3Client({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
      endpoint: this.config.endpoint,
      forcePathStyle: this.config.forcePathStyle,
    });

    this.logger.log(`S3 Service initialized with region: ${this.config.region}, bucket: ${this.config.bucket}`);
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(
    file: Buffer | Uint8Array | string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    try {
      const key = this.generateKey(options.folder, options.fileName);
      const contentType = options.contentType || 'application/octet-stream';

      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
        Metadata: options.metadata,
        Tagging: options.tags ? this.formatTags(options.tags) : undefined,
      });

      const result = await this.s3Client.send(command);
      
      const uploadResult: UploadResult = {
        key,
        url: this.getPublicUrl(key),
        bucket: this.config.bucket,
        size: Buffer.isBuffer(file) ? file.length : file.toString().length,
        contentType,
        etag: result.ETag,
      };

      this.logger.log(`File uploaded successfully: ${key}`);
      return uploadResult;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Upload a file from Express multer
   */
  async uploadMulterFile(
    file: Express.Multer.File,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const uploadOptions: UploadOptions = {
      ...options,
      fileName: options.fileName || file.originalname,
      contentType: options.contentType || file.mimetype,
    };

    return this.uploadFile(file.buffer, uploadOptions);
  }

  /**
   * Download a file from S3
   */
  async downloadFile(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });

      const result = await this.s3Client.send(command);
      
      if (result.Body instanceof Readable) {
        const chunks: Buffer[] = [];
        for await (const chunk of result.Body) {
          chunks.push(chunk);
        }
        return Buffer.concat(chunks);
      }

      throw new Error('Unable to read file body');
    } catch (error) {
      this.logger.error(`Failed to download file ${key}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get a presigned URL for file download
   */
  async getPresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      
      this.logger.log(`Generated presigned URL for ${key}, expires in ${expiresIn}s`);
      return url;
    } catch (error) {
      this.logger.error(`Failed to generate presigned URL for ${key}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get a presigned URL for file upload
   */
  async getPresignedUploadUrl(
    key: string, 
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        ContentType: contentType,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      
      this.logger.log(`Generated presigned upload URL for ${key}, expires in ${expiresIn}s`);
      return url;
    } catch (error) {
      this.logger.error(`Failed to generate presigned upload URL for ${key}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file ${key}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete multiple files from S3
   */
  async deleteFiles(keys: string[]): Promise<void> {
    try {
      const deletePromises = keys.map(key => this.deleteFile(key));
      await Promise.all(deletePromises);
      
      this.logger.log(`Deleted ${keys.length} files successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete multiple files: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Check if a file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get file information
   */
  async getFileInfo(key: string): Promise<FileInfo> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });

      const result = await this.s3Client.send(command);
      
      return {
        key,
        size: result.ContentLength || 0,
        lastModified: result.LastModified || new Date(),
        contentType: result.ContentType || 'application/octet-stream',
        etag: result.ETag || '',
      };
    } catch (error) {
      this.logger.error(`Failed to get file info for ${key}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * List files in a folder
   */
  async listFiles(
    prefix?: string,
    maxKeys: number = 1000
  ): Promise<FileInfo[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.config.bucket,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const result = await this.s3Client.send(command);
      
      return (result.Contents || []).map(object => ({
        key: object.Key || '',
        size: object.Size || 0,
        lastModified: object.LastModified || new Date(),
        contentType: 'application/octet-stream', // Not available in list operation
        etag: object.ETag || '',
      }));
    } catch (error) {
      this.logger.error(`Failed to list files with prefix ${prefix}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Copy a file within S3
   */
  async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    try {
      const command = new CopyObjectCommand({
        Bucket: this.config.bucket,
        Key: destinationKey,
        CopySource: `${this.config.bucket}/${sourceKey}`,
      });

      await this.s3Client.send(command);
      
      this.logger.log(`File copied from ${sourceKey} to ${destinationKey}`);
    } catch (error) {
      this.logger.error(`Failed to copy file from ${sourceKey} to ${destinationKey}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(key: string): string {
    if (this.config.endpoint) {
      // Custom endpoint (like MinIO)
      return `${this.config.endpoint}/${this.config.bucket}/${key}`;
    }
    
    // Standard AWS S3 URL
    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;
  }

  /**
   * Generate a unique key for file storage
   */
  private generateKey(folder?: string, fileName?: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const randomId = Math.random().toString(36).substring(2, 15);
    
    const name = fileName || `file-${timestamp}-${randomId}`;
    
    if (folder) {
      return `${folder}/${name}`;
    }
    
    return name;
  }

  /**
   * Format tags for S3
   */
  private formatTags(tags: Record<string, string>): string {
    return Object.entries(tags)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  /**
   * Get bucket name
   */
  getBucketName(): string {
    return this.config.bucket;
  }

  /**
   * Get region
   */
  getRegion(): string {
    return this.config.region;
  }
}