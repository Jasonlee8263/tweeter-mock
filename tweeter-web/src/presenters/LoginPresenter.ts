import { UserPresenter } from "./UserPresenter";
export class LoginPresenter extends UserPresenter {
    public async doLogin(alias: string, password: string, rememberMe: boolean) {
      await this.doAuth(() => this.service.login(alias, password));
      };
      protected getItemDescription(): string {
        return "log user in";
      }
}