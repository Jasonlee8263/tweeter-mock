import { UserService } from "../model/service/UserService";
import { UserPresenter, UserView } from "./UserPresenter";

export class LoginPresenter extends UserPresenter {
    private userService: UserService;
    constructor(view: UserView) {
        super(view);
        this.userService = new UserService();
    }
    public async doAuth(alias: string, password: string, rememberMe: boolean) {
        try {
          this.isLoading = true;
    
          const [user, authToken] = await this.userService.login(alias, password);
    
          this.view.updateUserInfo(user, user, authToken, rememberMe);
          
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
          );
        } finally {
          this.isLoading = false;
        }
      };
}