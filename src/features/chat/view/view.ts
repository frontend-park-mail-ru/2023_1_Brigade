class ViewChat {
    render(id = null as any) {
        if (!document.body.querySelector('.js-header')) {
            console.log('render function has been called');
        }
    }
}