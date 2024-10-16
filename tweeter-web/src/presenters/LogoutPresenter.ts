import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void;
}
export class LogoutPresenter extends Presenter<LogoutView> {
  private userSerivce: UserService;
  constructor(view: LogoutView) {
    super(view);
    this.userSerivce = new UserService();
  }
  public logOut = async (authToken: AuthToken) => {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.itemHandler(async () => {
      await this.userSerivce.logout(authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  };
}
