const CommandTemplate = require(`./_Command.js`);
const axios = require('axios');

class Crypto extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);

        if (args.length < 2) {
            this.sendEmbed(0, `Nie podano nazwy kryptowaluty do sprawdzenia!`);
            return;
        }

        this.getData();
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
                this.sendEmbed(0, "Nie znaleziono podanej kryptowaluty");
                return;
            }

            if (result.status == 200) {
                const cryptoName = Object.entries(result.data)[0][0],
                      cryptoCurrencyData = Object.entries(result.data)[0][1];

                if (Object.keys(cryptoCurrencyData).length === 0) {
                    this.sendEmbed(0, "Nie znaleziono podanej waluty");
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
}

module.exports = {
    name: `crypto`,
    execute(msg, args) {new Crypto(msg, args)}
}