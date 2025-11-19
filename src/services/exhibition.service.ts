import { Exhibition } from "@prisma/client";
import {
  CreateExhibitionDto,
  ExhibitionResponseDto,
} from "../dtos/exhibition.dto";
import { exhibitionRepository } from "../repositories/exhibition.repository";
import { CreateExhibitionData } from "../interfaces/exhibition-repository.interface";
import { imagekitService } from "./imagekit.service";
import { IExhibitionService } from "../interfaces/exhibition-service.interface";

export class ExhibitionService implements IExhibitionService {
  /**
   * Create a new exhibition with file uploads
   */
  async createExhibition(
    dto: CreateExhibitionDto,
    poster: Express.Multer.File,
    productImages: Express.Multer.File[],
    productVideo?: Express.Multer.File,
  ): Promise<ExhibitionResponseDto> {
    try {
      // Upload company poster
      const posterResult = await imagekitService.uploadFile(
        poster.buffer,
        poster.originalname,
        "exhibitions/posters",
      );

      // Upload product images
      const productImageUrls = await imagekitService.uploadMultipleFiles(
        productImages,
        "exhibitions/products",
      );

      // Upload product video if provided (file upload)
      let productVideoUrl = dto.productVideoUrl; // Use external link if provided
      if (productVideo) {
        const videoResult = await imagekitService.uploadFile(
          productVideo.buffer,
          productVideo.originalname,
          "exhibitions/videos",
        );
        productVideoUrl = videoResult.url;
      }

      // Prepare data for repository
      const exhibitionData: CreateExhibitionData = {
        companyName: dto.companyName,
        companyDescription: dto.companyDescription,
        companyPosterUrl: posterResult.url,
        companyAbout: dto.companyAbout,
        productName: dto.productName,
        productDescription: dto.productDescription,
        productAbout: dto.productAbout,
        productImages: productImageUrls,
        productVideoUrl,
      };

      // Save to database
      const exhibition = await exhibitionRepository.create(exhibitionData);

      return this.mapToDto(exhibition);
    } catch (error) {
      throw new Error(
        `Failed to create exhibition: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get all exhibitions
   */
  async getAllExhibitions(): Promise<ExhibitionResponseDto[]> {
    const exhibitions = await exhibitionRepository.findAll();
    return exhibitions.map((ex) => this.mapToDto(ex));
  }

  /**
   * Get exhibition by ID
   */
  async getExhibitionById(id: string): Promise<ExhibitionResponseDto | null> {
    const exhibition = await exhibitionRepository.findById(id);
    return exhibition ? this.mapToDto(exhibition) : null;
  }

  /**
   * Map Exhibition entity to DTO
   */
  private mapToDto(exhibition: Exhibition): ExhibitionResponseDto {
    return {
      id: exhibition.id,
      companyName: exhibition.companyName,
      companyDescription: exhibition.companyDescription,
      companyPosterUrl: exhibition.companyPosterUrl,
      companyAbout: exhibition.companyAbout,
      productName: exhibition.productName,
      productDescription: exhibition.productDescription,
      productAbout: exhibition.productAbout,
      productImages: exhibition.productImages,
      productVideoUrl: exhibition.productVideoUrl ?? undefined,
      createdAt: exhibition.createdAt,
      updatedAt: exhibition.updatedAt,
    };
  }
}

export const exhibitionService = new ExhibitionService();
