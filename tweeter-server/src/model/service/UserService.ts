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
import { SessionsDAO } from "../dao/SessionsDAO";
import crypto from "crypto";

export class UserService {
  private userDAO: UserDAO;
  private S3DAO: S3DAO;
  private sessionsDAO: SessionsDAO;
  constructor(daoFactory: DAOFactory) {
    this.userDAO = daoFactory.createUserDAO();
    this.S3DAO = daoFactory.createS3DAO();
    this.sessionsDAO = daoFactory.createSessionsDAO();
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
    const imageBuffer: Buffer = Buffer.from(userImageBytes, "base64");
    // Upload user profile image to S3
    const imageKey = `${alias}.${imageFileExtension}`;
    const imageUrl = await this.S3DAO.uploadImage(imageKey, imageBuffer);

    // TODO: Replace with the result of calling the server
    // const user = FakeData.instance.firstUser;
    const user = { alias, firstName, lastName, imageUrl } as UserDto;
    await this.userDAO.createUser(user, password);

    if (user === null) {
      throw new Error("Invalid registration");
    }
    const token = crypto.randomUUID();
    const timestamp = Date.now();
    await this.sessionsDAO.createSession(token, timestamp, alias);

    return [user, new AuthToken(token, timestamp).dto];
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
    const token = crypto.randomUUID();
    const timestamp = Date.now();
    await this.sessionsDAO.createSession(token, timestamp, alias);

    return [user, new AuthToken(token, timestamp).dto];
  }
  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    // await new Promise((res) => setTimeout(res, 1000));
    await this.sessionsDAO.deleteSession(token);
  }
  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    // const data = FakeData.instance.findUserByAlias(alias);
    const data = await this.userDAO.getUserByAlias(alias);
    await this.sessionsDAO.updateSession(token, Date.now());
    return data ?? null;
  }
}
