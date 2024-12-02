export interface S3DAO {
  uploadImage(imageKey: string, imageBytes: string): Promise<string>;
}
