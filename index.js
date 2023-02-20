
const { exec } = require('child_process');
const app = require('express')();
const proxy = require('express-http-proxy');

setInterval(() => {
    exec('git fetch --all', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  exec(`git reset --hard`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
      
      exec('git pull', (err, stdout, stderr) => {
          if (err) {

              console.error(err); 
              return;
            }

    console.log('Successfully pulled apps list.');
      });
  });
    })
}, 1000 * 30);

app.use((req, res, next) => {

  // check domain against apps.json to get port, redirect traffic to that port
  const domain = req.get('host');
  const apps = require('./apps.json');

  const app = apps.find(app => app.name === domain || app.name === domain.replace('www.', ''));

  if (!app) {
    return res.status(404).send('Not found.');
  }

  proxy(`http://localhost:${app.env.PORT}`)(req, res, next);

})

app.listen(2000, () => console.log('Listening on port 2000'));