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
          authToken.token!,
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
        authToken.token,
        displayedUser
      );
      this.view.setFolloweeCount(this.followerCount);
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.itemHandler(async () => {
      this.followerCount = await this.service.getFollowerCount(
        authToken.token,
        displayedUser
      );
      this.view.setFollowerCount(this.followerCount);
    }, "get followers count");
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.view.setIsLoading(true);
    this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
    this.itemHandler(async () => {
      const [followerCount, followeeCount] = await this.service.follow(
        authToken.token!,
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
      const [followerCount, followeeCount] = await this.service.unfollow(
        authToken.token!,
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
