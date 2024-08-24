const mineflayer = require('mineflayer');
const fs = require('fs');
const ini = require('ini');
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout})
// Read and parse the INI file
const config = ini.parse(fs.readFileSync('./setup.ini', 'utf-8'));

const bot = mineflayer.createBot({
    host: config.General.serverIP,
    port: parseInt(config.General.serverPort),
    version: config.General.serverVersion,
    username: config.General.email,
    password: config.General.password,
    auth: 'microsoft'
});

bot.on('login', async () => {
    console.log(`Signed in as ${bot.username}`);
    await process.stdout.write(`\x1B]0;${bot.username}@${config.General.serverIP}\x07`);
});

bot.on('chat', (username, message, translate, jsonMsg, Matches) => {
    
});

bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {
    const tpRequest = /^(.*) has requested to teleport to you\.|^(.*) has requested that you teleport to them\.$/;
    const match = message.match(tpRequest);

    if (match) {
        const senderName = match[1] || match[2];

        if (config.Advanced.botOwners.includes(senderName)) {
            console.log(`Yes sir, teleport request from ${senderName} accepted.`);
            bot.chat(`/tpaccept ${senderName}`);
        } else {
            bot.chat(`/tpdeny`);
            console.log(`Teleport request from ${senderName} denied, not a bot owner.`);
        }
    }

    console.log(message);

    // console.log(`${message}, ${messagePosition}, ${jsonMsg}, ${sender}, ${verified}`);
});

rl.on('line', async (msg) => {
    bot.chat(msg)
})
