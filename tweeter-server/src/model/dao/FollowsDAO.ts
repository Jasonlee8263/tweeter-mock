export interface FollowsDAO {
  getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: string | null
  ): Promise<[string[], boolean]>;

  getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: string | null
  ): Promise<[string[], boolean]>;

  getIsFollower(userAlias: string, targetAlias: string): Promise<boolean>;

  getFolloweeCount(userAlias: string): Promise<number>;

  getFollowerCount(userAlias: string): Promise<number>;

  follow(userAlias: string, targetAlias: string): Promise<void>;

  unfollow(userAlias: string, targetAlias: string): Promise<void>;
}
