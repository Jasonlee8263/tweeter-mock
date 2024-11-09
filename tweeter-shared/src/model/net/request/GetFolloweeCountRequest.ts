import { User } from "../../domain/User";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "../response/TweeterResponse";

export interface GetFolloweeCountRequest extends TweeterResponse {
  readonly token: string;
  readonly user: UserDto;
}
