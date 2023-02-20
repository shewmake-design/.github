
// for every app in the apps.json, check if it's folder exists. If not, clone it.

const fs = require('fs');
const { exec } = require('child_process');

const apps = JSON.parse(fs.readFileSync('./apps.json', 'utf8'));

for (const app of apps) {
    if (!fs.existsSync(`./sites/${app.name}`)) {
        exec(`git clone https://github.com/shewmake-design/${app.name}.git ./sites/${app.name}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
    
        console.log(`Successfully cloned ${app.name}.`);
        });
    }
}
    
exec('pm2 start apps.json', (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    
    console.log('Successfully started apps.');
});
