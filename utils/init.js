const welcome = require('cli-welcome');
const pkg = require('./../package.json');
const unhandled = require('cli-handle-unhandled');

module.exports = ({ clear = true }) => {
	unhandled();
	welcome({
		title: `the-a`,
		tagLine: `by aapelix`,
		description: pkg.description,
		version: pkg.version,
		bgColor: '#375aef',
		color: '#000000',
		bold: true,
		clear
	});
};
