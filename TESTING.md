# Testing Guide with Interfaces

## Overview

Interfaces enable comprehensive unit testing by allowing dependency injection and mocking. This guide demonstrates testing strategies for each layer.

## Setup

Install testing dependencies:
```bash
npm install -D jest @types/jest ts-jest
npm install -D @faker-js/faker
```

Configure Jest (`jest.config.js`):
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.interface.ts'],
};
```

---

## Unit Testing Examples

### 1. Testing ImageKit Service

```typescript
// src/services/__tests__/imagekit.service.test.ts
import { ImageKitService } from '../imagekit.service';
import { IImageKitService } from '../../interfaces';

describe('ImageKitService', () => {
  let service: IImageKitService;

  beforeEach(() => {
    service = new ImageKitService();
  });

  it('should upload a file successfully', async () => {
    const buffer = Buffer.from('test-image-data');
    const fileName = 'test.jpg';

    const result = await service.uploadFile(buffer, fileName, 'test-folder');

    expect(result).toHaveProperty('url');
    expect(result).toHaveProperty('fileId');
    expect(result.url).toContain('ik.imagekit.io');
  });

  it('should upload multiple files', async () => {
    const files = [
      { buffer: Buffer.from('image1'), originalname: 'img1.jpg' },
      { buffer: Buffer.from('image2'), originalname: 'img2.jpg' },
    ];

    const urls = await service.uploadMultipleFiles(files, 'test-folder');

    expect(urls).toHaveLength(2);
    urls.forEach(url => expect(url).toContain('ik.imagekit.io'));
  });
});
```

---

### 2. Testing Exhibition Repository

```typescript
// src/repositories/__tests__/exhibition.repository.test.ts
import { ExhibitionRepository } from '../exhibition.repository';
import { IExhibitionRepository } from '../../interfaces';
import { prisma } from '../../lib/prisma';

// Mock Prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    exhibition: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('ExhibitionRepository', () => {
  let repository: IExhibitionRepository;

  beforeEach(() => {
    repository = new ExhibitionRepository();
    jest.clearAllMocks();
  });

  it('should create an exhibition', async () => {
    const mockData = {
      companyName: 'Test Company',
      companyDescription: 'Description',
      companyPosterUrl: 'https://...',
      companyAbout: 'About',
      productName: 'Product',
      productDescription: 'Desc',
      productAbout: 'About',
      productImages: ['https://...'],
    };

    const mockExhibition = { id: '123', ...mockData, createdAt: new Date(), updatedAt: new Date() };
    (prisma.exhibition.create as jest.Mock).mockResolvedValue(mockExhibition);

    const result = await repository.create(mockData);

    expect(result).toEqual(mockExhibition);
    expect(prisma.exhibition.create).toHaveBeenCalledWith({ data: mockData });
  });

  it('should find all exhibitions', async () => {
    const mockExhibitions = [
      { id: '1', companyName: 'Company 1', /* ... */ },
      { id: '2', companyName: 'Company 2', /* ... */ },
    ];
    (prisma.exhibition.findMany as jest.Mock).mockResolvedValue(mockExhibitions);

    const result = await repository.findAll();

    expect(result).toHaveLength(2);
    expect(prisma.exhibition.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should find exhibition by id', async () => {
    const mockExhibition = { id: '123', companyName: 'Test' /* ... */ };
    (prisma.exhibition.findUnique as jest.Mock).mockResolvedValue(mockExhibition);

    const result = await repository.findById('123');

    expect(result).toEqual(mockExhibition);
    expect(prisma.exhibition.findUnique).toHaveBeenCalledWith({ where: { id: '123' } });
  });
});
```

---

### 3. Testing Exhibition Service (with Mocks)

```typescript
// src/services/__tests__/exhibition.service.test.ts
import { ExhibitionService } from '../exhibition.service';
import { IExhibitionService, IExhibitionRepository, IImageKitService } from '../../interfaces';

