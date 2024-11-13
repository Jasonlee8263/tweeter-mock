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
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    return await this.serverFacade.getMoreFollowers(request);
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
    return await this.serverFacade.getMoreFollowees(request);
  }

  public async getIsFollowerStatus(
    token: string,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: GetIsFollowerStatusRequest = {
      token: token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    };
    // TODO: Replace with the result of calling server
    // return FakeData.instance.isFollower();
    return await this.serverFacade.getIsFollowerStatus(request);
  }

  public async getFolloweeCount(token: string, user: User): Promise<number> {
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getFolloweeCount(user.alias);
    const request: GetFollowCountRequest = {
      token: token,
      user: user.dto,
    };
    return await this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(token: string, user: User): Promise<number> {
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getFollowerCount(user.alias);
    const request: GetFollowCountRequest = {
      token: token,
      user: user.dto,
    };
    return await this.serverFacade.getFollowerCount(request);
  }
  public async follow(
    token: string,
    userToFollow: User
  ): Promise<[number, number]> {
    const request: FollowRequest = {
      token: token,
      userToFollow: userToFollow.dto,
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
    userToUnfollow: User
  ): Promise<[number, number]> {
    const request: FollowRequest = {
      token: token,
      userToFollow: userToUnfollow.dto,
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
