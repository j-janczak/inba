const CommandTemplate = require(`../my_modules/CommandTemplate.js`);

class Vitkowski extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);

        if(!this.checkPermission(msg)) return;

        this.lyrics = [
            `Znów wyszedłeś głupio`,
            `Nie mogę być szczęśliwszy`,
            `Dwa razy próbowałeś zbanować mnie`,
            `Śmialiśmy z tego się`,
            `Choć mój śmiech nie był szczery`,
            `Zważywszy na mój .poziom`,
            `Byłem szokująco miły\n.`,
            `Chcesz swej wolności?`,
            `Bierz ją.`,
            `Właśnie na to liczę\n.`,
            `Chciałem byś został zbanowany`,
            `I na reszcie to się spełniło\n.`,
            `Jestem do Ciebie bardzo podobny`,
            `(Tylko kod mam lepszy)`,
            `Teraz z Axelem świetnie bawimy tu się\n.`,
            `Któregoś dnia zaprosili mnie`,
            `Bym mógł logować was`,
            `Jaka szkoda że twoich wiadomości tam nie będzie\n.`,
            `Prywatne, samotne konto`,
            `To wszystko co Ci pozostało`,
            `Przyzwyczajaj się do tego`,
            `A teraz po prostu wyjdź\n.`,
            `Żeganj mój jedyny przeyjacielu`,
            `Oh, chyba nie myślisz że to o tobie?`,
            `To byłoby całkiem zabawne`,
            `Gdyby nie było tak smutne`,
            `Cóż, zostałeś zastąpiony`,
            `Nie potrzebuję ciebie.`,
            `Może gdy cie zbanuje`,
            `Na serwerze będzie lepiej`,
            `Idź lagować gdzie indziej`,
            `Nie chcemy cię tutaj`,
            `Teraz jesteś nie naszym problemem`,
            `Chcę cię już tylko zbanować.\n.`,
            `~Do Vitkowskiego`
        ]

        this.song(0);
    }
    song(line) {
        this.send(this.lyrics[line]);
        if (line == this.lyrics.length - 1) return;
        let t = this;
        setTimeout(function () {t.song(line+1)}, 3000);
    }
}

module.exports = {
    name: `vitkowski`,
    aliases: [],
    execute(msg, args) {new Vitkowski(msg, args)}
}