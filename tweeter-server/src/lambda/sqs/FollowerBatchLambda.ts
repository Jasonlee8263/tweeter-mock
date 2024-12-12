import { SQSEvent } from "aws-lambda";
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { FollowsDAOProvider } from "../../model/dao/FollowsDAOProvider";

const sqsClient = new SQSClient({ region: "us-east-1" });
const feedUpdateQueueUrl =
  "https://sqs.us-east-1.amazonaws.com/929651342877/FeedUpdate-SQS"; // 두 번째 큐 URL

export async function handler(event: SQSEvent): Promise<void> {
  console.log(`[DEBUG] Received SQS Event: ${JSON.stringify(event)}`);
  const followDAO = new FollowsDAOProvider();

  for (const record of event.Records) {
    try {
      const { authorAlias, content, timestamp } = JSON.parse(record.body);
      console.log(`[DEBUG] Processing record for author: ${authorAlias}`);

      // 1. 팔로워 목록 가져오기
      const followers: string[] = [];
      let lastItem: string | null = null;
      let hasMore = true;

      while (hasMore) {
        try {
          const [fetchedFollowers, more] = await followDAO.getFollowers(
            authorAlias,
            1000, // 한 번에 가져올 팔로워 수 (최대 1000)
            lastItem
          );

          followers.push(...fetchedFollowers); // 팔로워 추가
          lastItem = fetchedFollowers.length
            ? fetchedFollowers[fetchedFollowers.length - 1]
            : null;
          hasMore = more;

          console.log(
            `[DEBUG] Fetched ${fetchedFollowers.length} followers, hasMore: ${hasMore}`
          );
        } catch (error) {
          console.error(
            `[ERROR] Failed to fetch followers for author: ${authorAlias}`,
            error
          );
          throw error;
        }
      }

      console.log(`[DEBUG] Total followers fetched: ${followers.length}`);

      if (followers.length === 0) {
        console.log(`[INFO] No followers found for author: ${authorAlias}`);
        continue; // 팔로워가 없으면 다음 메시지로 넘어감
      }

      // 2. 팔로워를 배치로 나누기
      const batchSize = 10;
      for (let i = 0; i < followers.length; i += batchSize) {
        const batch = followers.slice(i, i + batchSize);

        // 3. 각 배치를 두 번째 큐에 추가
        const batchEntries = batch.map((followerAlias, index) => ({
          Id: `${i + index}`, // 유일한 ID 생성
          MessageBody: JSON.stringify({
            followerAlias,
            content,
            authorAlias,
            timestamp,
          }),
        }));

        const params = {
          QueueUrl: feedUpdateQueueUrl,
          Entries: batchEntries,
        };

        try {
          const response = await sqsClient.send(
            new SendMessageBatchCommand(params)
          );
          console.log(
            `[DEBUG] Successfully sent batch of size ${batch.length}:`,
            response
          );
        } catch (error) {
          console.error(
            `[ERROR] Failed to send batch for followers: ${JSON.stringify(
              batch
            )}`,
            error
          );
        }
      }
    } catch (error) {
      console.error(
        `[ERROR] Failed to process record: ${JSON.stringify(record.body)}`,
        error
      );
    }
  }
}
