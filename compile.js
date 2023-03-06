const pug = require('pug');
const fs = require('fs').promises;

const PATHS = ['./src/pages/auth/', './src/pages/reg/', './src/pages/Chat/', './src/pages/error/'];
  
const PATH_OUT = './src/templates/';

for (const path of PATHS) {
  fs.readdir(path)
    .then(async (res) => {
      for (const fileName of res) {
        if (fileName.split('.')[1] === 'pug') {
          const name = fileName.replace('.pug', '');

          const templateFunction = pug.compileFile(path + fileName);

          fs.writeFile(PATH_OUT + name + '.js', 'export default ' + templateFunction);
        }
      }
    });
}
