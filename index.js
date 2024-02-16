const { Client, LocalAuth } = require("whatsapp-web.js");

const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");

require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const PORT = process.env.PORT;
app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  console.log("Received webhook:", req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth({
    dataPath: "src/",
  }),
});

const qrcode = require("qrcode-terminal");
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("remote_session_saved", () => {
  console.log("foi");
});

client.on("ready", async () => {
  console.log("Client is ready!");
  let number = "+55 55 9696-1004";
  let final_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
  let chatId = final_number.substring(1) + "@c.us";
  console.log(chatId);
  let number_details = await client.getNumberId(chatId);
  console.log(number_details);

  if (number_details) {
    let sendMessageData = await client.sendMessage(
      chatId,
      "isso aqui e uma mensagem automatizada pelo gigante cristiano ronaldo"
    ); // send message
    console.log(sendMessageData);
  } else {
    console.log(final_number, "Mobile number is not registered");
  }
});
client.initialize();

client.on("message", async (message) => {
  if (message.body === "cristiano ronaldo") {
    await message.reply("eita");
  }
});
