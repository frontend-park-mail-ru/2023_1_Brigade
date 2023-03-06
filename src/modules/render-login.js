import auth from '../templates/auth.js';
import { validateEmail, validatePassword } from './validator.js';
import checkAuth from './render-auth.js';
import { post } from './ajax.js';

export default (parent, config) => {
  parent.innerHTML = '';
  parent.innerHTML = auth(); // TODO: лучше переименовать в login

  document.querySelector('.auth-but').addEventListener('click', (e) => {
    e.preventDefault();

    const inputEmail = document.querySelector('.email');
    const inputPassword = document.querySelector('.password');

    const valEmail = validateEmail(inputEmail);
    const valPassword = validatePassword(inputPassword);

    if (valEmail && valPassword) {
      post({
        url: '/login/',
        body: JSON.stringify({ email: inputEmail.value, password: inputPassword.value }),
      })
        .then(({ status, parsedBody }) => {
          switch (status) {
            case 200:
              parsedBody.then((res) => {
                config.chat.render(parent, config, res.id);
              })
              break;
            case 404:
              inputEmail.classList.add('auth-reg__input_error');
              document.querySelector('.invalid-email').classList.remove('invisible');
              break;
            case 409:
              config.error.render(parent, config, config.login.key, {name: "409", descr: "The session is already registered"})
              break;
            case 500:
              config.error.render(parent, config, config.login.key, {name: "500", descr: "Internal error"})
              break;
            default:
          }
        });
      }
  });

  document.querySelector('.auth-ques').addEventListener('click', (e) => {
    e.preventDefault();

    config.reg.render(parent, config);
  });
};
