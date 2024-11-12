import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void;
}
export class LogoutPresenter extends Presenter<LogoutView> {
  private _userService: UserService | null;
  constructor(view: LogoutView) {
    super(view);
    this._userService = null;
  }
  public get userService() {
    if (this._userService == null) {
      this._userService = new UserService();
    }
    return this._userService;
  }
  public logOut = async (authToken: AuthToken) => {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.itemHandler(async () => {
      await this.userService.logout(authToken.token!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  };
}
