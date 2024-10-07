interface StatusItemView {
}
export abstract class StatusItemPresenter {
    private _view: StatusItemView;

    constructor(view: StatusItemView) {
        this._view = view;
    }
}