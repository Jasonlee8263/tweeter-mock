import { AuthToken } from "tweeter-shared";

export class SessionsDAOProvider implements SessionsDAO {
  authToken: AuthToken;
}
