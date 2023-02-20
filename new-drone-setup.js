console.time('Process finished in')
const fs = require('fs');
const { execSync } = require('child_process');

const apps = JSON.parse(fs.readFileSync('./apps.json', 'utf8'));

console.log(`Cloning ${apps.length} apps...`);
console.time('Cloned all apps in');
for (const app of apps) {
    if (!fs.existsSync(`./sites/${app.name}`)) {
        execSync(`git clone https://github.com/shewmake-design/${app.name}.git ./sites/${app.name}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
    
            console.log(`Successfully cloned ${app.name}.`);
            
            console.log(`Building ${app.name}...`)
            console.time(`Built ${app.name} in`)
            const proc = execSync(`cd ./sites/${app.name} && npm install && npm run build`, (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
            
                console.timeEnd(`Built ${app.name} in`)
            })

            proc.stdout.on('data', (data) => {
                console.log(`[${app.name}] ${data}`);
            })
                
            proc.stderr.on('data', (data) => {

                console.error(`[${app.name}] ${data}`);
            }
            )
        });
    }
}
console.timeEnd('Cloned all apps in');

console.log("Starting apps...");
console.time('Started all apps in');
execSync('pm2 start apps.json', (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    
    console.log('Successfully started apps.');
});
console.timeEnd('Started all apps in');
console.timeEnd('Process finished in')