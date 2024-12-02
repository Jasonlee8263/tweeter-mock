import { Buffer } from "buffer";
import {
  AuthToken,
  AuthTokenDto,
  FakeData,
  User,
  UserDto,
} from "tweeter-shared";
import { UserDAO } from "../dao/UserDAO";
import { S3DAO } from "../dao/S3DAO";
import { DAOFactory } from "../dao/DAOFactory";

export class UserService {
  private userDAO: UserDAO;
  private S3DAO: S3DAO;
  constructor(daoFactory: DAOFactory) {
    this.userDAO = daoFactory.createUserDAO();
    this.S3DAO = daoFactory.createS3DAO();
  }
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");
    // Upload user profile image to S3
    const imageKey = `${alias}.${imageFileExtension}`;
    const imageUrl = await this.S3DAO.uploadImage(imageKey, imageStringBase64);

    // TODO: Replace with the result of calling the server
    // const user = FakeData.instance.firstUser;
    const user = { alias, firstName, lastName, imageUrl } as UserDto;
    await this.userDAO.createUser(user, password);

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken.dto];
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const isValid = await this.userDAO.validatePassword(alias, password);
    if (!isValid) {
      throw new Error("Invalid alias or password");
    }

    // Fetch user details
    const user = await this.userDAO.getUserByAlias(alias);
    if (!user) {
      throw new Error("User not found");
    }

    // TODO: Replace with the result of calling the server
    // const user = FakeData.instance.firstUser;

    return [user, FakeData.instance.authToken.dto];
  }
  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const data = FakeData.instance.findUserByAlias(alias);
    return data?.dto ?? null;
  }
}
