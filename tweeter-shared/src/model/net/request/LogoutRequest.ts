import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface LogoutRequest {
  readonly token: string;
}
