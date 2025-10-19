import { registerAs } from '@nestjs/config';

export interface S3Config {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  forcePathStyle?: boolean;
}

export default registerAs('s3', (): S3Config => ({
  region: process.env.AWS_REGION || 'us-east-1',
  bucket: process.env.AWS_S3_BUCKET || 'gmp-backend-files',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  endpoint: process.env.AWS_S3_ENDPOINT, // For MinIO or custom S3-compatible services
  forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
}));