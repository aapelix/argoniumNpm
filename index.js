#!/usr/bin/env node

/**
 * argonium
 * Helps you and your mom to use cli commands
 *
 * @author aapelix <https://www.aapelix.dev/>
 */


/* Cli Stuff */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const alert = require('cli-alerts');

const { exec } = require("child_process");

const { createSpinner } = require("nanospinner");

const { prompt, Select } = require('enquirer');
const chalk = require('chalk');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

let remoteUrl;
let defaultMsg = "Committed using Argonium";
let defaultBranch = "main";

function updateSpinner(spinner) {
	spinner.update({
		frames: [chalk.black("■■■■■■"), chalk.black("■■■■■■"), chalk.blue('■') + chalk.black('■■■■■'), chalk.blue("■■") + chalk.black("■■■■"), chalk.blue("■■■") + chalk.black("■■■"), chalk.blue("■■■■") + chalk.black("■■"), chalk.blue("■■■■■") + chalk.black("■"), chalk.blue("■■■■■■"), chalk.blue("■■■■■■"), chalk.black("■") + chalk.blue("■■■■■"), chalk.black("■■") + chalk.blue("■■■■"), chalk.black("■■■") + chalk.blue("■■■"), chalk.black("■■■■") + chalk.blue("■■"), chalk.black("■■■■■") + chalk.blue("■")],
		interval: 150,
	})
}

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	debug && log(flags);

	if (input.includes(`git`) || input.includes(`g`)) {

		if(input.includes(`commit`) || input.includes(`c`)){

			const spinner = createSpinner("Adding files...").start();

			updateSpinner(spinner);

			await runCmd("git add .");
			
			spinner.update({
				text: "Committing...",
			})

			await runCmd('git commit -m "' + defaultMsg + '"');

			await runCmd("git pull");

			spinner.update({
				text: "Deploying...",
			})

			await runCmd("git push origin " + defaultBranch);

			spinner.success({text: "Succesfully committed to GitHub!"});

			alert({type: `info`, msg: ``})
		}

		else if (input.includes(`msg`) || input.includes(`m`)) {
			const answers = await prompt({
				name: "commit_msg",
				type: "input",
				message: "Commit message",
			});

			defaultMsg = answers.commit_msg;
			alert({type: `success`, msg: `Successfully changed commit message to ` + defaultMsg})
		}

		else if(input.includes(`init`) || input.includes(`i`)) {
		
			const answers = await prompt({
				name: "remote_url",
				type: "input",
				message: "URL for the remote repository",
				default() {
					return "https://github.com/example/example.git"
				},
			});

			remoteUrl = answers.remote_url;

			const spinner = createSpinner("Initializing...").start();
			updateSpinner(spinner);

			await runCmd('echo "# testing" >> README.md')


			await runCmd("git init")

			await runCmd("git add README.md")

			spinner.update({
				text: "Committing...",
			})

			await runCmd('git commit -m "First commit using Argonium"');

			await runCmd("git branch -M main")

			await runCmd("git remote add origin " + remoteUrl);

			spinner.update({
				text: "Deploying...",
			})

			await runCmd("git push -u origin main");

			alert({type: `success`, msg: ``});

			spinner.success({text: "Your repository is now ready!"});
		}

		else if (input.includes(`branch`) || input.includes(`b`)) {
			const answers = await prompt({
				name: "branch_name",
				type: "input",
				message: "URL for the remote repository",
				default() {
					return "https://github.com/example/example.git"
				},
			});

			defaultBranch = answers.branch_name;

			await runCmd("git branch -M " + defaultBranch);

			alert({type: `success`, msg: `Successfully changed branch to ` + defaultBranch})
		}
	}

	if (input.includes(`firebase`) || input.includes(`fb`)) {
		if (input.includes(`init`)) {
			console.log("Soon... https://argonium.net/blog");
		}

		else if (input.includes(`deploy`)) {

			const spinner = createSpinner("Building...").start();
			updateSpinner(spinner);

			await runCmd("npm run build");

			spinner.update({
				text: "Deploying...",
			})

			await runCmd("firebase deploy");

			alert({type: `success`, msg: ``});

			spinner.success({text: "Build and deployed to firebase!"})
		}
	}

	if (input.includes(`create`)) {
		let name;

		const prompt = new Select({
  			name: 'framework_name',
  			message: 'What you want to create?',
  			choices: ['React', "Vite", 'Vue', 'Svelte', 'Astro', "Next.js", "Spring"]
		});
		
		await prompt.run()
		  .then(answer => name = answer)
		  .catch(console.error);

		if (name == "React") {

			let reactName;

			const reactPrompt = await prompt({
				name: "react_name",
				message: "Name of your new React project",
				type: "input"
			})

			reactName = reactPrompt.react_name;

			const spinner = createSpinner("Creating your project...").start();
			updateSpinner(spinner);

			await runCmd("npx create-react-app " + reactName);

			spinner.update({
				text: "Cding to your new project...",
			});

			await runCmd("cd" + reactName);

			spinner.success({text: "Created your " + reactName + "project!"});

			alert({type: `info`, msg: `To view your ` + reactName + `project run: ` + chalk.blue("npm run dev")})
		}

		if (name == "Vue") {
			runCmd("npm init vue@latest", true)
		}

		if (name == "Svelte") {
			let svelteName;

			const sveltePrompt = await prompt({
				name: "svelte_name",
				message: "Name of your new svelte project",
				type: "input"
			})

			svelteName = sveltePrompt.svelte_name;

			const spinner = createSpinner("Creating your project").start();
			updateSpinner(spinner);

			await runCmd("npm create svelte@latest " + svelteName, true);

			spinner.update({
				text: "Cding to your new project",
			});

			await runCmd("cd" + svelteName);

			spinner.update({
				text: "Initializing...",
			});

			spinner.success({text: "Created your " + svelteName + "project!"});

			alert({type: `info`, msg: `To view your ` + svelteName + `project run: ` + chalk.blue("npm run dev")})
		}

		if (name == "Astro") {
			await runCmd("npm create astro@latest", true);
		}


		if (name == "Next.js") {
			await runCmd("npx create-next-app", true)
		}

		if (name == "Spring") {
			await runCmd("explorer https://start.spring.io");
		}

	}
		
})();


async function runCmd(command, print) {
	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.log(`Error exexcuting command: ${error.message}`);
		}
		if (stderr) {
      		console.error(stderr);
      		return;
    	}
		
		if (print) {
			console.log(stdout);
		}
	})
}


