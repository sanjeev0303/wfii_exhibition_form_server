import ImageKit from "imagekit";
import { IImageKitService } from "../interfaces/imagekit-service.interface";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export class ImageKitService implements IImageKitService {
  /**
   * Upload a file buffer to ImageKit
   */
  async uploadFile(
    file: Buffer,
    fileName: string,
    folder: string = "exhibitions",
  ): Promise<{ url: string; fileId: string }> {
    try {
      const result = await imagekit.upload({
        file: file.toString("base64"),
        fileName,
        folder,
      });

      return {
        url: result.url,
        fileId: result.fileId,
      };
    } catch (error) {
      throw new Error(
        `ImageKit upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: Array<{ buffer: Buffer; originalname: string }>,
    folder: string = "exhibitions",
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file.buffer, file.originalname, folder),
    );

    const results = await Promise.all(uploadPromises);
    return results.map((r) => r.url);
  }

  /**
   * Delete a file from ImageKit
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await imagekit.deleteFile(fileId);
    } catch (error) {
      throw new Error(
        `ImageKit delete failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

export const imagekitService = new ImageKitService();
