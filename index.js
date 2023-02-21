const { exec } = require("child_process");
const app = require("express")();
const proxy = require("express-http-proxy");
const os = require("os");

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://api-walterjs-dev-default-rtdb.firebaseio.com",
});

const db = admin.database();
const ref = db.ref("/");

ref.on("child_changed", (snapshot) => {
	const project = snapshot.val();

	console.log(project.info);
});

setInterval(() => {
	exec("git fetch --all", (err, stdout, stderr) => {
		if (err) {
			console.error(err);
			return;
		}

		exec("git pull origin dev", (err, stdout, stderr) => {
			if (err) {
				console.error(err);
				return;
			}

			// check if there were updates
			if (stdout.includes("Already up to date.")) {
				console.log("No updates found.");
				return;
			} else {
				console.log("Updates found.");
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

			console.log("Successfully pulled apps list.");
		});
	});
}, 1000 * 5);

app.use((req, res, next) => {
	// check domain against apps.json to get port, redirect traffic to that port
	const domain = req.get("host");
	const apps = require("./apps.json");

	const app = apps.find(
		(app) => app.name === domain || app.name === domain.replace("www.", "")
	);

	// add header with hostname
	res.setHeader("x-node", os.hostname() ?? "unknown");

	if (!app) {
		console.log("app not found", domain);
		return res.status(404).send("Not found.");
	}

	proxy(`http://localhost:${app.port}`)(req, res, next);
});

app.listen(2000, () => console.log("Listening on port 2000"));
