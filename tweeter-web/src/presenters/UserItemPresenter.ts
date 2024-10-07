import { AuthToken, User } from "tweeter-shared";

export interface UserItemView {
    addItems: (newItems: User[]) => void;
    displayErrorMessage: (message: string) => void;
}
export abstract class UserItemPresenter {
    private _view: UserItemView;
    private _hasMoreItems = true;
    private _lastItem: User | null = null;

    protected constructor(view: UserItemView) {
        this._view = view
    }

    protected get view(): UserItemView {
        return this._view;
    }

    public get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }
    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }
    protected get lastItem(): User | null {
        return this._lastItem;
    }
    protected set lastItem(value: User | null) {
        this._lastItem = value;
    }

    reset() {
        this.lastItem = null;
        this.hasMoreItems = true;
    }
    public abstract loadMoreItems(authToken:AuthToken, userAlias: string) : void;
}