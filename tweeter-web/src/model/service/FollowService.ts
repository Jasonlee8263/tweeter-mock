import {
  AuthToken,
  FakeData,
  FollowRequest,
  GetFollowCountRequest,
  GetIsFollowerStatusRequest,
  User,
  UserDto,
} from "tweeter-shared";
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
    return await this.serverFacade.getMoreFollowers(request);
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
    return await this.serverFacade.getMoreFollowees(request);
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    const request: GetIsFollowerStatusRequest = {
      token: token,
      user: user,
      selectedUser: selectedUser,
    };
    // TODO: Replace with the result of calling server
    // return FakeData.instance.isFollower();
    return await this.serverFacade.getIsFollowerStatus(request);
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getFolloweeCount(user.alias);
    const request: GetFollowCountRequest = {
      token: token,
      user: user,
    };
    return await this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getFollowerCount(user.alias);
    const request: GetFollowCountRequest = {
      token: token,
      user: user,
    };
    return await this.serverFacade.getFollowerCount(request);
  }
  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[number, number]> {
    const request: FollowRequest = {
      token: token,
      userToFollow: userToFollow,
    };
    // Pause so we can see the follow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));
    await this.serverFacade.follow(request);

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }
  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[number, number]> {
    const request: FollowRequest = {
      token: token,
      userToFollow: userToUnfollow,
    };
    // Pause so we can see the unfollow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));
    await this.serverFacade.unfollow(request);
    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }
}
