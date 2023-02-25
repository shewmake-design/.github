const SITE_DIR = "/home/drone/actions-runner/_work";

module.exports = {
	apps: require("./apps.json").map((app) => ({
		name: app.name,
		cwd: `${SITE_DIR}/${app.name}/${app.name}`,
		script: "npm run start -- -p $PORT",
		max_memory_restart: "100M",
		env: {
			PORT: app.port,
		},
	})),
};
