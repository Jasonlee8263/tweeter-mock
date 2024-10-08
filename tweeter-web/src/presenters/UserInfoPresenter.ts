import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  addFolloweeCount: (count: number) => void;
  addFollowerCount: (count: number) => void;
  addIsFollower: (isFollower: boolean) => void;
  addIsLoading: (isLoading: boolean) => void;
}
export class UserInfoPresenter {
  private _view: UserInfoView;
  private followService: FollowService;
  private _isFollower: boolean = false;
  private _followerCount: number = 0;
  private _followeeCount: number = 0;
  private _isLoading: boolean = false;
  constructor(view: UserInfoView) {
    this._view = view;
    this.followService = new FollowService();
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
  public get isLoading(): boolean {
    return this._isLoading;
  }
  public set isLoading(value: boolean) {
    this._isLoading = value;
  }
  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this._view.addIsFollower(false);
      } else {
        this._isFollower = await this.followService.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
        this._view.addIsFollower(this._isFollower);
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this._followeeCount = await this.followService.getFolloweeCount(
        authToken,
        displayedUser
      );
      this._view.addFolloweeCount(this._followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this._followerCount = await this.followService.getFollowerCount(
        authToken,
        displayedUser
      );
      this._view.addFollowerCount(this._followerCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }
  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.followService.getFollowerCount(
      authToken,
      userToFollow
    );
    const followeeCount = await this.followService.getFolloweeCount(
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

    const followerCount = await this.followService.getFollowerCount(
      authToken,
      userToUnfollow
    );
    const followeeCount = await this.followService.getFolloweeCount(
      authToken,
      userToUnfollow
    );

    return [followerCount, followeeCount];
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    try {
      this._view.addIsLoading(true);
      this._view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.follow(
        authToken!,
        displayedUser!
      );

      this._view.addFolloweeCount(followeeCount);
      this._view.addFollowerCount(followerCount);
      this._view.addIsFollower(true);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._view.addIsLoading(false);
    }
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    try {
      this.isLoading = true;
      this._view.addIsLoading(true);
      this._view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.unfollow(
        authToken!,
        displayedUser!
      );
      this._view.addFolloweeCount(followeeCount);
      this._view.addFollowerCount(followerCount);
      this._view.addIsFollower(false);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._view.addIsLoading(false);
    }
  }
}
