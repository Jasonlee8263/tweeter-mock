import { DynamoDB } from "aws-sdk";
import { UserDAO } from "./UserDAO";
import { UserDto } from "tweeter-shared";

export class DynamoDBUserDAO implements UserDAO {
  private readonly tableName = "Users";
  private readonly dynamoDB = new DynamoDB.DocumentClient();

  async getUserByAlias(alias: string): Promise<UserDto> {
    const params = {
      TableName: this.tableName,
      Key: { alias },
    };
    const result = await this.dynamoDB.get(params).promise();
    return result.Item as UserDto;
  }

  async createUser(user: UserDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: user,
    };
    await this.dynamoDB.put(params).promise();
  }
}
