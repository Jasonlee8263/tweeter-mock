import { PostStatusRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DAOFactoryClass } from "../../model/dao/DAOFactoryClass";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
const sqsClient = new SQSClient({ region: "us-east-1" });
const statusUpdateQueueUrl =
  "https://sqs.us-east-1.amazonaws.com/929651342877/StatusUpdate-SQS"; // 두 번째 큐 URL
export const handler = async (request: PostStatusRequest): Promise<void> => {
  const statusService = new StatusService(new DAOFactoryClass());
  await statusService.postStatus(request.token, request.newStatus);
  const message = {
    authorAlias: request.newStatus.user.alias,
    content: request.newStatus.post,
    timestamp: request.newStatus.timestamp,
  };

  const params = {
    QueueUrl: statusUpdateQueueUrl,
    MessageBody: JSON.stringify(message),
  };

  try {
    await sqsClient.send(new SendMessageCommand(params));
    console.log("Enqueued status update:", message);
  } catch (error) {
    console.error("Error enqueuing status update:", error);
  }
};
