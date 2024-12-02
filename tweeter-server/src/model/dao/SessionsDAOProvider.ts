import { AuthToken } from "tweeter-shared";
import {
  GetCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
  GetCommandInput,
  PutCommandInput,
  DeleteCommandInput,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SessionsDAO } from "./SessionsDAO";

export class SessionsDAOProvider implements SessionsDAO {
  private readonly dynamoDB;
  private readonly tableName = "Sessions";

  constructor() {
    const client = new DynamoDBClient();
    this.dynamoDB = DynamoDBDocumentClient.from(client);
  }

  async createSession(
    authToken: string,
    lastused: number,
    alias: string
  ): Promise<void> {
    const expirationTime = Math.floor(Date.now() / 1000) + 900; // 15 minutes from now
    const params: PutCommandInput = {
      TableName: this.tableName,
      Item: {
        authToken,
        lastused,
        alias,
        expirationTime,
      },
    };

    await this.dynamoDB.send(new PutCommand(params));
  }

  async getSession(authToken: string): Promise<string | null> {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key: { authToken },
    };

    const result = await this.dynamoDB.send(new GetCommand(params));
    if (!result.Item) return null;

    return result.Item.authToken as string;
  }

  async deleteSession(authToken: string): Promise<void> {
    const params: DeleteCommandInput = {
      TableName: this.tableName,
      Key: { authToken },
    };

    await this.dynamoDB.send(new DeleteCommand(params));
  }
  async updateSession(authToken: string, newLastUsed: number): Promise<void> {
    const newExpirationTime = Math.floor(Date.now() / 1000) + 900; // 15 minutes from now
    const params: UpdateCommandInput = {
      TableName: this.tableName,
      Key: { authToken },
      UpdateExpression:
        "set lastused = :lastused, expirationTime = :expirationTime",
      ExpressionAttributeValues: {
        ":lastused": newLastUsed,
        ":expirationTime": newExpirationTime,
      },
    };

    try {
      await this.dynamoDB.send(new UpdateCommand(params));
      console.log(`Session updated for authToken: ${authToken}`);
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  }
}
