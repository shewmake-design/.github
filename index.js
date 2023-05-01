const { exec, spawn } = require("child_process");
const app = require("express")();
const proxy = require("express-http-proxy");
const os = require("os");
const axios = require("axios");
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");
const e = require("express");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://api-walterjs-dev-default-rtdb.firebaseio.com",
});

const db = admin.database();
const ref = db.ref("/");

ref.on("child_changed", (snapshot) => {
	const project = snapshot.val().info;

	const apps = require("./apps.json");

	const app = apps.find((app) => app.name.includes(project.domain));

	if (!app) {
		console.log("app not found", project.name);
		return;
	} else {
		console.log(
			`[${project.name}] Sending revalidation request to '${app.name}'`
		);

		axios
			.get(`http://localhost:${app.port}/api/revalidate`)
			.then((res) => {
				console.log(`[${project.name}] Revalidation request sent.`);

				if (res.status !== 200) {
					console.log(
						`[${project.name}] Revalidation request failed.`
					);
				} else {
					console.log(
						`[${project.name}] Revalidation request was successful.`
					);
				}
			})
			.catch((err) => {
				console.log(`[${project.name}] Revalidation request failed.`);
				console.log(err);
			});
	}
});

const loop = () => {
	exec("git fetch --all", (err, stdout, stderr) => {
		if (err) {
			console.error(err);
			return;
		}

		exec(
			`git pull ${os.hostname() === "sat-00" ? "origin dev" : ""}`,
			(err, stdout, stderr) => {
				if (err) {
					console.error(err);
					exec(
						`git reset --hard HEAD && git pull ${
							os.hostname() === "sat-00" ? "origin dev" : ""
						}`,
						(err, stdout, stderr) => {
							if (err) {
								console.error(err);
							}
						}
					);
					return setTimeout(loop, 1000 * 5);
				}

				// check if there were updates
				if (stdout.includes("Already up to date.")) {
					console.log("No updates found.");
					return setTimeout(loop, 1000 * 5);
				} else {
					console.log("Updates found.");
					console.log("Spawning app setup...");
					exec(
						"node /home/drone/.github/new-drone-setup.js",
						(err, stdout, stderr) => {
							if (err) {
								console.error(err);
								return;
							}
							console.log("Spawned app setup.");
							console.log("Restarting app-puller...");

							exec(
								"npm i && pm2 restart app-puller",
								(err, stdout, stderr) => {
									if (err) {
										console.error(err);
										return;
									}
									console.log("Restarted app-puller.");
								}
							);
						}
					);
				}
				console.log("Successfully pulled apps list.");
			}
		);
	});
};

app.use((req, res, next) => {
	// check domain against apps.json to get port, redirect traffic to that port
	const domain = req.get("host");

	if (!domain) return next();

	const apps = require("./apps.json");

	const app = apps.find((app) => {
		if (
			os.hostname() === "sat-00" &&
			domain.split(".dev.shewmake.design").length > 1
		) {
			// scbaseball.org.dev.shewmake.design || 2002.dev.shewmake.design both forward to scbaseball.org on dev
			return (
				app.name === domain.split(".dev.shewmake.design")[0] ||
				app.port.toString() === domain.split(".dev.shewmake.design")[0]
			);
		}

		return app.name === domain || app.name === domain.replace("www.", "");
	});

	// add header with hostname
	res.setHeader("x-node", os.hostname() ?? "unknown");

	if (!app) {
		console.log("app not found", domain);
		// if using local port, use next(), otherwise return 404
		if (domain.includes(":200") || domain === "dev.shewmake.design")
			return next();
		else return res.status(404).send("Not found.");
	}

	proxy(`http://localhost:${app.port}`)(req, res, next);
});

app.use("/", (req, res) => {
	const apps = require("./apps.json");

	// check status code of each app with HEAD req, return json
	const promises = apps.map((app) => {
		return axios
			.head(`http://localhost:${app.port}`)
			.then((res) => {
				return { ...app, status: res.status };
			})
			.catch((err) => {
				return { ...app, status: err.response?.status ?? 500 };
			});
	});

	Promise.all(promises).then((apps) => {
		// return json and status code 200 if all apps are up, otherwise return 500
		const status = apps.every((app) => app.status === 200) ? 200 : 500;
		res.status(status)
			.setHeader("Content-Type", "application/json")
			.send(
				JSON.stringify(
					{
						node: os.hostname(),
						status,
						apps,
					},
					null,
					2
				)
			);
	});
});

app.listen(2000, () => console.log("Listening on port 2000"));
loop();
