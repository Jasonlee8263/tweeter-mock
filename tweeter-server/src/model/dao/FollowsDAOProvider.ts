import {
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  PutCommand,
  DynamoDBDocumentClient,
  QueryCommandInput,
  UpdateCommandInput,
  DeleteCommandInput,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class FollowsDAOProvider {
  private readonly dynamoDB;
  private readonly followsTable = "follows";

  constructor() {
    const client = new DynamoDBClient({ region: "us-east-1" }); // Replace with your region
    this.dynamoDB = DynamoDBDocumentClient.from(client);
  }

  /**
   * Add a follow relationship between a follower and a followee.
   */
  async follow(follower: string, followee: string): Promise<void> {
    const params: PutCommandInput = {
      TableName: this.followsTable,
      Item: {
        follower_handle: `${follower}`,
        followee_handle: `${followee}`,
        follower_name: follower,
        followee_name: followee,
      },
    };

    await this.dynamoDB.send(new PutCommand(params));
  }

  /**
   * Remove a follow relationship between a follower and a followee.
   */
  async unfollow(follower: string, followee: string): Promise<void> {
    const params: DeleteCommandInput = {
      TableName: this.followsTable,
      Key: {
        follower_handle: `${follower}`,
        followee_handle: `${followee}`,
      },
    };

    await this.dynamoDB.send(new DeleteCommand(params));
  }

  /**
   * Check if a user is following another user.
   */
  async getIsFollower(follower: string, followee: string): Promise<boolean> {
    const params: QueryCommandInput = {
      TableName: this.followsTable,
      KeyConditionExpression:
        "follower_handle = :follower AND followee_handle = :followee",
      ExpressionAttributeValues: {
        ":follower": `${follower}`,
        ":followee": `${followee}`,
      },
    };

    const result = await this.dynamoDB.send(new QueryCommand(params));
    return (result.Count ?? 0) > 0;
  }

  /**
   * Get the number of followees for a specific follower.
   */
  async getFolloweeCount(follower: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: this.followsTable,
      KeyConditionExpression: "follower_handle = :follower",
      ExpressionAttributeValues: {
        ":follower": `${follower}`,
      },
      Select: "COUNT",
    };

    const result = await this.dynamoDB.send(new QueryCommand(params));
    return result.Count || 0;
  }

  /**
   * Get the number of followers for a specific followee.
   */
  async getFollowerCount(followee: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: this.followsTable,
      IndexName: "follows_index",
      KeyConditionExpression: "followee_handle = :followee",
      ExpressionAttributeValues: {
        ":followee": `${followee}`,
      },
      Select: "COUNT",
    };

    const result = await this.dynamoDB.send(new QueryCommand(params));
    return result.Count || 0;
  }

  /**
   * Get a paginated list of followees for a specific follower.
   */
  async getFollowees(
    follower: string,
    pageSize: number,
    lastFolloweeHandle: string | null
  ): Promise<[string[], boolean]> {
    const params: QueryCommandInput = {
      TableName: this.followsTable,
      KeyConditionExpression: "follower_handle = :follower",
      ExpressionAttributeValues: {
        ":follower": `${follower}`,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastFolloweeHandle
        ? {
            follower_handle: `${follower}`,
            followee_handle: lastFolloweeHandle,
          }
        : undefined,
    };

    const result = await this.dynamoDB.send(new QueryCommand(params));
    const followees = result.Items?.map((item) => item.followee_handle) || [];
    const hasMore = !!result.LastEvaluatedKey;

    return [followees, hasMore];
  }

  /**
   * Get a paginated list of followers for a specific followee.
   */
  async getFollowers(
    followee: string,
    pageSize: number,
    lastFollowerHandle: string | null
  ): Promise<[string[], boolean]> {
    const params: QueryCommandInput = {
      TableName: this.followsTable,
      IndexName: "follows_index",
      KeyConditionExpression: "followee_handle = :followee",
      ExpressionAttributeValues: {
        ":followee": `${followee}`,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastFollowerHandle
        ? {
            followee_handle: `${followee}`,
            follower_handle: lastFollowerHandle,
          }
        : undefined,
    };
    const result = await this.dynamoDB.send(new QueryCommand(params));
    const followers = result.Items?.map((item) => item.follower_handle) || [];
    const hasMore = !!result.LastEvaluatedKey;

    return [followers, hasMore];
  }

  /**
   * Update follower and followee names for an existing relationship.
   */
  async updateFollow(
    follower: string,
    followee: string,
    newFollowerName: string,
    newFolloweeName: string
  ): Promise<void> {
    const params: UpdateCommandInput = {
      TableName: this.followsTable,
      Key: {
        follower_handle: `${follower}`,
        followee_handle: `${followee}`,
      },
      UpdateExpression:
        "SET follower_name = :newFollowerName, followee_name = :newFolloweeName",
      ExpressionAttributeValues: {
        ":newFollowerName": newFollowerName,
        ":newFolloweeName": newFolloweeName,
      },
    };

    await this.dynamoDB.send(new UpdateCommand(params));
  }
}
