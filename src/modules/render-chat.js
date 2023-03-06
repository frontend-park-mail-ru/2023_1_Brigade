import chat from '../templates/chat.js';
import checkAuth from './render-auth.js';
import { deleteSession } from './ajax.js';


const imagesConfig = ['./assets/img/iii.png', './assets/img/geva.png'];

export default (parent, config, userId) => {
  parent.innerHTML = '';
  parent.innerHTML = chat();
  checkAuth();
  
  if (userId) {
    document.querySelector('.header__user-photo').src = './assets/img/geva.png';
  }

  document.querySelector('.logout').addEventListener('click', (e) => {
    e.preventDefault();

    // console.log(document.cookie);
    // localStorage.setItem("Cookie", document.cookie)

    deleteSession({
      url: '/logout/',
    }).then(({status}) => {
        switch (status) {
          case 204:
            config.login.render(parent, config);
            break;
          case 401:
            config.error.render(parent, config, config.chat.key, {name: "401", descr: "Cookie not found"})
            break;
          case 404:
            config.error.render(parent, config, config.chat.key, {name: "404", descr: "User session not found"})
            break;                  
          case 500:
            config.error.render(parent, config, config.chat.key, {name: "500", descr: "Internal error"})
        }
    })
  });
};
