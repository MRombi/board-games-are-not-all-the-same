const express = require("express");
const { getCategories } = require("./controllers/categories.c");
const { getReviewById, patchReviewById, getReviews } = require("./controllers/reviews.c");
const { getUsers } = require("./controllers/users.c");
const { getCommentByReviewId, postCommentByReviewId } = require("./controllers/comments.c");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/users", getUsers)

app.get("/api/reviews/:review_id/comments", getCommentByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Something went wrong, sorry :(" });
});

module.exports = app;