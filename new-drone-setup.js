console.time('Process finished in')
const fs = require('fs');
const { execSync } = require('child_process');

const apps = JSON.parse(fs.readFileSync('./apps.json', 'utf8'));

console.log(`Cloning ${apps.length} apps...`);
for (const app of apps) {
    if (!fs.existsSync(`./sites/${app.name}`)) {
        execSync(`git clone https://github.com/shewmake-design/${app.name}.git ./sites/${app.name}`, {
            stdio: 'inherit'
    
        });
        console.log(`Successfully cloned ${app.name}.`);
            
            console.log(`Building ${app.name}...`)
            console.time(`[${app.name}] Build finished in`);
            execSync(`echo Installing dependencies &&` +
				`cd /home/drone/.github/sites/${app.name} && npm install --force && ` +
				`echo Building site &&` +
				`npm run build && ` +
				`echo Restarting server &&` +
                `cd /home/drone/.github && pm2 delete apps.json --only ${app.name} && pm2 start apps.json --only ${app.name} && ` +
                `echo Successfully built ${app.name}`, {
                    stdio: 'inherit'
                });

			console.log(`----------------------------------------`);
			console.timeEnd(`[${app.name}] Build finished in`);
			console.log(`----------------------------------------`);
    }
}


// TODO: put sites in the correct actions-runner directory, ensure that each site has it's .env.local file included (it's a private repo, so who cares?)