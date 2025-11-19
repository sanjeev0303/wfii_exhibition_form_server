import { Request, Response, NextFunction } from "express";

/**
 * Interface for Exhibition controller HTTP handlers
 * Responsible for request/response handling and validation
 */
export interface IExhibitionController {
  /**
   * Handle POST /api/exhibitions
   * Create a new exhibition with multipart form data
   * 
   * Expected files:
   * - poster: Company poster image (required, 1 file)
   * - productImages: Product images (required, 1-10 files)
   * - productVideo: Product video (optional, 1 file)
   * 
   * Expected form fields:
   * - companyName, companyDescription, companyAbout
   * - productName, productDescription, productAbout
   * - productVideoUrl (optional)
   * 
   * @param req - Express request object with multipart data
   * @param res - Express response object
   * @param next - Express next function for error handling
   * @returns HTTP 201 with created exhibition or error response
   */
  createExhibition(req: Request, res: Response, next: NextFunction): Promise<Response | void>;

  /**
   * Handle GET /api/exhibitions
   * Retrieve all exhibitions
   * 
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function for error handling
   * @returns HTTP 200 with array of exhibitions or error response
   */
  getAllExhibitions(req: Request, res: Response, next: NextFunction): Promise<Response | void>;

  /**
   * Handle GET /api/exhibitions/:id
   * Retrieve a specific exhibition by ID
   * 
   * @param req - Express request object with id param
   * @param res - Express response object
   * @param next - Express next function for error handling
   * @returns HTTP 200 with exhibition data or 404 if not found
   */
  getExhibitionById(req: Request, res: Response, next: NextFunction): Promise<Response | void>;

  /**
   * Handle DELETE /api/exhibitions/:id (optional - future implementation)
   * Delete an exhibition and its media
   * 
   * @param req - Express request object with id param
   * @param res - Express response object
   * @param next - Express next function for error handling
   * @returns HTTP 200 on success or error response
   */
  deleteExhibition?(req: Request, res: Response, next: NextFunction): Promise<Response | void>;

  /**
   * Handle PUT /api/exhibitions/:id (optional - future implementation)
   * Update an exhibition
   * 
   * @param req - Express request object with id param and update data
   * @param res - Express response object
   * @param next - Express next function for error handling
   * @returns HTTP 200 with updated exhibition or error response
   */
  updateExhibition?(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
