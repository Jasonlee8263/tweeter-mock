import { Buffer } from "buffer";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  private serverFacade = new ServerFacade();
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const request = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: userImageBytes,
      imageFileExtension: imageFileExtension,
    };
    // const user = FakeData.instance.firstUser;

    // if (user === null) {
    //   throw new Error("Invalid registration");
    // }

    // return [user, FakeData.instance.authToken];
    return await this.serverFacade.register(request);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request = {
      alias: alias,
      password: password,
    };
    // TODO: Replace with the result of calling the server
    // const user = FakeData.instance.firstUser;

    // if (user === null) {
    //   throw new Error("Invalid alias or password");
    // }

    // return [user, FakeData.instance.authToken];
    return await this.serverFacade.login(request);
  }
  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    // await new Promise((res) => setTimeout(res, 1000));
    const request = {
      token: token,
    };
    await this.serverFacade.logout(request);
  }
  public async getUser(token: string, alias: string): Promise<User | null> {
    const request = {
      token: token,
      alias: alias,
    };
    // TODO: Replace with the result of calling server
    // return FakeData.instance.findUserByAlias(alias);
    return await this.serverFacade.getUser(request);
  }
}
