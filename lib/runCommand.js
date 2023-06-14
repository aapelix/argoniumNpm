function runCommand(command) {
	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.log(`Error exexcuting command: ${error.message}`);
		}
		if (stderr) {
	  		console.error(stderr);
	  		return;
		}
		
		console.log(stdout);
	})
}

module.exports.runCommand = runCommand;