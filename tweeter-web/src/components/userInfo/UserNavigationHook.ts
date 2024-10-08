import useToastListener from "../toaster/ToastListenerHook";
import useInfoHook from "./UserInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
interface Props {
  presenterGenerator: (view: UserNavigationView) => UserNavigationPresenter;
}
const userNavigationHook = (props:Props) => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } = useInfoHook();
    const listener: UserNavigationView = {
        setDisplayedUser: setDisplayedUser,
        displayErrorMessage: displayErrorMessage,
      };
    const presenter:UserNavigationPresenter = props.presenterGenerator(listener);

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        await presenter.navigateToUser(event, authToken, currentUser);
      };
    
      return { navigateToUser };

}
export default userNavigationHook
