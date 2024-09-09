# Creating a Command for the Bot

This bot uses the Mineflayer package. For detailed documentation, refer to the [Mineflayer API](https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md).

When adding a new command, it will automatically be registered as a `/command`. Ensure the command name doesn’t conflict with existing server commands. You can organize commands into subfolders within the `/consoleCommands` directory, and they will still be recognized by the bot. Commands will use the filename as their command name: for example, `sneak.js` will be accessible as `/sneak`, and `goto.js` as `/goto`.

## Creating a Command

1. **File Structure**: Create a JavaScript file in the `/consoleCommands` directory or its subdirectories. The filename will determine the command name.

2. **Command Template**:
   Start your command file with the following structure:

   ```js
   module.exports = (bot, args) => {
       // Your command logic here
   }
   ```

   - `bot`: The Mineflayer bot instance.
   - `args`: An array of arguments passed to the command.

3. **Example**:
   For a command named `/sneak`, create a file named `sneak.js` with the following content:

   ```js
   module.exports = (bot, args) => {
       // Example: Make the bot start sneaking
       bot.setControlState('sneak', true);
   }
   ```

   This will enable the bot to sneak when the `/sneak` command is invoked.
