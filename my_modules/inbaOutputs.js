const outputs = require(`../config/outputs.json`);

function get(args) {
    let values;
    let skip;
    if (Array.isArray(args[Object.keys(args)[Object.keys(args).length - 1]])) {
        values = args[Object.keys(args)[Object.keys(args).length - 1]];
        skip = Object.keys(args)[Object.keys(args).length - 1];
    }
    
    let currentArray = outputs;
    for (const arg in args) {
        if (arg == skip) continue;
        currentArray = currentArray[args[arg]];
    }

    if (Array.isArray(currentArray))
        currentArray = currentArray[Math.floor(Math.random() * currentArray.length)];

    if (values) {
        values.forEach(value => {
            currentArray = currentArray.replace("%s", value);
        });
    }
    return currentArray;
}

module.exports = {
    get
};