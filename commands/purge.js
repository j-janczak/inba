const sd = require(`../my_modules/simpleDiscord.js`);
const permissions = require('./checkPermission.js');
const outputs = require(`../my_modules/inbaOutputs.js`);

module.exports = {
    name: 'purge',
    description: 'Deletes messages',
    execute(message, args) {
        if (permissions.execute(message, [false])) {
            if (args.length == 1) {
                sd.send(message, outputs.direct(`purge`, `not_enough_arguments`));
            } else if (args.length == 2) {
                if (args[1].match(/^[0-9]*$/g)) {
                    let msgToPurge = parseInt(args[1]);
                    if (msgToPurge >= 1 && msgToPurge <= 100) {
                        if (msgToPurge == 100) msgToPurge = 99;
                        message.channel.bulkDelete(msgToPurge + 1)
                        .then(_msg => {
                            sd.send(message, outputs.direct(`purge`, `success`, [msgToPurge]), m => {m.delete(3000);});
                        }).catch((error) => {
                            console.error(error);
                            if (error.code == 50034) sd.send(message, `Error: You can only pugre messages that are under 14 days old.`);
                        });
                    } else sd.send(message, outputs.direct(`purge`, `out_of_range`));
                } else sd.send(message, outputs.direct(`purge`, `not_a_number`));
            }
        } else sd.send(message, outputs.random(`unauthorized`));
    },
};
