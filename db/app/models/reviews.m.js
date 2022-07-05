const connection = require("../../connection");

exports.selectReviewById = (id) => {
  if (isNaN(id) === false) {
    return connection
      .query(
        `
        SELECT 
        reviews.review_id,
        reviews.title,
				reviews.category,
				reviews.designer,
				reviews.owner,
				reviews.review_body,
				reviews.review_img_url,
				reviews.created_at,
				reviews.votes, 
        COUNT(comments.body) AS comment_count
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;
  `,
        [id]
      )
      .then((result) => {
        if (result.rows.length > 0) {
          return result.rows[0];
        } else {
          return Promise.reject({
            status: 404,
            message: "Path not found, invilid review_id",
          });
        }
      });
  } else {
    return Promise.reject({
      status: 400,
      message: "Bad request, review_id must be a number",
    });
  }
};

exports.updateReviewById = (id, votes) => {
  let vote = Object.values(votes).join("");
  let inc_votes = Object.keys(votes).join("");

  if (inc_votes !== "inc_votes") {
    return Promise.reject({
      status: 404,
      message: "bad request, the request body must contain inc_votes",
    });
  } else if (isNaN(id) === false) {
    if (isNaN(vote) === true) {
      return Promise.reject({
        status: 400,
        message: "Bad request, vote must be a number",
      });
    } else {
      return connection
        .query(
          `
  UPDATE reviews 
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *
  `,
          [vote, id]
        )
        .then((result) => {
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            return Promise.reject({
              status: 404,
              message: "Path not found, invilid review_id",
            });
          }
        });
    }
  } else {
    return Promise.reject({
      status: 400,
      message: "Bad request, review_id must be a number",
    });
  }
};
