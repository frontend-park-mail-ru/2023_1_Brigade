import { get } from './ajax.js';

export default (parent, config) => {
  get({
    url: '/auth/',
  })
    .then(({ status, parsedBody }) => {
      switch (status) {
        case 200:
          parsedBody.then((res) => {
            config.chat.render(parent, config, res.id);
          })
          break;
        case 404:
          config.login.render(parent, config);
          break;
        case 500:
          config.error.render(parent, config, config.login.key, {name: "500", descr: "Internal error"});
          break;
        default:
          config.login.render(parent, config);
      }
    });
};
