const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ key: process.env.BING_MAPS_KEY });
});

module.exports = router;