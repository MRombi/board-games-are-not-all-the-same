const {
  selectCommentByReviewId,
  insertCommentByReviewId,
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
      comments = results[1];
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
    checkUsernameById(review_id, username),
    insertCommentByReviewId(review_id, req.body),
  ]);
  allPromises
    .then((results) => {
      comment = results[2];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
