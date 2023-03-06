const AJAX_METHODS = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

const BACKEND_URL = 'http://95.163.249.116:8081'
const BACKEND_URL_LOCAL = '127.0.0.1:8081'

/**
 * method implementing request work
 */
function ajax(url, { method, body = null }) {
  return fetch(url, {
    method,
    headers: { "Accept": "application/json", "Host": BACKEND_URL_LOCAL, "Origin": "", 'Content-Type': 'application/json'},
    credentials: "include",
    mode: "cors",
    body,
  })
    .then((response) => {
      const { status } = response;
      let parsedBody;
      if (status != 204) {
        parsedBody = response.json();
      }
      return { status, parsedBody };
    });
}

function get({ url }) {
  return ajax(BACKEND_URL_LOCAL + url, {
    method: AJAX_METHODS.GET,
  });
}

function post({ url, body }) {
  // console.log("post method: ", url)
  return ajax(BACKEND_URL_LOCAL + url, {
    method: AJAX_METHODS.POST,
    body,
  });
}

function deleteSession({ url}) {
  return ajax(BACKEND_URL_LOCAL + url, {
    method: AJAX_METHODS.DELETE,
  });
}

export {
  get, post, deleteSession,
};
