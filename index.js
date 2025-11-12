// Part 1: The Web Server (to keep it awake)
const http = require('http' );
http.createServer(function (req, res ) {
  // --- NEW LOG ---
  // This will print a message every time UptimeRobot pings the server.
  console.log(`[INFO] Received a ping from UptimeRobot at ${new Date().toLocaleTimeString()}. Staying awake!`);
  
  res.write("I'm alive!");
  res.end();
}).listen(8080);

// Part 2: The Minecraft JAVA Bot
const mineflayer = require('mineflayer');

// This function wraps the bot creation so we can call it again to reconnect
function createBot() {
  // --- NEW LOG ---
  // This clearly shows when a new connection attempt begins.
  console.log(`[CONNECTING] Attempting to connect to the server... (Version: 1.21.10)`);

  const bot = mineflayer.createBot({
    host: 'MentallyStable2SMP.play.hosting.play.hosting',
    username: 'AFK_Bot_247',
    auth: 'offline',
    version: '1.21.10'
  });

  bot.on('login', () => {
    // --- NEW LOG ---
    // A clear success message.
    console.log(`[SUCCESS] Bot has logged in to the Java server!`);
    
    setInterval(() => {
      bot.setControlState('jump', true);
      bot.setControlState('jump', false);
    }, 30000);
  });

  bot.on('kicked', (reason) => {
    // --- IMPROVED LOG ---
    // This cleans up the kick reason to make it more readable.
    console.error(`[KICKED] Bot was kicked from the server.`);
    console.error(`> Reason: ${reason}`); // The 'reason' is printed on its own line for clarity.
    console.log('[RECONNECTING] Will try to reconnect in 1 minute...');
    setTimeout(createBot, 60000);
  });

  bot.on('error', (err) => {
    // --- IMPROVED LOG ---
    // This ensures the full error message is always visible.
    console.error(`[ERROR] A connection error occurred.`);
    console.error(`> Details: ${err.message}`); // The error message is printed clearly.
    console.log('[RECONNECTING] Will try to reconnect in 1 minute...');
    setTimeout(createBot, 60000);
  });

  bot.on('end', (reason) => {
    // --- NEW LOG ---
    // This tells us when the bot disconnects for any reason.
    console.log(`[DISCONNECTED] Bot has disconnected. Reason: ${reason}`);
    console.log('[RECONNECTING] Will try to reconnect in 1 minute...');
    setTimeout(createBot, 60000);
  });
}

// Start the bot for the first time
createBot();
