#!/usr/bin/env node

/**
 * the-a
 * Helps using cli commands
 *
 * @author aapelix <https://www.aapelix.dev/>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const { exec } = require("child_process");

const { createSpinner } = require("nanospinner");

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	debug && log(flags);

	if(input.includes(`commit`) || input.includes(`c`)){
		const spinner = createSpinner("Committing...").start();

		await runCommand("git add .");

		await runCommand("git commit");

		spinner.success({text: "Succesfully committed to GitHub!"});
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
