export interface UserItemView {
}
export class UserItemPresenter {
    private view: UserItemView;

    protected constructor(view: UserItemView) {
        this.view = view
    }
}