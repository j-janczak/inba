const CommandTemplate = require(`./_Command.js`);
const botConfig = require(`../cfg/config.json`);
const axios = require('axios');

class Crypto extends CommandTemplate {
    constructor(msg, args, client) {
        super(msg, args, client);

        if (args.length < 2) this.help();
        else if (this.args[1] == `help`) this.help();
        else this.getData();
    }
    async getData() {
        try {
            let crypto = this.args[1]
            if (crypto == "btc") crypto = "bitcoin";
            else if (crypto == "eth") crypto = "ethereum";
            else if (crypto == "ltc") crypto = "litecoin";
            else if (crypto == "xlm") crypto = "stellar";
            else if (crypto == "bch") crypto = "bitcoincash";
            else if (crypto == "doge") crypto = "dogecoin";
            else if (crypto == "xch") crypto = "chia";

            const currency = (this.args.length == 3) ? this.args[2] : "pln";
            const result = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`);

            console.log(result.data);

            if (Object.keys(result.data).length === 0) {
                this.sendEmbed(0, this.getString(`crypto`, `notFound`));
                return;
            }

            if (result.status == 200) {
                const cryptoName = Object.entries(result.data)[0][0],
                      cryptoCurrencyData = Object.entries(result.data)[0][1];

                if (Object.keys(cryptoCurrencyData).length === 0) {
                    this.sendEmbed(0, this.getString(`crypto`, `notFound`));
                    return;
                }

                const cryptoCurrencyName = Object.entries(cryptoCurrencyData)[0][0],
                      cryptoCurrencyNameValue = Object.entries(cryptoCurrencyData)[0][1];

                const cryptoNameUpper = cryptoName.charAt(0).toUpperCase() + cryptoName.slice(1);

                this.sendEmbed(1, `1 **${cryptoNameUpper}** = ${cryptoCurrencyNameValue} **${cryptoCurrencyName}**`);
            }
        } catch (error) {
            console.error(error)
            this.sendEmbed(0, "Wystąpił błąd!");
        }
    }
    help() {
        this.sendHelp(`Crypto`, `
Displays the current value of the selected cryptocurrency
\`${botConfig.prefix} ${this.args[0]} <currency1> <currency2>\`

Examples of use:
\`${botConfig.prefix} ${this.args[0]} btc\`
\`${botConfig.prefix} ${this.args[0]} eth usd\`
\`${botConfig.prefix} ${this.args[0]} btc eth\`

Short names such as "btc" work with more popular cryptocurrencies, for the rest, use the full names:
\`${botConfig.prefix} ${this.args[0]} numeraire usd\`

*Powered by https://www.coingecko.com/pl/api*
`);
    }
}

module.exports = {
    name: `crypto`,
    execute(msg, args, client) {new Crypto(msg, args, client)}
}