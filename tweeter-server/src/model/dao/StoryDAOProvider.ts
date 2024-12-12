import {
  QueryCommand,
  PutCommand,
  DynamoDBDocumentClient,
  QueryCommandInput,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StoryDAO } from "./StoryDAO";

export class StoryDAOProvider implements StoryDAO {
  private readonly dynamoDB;
  private readonly tableName = "Story";

  constructor() {
    const client = new DynamoDBClient({ region: "us-east-1" });
    this.dynamoDB = DynamoDBDocumentClient.from(client);
  }

  /**
   * Get a paginated list of statuses from a user's story.
   */
  async getStoryPage(
    authorAlias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<{
    items: { authorAlias: string; timestamp: number; content: string }[];
    hasMore: boolean;
  }> {
    try {
      const params: QueryCommandInput = {
        TableName: this.tableName,
        KeyConditionExpression: "authorAlias = :authorAlias",
        ExpressionAttributeValues: {
          ":authorAlias": `${authorAlias}`,
        },
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: lastTimestamp
          ? {
              authorAlias: `${authorAlias}`,
              timestamp: lastTimestamp,
            }
          : undefined,
      };

      const result = await this.dynamoDB.send(new QueryCommand(params));

      const items =
        result.Items?.map((item) => ({
          authorAlias: item.authorAlias,
          timestamp: item.timestamp,
          content: item.content,
        })) || [];

      return { items, hasMore: !!result.LastEvaluatedKey };
    } catch (error) {
      console.error("Error in getStoryPage:", error);
      throw error;
    }
  }

  /**
   * Add a status to a user's story.
   */
  async addStory(status: {
    authorAlias: string;
    timestamp: number;
    content: string;
  }): Promise<void> {
    const params: PutCommandInput = {
      TableName: this.tableName,
      Item: {
        authorAlias: `${status.authorAlias}`,
        timestamp: status.timestamp,
        content: status.content,
      },
    };

    await this.dynamoDB.send(new PutCommand(params));
  }
}
