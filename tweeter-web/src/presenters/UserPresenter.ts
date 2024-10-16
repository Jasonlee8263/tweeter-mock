import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface UserView extends View {
  setIsLoading: (bool: boolean) => void;
  navigate: (str: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  rememberMe: boolean,
  originalUrl?: string | undefined
}
export abstract class UserPresenter extends Presenter<UserView> {
  private _service: UserService;

  protected createService(): UserService {
    return new UserService();
  }
  constructor(view: UserView) {
    super(view);
    this._service = this.createService();
  }
  protected get service() {
    return this._service;
  }

  public async doAuth(authFunction:()=> Promise<[User, AuthToken]>) {
    this.itemHandler(async () => {
      try {
        this.view.setIsLoading(true);

        const [user, authToken] = await authFunction();

        this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);
        if (!!this.view.originalUrl) {
            this.view.navigate(this.view.originalUrl);
          } else {
            this.view.navigate("/");
          }
      } catch (error) {
        this.view.displayErrorMessage(
          `Failed to log user in because of exception: ${error}`
        );
      } finally {
        this.view.setIsLoading(false);
      }
    }, this.getItemDescription());
  }
  // protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>
  protected abstract getItemDescription(): string;
}
