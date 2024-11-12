import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";
import { PagedUserItemRequest } from "tweeter-shared";

export class FollowService {
  private serverFacade = new ServerFacade();
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem,
    };
    return this.serverFacade.getMoreFollowers(request);
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem,
    };
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
    return this.serverFacade.getMoreFollowees(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }
  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[number, number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  }
  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[number, number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(
      authToken,
      userToUnfollow
    );
    const followeeCount = await this.getFolloweeCount(
      authToken,
      userToUnfollow
    );

    return [followerCount, followeeCount];
  }
}
