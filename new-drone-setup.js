console.time('Process finished in')
const fs = require('fs');
const { execSync } = require('child_process');

const apps = JSON.parse(fs.readFileSync('./apps.json', 'utf8'));

console.log(`Cloning ${apps.length} apps...`);
for (const app of apps) {
    if (!fs.existsSync(`./sites/${app.name}`)) {
        execSync(`git clone https://github.com/shewmake-design/${app.name}.git ./sites/${app.name}`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
    
        });
        console.log(`Successfully cloned ${app.name}.`);
            
            console.log(`Building ${app.name}...`)
            console.timeEnd(`[${app.name}] Build finished in`);
            execSync(`echo Installing dependencies &&` +
				`cd /home/drone/.github/sites/${app.name} && npm install --force && ` +
				`echo Building site &&` +
				`npm run build && ` +
				`echo Restarting server &&` +
                `cd /home/drone/.github && pm2 delete apps.json --only ${app.name} && pm2 start apps.json --only ${app.name} && ` +
                `echo Successfully built ${app.name}`, (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }

                if (stdout) {
                    console.log(`[${app.name}] ${stdout}`);
                }

                if (stderr) {
                    console.error(`[${app.name}] ${stderr}`);
                }
            });

			console.log(`----------------------------------------`);
			console.log(
				`[${req.body.repository.name}] Process exited with code ${code}`
			);
			console.timeEnd(`[${app.name}] Build finished in`);
			console.log(`----------------------------------------`);
    }
}