describe('ExhibitionService', () => {
  let service: IExhibitionService;
  let mockRepository: jest.Mocked<IExhibitionRepository>;
  let mockImageKit: jest.Mocked<IImageKitService>;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Create mock ImageKit service
    mockImageKit = {
      uploadFile: jest.fn(),
      uploadMultipleFiles: jest.fn(),
      deleteFile: jest.fn(),
    };

    // Inject mocks (you'd need to update the service constructor)
    service = new ExhibitionService(mockRepository, mockImageKit);
  });

  it('should create exhibition with file uploads', async () => {
    const dto = {
      companyName: 'Tech Corp',
      companyDescription: 'Innovative solutions',
      companyAbout: 'About us',
      productName: 'Product X',
      productDescription: 'Amazing product',
      productAbout: 'Product details',
    };

    const posterFile = {
      buffer: Buffer.from('poster'),
      originalname: 'poster.jpg',
    } as Express.Multer.File;

    const productImages = [
      { buffer: Buffer.from('img1'), originalname: 'img1.jpg' } as Express.Multer.File,
    ];

    // Mock ImageKit uploads
    mockImageKit.uploadFile.mockResolvedValue({
      url: 'https://ik.imagekit.io/poster.jpg',
      fileId: 'poster-id',
    });
    mockImageKit.uploadMultipleFiles.mockResolvedValue([
      'https://ik.imagekit.io/img1.jpg',
    ]);

    // Mock repository create
    const mockExhibition = {
      id: '123',
      ...dto,
      companyPosterUrl: 'https://ik.imagekit.io/poster.jpg',
      productImages: ['https://ik.imagekit.io/img1.jpg'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRepository.create.mockResolvedValue(mockExhibition);

    const result = await service.createExhibition(dto, posterFile, productImages);

    expect(result.id).toBe('123');
    expect(result.companyName).toBe('Tech Corp');
    expect(mockImageKit.uploadFile).toHaveBeenCalledTimes(1);
    expect(mockImageKit.uploadMultipleFiles).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should get all exhibitions', async () => {
    const mockExhibitions = [
      { id: '1', companyName: 'Company 1', /* ... */ },
    ];
    mockRepository.findAll.mockResolvedValue(mockExhibitions);

    const result = await service.getAllExhibitions();

    expect(result).toHaveLength(1);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should handle upload failures', async () => {
    const dto = { /* ... */ };
    const posterFile = { /* ... */ } as Express.Multer.File;
    const productImages = [{ /* ... */ }] as Express.Multer.File[];

    mockImageKit.uploadFile.mockRejectedValue(new Error('Upload failed'));

    await expect(
      service.createExhibition(dto, posterFile, productImages)
    ).rejects.toThrow('Failed to create exhibition');
  });
});
```

---

### 4. Testing Exhibition Controller

```typescript
// src/controllers/__tests__/exhibition.controller.test.ts
import { Request, Response, NextFunction } from 'express';
import { ExhibitionController } from '../exhibition.controller';
import { IExhibitionController, IExhibitionService } from '../../interfaces';

describe('ExhibitionController', () => {
  let controller: IExhibitionController;
  let mockService: jest.Mocked<IExhibitionService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockService = {
      createExhibition: jest.fn(),
      getAllExhibitions: jest.fn(),
      getExhibitionById: jest.fn(),
    };

    controller = new ExhibitionController(mockService);

    mockRequest = {
      body: {},
      params: {},
      files: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  it('should return 400 if poster is missing', async () => {
    mockRequest.files = { productImages: [] };

    await controller.createExhibition(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Company poster is required',
      })
    );
  });

  it('should create exhibition successfully', async () => {
    mockRequest.body = {
      companyName: 'Tech Corp',
      companyDescription: 'Desc',
      companyAbout: 'About',
      productName: 'Product',
      productDescription: 'Desc',
      productAbout: 'About',
    };

    mockRequest.files = {
      poster: [{ buffer: Buffer.from('poster'), originalname: 'poster.jpg' }],
      productImages: [{ buffer: Buffer.from('img'), originalname: 'img.jpg' }],
    };

    const mockExhibition = { id: '123', companyName: 'Tech Corp', /* ... */ };
    mockService.createExhibition.mockResolvedValue(mockExhibition);

    await controller.createExhibition(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Exhibition created successfully',
        data: mockExhibition,
      })
    );
  });

  it('should get all exhibitions', async () => {
    const mockExhibitions = [{ id: '1', /* ... */ }];
    mockService.getAllExhibitions.mockResolvedValue(mockExhibitions);

    await controller.getAllExhibitions(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: mockExhibitions,
      })
    );
  });

  it('should return 404 if exhibition not found', async () => {
    mockRequest.params = { id: '999' };
    mockService.getExhibitionById.mockResolvedValue(null);

    await controller.getExhibitionById(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Exhibition not found',
      })
    );
  });
});
```

---

## Integration Testing

```typescript
// src/__tests__/integration/exhibition.integration.test.ts
import request from 'supertest';
import { createApp } from '../../app';
import { prisma } from '../../lib/prisma';

describe('Exhibition API Integration Tests', () => {
  let app: Express.Application;

  beforeAll(() => {
    app = createApp();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.exhibition.deleteMany();
  });

  it('should create exhibition via API', async () => {
    const response = await request(app)
      .post('/api/exhibitions')
      .field('companyName', 'Tech Corp')
      .field('companyDescription', 'Description')
      .field('companyAbout', 'About')
      .field('productName', 'Product')
      .field('productDescription', 'Product desc')
      .field('productAbout', 'Product about')
      .attach('poster', Buffer.from('poster-data'), 'poster.jpg')
      .attach('productImages', Buffer.from('img-data'), 'img.jpg');

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
  });

  it('should get all exhibitions', async () => {
    // Create test data
    await prisma.exhibition.create({
      data: {
        companyName: 'Test Company',
        companyDescription: 'Desc',
        companyPosterUrl: 'https://...',
        companyAbout: 'About',
        productName: 'Product',
        productDescription: 'Desc',
        productAbout: 'About',
        productImages: ['https://...'],
      },
    });

    const response = await request(app).get('/api/exhibitions');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
  });
});
```

---

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Happy path + error scenarios

Run tests:
```bash
npm test                  # Run all tests
npm test -- --coverage   # With coverage report
npm test -- --watch      # Watch mode
```

---

## Benefits of Interface-Based Testing

1. ✅ **Fast**: Mock external dependencies (DB, APIs)
2. ✅ **Isolated**: Test one layer at a time
3. ✅ **Reliable**: No flaky network/DB issues
4. ✅ **Maintainable**: Change implementations without changing tests
5. ✅ **Documentation**: Tests demonstrate usage patterns
