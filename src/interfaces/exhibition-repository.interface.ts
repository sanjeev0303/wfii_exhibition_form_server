import { Exhibition } from "@prisma/client";

/**
 * Data structure for creating a new exhibition
 */
export interface CreateExhibitionData {
  companyName: string;
  companyDescription: string;
  companyPosterUrl: string;
  companyAbout: string;
  productName: string;
  productDescription: string;
  productAbout: string;
  productImages: string[];
  productVideoUrl?: string;
}

/**
 * Interface for Exhibition repository operations
 * Follows Repository pattern for data access abstraction
 */
export interface IExhibitionRepository {
  /**
   * Create a new exhibition record
   * @param data - Exhibition data to create
   * @returns Created exhibition entity
   */
  create(data: CreateExhibitionData): Promise<Exhibition>;

  /**
   * Find all exhibitions
   * @returns Array of all exhibitions ordered by creation date
   */
  findAll(): Promise<Exhibition[]>;

  /**
   * Find exhibition by unique identifier
   * @param id - Exhibition ID
   * @returns Exhibition entity or null if not found
   */
  findById(id: string): Promise<Exhibition | null>;

  /**
   * Delete exhibition by ID
   * @param id - Exhibition ID to delete
   * @returns Deleted exhibition entity
   */
  delete(id: string): Promise<Exhibition>;

  /**
   * Update exhibition data
   * @param id - Exhibition ID to update
   * @param data - Partial exhibition data to update
   * @returns Updated exhibition entity
   */
  update(id: string, data: Partial<CreateExhibitionData>): Promise<Exhibition>;

  /**
   * Find exhibitions by company name (optional - for future filtering)
   * @param companyName - Company name to search for
   * @returns Array of matching exhibitions
   */
  findByCompanyName?(companyName: string): Promise<Exhibition[]>;

  /**
   * Count total exhibitions (optional - for pagination)
   * @returns Total count of exhibitions
   */
  count?(): Promise<number>;
}
