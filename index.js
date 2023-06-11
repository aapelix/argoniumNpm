#!/usr/bin/env node

/**
 * the-a
 * Helps you and your mom to use cli commands
 *
 * @author aapelix <https://www.aapelix.dev/>
 */

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

	if(input.includes(`commit`) || input.includes(`c`)){

		const spinner = createSpinner("Adding files...").start();

		updateSpinner(spinner);
		

		await runCommand("git add .");
		
		spinner.update({
			text: "Committing...",
		})

		await runCommand('git commit -m "Committed using Argonium"');
		
		await runCommand("git pull");
		
		spinner.update({
			text: "Deploying...",
		})

		await runCommand("git push");

		spinner.success({text: "Succesfully committed to GitHub!"});

		alert({type: `info`, msg: ``})
	}

	if(input.includes(`ginit`) || input.includes(`gi`)) {

		const spinner = createSpinner("Initializing...").start();
		updateSpinner(spinner);

		async function askInit() {
			const answers = new prompt({
				name: "remote_url",
				type: "input",
				message: "URL for the remote repository",
				default() {
					return "https://github.com/example/example.git"
				},
			});
		}

		remoteUrl = answers.remote_url;
		

		await runCommand('echo "# testing" >> README.md')
		
		
		await runCommand("git init")

		await runCommand("git add README.md")

		spinner.update({
			text: "Committing...",
		})
		
		await runCommand('git commit -m "First commit using A"');
		
		await runCommand("git branch -M main")

		await askInit();
		await runCommand("git remote add origin " + remoteUrl);
		
		spinner.update({
			text: "Deploying...",
		})

		await runCommand("git push -u origin main");

		alert({type: `success`, msg: ``});

		spinner.success({text: "Your repository is now ready!"});
	}

	if (input.includes(`firebase`) || input.includes(`fb`)) {

		const spinner = createSpinner("Building...").start();
		updateSpinner(spinner);

		await runCommand("npm run build");

		spinner.update({
			text: "Deploying...",
		})

		await runCommand("firebase deploy");

		alert({type: `success`, msg: ``});

		spinner.success({text: "Build and deployed to firebase!"})
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

			const reactPrompt = new prompt({
				name: "react_name",
				message: "Name of your new React project",
				type: "input"
			})

			reactName = reactPrompt.react_name;

			const spinner = createSpinner("Creating your project...").start();
			updateSpinner(spinner);

			await runCommand("npx create-react-app " + reactName);

			spinner.update({
				text: "Cding to your new project...",
			});

			await runCommand("cd" + reactName);

			spinner.success({text: "Created your " + reactName + "project!"});

			alert({type: `info`, msg: `To view your ` + reactName + `project run: ` + chalk.blue("npm run dev")})
		}

		if (name == "Vue") {
			runCommand("npm init vue@latest", true)
		}

		if (name == "Svelte") {
			let svelteName;

			const sveltePrompt = new prompt({
				name: "svelte_name",
				message: "Name of your new svelte project",
				type: "input"
			})

			svelteName = sveltePrompt.svelte_name;

			const spinner = createSpinner("Creating your project").start();
			updateSpinner(spinner);

			await runCommand("npm create svelte@latest " + svelteName, true);

			spinner.update({
				text: "Cding to your new project",
			});

			await runCommand("cd" + svelteName);

			spinner.update({
				text: "Initializing...",
			});

			spinner.success({text: "Created your " + svelteName + "project!"});

			alert({type: `info`, msg: `To view your ` + svelteName + `project run: ` + chalk.blue("npm run dev")})
		}

		if (name == "Astro") {
			runCommand("npm create astro@latest", true);
		}


		if (name == "Next.js") {

			runCommand("npx create-next-app", true)
		}

		if (name == "Spring") {
			runCommand("https://start.spring.io");
		}


	}
		
})();


async function runCommand(command, print) {
	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.log(`Error exexcuting command: ${error.message}`);
		}
		if (stderr) {
      		console.error(`Error output: ${stderr}`);
      		return;
    	}
		
		if (print) {
			console.log(stdout);
		}
	})
}


