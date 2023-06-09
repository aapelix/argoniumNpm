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
		const spinner = createSpinner("Committing...").start();

		runCommand("git add .");
		await delay(1000)
		runCommand('git commit -m "Committed using A"');
		await delay(1000)
		runCommand("git pull");
		await delay(1000)
		runCommand("git push");

		alert({type: `success`, msg: ``});

		spinner.success({text: 
		"Succesfully committed to GitHub!\n If any errors occurred, they are listed below\n"});
	}

	if(input.includes(`ginit`) || input.includes(`gi`)) {

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

		runCommand('echo "# testing" >> README.md')
		await delay(500);
		
		runCommand("git init")
		await delay(2000)
		runCommand("git add README.md")
		await delay(500);
		runCommand('git commit -m "First commit using A"');
		await delay(500);

		runCommand("git branch -M main")

		await askInit();
		runCommand("git remote add origin " + remoteUrl);
		await delay(500)
		runCommand("git push -u origin main");

		alert({type: `success`, msg: `Your repository is now ready!`});
	}

	if (input.includes(`firebase`) || input.includes(`fb`)) {
		async function build() {
			runCommand("npm run build");
		}

		async function deploy() {
			runCommand("firebase deploy");
		}

		await build();
		await deploy();

		alert({type: `success`, msg: `Build and deployed to firebase!`});
	}

})();


function runCommand(command) {
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


