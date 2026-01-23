const {userthread}=require("../models/userthread");
//Gemini responses
const { generateEnglish } = require("./ai");
//Lingo.dev as translator
const { translate, translateToEnglish, normalizeLang, detectLanguage } = require("./translator");
//discord js
const {Client,GatewayIntentBits,ChannelType, PermissionFlagsBits } = require('discord.js');
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
  .then(() => console.log("✅ Discord bot logged in successfully to handle crud operations"))
  .catch((err) => console.error("❌ Discord bot login failed:", err));
//Thread deletion from discord by client
async function deleteThread(thread){
  try {
    const deleted = await userthread.findOneAndDelete({ threadId: thread.id });
    if (deleted) {
      console.log(`🗑️ Deleted thread from DB for user ${deleted.username} (${deleted.userId})`);
    } else {
      console.log(`🗑️ Thread ${thread.id} deleted, but no DB record found.`);
    }
  } catch (err) {
    console.error("Failed to clean up thread from DB:", err);
  }
}

async function createMessage(message){
  if(message.author.bot || !message.guild)  return;  // reply khud ko hi reply deta rahega
  const user = message.author; 
  const content = message.content.trim();
  let thread;//4
  let record = await userthread.findOne({ userId: user.id });
if (record) {
  try {
    thread = await message.guild.channels.fetch(record.threadId);
    // If user is already chatting inside their thread, skip the redirection message
    if (message.channel.id === record.threadId) {
      // Ignore messages that start with '@' inside private thread
      if (content.startsWith("@")) {
        return; // do not respond
      }
      // let it continue to AI / create
    } else if (thread && !thread.archived) {
      if (content === "ready") {
        return message.reply(`👤 ${user.username}, your private thread is already created.`);
      } else {
        return ;
      }
    } else {
      thread = null; // Archived or missing
    }
  } catch (e) {
    thread = null;
  }
}
  
  // Create thread if not found or archived
  if (!thread && content ==="ready") {
    try {
      // Fetch the hidden parent channel
  const parentChannel = await client.channels.fetch(process.env.PARENT_CHANNEL_ID);
  if (!parentChannel) {
    console.log("❌ Parent channel not found.");
    return message.reply("⚠️ Unable to find the parent channel. Please check `PARENT_CHANNEL_ID`.");
  }
  console.log("✅ Parent channel found:", parentChannel.name);

  if (!parentChannel || !parentChannel.isTextBased()) {
  console.error("❌ Parent channel not found or not text-based");
  return;
}
console.log(parentChannel.permissionsFor(client.user).toArray());
console.log(`Channel type: ${parentChannel.type}`);

thread = await parentChannel.threads.create({
  name: `${user.username}-chat`,
  autoArchiveDuration: 60,
  type: ChannelType.PrivateThread,
  reason: 'Private user thread'
});

await thread.members.add(user.id);
// await thread.setLocked(true);     
await thread.setInvitable(false); 
  const defaultLang = normalizeLang(message.guild?.preferredLocale || 'en');
  record = await userthread.findOneAndUpdate(
        { userId: user.id },
        {
          userId: user.id,
          username: user.username,
          threadId: thread.id,
          guildId: message.guild.id,
          language: defaultLang,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
      await message.reply(`📬 ${user.username} Your private thread is ready`);
      await thread.send(`👋 Hello ${user.username}, welcome to your private thread! Current language: ${record.language || defaultLang}. Use \`lang <code>\` to change (e.g., \`lang hi\`, \`lang es\`).`);
          return;
    } catch (err) {
      console.error("Thread creation failed:", err);
      return message.reply(" Unable to create thread.");
    }
  }
  // Handle language commands inside the thread
  if (thread && (/^lang(\s|$)/i.test(content) || /^setlang(\s|$)/i.test(content))) {
    const parts = content.split(/\s+/);
    if (parts.length === 1) {
      return thread.send(`🌐 Current language: ${record?.language || 'en'}\nChange with: lang <code>  (e.g., lang hi, lang es, lang fr)`);
    }
    if (parts[1].toLowerCase() === 'list') {
      return thread.send("Common codes: en, hi, es, fr, de, ja, ko, zh, ar, ru, pt");
    }
    const newLang = normalizeLang(parts[1]);
    record = await userthread.findOneAndUpdate(
      { userId: user.id },
      { language: newLang, lastUpdated: new Date() },
      { new: true }
    );
    return thread.send(`✅ Language set to: ${newLang}`);
  }

   if(thread){
    try{
    // 0) Normalize input: translate any user input to English first
    const englishInput = await translateToEnglish(content);
    // 1) Generate English via Gemini based on normalized input
    const english = await generateEnglish(englishInput);
    // 2) Determine target language preference
    const targetLang = record?.language || normalizeLang(message.guild?.preferredLocale || 'en');
    // 3) Translate via Lingo.dev if needed
    const finalText = await translate(english, targetLang);
     return thread.send(finalText);
    } catch(err){
      console.error("Gemini response error:", err);
      return thread.send("⚠️ Bot failed to respond due to api overloading.");
    }
  }
}

module.exports={deleteThread,createMessage}