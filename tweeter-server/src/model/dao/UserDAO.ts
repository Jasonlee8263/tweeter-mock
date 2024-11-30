import { UserDto } from "tweeter-shared";

export interface UserDAO {
  getUserByAlias(userId: string): Promise<UserDto>;
  createUser(user: UserDto): Promise<void>;
}
