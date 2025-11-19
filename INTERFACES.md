# Interface Architecture Documentation

## Overview

This project follows SOLID principles with interface-based design for maintainability, testability, and extensibility. Each layer is abstracted through interfaces, enabling dependency inversion and easier unit testing.

## Interface Hierarchy

```
interfaces/
├── imagekit-service.interface.ts       # Media upload abstraction
├── exhibition-repository.interface.ts  # Data access abstraction
├── exhibition-service.interface.ts     # Business logic abstraction
├── exhibition-controller.interface.ts  # HTTP handler abstraction
└── index.ts                           # Central exports
```

## Design Principles Applied

### 1. **Single Responsibility Principle (SRP)**
Each interface defines a single responsibility:
- `IImageKitService`: File upload operations
- `IExhibitionRepository`: Database CRUD operations
- `IExhibitionService`: Business logic orchestration
- `IExhibitionController`: HTTP request/response handling

### 2. **Open/Closed Principle (OCP)**
Interfaces are open for extension but closed for modification. You can:
- Create new implementations without changing existing code
- Add optional methods for future features
- Extend functionality through composition

### 3. **Liskov Substitution Principle (LSP)**
Any implementation of an interface can be substituted without breaking the application:
```typescript
// Can swap implementations
const service: IExhibitionService = new ExhibitionService();
// Or use a mock for testing
const mockService: IExhibitionService = new MockExhibitionService();
```

### 4. **Interface Segregation Principle (ISP)**
Interfaces are focused and don't force implementations to depend on methods they don't use. Optional methods are marked with `?` for future extensions.

### 5. **Dependency Inversion Principle (DIP)**
High-level modules (controllers, services) depend on abstractions (interfaces), not concrete implementations.

---

## Interface Details

### IImageKitService
**Purpose**: Abstract file upload operations to external media service

**Key Methods**:
- `uploadFile()` - Upload single file
- `uploadMultipleFiles()` - Batch upload
- `deleteFile()` - Remove media

**Implementation**: `ImageKitService` in `src/services/imagekit.service.ts`

**Benefits**:
- Easy to mock for testing
- Can swap to different storage providers (S3, Cloudinary, etc.)
- Centralized error handling

---

### IExhibitionRepository
**Purpose**: Abstract database operations (Repository Pattern)

**Key Methods**:
- `create()` - Insert new exhibition
- `findAll()` - Query all exhibitions
- `findById()` - Query by ID
- `update()` - Modify exhibition
- `delete()` - Remove exhibition

**Optional Methods** (for future):
- `findByCompanyName()` - Search by company
- `count()` - Pagination support

**Implementation**: `ExhibitionRepository` in `src/repositories/exhibition.repository.ts`

**Benefits**:
- Decouples business logic from ORM
- Easy to unit test services with mock repositories
- Can switch ORMs (Prisma → TypeORM) without changing services
- Enables query optimization in one place

---

### IExhibitionService
**Purpose**: Define business logic contracts

**Key Methods**:
- `createExhibition()` - Orchestrate file uploads + DB save
- `getAllExhibitions()` - Retrieve all with DTOs
- `getExhibitionById()` - Retrieve single exhibition

**Optional Methods** (for future):
- `updateExhibition()` - Update with new files
- `deleteExhibition()` - Remove with cleanup

**Implementation**: `ExhibitionService` in `src/services/exhibition.service.ts`

**Benefits**:
- Clear contract for business operations
- Easy to test with mocked dependencies
- Enables multiple service implementations (e.g., caching layer)

---

### IExhibitionController
**Purpose**: Define HTTP handler contracts

**Key Methods**:
- `createExhibition()` - POST /api/exhibitions
- `getAllExhibitions()` - GET /api/exhibitions
- `getExhibitionById()` - GET /api/exhibitions/:id

**Optional Methods** (for future):
- `updateExhibition()` - PUT /api/exhibitions/:id
- `deleteExhibition()` - DELETE /api/exhibitions/:id

**Implementation**: `ExhibitionController` in `src/controllers/exhibition.controller.ts`

**Benefits**:
- Standardized request/response handling
- Easy to create alternative controllers (GraphQL, gRPC)
- Simplifies middleware testing

---

## Usage Examples

### Dependency Injection Ready
```typescript
// Constructor injection (future improvement)
class ExhibitionService implements IExhibitionService {
  constructor(
    private readonly repository: IExhibitionRepository,
    private readonly mediaService: IImageKitService
  ) {}
}
```

### Testing with Mocks
```typescript
// Unit test example
const mockRepo: IExhibitionRepository = {
  create: jest.fn().mockResolvedValue(mockExhibition),
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(mockExhibition),
  delete: jest.fn(),
  update: jest.fn(),
};

const service = new ExhibitionService(mockRepo, mockMediaService);
```

### Swapping Implementations
```typescript
// Switch from ImageKit to AWS S3
class S3Service implements IImageKitService {
  async uploadFile(file: Buffer, fileName: string) {
    // S3 upload logic
    return { url: "...", fileId: "..." };
  }
  // ... implement other methods
}

// Just swap the service
const s3Service = new S3Service();
```

---

## Future Extensions

### Planned Interface Additions

1. **Authentication Service**
```typescript
interface IAuthService {
  validateToken(token: string): Promise<User>;
  generateToken(userId: string): Promise<string>;
}
```

2. **Logging Service**
```typescript
interface ILoggerService {
  info(message: string, metadata?: any): void;
  error(message: string, error?: Error): void;
}
```

3. **Cache Service**
```typescript
interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
}
```

---

## Migration Path

If you need to refactor existing code to use dependency injection:

1. **Update constructors**:
```typescript
class ExhibitionService {
  constructor(
    private readonly repository: IExhibitionRepository,
    private readonly imageKit: IImageKitService
  ) {}
}
```

2. **Update route handlers**:
```typescript
const repository = new ExhibitionRepository();
const imageKit = new ImageKitService();
const service = new ExhibitionService(repository, imageKit);
const controller = new ExhibitionController(service);
```

3. **Add IoC container** (optional - for advanced DI):
```typescript
// Using tsyringe or inversify
container.register<IExhibitionRepository>("ExhibitionRepository", ExhibitionRepository);
```

---

## Benefits Summary

✅ **Testability**: Mock interfaces for unit tests  
✅ **Maintainability**: Clear contracts reduce coupling  
✅ **Extensibility**: Add features without breaking existing code  
✅ **Flexibility**: Swap implementations easily  
✅ **Documentation**: Interfaces serve as API contracts  
✅ **Type Safety**: TypeScript enforces interface compliance  

---

## Related Files

- **Implementations**: `src/controllers/`, `src/services/`, `src/repositories/`
- **DTOs**: `src/dtos/exhibition.dto.ts`
- **Utils**: `src/utils/response.util.ts`
- **Routes**: `src/routes/exhibition.routes.ts`
