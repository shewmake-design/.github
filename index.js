
const { exec } = require('child_process');

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
}, 1000 * 30) // 30 seconds