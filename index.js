require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const Parser = require("rss-parser");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const parser = new Parser();

const {
  DISCORD_TOKEN,
  CHANNEL_ID,
  INSTAGRAM_USER
} = process.env;

let lastPost = null;

client.once("ready", () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
  setInterval(checkInstagram, 60000);
});

async function checkInstagram() {
  try {
    const feed = await parser.parseURL(
      `https://rsshub.app/instagram/user/${INSTAGRAM_USER}`
    );

    if (!feed.items || feed.items.length === 0) return;

    const post = feed.items[0];
    if (post.link === lastPost) return;

    lastPost = post.link;

    const channel = await client.channels.fetch(CHANNEL_ID);

    const embed = new EmbedBuilder()
      .setTitle("📸 Novo post no Instagram")
      .setDescription(`[Ver post](${post.link})`)
      .setColor(0xE1306C)
      .setTimestamp();

    channel.send({ embeds: [embed] });

  } catch (err) {
    console.log("Erro:", err.message);
  }
}

client.login(DISCORD_TOKEN);

