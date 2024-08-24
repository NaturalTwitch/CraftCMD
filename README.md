# CraftCMD

A simple Minecraft bot using the Mineflayer library that connects to a Minecraft server, handles chat messages, and processes teleport requests from authorized users.

## Features

- Connects to a Minecraft server with provided credentials.
- Responds to teleport requests from specified bot owners.
- Handles user input from the command line to send chat messages in-game.
- Supports configuration via an INI file.

## Requirements

- Node.js (>= 14.x)
- `mineflayer` library
- `ini` library

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

## Usage

1. **Run the bot:**

   ```bash
   node .
   ```

2. **Interact with the bot:**

   - **Chat Commands:** Type messages in the command line to send them as chat messages in the Minecraft server.
   - **Teleport Requests:** The bot will automatically accept teleport requests from users listed in the `botOwners` array. All other requests will be denied.

## Configuration

- **`email`**: The email address used for logging into Minecraft.
- **`password`**: The password associated with the email account.
- **`serverIP`**: The IP address of the Minecraft server to connect to.
- **`serverPort`**: The port number of the Minecraft server (default is 25565).
- **`serverVersion`**: The version of the Minecraft server.
- **`discordBridge`**: A boolean value indicating if Discord integration is enabled (not implemented in this version).
- **`discord_token`**: The token for Discord integration (not used in this version).
- **`botOwners`**: An array of usernames who are allowed to request teleportation.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements. Please follow the coding guidelines and ensure tests are passing before submitting changes.

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please open an issue on the GitHub repository or contact me at dev@mursybot.com or naturaltwitch on discord.
