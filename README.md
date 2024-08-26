
# CraftCMD

CraftCMD is a Minecraft bot powered by [mineflayer](https://github.com/PrismarineJS/mineflayer) with an optional Discord bridge, allowing you to control and monitor your Minecraft server through Discord. This bot is configurable via a `setup.ini` file and includes features like Auto-AFK, Auto-Attack, and automatic reconnection on disconnect.

## Features

- **Discord Bridge:** Send and receive Minecraft chat messages via Discord.
- **Auto-AFK:** Automatically send commands to prevent being kicked for inactivity.
- **Auto-Attack:** Automatically attack hostile mobs near the bot.
- **Automatic Reconnect:** Reconnect the bot automatically after being kicked.

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/NaturalTwitch/CraftCMD.git
    cd CraftCMD
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configuration:**
    - A default `setup.ini` configuration file will be created on the first run.
    - Edit `setup.ini` to add your Minecraft and Discord credentials and configure the bot settings.

## Configuration

The `setup.ini` file is divided into several sections:

```ini
# General Settings
[General]
email=example@mursybot.com        # Email for Minecraft login
password=123456789                # Password for Minecraft login
serverIP=play.mursybot.com        # Minecraft server IP
serverPort=25565                  # Minecraft server port (default: 25565)
serverVersion=1.20.4              # Minecraft server version


# Advanced Settings
[Advanced]
discordBridge=false                # Enable or disable Discord bridge
discord_token=                     # Discord bot token
channelID=1228268474590167042      # Discord channel ID for communication
approvedDiscordUsers=["513413045251342336"]  # Approved Discord users for command sending
botOwners=["NaturalTwitch"]        # Bot owners for auto teleport accept


# AutoLog Settings
[AutoLog]
enable=true
rejoinTime=5000                    # Rejoin time in milliseconds


# AntiAFK Settings
[AntiAFK]
antiAfk=false                      # Enable or disable Anti-AFK
afkTime=60000                      # AFK command interval in milliseconds
afkCommand=/home                   # AFK command to be sent


# AutoAttack Settings
[AutoAttack]
enable=false                       # Enable or disable Auto-Attack
armSwing=true                      # Toggle arm swing during the attack
```

## Usage

1. **Start the bot:**
    ```bash
    node index.js
    ```
    The bot will automatically create a `setup.ini` file if it doesn't exist. Update the file with your credentials and settings, then restart the bot.

2. **Using the Discord Bridge:**
    - The bot will send and receive messages between the specified Discord channel and the Minecraft server.
    - Teleport requests can be managed via Discord, and commands can be sent from approved users.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements. Please follow the coding guidelines and ensure tests are passed before submitting changes.

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please open an issue on the GitHub repository or contact me at dev@mursybot.com or naturaltwitch on Discord.
