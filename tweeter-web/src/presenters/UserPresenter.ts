import { AuthToken, User } from "tweeter-shared";

export interface UserView {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
    displayErrorMessage: (message: string) => void;
}
export abstract class UserPresenter {
    private _view: UserView;
    private _isLoading = false;

    protected constructor(view: UserView) {
        this._view = view;
    }
    protected get view(): UserView {
        return this._view;
    }
    public get isLoading(): boolean { return this._isLoading; }
    protected set isLoading(value: boolean) { this._isLoading = value; }
    public abstract doAuth(alias?:string,password?:string, rememberMe?: boolean, firstName?: string, lastName?:string,imageBytes?:Uint8Array,imageFileExtension?:string):void
}