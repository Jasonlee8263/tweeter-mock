import {
  GetCommand,
  PutCommand,
  DynamoDBDocumentClient,
  GetCommandInput,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcryptjs";
import { UserDAO } from "./UserDAO";
import { User, UserDto } from "tweeter-shared";

export class DynamoDBUserDAO implements UserDAO {
  private readonly dynamoDB;
  private readonly tableName = "Users";

  constructor() {
    const client = new DynamoDBClient(); // DynamoDB 기본 클라이언트 생성
    this.dynamoDB = DynamoDBDocumentClient.from(client); // DocumentClient로 변환
  }

  /**
   * Create a new user in the database.
   * Password is hashed and stored in the database separately from the User object.
   */
  async createUser(
    user: UserDto,
    plainPassword: string // Plain password provided during user registration
  ): Promise<void> {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const params: PutCommandInput = {
      TableName: this.tableName,
      Item: {
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        hashedPassword, // Save hashed password in the database
      },
    };

    await this.dynamoDB.send(new PutCommand(params));
  }

  /**
   * Retrieve a user by their alias.
   * This does not include the hashed password.
   */
  async getUserByAlias(alias: string): Promise<UserDto | null> {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key: { alias },
    };

    const result = await this.dynamoDB.send(new GetCommand(params));
    if (!result.Item) return null;

    // Exclude the hashed password from the returned User object
    return {
      alias: result.Item.alias,
      firstName: result.Item.firstName,
      lastName: result.Item.lastName,
      imageUrl: result.Item.imageUrl,
    } as User;
  }

  /**
   * Validate a user's password by comparing it with the hashed password in the database.
   */
  async validatePassword(
    alias: string,
    plainPassword: string
  ): Promise<boolean> {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key: { alias },
      ProjectionExpression: "hashedPassword", // Retrieve only the hashed password
    };

    const result = await this.dynamoDB.send(new GetCommand(params));
    if (!result.Item || !result.Item.hashedPassword) {
      return false; // User or hashed password not found
    }

    // Compare the provided plain password with the stored hashed password
    return bcrypt.compare(plainPassword, result.Item.hashedPassword);
  }
}
