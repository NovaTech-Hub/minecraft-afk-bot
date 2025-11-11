// Part 1: The Web Server (to keep it awake)
const http = require('http' );
http.createServer(function (req, res ) {
  res.write("I'm alive!"); // The message UptimeRobot will see
  res.end();
}).listen(8080);

// Part 2: The Minecraft Bot
const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'MentallyStable2SMP.play.hosting.play.hosting',
  username: 'AFK_Bot_247',
  auth: 'offline',
  version: '1.21.10' // <--- THE CORRECT VERSION!
});


  bot.on('login', () => {
    console.log('Bot has logged in.');
    // This makes the bot jump every 30 seconds to avoid being kicked for AFK
    setInterval(() => {
      bot.setControlState('jump', true);
      bot.setControlState('jump', false);
    }, 30000);
  });

  bot.on('kicked', (reason) => {
    console.log('Bot was kicked for:', reason);
    // Try to reconnect after 5 minutes
    setTimeout(createBot, 5 * 60 * 1000);
  });

  bot.on('error', (err) => {
    console.log('An error occurred:', err);
    // Try to reconnect after 5 minutes
    setTimeout(createBot, 5 * 60 * 1000);
  });

  bot.on('end', () => {
    console.log('Bot has disconnected.');
    // Try to reconnect after 5 minutes
    setTimeout(createBot, 5 * 60 * 1000);
  });
}

// Start the bot for the first time
createBot();
