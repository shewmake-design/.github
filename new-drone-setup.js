console.time("Process finished in");
const fs = require("fs");
const { execSync } = require("child_process");
const SITE_DIR = "/home/drone/actions-runner/_work";

const apps = JSON.parse(fs.readFileSync("./apps.json", "utf8")).filter(
	(app) =>
		!fs.existsSync(
			app.apiKey
				? `/home/drone/sites/${app.name}`
				: `${SITE_DIR}/${app.name}/${app.name}`
		)
);

console.log(
	apps.length > 0 ? `Cloning ${apps.length} apps...` : "No apps need cloning."
);
for (const app of apps) {
	execSync(
		`git clone https://github.com/shewmake-design/${
			app.apiKey ? "website" : app.name
		}.git ${
			app.apiKey
				? `/home/drone/sites/${app.name}`
				: `${SITE_DIR}/${app.name}/${app.name}`
		} && cd ${
			app.apiKey
				? `/home/drone/sites/${app.name}`
				: `${SITE_DIR}/${app.name}/${app.name}`
		}${os.hostname() === "sat-00" ? " && git checkout dev" : ""}${
			app.apiKey ? " && export API_KEY=" + app.apiKey : ""
		}`,
		{
			stdio: "inherit",
		}
	);
	console.log(`Successfully cloned ${app.name}.`);

	console.log(`Building ${app.name}...`);
	console.time(`[${app.name}] Build finished in`);
	execSync(
		`echo Installing dependencies && ` +
			`cd ${
				app.apiKey
					? `/home/drone/sites/${app.name}`
					: `${SITE_DIR}/${app.name}/${app.name}`
			} && pnpm pkg delete scripts.prepare && pnpm install --force --shamefully-hoist --production && ` +
			`echo Building site && ` +
			`API_KEY=${app.apiKey} npm run build && ` +
			`echo Restarting server && ` +
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
