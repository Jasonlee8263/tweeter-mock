import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LogoutView {
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
    clearUserInfo: () => void;
    displayErrorMessage: (message: string) => void;
}
export class LogoutPresenter {
    private _view: LogoutView;
    private userSerivce: UserService;
    constructor(view: LogoutView) {
        this._view = view;
        this.userSerivce = new UserService();
    }
    public logOut = async (authToken:AuthToken) => {
        this._view.displayInfoMessage("Logging Out...", 0);
    
        try {
          await this.userSerivce.logout(authToken!);
    
          this._view.clearLastInfoMessage();
          this._view.clearUserInfo();
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`
          );
        }
      };
}