console.time("Process finished in");
const fs = require("fs");
const { execSync } = require("child_process");
const SITE_DIR = "/home/drone/actions-runner/_work";

const apps = JSON.parse(fs.readFileSync("./apps.json", "utf8")).filter(
	(app) => !fs.existsSync(`${SITE_DIR}/${app.name}`)
);

console.log(
	apps.length > 0 ? `Cloning ${apps.length} apps...` : "No apps need cloning."
);
for (const app of apps) {
	execSync(
		`git clone https://github.com/shewmake-design/${app.name}.git ${SITE_DIR}/${app.name}`,
		{
			stdio: "inherit",
		}
	);
	console.log(`Successfully cloned ${app.name}.`);

	console.log(`Building ${app.name}...`);
	console.time(`[${app.name}] Build finished in`);
	execSync(
		`echo Installing dependencies &&` +
			`cd ${SITE_DIR}/${app.name} && pnpm install --force --shamefully-hoist && ` +
			`echo Building site &&` +
			`npm run build && ` +
			`echo Restarting server &&` +
			`cd ~/.github && pm2 delete ecosystem.config.js --only ${app.name} && pm2 start ecosystem.config.js --only ${app.name} && pm2 save && ` +
			`echo Successfully built ${app.name}`,
		{
			stdio: "inherit",
		}
	);

	console.log(`----------------------------------------`);
	console.timeEnd(`[${app.name}] Build finished in`);
	console.log(`----------------------------------------`);
}
