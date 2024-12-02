import { UserDto } from "tweeter-shared";

export interface UserDAO {
  getUserByAlias(alias: string): Promise<UserDto | null>;
  createUser(user: UserDto, plainPassword: string): Promise<void>;
  validatePassword(alias: string, plainPassword: string): Promise<boolean>;
}
