const sd = require(`../my_modules/simpleDiscord.js`);

let helpStr = `
<foo> - user input
[a|b] - a or b
{} - optional
\`\`\`ban <user>
kick <user>
joinMessage ["<message>"|test]
leaveMessage ["<message>"|test]
color [help|<color>|list|initialize|destruction]
[poll|vote|survey] {stop}
purge <number of messages>
role help
role info <role>
role [add|remove] <user> <role>
role default [add|remove|list] <role>
userInfo {user}
avatar {user}
serverInfo
inbaInfo
ping\`\`\`
`;

module.exports = {
    name: 'help',
    description: 'Commands help',
    execute(message, args) {
        message.author.send(helpStr);
        message.react(`👌`);
    },
};
