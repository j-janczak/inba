const fs = require(`fs`);
const outputsJson = fs.readFileSync(`./config/outputs.json`);
const outputs = JSON.parse(outputsJson);

module.exports = {
    random(column) {
        let o = Math.floor(Math.random() * outputs[column].length);
		return outputs[column][o];
    },
    direct(column, item, variable = null) {
        if (variable) {
            var tmpOutput = outputs[column][item];
            variable.forEach(element => {
                tmpOutput = tmpOutput.replace("%s", element);
            });
            return tmpOutput;
        }
        else return outputs[column][item];
    }
};