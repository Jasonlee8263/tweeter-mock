import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DAOFactoryClass } from "../../model/dao/DAOFactoryClass";
export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const userService = new UserService(new DAOFactoryClass());
  const [user, authToken] = await userService.login(
    request.alias,
    request.password
  );
  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken,
  };
};
