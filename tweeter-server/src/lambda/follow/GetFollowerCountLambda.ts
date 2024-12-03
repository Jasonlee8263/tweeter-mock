import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DAOFactoryClass } from "../../model/dao/DAOFactoryClass";
export const handler = async (
  request: GetFollowCountRequest
): Promise<GetFollowCountResponse> => {
  const followService = new FollowService(new DAOFactoryClass());
  const count = await followService.getFollowerCount(
    request.token,
    request.user
  );
  return {
    success: true,
    message: null,
    count: count,
  };
};
