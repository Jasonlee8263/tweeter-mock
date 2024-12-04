import { PostStatusRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DAOFactoryClass } from "../../model/dao/DAOFactoryClass";
export const handler = async (request: PostStatusRequest): Promise<void> => {
  const statusService = new StatusService(new DAOFactoryClass());
  await statusService.postStatus(request.token, request.newStatus);
};
