var express = require("express");
var router = express.Router();

// In-memory mock data store
let nextId = 21;
const todos = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  title: `Todo ${i + 1}`,
  completed: i % 3 === 0 ? false : i % 2 === 0, // a bit of variety
}));

/**
 * GET /todos
 * Query params: pageNum (1-based), pageSize
 * Returns: { list, total, pageNum, pageSize }
 */
router.get("/", function (req, res) {
  const total = todos.length;
  const pageNum = Math.max(parseInt(req.query.pageNum, 10) || 1, 1);
  const pageSize = Math.max(parseInt(req.query.pageSize, 10) || 10, 1);

  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const list = todos.slice(start, end);

  res.json({ code: 0, list, total, pageNum, pageSize });
  // res.json({ code: -1, message: "An error occurred while fetching todos." });
});

/**
 * POST /todos
 * Body: { title: string, completed?: boolean }
 * Returns: created todo item
 */
router.post("/", function (req, res) {
  const { title, completed } = req.body || {};
  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "Invalid title" });
  }

  const item = {
    id: nextId++,
    title: title.trim(),
    completed: typeof completed === "boolean" ? completed : false,
  };

  todos.unshift(item);

  // setTimeout(() => {
  //   res.status(200).json({
  //     code: 0,
  //     ...item,
  //   });
  // }, 3000);

  // setTimeout(() => {
  //   res.status(500).json({ message: "Failed to create todo item." });
  // }, 3000);

  res.status(200).json({
    code: 0,
    ...item,
  });
});

module.exports = router;
