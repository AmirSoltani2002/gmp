import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';
import s3Config from './s3.config';

// Mock the AWS SDK
const mockS3Client = {
  send: jest.fn(),
};

const mockGetSignedUrl = jest.fn();

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => mockS3Client),
  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
  ListObjectsV2Command: jest.fn(),
  HeadObjectCommand: jest.fn(),
  CopyObjectCommand: jest.fn(),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: mockGetSignedUrl,
}));

describe('S3Service', () => {
  let service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(s3Config),
      ],
      providers: [S3Service],
    })
      .overrideProvider(s3Config.KEY)
      .useValue({
        region: 'us-east-1',
        bucket: 'test-bucket',
        accessKeyId: 'test-key',
        secretAccessKey: 'test-secret',
        endpoint: undefined,
        forcePathStyle: false,
      })
      .compile();

    service = module.get<S3Service>(S3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const mockResult = {
        ETag: '"test-etag"',
      };
      mockS3Client.send.mockResolvedValue(mockResult);

      const file = Buffer.from('test file content');
      const result = await service.uploadFile(file, {
        folder: 'test',
        fileName: 'test.txt',
        contentType: 'text/plain',
      });

      expect(result).toEqual({
        key: expect.stringMatching(/^test\/test\.txt$/),
        url: expect.stringContaining('test-bucket'),
        bucket: 'test-bucket',
        size: file.length,
        contentType: 'text/plain',
        etag: '"test-etag"',
      });

      expect(mockS3Client.send).toHaveBeenCalled();
    });

    it('should upload a multer file successfully', async () => {
      const mockResult = {
        ETag: '"test-etag"',
      };
      mockS3Client.send.mockResolvedValue(mockResult);

      const multerFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test image content'),
        destination: '',
        filename: '',
        path: '',
        stream: null,
      };

      const result = await service.uploadMulterFile(multerFile);

      expect(result).toEqual({
        key: expect.stringContaining('test.jpg'),
        url: expect.stringContaining('test-bucket'),
        bucket: 'test-bucket',
        size: multerFile.buffer.length,
        contentType: 'image/jpeg',
        etag: '"test-etag"',
      });
    });
  });

  describe('downloadFile', () => {
    it('should download a file successfully', async () => {
      const mockBody = {
        [Symbol.asyncIterator]: async function* () {
          yield Buffer.from('test content');
        },
      };

      mockS3Client.send.mockResolvedValue({
        Body: mockBody,
      });

      const result = await service.downloadFile('test/file.txt');

      expect(result).toEqual(Buffer.from('test content'));
      expect(mockS3Client.send).toHaveBeenCalled();
    });
  });

  describe('getPresignedDownloadUrl', () => {
    it('should generate a presigned download URL', async () => {
      const mockUrl = 'https://test-bucket.s3.amazonaws.com/test/file.txt?X-Amz-Signature=...';
      mockGetSignedUrl.mockResolvedValue(mockUrl);

      const result = await service.getPresignedDownloadUrl('test/file.txt', 3600);

      expect(result).toBe(mockUrl);
      expect(mockGetSignedUrl).toHaveBeenCalled();
    });
  });

  describe('deleteFile', () => {
    it('should delete a file successfully', async () => {
      mockS3Client.send.mockResolvedValue({});

      await service.deleteFile('test/file.txt');

      expect(mockS3Client.send).toHaveBeenCalled();
    });
  });

  describe('fileExists', () => {
    it('should return true when file exists', async () => {
      mockS3Client.send.mockResolvedValue({
        ContentLength: 1024,
        LastModified: new Date(),
      });

      const result = await service.fileExists('test/file.txt');

      expect(result).toBe(true);
    });

    it('should return false when file does not exist', async () => {
      const error = new Error('NotFound');
      error.name = 'NotFound';
      mockS3Client.send.mockRejectedValue(error);

      const result = await service.fileExists('test/nonexistent.txt');

      expect(result).toBe(false);
    });
  });

  describe('getFileInfo', () => {
    it('should get file information successfully', async () => {
      const mockResult = {
        ContentLength: 1024,
        LastModified: new Date('2025-10-19'),
        ContentType: 'text/plain',
        ETag: '"test-etag"',
      };
      mockS3Client.send.mockResolvedValue(mockResult);

      const result = await service.getFileInfo('test/file.txt');

      expect(result).toEqual({
        key: 'test/file.txt',
        size: 1024,
        lastModified: mockResult.LastModified,
        contentType: 'text/plain',
        etag: '"test-etag"',
      });
    });
  });

  describe('listFiles', () => {
    it('should list files successfully', async () => {
      const mockResult = {
        Contents: [
          {
            Key: 'test/file1.txt',
            Size: 1024,
            LastModified: new Date('2025-10-19'),
            ETag: '"etag1"',
          },
          {
            Key: 'test/file2.txt',
            Size: 2048,
            LastModified: new Date('2025-10-19'),
            ETag: '"etag2"',
          },
        ],
      };
      mockS3Client.send.mockResolvedValue(mockResult);

      const result = await service.listFiles('test/', 100);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        key: 'test/file1.txt',
        size: 1024,
        lastModified: mockResult.Contents[0].LastModified,
        contentType: 'application/octet-stream',
        etag: '"etag1"',
      });
    });
  });

  describe('copyFile', () => {
    it('should copy a file successfully', async () => {
      mockS3Client.send.mockResolvedValue({});

      await service.copyFile('source/file.txt', 'destination/file.txt');

      expect(mockS3Client.send).toHaveBeenCalled();
    });
  });

  describe('utility methods', () => {
    it('should return correct bucket name', () => {
      expect(service.getBucketName()).toBe('test-bucket');
    });

    it('should return correct region', () => {
      expect(service.getRegion()).toBe('us-east-1');
    });

    it('should generate correct public URL', () => {
      const url = service.getPublicUrl('test/file.txt');
      expect(url).toBe('https://test-bucket.s3.us-east-1.amazonaws.com/test/file.txt');
    });
  });
});