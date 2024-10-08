import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
    setDisplayedUser: (user: User) => void;
    displayErrorMessage: (message: string) => void;
}
export class UserNavigationPresenter {
    private _view: UserNavigationView;
    private userService: UserService;
    constructor(view: UserNavigationView) {
        this._view = view;
        this.userService = new UserService();
    }
    public async getUser(authToken: AuthToken, alias: string) {
        return this.userService.getUser(authToken, alias);
    }
    public async navigateToUser(event: React.MouseEvent, authToken: AuthToken | null, currentUser: User | null) {
        try {
            const alias = this.extractAlias(event.target.toString());
      
            const user = await this.getUser(authToken!, alias);
      
            if (!!user) {
              if (currentUser!.equals(user)) {
                this._view.setDisplayedUser(currentUser!);
              } else {
                this._view.setDisplayedUser(user);
              }
            }
          } catch (error) {
            this._view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
          }
    }
    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
      };
}