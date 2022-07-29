const {
  selectCommentByReviewId,
  insertCommentByReviewId,
  removeCommentById,
  selectCommentById,
} = require("../models/comments.m");

const { selectReviewById } = require("../models/reviews.m");
const { checkUsernameById } = require("../../utils/checkUsername");

exports.getCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const allPromises = Promise.all([
    selectReviewById(review_id),
    selectCommentByReviewId(review_id),
  ]);
  allPromises
    .then((results) => {
      let comments = results[1];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { username } = req.body;
  const allPromises = Promise.all([
    selectReviewById(review_id),
    checkUsernameById( username),
    insertCommentByReviewId(review_id, req.body),
  ]);
  allPromises
    .then((results) => {
      let comment = results[2];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const allPromises = Promise.all([
    selectCommentById(comment_id),
    removeCommentById(comment_id),
  ]);
  allPromises
    .then((result) => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  selectCommentById(comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}
