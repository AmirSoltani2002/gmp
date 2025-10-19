import { Test, TestingModule } from '@nestjs/testing';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('S3Controller', () => {
  let controller: S3Controller;
  let service: S3Service;

  const mockS3Service = {
    uploadMulterFile: jest.fn(),
    uploadFile: jest.fn(),
    downloadFile: jest.fn(),
    getPresignedDownloadUrl: jest.fn(),
    deleteFile: jest.fn(),
    fileExists: jest.fn(),
    getFileInfo: jest.fn(),
    listFiles: jest.fn(),
    copyFile: jest.fn(),
    getBucketName: jest.fn().mockReturnValue('test-bucket'),
    getRegion: jest.fn().mockReturnValue('us-east-1'),
    getPublicUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3Controller],
      providers: [
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    controller = module.get<S3Controller>(S3Controller);
    service = module.get<S3Service>(S3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    const mockFile: Express.Multer.File = {
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

    it('should upload a file successfully', async () => {
      const mockResult = {
        key: 'uploads/test.jpg',
        url: 'https://test-bucket.s3.amazonaws.com/uploads/test.jpg',
        bucket: 'test-bucket',
        size: 1024,
        contentType: 'image/jpeg',
        etag: '"test-etag"',
      };
      mockS3Service.uploadMulterFile.mockResolvedValue(mockResult);

      const result = await controller.uploadFile(mockFile, {
        folder: 'uploads',
      });

      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
      expect(service.uploadMulterFile).toHaveBeenCalledWith(mockFile, {
        folder: 'uploads',
      });
    });

    it('should throw BadRequestException when no file provided', async () => {
      await expect(controller.uploadFile(null, {}))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('downloadFile', () => {
    it('should download a file successfully', async () => {
      const mockBuffer = Buffer.from('test content');
      mockS3Service.downloadFile.mockResolvedValue(mockBuffer);

      const result = await controller.downloadFile('test/file.txt');

      expect(result).toEqual(mockBuffer);
      expect(service.downloadFile).toHaveBeenCalledWith('test/file.txt');
    });
  });

  describe('getPresignedUrl', () => {
    it('should generate presigned URL successfully', async () => {
      const mockUrl = 'https://test-bucket.s3.amazonaws.com/test/file.txt?X-Amz-Signature=...';
      mockS3Service.getPresignedDownloadUrl.mockResolvedValue(mockUrl);

      const result = await controller.getPresignedUrl('test/file.txt', {
        expiresIn: 3600,
      });

      expect(result).toEqual({
        success: true,
        data: {
          url: mockUrl,
          expiresIn: 3600,
        },
      });
      expect(service.getPresignedDownloadUrl).toHaveBeenCalledWith('test/file.txt', 3600);
    });

    it('should use default expiration when not provided', async () => {
      const mockUrl = 'https://test-bucket.s3.amazonaws.com/test/file.txt?X-Amz-Signature=...';
      mockS3Service.getPresignedDownloadUrl.mockResolvedValue(mockUrl);

      await controller.getPresignedUrl('test/file.txt', {});

      expect(service.getPresignedDownloadUrl).toHaveBeenCalledWith('test/file.txt', 3600);
    });
  });

  describe('listFiles', () => {
    it('should list files successfully', async () => {
      const mockFiles = [
        {
          key: 'test/file1.txt',
          size: 1024,
          lastModified: new Date('2025-10-19'),
          contentType: 'text/plain',
          etag: '"etag1"',
        },
        {
          key: 'test/file2.txt',
          size: 2048,
          lastModified: new Date('2025-10-19'),
          contentType: 'text/plain',
          etag: '"etag2"',
        },
      ];
      mockS3Service.listFiles.mockResolvedValue(mockFiles);

      const result = await controller.listFiles({
        prefix: 'test/',
        maxKeys: 10,
      });

      expect(result).toEqual({
        success: true,
        data: {
          files: mockFiles,
          count: 2,
        },
      });
      expect(service.listFiles).toHaveBeenCalledWith('test/', 10);
    });

    it('should use default values when not provided', async () => {
      mockS3Service.listFiles.mockResolvedValue([]);

      await controller.listFiles({});

      expect(service.listFiles).toHaveBeenCalledWith('', 1000);
    });
  });

  describe('getFileInfo', () => {
    it('should get file info successfully when file exists', async () => {
      const mockInfo = {
        key: 'test/file.txt',
        size: 1024,
        lastModified: new Date('2025-10-19'),
        contentType: 'text/plain',
        etag: '"test-etag"',
      };
      mockS3Service.fileExists.mockResolvedValue(true);
      mockS3Service.getFileInfo.mockResolvedValue(mockInfo);

      const result = await controller.getFileInfo('test/file.txt');

      expect(result).toEqual({
        success: true,
        data: mockInfo,
      });
    });

    it('should throw NotFoundException when file does not exist', async () => {
      mockS3Service.fileExists.mockResolvedValue(false);

      await expect(controller.getFileInfo('test/nonexistent.txt'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully when file exists', async () => {
      mockS3Service.fileExists.mockResolvedValue(true);
      mockS3Service.deleteFile.mockResolvedValue(undefined);

      const result = await controller.deleteFile('test/file.txt');

      expect(result).toEqual({
        success: true,
        message: 'File deleted successfully',
      });
      expect(service.deleteFile).toHaveBeenCalledWith('test/file.txt');
    });

    it('should throw NotFoundException when file does not exist', async () => {
      mockS3Service.fileExists.mockResolvedValue(false);

      await expect(controller.deleteFile('test/nonexistent.txt'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('copyFile', () => {
    it('should copy file successfully when source exists', async () => {
      mockS3Service.fileExists.mockResolvedValue(true);
      mockS3Service.copyFile.mockResolvedValue(undefined);

      const result = await controller.copyFile({
        sourceKey: 'source/file.txt',
        destinationKey: 'destination/file.txt',
      });

      expect(result).toEqual({
        success: true,
        message: 'File copied successfully',
        data: {
          sourceKey: 'source/file.txt',
          destinationKey: 'destination/file.txt',
        },
      });
      expect(service.copyFile).toHaveBeenCalledWith('source/file.txt', 'destination/file.txt');
    });

    it('should throw NotFoundException when source file does not exist', async () => {
      mockS3Service.fileExists.mockResolvedValue(false);

      await expect(controller.copyFile({
        sourceKey: 'source/nonexistent.txt',
        destinationKey: 'destination/file.txt',
      })).rejects.toThrow(NotFoundException);
    });
  });

  describe('getBucketInfo', () => {
    it('should return bucket information', async () => {
      const result = await controller.getBucketInfo();

      expect(result).toEqual({
        success: true,
        data: {
          bucketName: 'test-bucket',
          region: 'us-east-1',
        },
      });
    });
  });
});