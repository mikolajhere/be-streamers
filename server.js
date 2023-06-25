const express = require("express");
const bodyParser = require("body-parser");
const streamerRouter = require("./routers/streamers");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.use(bodyParser.json());

// endpoints
app.use("/streamers", streamerRouter);

const port = 3000;
app.listen(3000, () => {
  console.log(`Server is listening on port ${port}`);
});
