import express from "express";
const app = express();
import * as fs from "fs";

// to read env variables in .env
import "dotenv/config";

// to control gift queries
import { Gift } from "./gift.js";

// use ejs template engine
app.set("view engine", "ejs");
app.use(express.static("static"));
app.use(express.static("static/images"));
app.use(express.json());

const allItems = JSON.parse(fs.readFileSync("all-items.json", "utf8"));

// Home page
app.get("/", async (req, res) => {
  res.render("index");
});

// Workshop page
app.get("/workshop", async (req, res) => {
  // all items are stored in JSON file
  res.render("workshop", { allItems: allItems });
});

// Garden page
app.get("/garden", async (req, res) => {
  // get all gifts
  const gifts = await Gift.getGifts();

  // randomize gift order
  let curr = gifts.length;
  let rand = 0;
  while (curr != 0) {
    rand = Math.floor(Math.random() * curr);
    curr--;
    [gifts[curr], gifts[rand]] = [gifts[rand], gifts[curr]];
  }

  res.render("garden", { gifts: gifts });
});

// Final page
app.get("/action", async (req, res) => {
  res.render("action", { allItems: allItems });
});

// About page
app.get("/about", async (req, res) => {
  res.render("about");
});

// Design Workshop page
app.get("/design", async (req, res) => {
  res.render("design");
});

// Adds gift to DB
app.post("/add-gift", async (req, res) => {
  const { name, gift } = req.body;
  const giftObj = new Gift(gift, name);
  const isSuccess = await giftObj.addGift();
  if (isSuccess) {
    res.status(200);
  } else {
    res.status(500);
  }
  return res.end();
});

// Listens for client requests
app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
