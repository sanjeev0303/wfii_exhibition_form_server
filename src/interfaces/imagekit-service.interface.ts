/**
 * Interface for file upload operations with ImageKit
 */
export interface IImageKitService {
  /**
   * Upload a single file buffer to ImageKit
   * @param file - File buffer to upload
   * @param fileName - Name of the file
   * @param folder - Folder path in ImageKit (default: "exhibitions")
   * @returns Object containing uploaded file URL and fileId
   */
  uploadFile(
    file: Buffer,
    fileName: string,
    folder?: string,
  ): Promise<{ url: string; fileId: string }>;

  /**
   * Upload multiple files to ImageKit
   * @param files - Array of files with buffer and originalname
   * @param folder - Folder path in ImageKit (default: "exhibitions")
   * @returns Array of uploaded file URLs
   */
  uploadMultipleFiles(
    files: Array<{ buffer: Buffer; originalname: string }>,
    folder?: string,
  ): Promise<string[]>;

  /**
   * Delete a file from ImageKit
   * @param fileId - ID of the file to delete
   */
  deleteFile(fileId: string): Promise<void>;
}
