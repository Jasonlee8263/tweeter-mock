import { UserDto } from "tweeter-shared";

export interface UserDAO {
  getUserByAlias(alias: string): Promise<UserDto | null>;
  createUser(user: UserDto, plainPassword: string): Promise<void>;
  validatePassword(alias: string, plainPassword: string): Promise<boolean>;
  incrementFollowerCount(alias: string): Promise<void>;
  decrementFollowerCount(alias: string): Promise<void>;
  incrementFolloweeCount(alias: string): Promise<void>;
  decrementFolloweeCount(alias: string): Promise<void>;
  getFollowerCount(userAlias: string): Promise<number>;
  getFolloweeCount(userAlias: string): Promise<number>;
}
