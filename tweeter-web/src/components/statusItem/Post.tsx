import { Status, Type } from "tweeter-shared";
import { Link } from "react-router-dom";
import userNavigationHook from "../userInfo/UserNavigationHook";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenters/UserNavigationPresenter";

interface Props {
  status: Status;
}

const Post = (props: Props) => {
  const { navigateToUser } = userNavigationHook({
    presenterGenerator: (view: UserNavigationView) =>
      new UserNavigationPresenter(view),
  });

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link
            key={index}
            to={segment.text}
            onClick={(event) => navigateToUser(event)}
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        )
      )}
    </>
  );
};

export default Post;
