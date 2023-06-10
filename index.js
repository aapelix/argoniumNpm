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

const { prompt } = require('enquirer');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

let remoteUrl;

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	debug && log(flags);

	if(input.includes(`commit`) || input.includes(`c`)){
		const spinner = createSpinner("Adding files...").start();

		await runCommand("git add .");
		
		spinner.update({
			text: "Committing...",
		})

		await runCommand('git commit -m "Committed using A"');
		
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

		async function askInit() {
			const answers = await prompt({
				name: "remote_url",
				type: "input",
				message: "URL for the remote repository",
				default() {
					return "https://github.com/example/example.git"
				},
			});
	
			remoteUrl = answers.remote_url;
		}

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

		await runCommand("npm run build");

		spinner.update({
			text: "Deploying...",
		})

		await runCommand("firebase deploy");

		alert({type: `success`, msg: ``});

		spinner.success({text: "Build and deployed to firebase!"})
	}

})();


async function runCommand(command) {
	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.log(`Error exexcuting command: ${error.message}`);
		}
		if (stderr) {
      		console.error(`Error output: ${stderr}`);
      		return;
    	}
    
	})
}


