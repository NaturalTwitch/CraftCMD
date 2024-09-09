module.exports = (bot, args) => {
    if (!bot.sneak) {
        bot.setControlState('sneak', true);
        console.log('Sneaking...');
        bot.sneak = true;
    } else {
        bot.setControlState('sneak', false);
        console.log('No Longer Sneaking...');
        bot.sneak = false;
    }
};
