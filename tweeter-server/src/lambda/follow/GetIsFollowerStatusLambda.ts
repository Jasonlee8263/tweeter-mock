import {
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DAOFactoryClass } from "../../model/dao/DAOFactoryClass";
export const handler = async (
  request: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {
  const followService = new FollowService(new DAOFactoryClass());
  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );
  return {
    success: true,
    message: null,
    isFollower: isFollower,
  };
};
