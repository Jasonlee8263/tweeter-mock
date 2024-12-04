import {
  QueryCommand,
  PutCommand,
  DynamoDBDocumentClient,
  QueryCommandInput,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StatusDto } from "tweeter-shared";
import { FeedDAO } from "./FeedDAO";

export class FeedDAOProvider implements FeedDAO {
  private readonly dynamoDB;
  private readonly feedTable = "Feed";

  constructor() {
    const client = new DynamoDBClient({ region: "us-east-1" });
    this.dynamoDB = DynamoDBDocumentClient.from(client);
  }

  /**
   * Get a paginated list of statuses from a user's feed.
   */
  async getFeedPage(
    receiverAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<
    [{ authorAlias: string; content: string; timestamp: number }[], boolean]
  > {
    const params: QueryCommandInput = {
      TableName: this.feedTable,
      KeyConditionExpression: "receiverAlias = :receiverAlias",
      ExpressionAttributeValues: {
        ":receiverAlias": `${receiverAlias}`,
      },
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey: lastItem
        ? {
            receiverAlias: `${lastItem.user.alias}`,
            timestamp: lastItem.timestamp,
          }
        : undefined,
    };

    const result = await this.dynamoDB.send(new QueryCommand(params));
    const items =
      result.Items?.map((item) => ({
        authorAlias: item.authorAlias,
        content: item.content,
        timestamp: item.timestamp,
      })) || [];

    const hasMore = !!result.LastEvaluatedKey;

    return [items, hasMore];
  }

  /**
   * Add a status to the feeds of a user's followers.
   */
  async addToFeeds(feedItem: {
    receiverAlias: string;
    timestamp: number;
    content: string;
    authorAlias: string;
  }): Promise<void> {
    const params: PutCommandInput = {
      TableName: this.feedTable,
      Item: {
        receiverAlias: feedItem.receiverAlias, // 반드시 포함
        timestamp: feedItem.timestamp, // Sort Key 사용 시 반드시 포함
        content: feedItem.content,
        authorAlias: feedItem.authorAlias,
      },
    };

    console.log("[DEBUG] Adding to feed:", params);

    await this.dynamoDB.send(new PutCommand(params));
  }
}
