const http = require("http");
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const port = 3000;


app
  .use(cors({ origin: true, credentials: true }))
  .use(express.json())
  .use(cookieParser());

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
res.set({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Date: Date.now()
});
res.sendFile(path.join(__dirname, "build", "index.html"));
});

http.createServer(app).listen(port, () => {
  console.log(`app listening at ${port}`);
});
