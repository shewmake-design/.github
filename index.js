
const { exec } = require('child_process');

setInterval(() => {
    exec('git fetch --all', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  exec(`git reset --hard origin/${remote_branch_name}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('Successfully pulled apps list.');
  });
});
})