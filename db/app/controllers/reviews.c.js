const { selectReviewById, updateReviewById, selectReviews } = require("../models/reviews.m");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  updateReviewById(review_id, req.body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
}

exports.getReviews = (req, res, next) => {
  const query = req.query;
  const queryLength = Object.keys(query);
  if (queryLength.length > 0) {
    selectReviews(query)
      .then((reviews) => {
        res.status(200).send({ reviews });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    selectReviews().then((reviews) => {
      res.status(200).send({ reviews });
    });
  }
}