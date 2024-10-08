import { UserService } from "../model/service/UserService";
import { UserPresenter, UserView } from "./UserPresenter";

export class RegisterPresenter extends UserPresenter {
    private userService: UserService;
    constructor(view: UserView) {
        super(view);
        this.userService = new UserService();
    }
    public async doAuth(alias:string,password:string,rememberMe:boolean, firstName:string,lastName:string,imageBytes:Uint8Array,imageFileExtension:string) {
        try {
          this.isLoading = true;
    
          const [user, authToken] = await this.userService.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension
          );
    
          this.view.updateUserInfo(user, user, authToken, rememberMe);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to register user because of exception: ${error}`
          );
        } finally {
          this.isLoading = false;
        }
      };
    
}