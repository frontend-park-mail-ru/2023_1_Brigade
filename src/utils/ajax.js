const AJAX_METHODS = {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE',
};

const BACKEND_URL = 'http://95.163.249.116:8081';
// const BACKEND_URL_LOCAL = '127.0.0.1:8081'

/**
 * method implementing request work
 * @param {string} url - path url
 * @param {string} method - request method
 * @param {json} body - request data
 * @returns {Promise} - request promise
 */
function ajax(url, { method, body = null }) {
    return fetch(BACKEND_URL + url, {
        method,
        headers: {
            Accept: 'application/json', Host: BACKEND_URL, 'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body,
    })
        .then((response) => {
            const { status } = response;
            let parsedBody;
            if (status !== 204) {
                parsedBody = response.json();
            }
            return { status, parsedBody };
        });
}

/**
 * method implementing GET request
 * @param {string} url - path url
 * @returns {Promise} - request promise
 */
function get({ url }) {
    return ajax(url, {
        method: AJAX_METHODS.GET,
    });
}

/**
 * method implementing POST request
 * @param {string} url - path url
 * @param {json} body - request data
 * @returns {Promise} - request promise
 */
function post({ url, body }) {
    // console.log('post method: ', url);
    return ajax(url, {
        method: AJAX_METHODS.POST,
        body,
    });
}

/**
 * method implementing DELETE request
 * @param {string} url - path url
 * @returns {Promise} - request promise
 */
function deleteSession({ url }) {
    return ajax(url, {
        method: AJAX_METHODS.DELETE,
    });
}

export {
    get, post, deleteSession,
};
