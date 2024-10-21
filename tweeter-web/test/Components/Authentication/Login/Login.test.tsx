import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { UserView } from "../../../../src/presenters/UserPresenter";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { instance, mock, verify } from "ts-mockito";
import "@testing-library/jest-dom";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fab);
describe("Login Component", () => {
  it("When first rendered the sign-in button is disabled", () => {
    const { signInButton } = renderLoginAndGetElement(
      "/",
      mockLoginPresenterGenerator
    );
    expect(signInButton).toBeDisabled();
  });
  it("enabled when both the alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/", mockLoginPresenterGenerator);
    await user.type(aliasField, "test");
    await user.type(passwordField, "test");
    expect(signInButton).toBeEnabled();
  });
  it("disabled if either the alias or password field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/", mockLoginPresenterGenerator);
    await user.type(aliasField, "test");
    await user.type(passwordField, "test");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "test");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("called with correct parameters when the sign-in button is pressed", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/", mockLoginPresenterGenerator);
    const originalUrl = "test.com";
    const alias = "@test";
    const password = "test";
    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);
    const mockedLoginPresenter = mock<LoginPresenter>();
    const mockedLoginPresenterInstance = instance(mockedLoginPresenter);
    verify(mockedLoginPresenterInstance.doLogin(alias, password)).once;
  });
  const mockLoginPresenterGenerator = (view: UserView): LoginPresenter => {
    const mockedLoginPresenter = mock<LoginPresenter>();
    return instance(mockedLoginPresenter);
  };
});

const renderLogin = (
  originalUrl: string,
  presenterGenerator: (view: UserView) => LoginPresenter
) => {
  return render(
    <MemoryRouter>
      <Login
        originalUrl={originalUrl}
        presenterGenerator={presenterGenerator}
      ></Login>
    </MemoryRouter>
  );
};

const renderLoginAndGetElement = (
  originalUrl: string,
  presenterGenerator: (view: UserView) => LoginPresenter
) => {
  const user = userEvent.setup();
  renderLogin(originalUrl, presenterGenerator);
  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};
