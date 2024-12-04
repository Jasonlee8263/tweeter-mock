import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DAOFactoryClass } from "../../model/dao/DAOFactoryClass";
export const handler = async (
  request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService(new DAOFactoryClass());
  const [items, hasMore] = await statusService.loadMoreFeedItems(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );
  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
