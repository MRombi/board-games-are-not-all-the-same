const { selectCommentByReviewId } = require("../models/comments.m");

exports.getCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
