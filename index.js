// Part 1: The Web Server (to keep it awake)
const http = require('http' );
http.createServer(function (req, res ) {
  res.write("I'm alive!");
  res.end();
}).listen(8080);

// Part 2: The Minecraft JAVA Bot
const mineflayer = require('mineflayer');

// This function wraps the bot creation so we can call it again to reconnect
function createBot() {
  console.log('Attempting to connect to the JAVA server...');

  const bot = mineflayer.createBot({
    host: 'MentallyStable2SMP.play.hosting.play.hosting', // Server address
    username: 'AFK_Bot_247', // Bot's name
    auth: 'offline',   // Assumes the server is offline-mode
    version: '1.21.10' // The correct Java Edition version!
  });

  bot.on('login', () => {
    console.log('Bot has logged in to the Java server.');
    // This makes the bot jump every 30 seconds to avoid being kicked for AFK
    setInterval(() => {
      bot.setControlState('jump', true);
      bot.setControlState('jump', false);
    }, 30000);
  });

  bot.on('kicked', (reason) => {
    console.log('Bot was kicked for:', reason);
    console.log('Will try to reconnect in 1 minute...');
    setTimeout(createBot, 60000);
  });

  bot.on('error', (err) => {
    console.log('An error occurred:', err.message);
    console.log('Will try to reconnect in 1 minute...');
    setTimeout(createBot, 60000);
  });

  bot.on('end', (reason) => {
    console.log('Bot has disconnected.', reason);
    console.log('Will try to reconnect in 1 minute...');
    setTimeout(createBot, 60000);
  });
}

// Start the bot for the first time
createBot();
