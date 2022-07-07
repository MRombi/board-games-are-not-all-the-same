const reviews = require("../data/test-data/reviews");

exports.findCategory = (reviews) => {
  arr = [];
  reviews.forEach((review) => {
    arr.push(review.category);
  });
  const set = new Set(arr);
  return set;
};
