import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface GetUserRequest {
  readonly token: string;
  readonly alias: string;
}
