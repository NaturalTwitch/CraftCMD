const mineflayer = require('mineflayer');

const Discord = require('discord.js');
const fs = require('fs');
const ini = require('ini');
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const { spawn } = require('child_process');
const { createCanvas } = require('canvas');
const https = require('https');
const packageVersion = "2.2.0"; // Local version

const path = './setup.ini';

// Default configuration with comments
const defaultConfigContent = `
# General Settings
[General]
email=example@mursybot.com        # Email to use for logging in
password=123456789       # Password to your microsoft account
serverIP=play.mursybot.com  # Server IP for the Minecraft server you are joining
serverPort=25565  # Minecraft server port !! Default port is 25565 !!
serverVersion=1.20.4 # Minecraft server Version (highest 1.20.4) is if the server version is unknown

# Advanced Settings
[Advanced]
discordBridge=false
discord_token=  # Discord App Token
channelID=1228268474590167042      # Channel you want the messages sent to
approvedDiscordUsers=["513413045251342336"]    # Set the User ID of the approved chat users
botOwners=["NaturalTwitch"] # Bot Owner for auto Teleport Accept

# Auto Log
[AutoLog]
enable=true
rejoinTime=5000 # In milliseconds

# AntiAFK Settings
[AntiAFK]
antiAfk=false
afkTime=60000 # In milliseconds
afkCommand=/home

# AutoAttack Settings
[AutoAttack]
enable=false  # Enables Auto Attack of Hostile Mobs
armSwing=true  # Toggle Arm Swing when attacking !! Default is true !!

# Auto Welcomes Players (Do Not Enable if the server puts you in vanish for teleporting)
[AutoWelcome]
enable=true
`;

// Function to check and create setup.ini file
function ensureConfigFile() {
    if (!fs.existsSync(path)) {
        console.log('Configuration file not found. Creating setup.ini, Please change your log in settings.');
        fs.writeFileSync(path, defaultConfigContent.trim());
        console.log('Default configuration written to setup.ini');
        process.exit()
    }
}

// Call the function at the start of your script
ensureConfigFile();

// Read the configuration file
const config = ini.parse(fs.readFileSync(path, 'utf-8'));

//Starting Logo
console.log(`********************************`)
console.log(`*          CraftCMD            *`)
console.log(`*      By NaturalTwitch        *`)
console.log(`********************************`)
process.stdout.write(`\x1B]0;CraftCMD - NaturalTwitch\x07`);
checkForUpdates();
setInterval(() => {
    checkForUpdates();
}, 86400000)



