import { CreateExhibitionDto, ExhibitionResponseDto } from "../dtos/exhibition.dto";

/**
 * Interface for Exhibition service business logic
 * Orchestrates repository and external service operations
 */
export interface IExhibitionService {
  /**
   * Create a new exhibition with file uploads
   * Handles:
   * - File uploads to ImageKit (poster, product images, optional video)
   * - Data persistence via repository
   * - Business logic validation
   * 
   * @param dto - Exhibition data transfer object
   * @param poster - Company poster file
   * @param productImages - Array of product image files
   * @param productVideo - Optional product video file
   * @returns Created exhibition response DTO
   * @throws Error if upload or creation fails
   */
  createExhibition(
    dto: CreateExhibitionDto,
    poster: Express.Multer.File,
    productImages: Express.Multer.File[],
    productVideo?: Express.Multer.File,
  ): Promise<ExhibitionResponseDto>;

  /**
   * Retrieve all exhibitions
   * @returns Array of exhibition response DTOs
   */
  getAllExhibitions(): Promise<ExhibitionResponseDto[]>;

  /**
   * Retrieve a single exhibition by ID
   * @param id - Exhibition unique identifier
   * @returns Exhibition response DTO or null if not found
   */
  getExhibitionById(id: string): Promise<ExhibitionResponseDto | null>;

  /**
   * Delete an exhibition and its associated media (optional - future implementation)
   * @param id - Exhibition ID to delete
   * @returns True if deleted successfully
   */
  deleteExhibition?(id: string): Promise<boolean>;

  /**
   * Update an exhibition (optional - future implementation)
   * @param id - Exhibition ID to update
   * @param dto - Updated exhibition data
   * @param files - Optional new files to upload
   * @returns Updated exhibition response DTO
   */
  updateExhibition?(
    id: string,
    dto: Partial<CreateExhibitionDto>,
    files?: {
      poster?: Express.Multer.File;
      productImages?: Express.Multer.File[];
      productVideo?: Express.Multer.File;
    },
  ): Promise<ExhibitionResponseDto>;
}
