import { S3DAO } from "./S3DAO";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
const BUCKET = "tweetercs340";
const REGION = "us-east-1";
export class S3DAOProvider implements S3DAO {
  async uploadImage(
    fileName: string,
    imageStringBase64Encoded: Buffer
  ): Promise<string> {
    // let decodedImageBuffer: Buffer = Buffer.from(
    //   imageStringBase64Encoded,
    //   "base64"
    // );
    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + fileName,
      Body: imageStringBase64Encoded,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
