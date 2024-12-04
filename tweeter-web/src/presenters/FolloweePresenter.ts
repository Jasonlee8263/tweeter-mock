import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";
export class FolloweePresenter extends UserItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    console.log("Loading more followees for:", userAlias);
    return this.service.loadMoreFollowees(
      authToken.token,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "load followees";
  }
}
