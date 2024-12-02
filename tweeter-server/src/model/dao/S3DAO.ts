export interface S3DAO {
  uploadImage(imageKey: string, imageBytes: Buffer): Promise<string>;
}
