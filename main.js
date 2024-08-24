const mineflayer = require('mineflayer');
const Discord = require('discord.js')
const fs = require('fs');
const ini = require('ini');
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
// Read and parse the INI file
const config = ini.parse(fs.readFileSync('./setup.ini', 'utf-8'));

console.log(`CraftCMD by NaturalTwitch`)

if (config.Advanced.discordBridge && config.Advanced.discord_token) {
    const client = new Discord.Client(
        {
            shards: 'auto',
            intents: [
                Discord.IntentsBitField.Flags.Guilds,
                Discord.IntentsBitField.Flags.GuildMessages,
                Discord.IntentsBitField.Flags.GuildMembers,
                Discord.IntentsBitField.Flags.DirectMessageReactions,
                Discord.IntentsBitField.Flags.DirectMessages,
                Discord.IntentsBitField.Flags.MessageContent,
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMembers,
                Discord.GatewayIntentBits.GuildVoiceStates
            ],
            partials: ["MESSAGE", "CHANNEL", "REACTION", "CHANNEL", "USER", "MEMBER"]
        }
    );


    const bot = mineflayer.createBot({
        host: config.General.serverIP,
        port: parseInt(config.General.serverPort),
        version: config.General.serverVersion,
        username: config.General.email,
        password: config.General.password,
        auth: 'microsoft'
    });


    bot.on('login', async () => {
        const channel = client.channels.cache.find((x) => (x.id === config.Advanced.channelID))
        console.log(`Signed in as ${bot.username}`);
        await process.stdout.write(`\x1B]0;${bot.username}@${config.General.serverIP}\x07`);
        console.log(`Discord Bridge Enabled: Signed into ${client.user.username}`)

        const discordOnline = new Discord.EmbedBuilder()
            .setColor(`00FF00`)
            .setTitle(`CraftCMD by NaturalTwitch`)
            .setDescription(`**${bot.username}** is Now Online! \n Server IP: ${config.General.serverIP}`)

        
        if (channel) {
            channel.send({embeds: [discordOnline]})
        }
    });

    bot.on('chat', (username, message, translate, jsonMsg, Matches) => {

    });

    client.on('messageCreate', (message) => {
        if(message.author.bot) return;
        bot.chat(`[${message.author.username}] ${message}`)
    })

    bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {
        const channel = client.channels.cache.find((x) => (x.id === config.Advanced.channelID))
        if (channel) {
            channel.send(message)
        }
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

    client.login(config.Advanced.discord_token);

} else {

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

}
