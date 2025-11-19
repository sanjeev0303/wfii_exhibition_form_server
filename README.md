# OpenX Backend

TypeScript + Express server with Exhibition management APIs, ImageKit integration, and Prisma ORM connected to Neon PostgreSQL.

## Features

- Express 5 server listening on port `4000`
- Public CORS policy (allows any origin)
- Exhibition APIs with file upload support (images & videos)
- ImageKit integration for cloud media storage
- Clean architecture: Controller → Service → Repository
- Type-safe DTOs and standardized API responses
- `/health` endpoint with database connectivity check
- Prisma ORM with PostgreSQL (Neon)
- Multipart file uploads via Multer

## Getting started

```bash
# Install dependencies
npm install

# Generate the Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start the dev server with hot reload
npm run dev

# Or build for production and run the compiled output
npm run build
npm start
```

Environment variables are configured in `.env` with:
- `DATABASE_URL`: Neon PostgreSQL connection
- ImageKit credentials for media uploads

## API Endpoints

### Health Check
```
GET http://localhost:4000/health
```

### Exhibition APIs
- **POST** `/api/exhibitions` - Create exhibition with file uploads
- **GET** `/api/exhibitions` - Get all exhibitions  
- **GET** `/api/exhibitions/:id` - Get exhibition by ID

See [API_DOCS.md](./API_DOCS.md) for complete API documentation with request/response examples.

## Architecture

Clean layered architecture following SOLID principles with interface-based design:

```
src/
├── interfaces/       # TypeScript interfaces for all layers
├── controllers/      # HTTP request handlers (implements IExhibitionController)
├── services/         # Business logic & ImageKit uploads (implements IExhibitionService)
├── repositories/     # Prisma database operations (implements IExhibitionRepository)
├── dtos/            # Request/Response Data Transfer Objects
├── routes/          # Express route definitions
├── utils/           # Response formatters & helpers
└── lib/             # Prisma client singleton
```

### SOLID Principles Implementation
- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Interfaces allow extension without modification
- **Liskov Substitution**: Implementations are interchangeable
- **Interface Segregation**: Focused interfaces with optional future methods
- **Dependency Inversion**: Dependencies on abstractions, not concrete classes

See [INTERFACES.md](./INTERFACES.md) for detailed interface documentation and design patterns.
