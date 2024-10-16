import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useInfoHook from "../../userInfo/UserInfoHook";
import { UserPresenter, UserView } from "../../../presenters/UserPresenter";
import { LoginPresenter } from "../../../presenters/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenterGenerator: (view: UserView) => LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useInfoHook();
  const { displayErrorMessage } = useToastListener();

  const listener: UserView = {
    setIsLoading: setIsLoading,
    navigate: navigate,
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    rememberMe: rememberMe,
    originalUrl: props.originalUrl,
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    presenter.doLogin(alias, password, rememberMe);
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          alias={alias}
          password={password}
          setAlias={setAlias}
          setPassword={setPassword}
          handleKeyDown={loginOnEnter}
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
