import { AuthToken, FakeData, User } from "tweeter-shared";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import useInfoHook from "../userInfo/UserInfoHook";
import userNavigationHook from "../userInfo/UserNavigationHook";

interface Props {
  value: User;
}

const UserItem = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useInfoHook();
  const { navigateToUser } = userNavigationHook();

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.value.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.value.firstName} {props.value.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={props.value.alias}
                onClick={(event) => navigateToUser(event)}
              >
                {props.value.alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
