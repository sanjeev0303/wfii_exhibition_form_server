# Architecture Diagram

## Layer Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        HTTP Request                              │
│                     (Multipart Form Data)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ROUTES LAYER                             │
│  • exhibition.routes.ts                                          │
│  • Multer middleware for file uploads                           │
│  • Route definitions & validation                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONTROLLER LAYER                            │
│  Interface: IExhibitionController                                │
│  Implementation: ExhibitionController                            │
│                                                                   │
│  Responsibilities:                                               │
│  • Request validation                                            │
│  • Extract multipart data                                        │
│  • Call service methods                                          │
│  • Format HTTP responses                                         │
│  • Error handling                                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                              │
│  Interface: IExhibitionService                                   │
│  Implementation: ExhibitionService                               │
│                                                                   │
│  Responsibilities:                                               │
│  • Business logic orchestration                                  │
│  • Coordinate ImageKit uploads                                   │
│  • Transform entities to DTOs                                    │
│  • Call repository for persistence                               │
│  • Transaction management                                        │
└──────────────┬──────────────────────────┬───────────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  IMAGEKIT SERVICE        │  │  REPOSITORY LAYER        │
│  Interface:              │  │  Interface:              │
│  IImageKitService        │  │  IExhibitionRepository   │
│                          │  │                          │
│  Implementation:         │  │  Implementation:         │
│  ImageKitService         │  │  ExhibitionRepository    │
│                          │  │                          │
│  Responsibilities:       │  │  Responsibilities:       │
│  • Upload files          │  │  • Database CRUD         │
│  • Delete media          │  │  • Query operations      │
│  • Handle ImageKit API   │  │  • Prisma integration    │
└──────────┬───────────────┘  └──────────┬───────────────┘
           │                              │
           ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│  ImageKit Cloud      │      │  PostgreSQL          │
│  (External Service)  │      │  (Neon Database)     │
└──────────────────────┘      └──────────────────────┘
```

## Data Flow Example: Create Exhibition

```
1. Client sends POST with files
        ↓
2. Multer middleware processes multipart data
        ↓
3. ExhibitionController.createExhibition()
   - Validates required files (poster, productImages)
   - Validates form fields
   - Creates CreateExhibitionDto
        ↓
4. ExhibitionService.createExhibition()
   - Uploads poster via ImageKitService
   - Uploads product images via ImageKitService
   - Uploads video (if provided) via ImageKitService
   - Builds CreateExhibitionData with URLs
        ↓
5. ExhibitionRepository.create()
   - Saves to PostgreSQL via Prisma
   - Returns Exhibition entity
        ↓
6. ExhibitionService maps entity to ExhibitionResponseDto
        ↓
7. Controller formats response with ResponseBuilder
        ↓
8. HTTP 201 response with created exhibition
```

## Interface Dependencies

```
IExhibitionController
        │
        ├─► IExhibitionService
        │           │
        │           ├─► IExhibitionRepository
        │           │           │
        │           │           └─► Prisma Client
        │           │
        │           └─► IImageKitService
        │                       │
        │                       └─► ImageKit SDK
        │
        └─► ResponseBuilder (Utility)
```

## DTO Flow

```
HTTP Request
     ↓
CreateExhibitionDto (Input)
     ↓
CreateExhibitionData (Repository Layer)
     ↓
Exhibition (Prisma Entity)
     ↓
ExhibitionResponseDto (Output)
     ↓
ApiResponse<ExhibitionResponseDto> (HTTP Response)
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has distinct responsibilities
2. **Testability**: Interfaces allow easy mocking
3. **Maintainability**: Changes isolated to specific layers
4. **Scalability**: Easy to add caching, logging, or new features
5. **Type Safety**: TypeScript enforces contracts at compile time

## Example: Adding Caching

To add Redis caching, you'd only modify the service layer:

```typescript
class CachedExhibitionService implements IExhibitionService {
  constructor(
    private baseService: IExhibitionService,
    private cache: ICacheService
  ) {}

  async getAllExhibitions() {
    const cached = await this.cache.get('exhibitions');
    if (cached) return cached;
    
    const data = await this.baseService.getAllExhibitions();
    await this.cache.set('exhibitions', data, 300);
    return data;
  }
}
```

No changes needed to controller or repository!
