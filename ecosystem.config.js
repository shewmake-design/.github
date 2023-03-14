const SITE_DIR = "/home/drone/actions-runner/_work";

module.exports = {
	apps: require("./apps.json").map((app) => {
		if (app.apiKey) {
			return {
				name: app.name,
				cwd: `/home/drone/sites/${app.name}`,
				script: "npm run start -- -p $PORT",
				max_memory_restart: "100M",
				env: {
					PORT: app.port,
					API_KEY: app.apiKey,
				},
			};
		}
		return {
			name: app.name,
			cwd: `${SITE_DIR}/${app.name}/${app.name}`,
			script: "npm run start -- -p $PORT",
			max_memory_restart: "100M",
			env: {
				PORT: app.port,
			},
		};
	}),
};
