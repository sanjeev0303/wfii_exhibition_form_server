import { prisma } from "../lib/prisma";
import { Exhibition } from "@prisma/client";
import {
  IExhibitionRepository,
  CreateExhibitionData,
} from "../interfaces/exhibition-repository.interface";

export class ExhibitionRepository implements IExhibitionRepository {
  /**
   * Create a new exhibition
   */
  async create(data: CreateExhibitionData): Promise<Exhibition> {
    return await prisma.exhibition.create({
      data,
    });
  }

  /**
   * Find all exhibitions
   */
  async findAll(): Promise<Exhibition[]> {
    return await prisma.exhibition.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Find exhibition by ID
   */
  async findById(id: string): Promise<Exhibition | null> {
    return await prisma.exhibition.findUnique({
      where: { id },
    });
  }

  /**
   * Delete exhibition by ID
   */
  async delete(id: string): Promise<Exhibition> {
    return await prisma.exhibition.delete({
      where: { id },
    });
  }

  /**
   * Update exhibition
   */
  async update(id: string, data: Partial<CreateExhibitionData>): Promise<Exhibition> {
    return await prisma.exhibition.update({
      where: { id },
      data,
    });
  }
}

export const exhibitionRepository = new ExhibitionRepository();
