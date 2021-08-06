const outputs = require('../cfg/outputs.json');

function get() {
	let values;
	let skip;
	if (Array.isArray(arguments[Object.keys(arguments)[Object.keys(arguments).length - 1]])) {
		values = arguments[Object.keys(arguments)[Object.keys(arguments).length - 1]];
		skip = Object.keys(arguments)[Object.keys(arguments).length - 1];
	}

	let currentArray = outputs;
	for (const arg in arguments) {
		if (arg == skip) continue;
		currentArray = currentArray[arguments[arg]];
	}

	if (Array.isArray(currentArray)) currentArray = currentArray[Math.floor(Math.random() * currentArray.length)];

	if (values) {
		values.forEach(value => {
			currentArray = currentArray.replace('%s', value);
		});
	}
	return currentArray;
}

module.exports = {
	get,
};