import { Request, Response, NextFunction } from "express";
import { exhibitionService } from "../services/exhibition.service";
import { ResponseBuilder } from "../utils/response.util";
import { CreateExhibitionDto } from "../dtos/exhibition.dto";
import { IExhibitionController } from "../interfaces/exhibition-controller.interface";

export class ExhibitionController implements IExhibitionController {
  /**
   * POST /api/exhibitions
   * Create a new exhibition
   */
  async createExhibition(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate required files
      const files = req.files as {
        poster?: Express.Multer.File[];
        productImages?: Express.Multer.File[];
        productVideo?: Express.Multer.File[];
      };

      if (!files?.poster || files.poster.length === 0) {
        return res.status(400).json(
          ResponseBuilder.error("Company poster is required"),
        );
      }

      if (!files?.productImages || files.productImages.length === 0) {
        return res.status(400).json(
          ResponseBuilder.error("At least one product image is required"),
        );
      }

      // Parse DTO from body
      const dto: CreateExhibitionDto = {
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
        companyAbout: req.body.companyAbout,
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        productAbout: req.body.productAbout,
        productVideoUrl: req.body.productVideoUrl,
      };

      // Validate required fields
      if (
        !dto.companyName ||
        !dto.companyDescription ||
        !dto.companyAbout ||
        !dto.productName ||
        !dto.productDescription ||
        !dto.productAbout
      ) {
        return res.status(400).json(
          ResponseBuilder.error("All required fields must be provided"),
        );
      }

      const exhibition = await exhibitionService.createExhibition(
        dto,
        files.poster[0],
        files.productImages,
        files.productVideo?.[0],
      );

      return res
        .status(201)
        .json(ResponseBuilder.created(exhibition, "Exhibition created successfully"));
    } catch (error) {
      console.error("Error creating exhibition:", error);
      return res.status(500).json(
        ResponseBuilder.error(
          "Failed to create exhibition",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  /**
   * GET /api/exhibitions
   * Get all exhibitions
   */
  async getAllExhibitions(req: Request, res: Response, next: NextFunction) {
    try {
      const exhibitions = await exhibitionService.getAllExhibitions();

      return res.json(
        ResponseBuilder.success(exhibitions, "Exhibitions retrieved successfully"),
      );
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
      return res.status(500).json(
        ResponseBuilder.error(
          "Failed to fetch exhibitions",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }

  /**
   * GET /api/exhibitions/:id
   * Get exhibition by ID
   */
  async getExhibitionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const exhibition = await exhibitionService.getExhibitionById(id);

      if (!exhibition) {
        return res.status(404).json(
          ResponseBuilder.error("Exhibition not found"),
        );
      }

      return res.json(
        ResponseBuilder.success(exhibition, "Exhibition retrieved successfully"),
      );
    } catch (error) {
      console.error("Error fetching exhibition:", error);
      return res.status(500).json(
        ResponseBuilder.error(
          "Failed to fetch exhibition",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }
}

export const exhibitionController = new ExhibitionController();
