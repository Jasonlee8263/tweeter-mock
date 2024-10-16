import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsFollower: (isFollower: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}
export class UserInfoPresenter extends Presenter<UserInfoView> {
  private _service: FollowService;
  private _isFollower: boolean = false;
  private _followerCount: number = 0;
  private _followeeCount: number = 0;
  constructor(view: UserInfoView) {
    super(view);
    this._service = new FollowService();
  }
  protected get service() {
    return this._service;
  }
  public get isFollower(): boolean {
    return this._isFollower;
  }
  public set isFollower(value: boolean) {
    this._isFollower = value;
  }
  public get followerCount(): number {
    return this._followerCount;
  }
  public set followerCount(value: number) {
    this._followerCount = value;
  }
  public get followeeCount(): number {
    return this._followeeCount;
  }
  public set followeeCount(value: number) {
    this._followeeCount = value;
  }
  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.itemHandler(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.isFollower = await this.service.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
        this.view.setIsFollower(this.isFollower);
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.itemHandler(async () => {
      this.followeeCount = await this.service.getFolloweeCount(
        authToken,
        displayedUser
      );
      this.view.setFolloweeCount(this.followerCount);
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.itemHandler(async () => {
      this.followerCount = await this.service.getFollowerCount(
        authToken,
        displayedUser
      );
      this.view.setFollowerCount(this.followerCount);
    }, "get followers count");
  }
  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.service.getFollowerCount(
      authToken,
      userToFollow
    );
    const followeeCount = await this.service.getFolloweeCount(
      authToken,
      userToFollow
    );

    return [followerCount, followeeCount];
  }
  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.service.getFollowerCount(
      authToken,
      userToUnfollow
    );
    const followeeCount = await this.service.getFolloweeCount(
      authToken,
      userToUnfollow
    );

    return [followerCount, followeeCount];
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.view.setIsLoading(true);
    this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
    this.itemHandler(async () => {
      const [followerCount, followeeCount] = await this.follow(
        authToken!,
        displayedUser!
      );
      this.view.setFolloweeCount(followeeCount);
      this.view.setFollowerCount(followerCount);
      this.view.setIsFollower(true);
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }, "follow user");
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.view.setIsLoading(true);
    this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);
    this.itemHandler(async () => {
      const [followerCount, followeeCount] = await this.unfollow(
        authToken!,
        displayedUser!
      );
      this.view.setFolloweeCount(followeeCount);
      this.view.setFollowerCount(followerCount);
      this.view.setIsFollower(false);
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }, "unfollow user");
  }
}
