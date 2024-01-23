const isLoggedMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    if (state.auth.isLogged === true) {
        const currentPath = window.location.pathname;
        if (currentPath === '/user/sigIn' || currentPath === '/user/signUp' || currentPath === '/'){
            window.location.href = '/dash'; 
        }
    }

    if (action.type === 'persist/REHYDRATE') {
        const state = store.getState();

        // Check if the user is not logged in
        if (state.auth.isLogged === false) {
            const currentPath = window.location.pathname;
            const isUserRoute = currentPath.startsWith('/user/');

            // If the current path is not a user route, redirect to the sign-in page
            if (!isUserRoute && currentPath !== '/' && state.auth.isLogged === false) {
                window.location.href = '/'; 
            }
        }
        else{
            const currentPath = window.location.pathname;
            if (currentPath === '/user/sigIn' || currentPath === '/user/signUp' || currentPath === '/'){
                window.location.href = '/dash'; 
            }
        }
    }

    return result;
};

export default isLoggedMiddleware;
