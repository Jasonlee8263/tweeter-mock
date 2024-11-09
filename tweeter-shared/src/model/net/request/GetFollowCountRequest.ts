import { User } from "../../domain/User";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "../response/TweeterResponse";

export interface GetFollowCountRequest extends TweeterResponse {
  readonly token: string;
  readonly user: UserDto;
}