// Discord Bridge
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
        console.log(`Discord Bridge Enabled: Signed into ${client.user.username}`)

        const discordOnline = new Discord.EmbedBuilder()
            .setColor(`00FF00`)
            .setTitle(`CraftCMD - NaturalTwitch`)
            .setThumbnail(`https://cdn.mursybot.com/sharing/CraftCMD.png`)
            .setDescription(`**${bot.username}** is Now Online! \n Server IP: ${config.General.serverIP}`)


        if (channel) {
            channel.send({ embeds: [discordOnline] })
        }

    });

    bot.on('chat', (username, message, translate, jsonMsg, Matches) => {

    });

    client.on('error', (e) => {
        console.log(e)
        return;
    })

    //Discord Bridge chat sender
    client.on('messageCreate', (message) => {
        const channel = config.Advanced.channelID
        const approved = config.Advanced.approvedDiscordUsers; // Array of Discord User IDs

        if (!approved.includes(message.author.id)) {
            return
        }
        if (message.channel.id !== channel) return;
        if (message.author.bot) return; // Return if the author is a bot and not a approved discord user or sent in the channel
        bot.chat(`${message}`)
    })

    // Message Handler to Discord and Console
    bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {
        const channel = client.channels.cache.find((x) => (x.id === config.Advanced.channelID))


        if (message.includes(`Next Shard`)) return;
        // if (message.includes("WANT A FREE RANK?")) return;

        // Prevented Empty Message From Sending 2024-08-29 (NT)
        if (!message || message.trim() === "") {
            return;
        }

        try {
            if (channel) {
                channel.send(message)
            }
        } catch (e) {
            console.log(e)
            return;
        }
        const tpRequest = /^(.*) has requested to teleport to you\.|^(.*) has requested that you teleport to them\.$/;
        const match = message.match(tpRequest);


        if (match) {
            const senderName = match[1] || match[2];

            const tpEmbed = new Discord.EmbedBuilder()
                .setColor(`00FF00`)
                .setTitle(`Teleport Request`)
                .setDescription(`${match[0]}`)

            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('accept')
                        .setLabel(`Accept`)
                        .setStyle(1),
                    new Discord.ButtonBuilder()
                        .setCustomId(`deny`)
                        .setLabel(`Deny`)
                        .setStyle(4)
                )

            channel.send({ embeds: [tpEmbed], components: [row] })

            if (config.Advanced.botOwners.includes(senderName)) {
                console.log(`Yes sir, teleport request from ${senderName} accepted.`);
                bot.chat(`/tpaccept ${senderName}`);
            } else {
                console.log(`Teleport Request from ${senderName}`);
            }
        }

        console.log(message);

        // console.log(`${message}, ${messagePosition}, ${jsonMsg}, ${sender}, ${verified}`);
    });


    setTimeout(() => {
        bot.on('playerJoined', (player) => {
            if (config.AutoWelcome.enable) {

                bot.chat(`Welcome ${player.username}!`)

            }
        })
    }, 10000)



    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;

        const { customId } = interaction;

        if (customId === 'accept') {
            console.log(`[Discord Bridge] sending command /tpaccept`)
            bot.chat(`/tpaccept`)
        } else if (customId === 'deny') {
            console.log(`[Discord Bridge] sending command /tpdeny`)
            bot.chat(`/tpdeny`)
        }
    })

    if (config.AutoAttack.enable) {
        setInterval(() => {
            const hostileMobs = Object.values(bot.entities).filter(entity => entity.kind === 'Hostile mobs');

            if (hostileMobs.length > 0) {
                // Find the closest hostile mob
                const closestMob = hostileMobs.reduce((closest, mob) => {
                    const distance = bot.entity.position.distanceTo(mob.position);
                    if (!closest || distance < closest.distance) {
                        return { mob, distance };
                    }
                    return closest;
                }, null).mob;

                // Attack the closest hostile mob
                bot.attack(closestMob, config.AutoAttack.armSwing);
            }
        }, 1000);
    }

    if (config.AntiAFK.antiAfk) {
        setInterval(() => {
            console.log(`[AntiAFK] Ran Command ${config.AntiAFK.afkCommand}`);
            bot.chat(config.AntiAFK.afkCommand);
        }, config.AntiAFK.afkTime);
    }

    bot.on('kicked', (r) => {
        console.log(`You were kicked for ${r}`)
        setTimeout(() => {
            if (config.AutoLog.enable) {
                restartProgram()
            } else {
                process.exit()
            }
        }, config.Advanced.rejoinTime)
    });

    bot.on('error', (e) => {
        console.log(`Disconnected by error: ${e}`)
        setTimeout(() => {
            if (config.AutoLog.enable) {
                restartProgram()
            } else {
                process.exit()
            }
        }, config.Advanced.rejoinTime)
    })

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
    });

    bot.on('chat', (username, message, translate, jsonMsg, Matches) => {

    });

    bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {
        const tpRequest = /^(.*) has requested to teleport to you\.|^(.*) has requested that you teleport to them\.$/;

        if (message.includes(`Next Shard`)) return;

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

    setTimeout(() => {
        bot.on('playerJoined', (player) => {
            if (config.AutoWelcome.enable) {

                bot.chat(`Welcome ${player.username}!`)

            }
        })
    }, 10000)

    bot.on('kicked', (r) => {
        console.log(`You were kicked for ${r}`)
        setTimeout(() => {
            if (config.AutoLog.enable) {
                restartProgram()
            } else {
                process.exit()
            }
        }, config.Advanced.rejoinTime)
    });

    bot.on('error', (e) => {
        console.log(`Disconnected by error: ${e}`)
        setTimeout(() => {
            if (config.AutoLog.enable) {
                restartProgram()
            } else {
                process.exit()
            }
        }, config.Advanced.rejoinTime)
    })

    rl.on('line', async (msg) => {
        bot.chat(msg)
    })


    if (config.AutoAttack.enable) {
        setInterval(() => {
            const hostileMobs = Object.values(bot.entities).filter(entity => entity.kind === 'Hostile mobs');

            if (hostileMobs.length > 0) {
                // Find the closest hostile mob
                const closestMob = hostileMobs.reduce((closest, mob) => {
                    const distance = bot.entity.position.distanceTo(mob.position);
                    if (!closest || distance < closest.distance) {
                        return { mob, distance };
                    }
                    return closest;
                }, null).mob;

                // Attack the closest hostile mob
                bot.attack(closestMob);
            }
        }, 1000);
    }

    if (config.AntiAFK.antiAfk) {
        setInterval(() => {
            bot.chat(config.AntiAFK.afkCommand)
        }, config.AntiAFK.afkTime)
    }

}


function restartProgram() {
    // Spawn a new process with the same script
    spawn(process.argv[0], process.argv.slice(1), {
        cwd: process.cwd(),
        detached: false,
        stdio: 'inherit'
    }).unref();

}

async function checkForUpdates() {
    const options = {
        hostname: 'raw.githubusercontent.com',
        path: '/NaturalTwitch/CraftCMD/main/version.json',
        method: 'GET',
        headers: {
            'User-Agent': 'node.js'
        }
    };

    await https.get(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const remoteVersion = JSON.parse(data).version;
                if (remoteVersion !== packageVersion) {
                    console.log("\x1b[33m%s\x1b[0m", `[Update Available] A new version (${remoteVersion}) is available. \nCurrent version is (${packageVersion}). \nPlease update your bot.`);
                } else {
                    console.log("\x1b[32m%s\x1b[0m", `[CraftCMD] Your version (${packageVersion}) is up to date.`);
                }
            } catch (e) {
                console.error('Error parsing version data from GitHub:', e);
            }
        });
    }).on('error', (e) => {
        console.error('Error checking for updates:', e);
    });
}

