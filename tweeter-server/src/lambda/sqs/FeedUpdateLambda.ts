import { SQSEvent } from "aws-lambda";
import { FeedDAOProvider } from "../../model/dao/FeedDAOProvider";

const feedDAO = new FeedDAOProvider();

export async function handler(event: SQSEvent): Promise<void> {
  console.log("Received event:", JSON.stringify(event));
  for (const record of event.Records) {
    const { followerAlias, content, authorAlias, timestamp } = JSON.parse(
      record.body
    );

    try {
      // 1. 팔로워의 피드를 업데이트
      await feedDAO.addToFeeds({
        receiverAlias: followerAlias,
        timestamp,
        content,
        authorAlias,
      });
      console.log(`Updated feed for ${followerAlias}`);
    } catch (error) {
      console.error(`Error updating feed for ${followerAlias}:`, error);
    }
  }
}
