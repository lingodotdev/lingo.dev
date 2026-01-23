const {deleteThread,createMessage}=require("../controller/discord");
const { Client, GatewayIntentBits} = require('discord.js');
//Client permisions allowed
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ]
});
//Discord BOT login
client.login(process.env.BOT_LOGIN)
  .then(() => console.log("✅ Discord bot logged in successfully for event handling"))
  .catch((err) => console.error("❌ Discord bot login failed:", err));
//client event handling
client.on("threadDelete",deleteThread );
client.on("messageCreate",createMessage);
module.exports=client;