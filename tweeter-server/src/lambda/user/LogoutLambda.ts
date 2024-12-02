import { LogoutRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DAOFactoryClass } from "../../model/dao/DAOFactoryClass";
export const handler = async (request: LogoutRequest): Promise<void> => {
  const userService = new UserService(new DAOFactoryClass());
  await userService.logout(request.token);
};
