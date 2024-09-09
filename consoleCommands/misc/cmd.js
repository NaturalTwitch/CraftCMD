const fs = require('fs');
const path = require('path');
module.exports = (bot, args) => {
    
    const commandsDir = path.join(__dirname, '../');

    
    const getSortedCommands = () => {
        const categories = fs.readdirSync(commandsDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        let commands = [];

        categories.forEach(category => {
            const categoryPath = path.join(commandsDir, category);
            const files = fs.readdirSync(categoryPath)
                .filter(file => file.endsWith('.js'))
                .map(file => file.replace('.js', '')); 

            commands = commands.concat(files);
        });

       
        commands.sort();

        return commands;
    };

    
    const generateHelpMenu = () => {
        const commands = getSortedCommands();

        let helpMenu = 'CraftCMD Help Menu:\n';
        commands.forEach(command => {
            helpMenu += `- ${command}\n`;
        });

        return helpMenu;
    };

    
    console.log(generateHelpMenu());

};
