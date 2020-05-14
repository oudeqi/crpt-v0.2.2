export const showLoading = (title = '正在加载...') => {
    api.showProgress({
        title,
        text: '',
        modal: true
    });
}
export const hideLoading = () => {
    api.hideProgress()
}
