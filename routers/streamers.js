const express = require("express");
const router = express.Router();
const pool = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

// POST /streamers - Create a new streamer
router.post("/", async (req, res) => {
  const { name, description, platform } = req.body;

  try {
    const connection = await pool.getConnection();
    let query = "SELECT id FROM streamers WHERE name = ?";
    let values = [name];

    const [results] = await connection.query(query, values);

    if (results.length > 0) {
      connection.release();
      return res
        .status(409)
        .json({ error: "Streamer with the same name already exists" });
    }

    const id = uuidv4();

    query =
      "INSERT INTO streamers (id, name, description, platform) VALUES (?, ?, ?, ?)";
    values = [id, name, description, platform];

    await connection.query(query, values);
    connection.release();

    res.status(201).json({ message: "Streamer submitted successfully", id });
  } catch (error) {
    console.error("Failed to insert streamer:", error);
    res.status(500).json({ message: "Failed to submit streamer" });
  }
});

// GET /streamers
router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM streamers";

    const [results] = await connection.query(query);
    connection.release();

    res.json({ streamers: results });
  } catch (error) {
    console.error("Failed to retrieve streamers:", error);
    res.status(500).json({ message: "Failed to retrieve streamers" });
  }
});

// GET /streamer/[streamerId]
router.get("/:streamerId", async (req, res) => {
  const streamerId = req.params.streamerId;

  try {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM streamers WHERE id = ?";
    const values = [streamerId];

    const [results] = await connection.query(query, values);
    connection.release();

    if (results.length === 0) {
      res.status(404).json({ message: "Streamer not found" });
    } else {
      res.json({ streamer: results[0] });
    }
  } catch (error) {
    console.error("Failed to retrieve streamer:", error);
    res.status(500).json({ message: "Failed to retrieve streamer" });
  }
});
// PUT /streamers/[streamerId]/vote
router.put("/:streamerId/vote", async (req, res) => {
  const streamerId = req.params.streamerId;
  const voteType = req.body.voteType;

  try {
    const connection = await pool.getConnection();
    let upvotesIncrement = 0;
    let downvotesIncrement = 0;

    if (voteType === "upvote") {
      upvotesIncrement = 1;
    } else if (voteType === "downvote") {
      downvotesIncrement = 1;
    }

    const query =
      "UPDATE streamers SET upvotes = upvotes + ?, downvotes = downvotes + ? WHERE id = ?";
    const values = [upvotesIncrement, downvotesIncrement, streamerId];

    const [results] = await connection.query(query, values);
    connection.release();

    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Streamer not found" });
    } else {
      res.json({ message: "Vote updated successfully" });
    }
  } catch (error) {
    console.error("Failed to update vote:", error);
    res.status(500).json({ message: "Failed to update vote" });
  }
});

module.exports = router;
