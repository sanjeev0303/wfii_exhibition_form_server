# Exhibition API Documentation

## Base URL
```
http://localhost:4000/api/exhibitions
```

## Endpoints

### 1. Create Exhibition
Create a new exhibition with company and product information.

**Endpoint:** `POST /api/exhibitions`

**Content-Type:** `multipart/form-data`

**Required Files:**
- `poster` (File) - Company poster image (1 file, max 50MB)
- `productImages` (File[]) - Product images (1-10 files, max 50MB each)

**Optional Files:**
- `productVideo` (File) - Product introduction video (1 file, max 50MB)

**Form Fields:**
```json
{
  "companyName": "string (required)",
  "companyDescription": "string (required)",
  "companyAbout": "string (required)",
  "productName": "string (required)",
  "productDescription": "string (required)",
  "productAbout": "string (required)",
  "productVideoUrl": "string (optional) - External video link like YouTube"
}
```

**Supported File Types:**
- Images: JPEG, PNG, GIF, WebP
- Videos: MP4, MPEG, QuickTime, WebM

**Example cURL Request:**
```bash
curl -X POST http://localhost:4000/api/exhibitions \
  -F "poster=@/path/to/company-poster.jpg" \
  -F "productImages=@/path/to/product1.jpg" \
  -F "productImages=@/path/to/product2.jpg" \
  -F "productVideo=@/path/to/intro.mp4" \
  -F "companyName=Tech Startup Inc" \
  -F "companyDescription=Innovative tech solutions" \
  -F "companyAbout=We are a startup focused on AI and ML" \
  -F "productName=AI Assistant" \
  -F "productDescription=Smart AI-powered assistant" \
  -F "productAbout=Our product helps businesses automate tasks"
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Exhibition created successfully",
  "data": {
    "id": "clx1234567890",
    "companyName": "Tech Startup Inc",
    "companyDescription": "Innovative tech solutions",
    "companyPosterUrl": "https://ik.imagekit.io/librarysanju/exhibitions/posters/company-poster.jpg",
    "companyAbout": "We are a startup focused on AI and ML",
    "productName": "AI Assistant",
    "productDescription": "Smart AI-powered assistant",
    "productAbout": "Our product helps businesses automate tasks",
    "productImages": [
      "https://ik.imagekit.io/librarysanju/exhibitions/products/product1.jpg",
      "https://ik.imagekit.io/librarysanju/exhibitions/products/product2.jpg"
    ],
    "productVideoUrl": "https://ik.imagekit.io/librarysanju/exhibitions/videos/intro.mp4",
    "createdAt": "2025-11-19T04:38:00.000Z",
    "updatedAt": "2025-11-19T04:38:00.000Z"
  },
  "timestamp": "2025-11-19T04:38:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Company poster is required",
  "timestamp": "2025-11-19T04:38:00.000Z"
}
```

---

### 2. Get All Exhibitions
Retrieve all exhibitions.

**Endpoint:** `GET /api/exhibitions`

**Example Request:**
```bash
curl http://localhost:4000/api/exhibitions
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Exhibitions retrieved successfully",
  "data": [
    {
      "id": "clx1234567890",
      "companyName": "Tech Startup Inc",
      "companyDescription": "Innovative tech solutions",
      "companyPosterUrl": "https://ik.imagekit.io/librarysanju/...",
      "companyAbout": "We are a startup focused on AI and ML",
      "productName": "AI Assistant",
      "productDescription": "Smart AI-powered assistant",
      "productAbout": "Our product helps businesses automate tasks",
      "productImages": [...],
      "productVideoUrl": "https://...",
      "createdAt": "2025-11-19T04:38:00.000Z",
      "updatedAt": "2025-11-19T04:38:00.000Z"
    }
  ],
  "timestamp": "2025-11-19T04:38:00.000Z"
}
```

---

### 3. Get Exhibition by ID
Retrieve a specific exhibition.

**Endpoint:** `GET /api/exhibitions/:id`

**Example Request:**
```bash
curl http://localhost:4000/api/exhibitions/clx1234567890
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Exhibition retrieved successfully",
  "data": {
    "id": "clx1234567890",
    "companyName": "Tech Startup Inc",
    ...
  },
  "timestamp": "2025-11-19T04:38:00.000Z"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Exhibition not found",
  "timestamp": "2025-11-19T04:38:00.000Z"
}
```

---

## Architecture

This API follows SOLID principles with a clean layered architecture:

```
├── controllers/        # Handle HTTP requests/responses
│   └── exhibition.controller.ts
├── services/          # Business logic
│   ├── exhibition.service.ts
│   └── imagekit.service.ts
├── repositories/      # Data access layer
│   └── exhibition.repository.ts
├── dtos/             # Data Transfer Objects
│   └── exhibition.dto.ts
├── routes/           # Route definitions
│   └── exhibition.routes.ts
└── utils/            # Utilities
    └── response.util.ts
```

### Layer Responsibilities:
- **Controller**: Validates input, handles HTTP concerns
- **Service**: Business logic, orchestrates repository and external services
- **Repository**: Database operations via Prisma
- **DTO**: Type-safe data contracts
- **Utils**: Standardized response formatting

## Environment Variables

Required in `.env`:
```properties
DATABASE_URL="postgresql://..."
IMAGEKIT_PRIVATE_KEY="private_..."
IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/..."
IMAGEKIT_ID="..."
```
