import { Link } from "react-router-dom";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import Post from "./Post";
import useToastListener from "../toaster/ToastListenerHook";
import useInfoHook from "../userInfo/UserInfoHook";

interface Props {
  value: Status;
}
const StatusItem = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const { displayedUser, setDisplayedUser, currentUser, authToken } =
    useInfoHook();
  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const user = await getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          setDisplayedUser(currentUser!);
        } else {
          setDisplayedUser(user);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };
  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.value.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.value.user.firstName} {props.value.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={props.value.user.alias}
                onClick={(event) => navigateToUser(event)}
              >
                {props.value.user.alias}
              </Link>
            </h2>
            {props.value.formattedDate}
            <br />
            <Post status={props.value} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;