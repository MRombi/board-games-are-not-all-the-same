const connection = require("../../connection");


exports.selectCommentByReviewId = (id) => {
  if (isNaN(id) === false) {
    return connection
      .query(
        `
        SELECT 
        comments.comment_id,
        comments.body,
        comments.votes,
        comments.author,
        comments.review_id,
        comments.created_at
        FROM comments
        WHERE comments.review_id = $1;
  `,
        [id]
      )
      .then((result) => {
        if (result.rows.length > 0) {
          return result.rows;
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
}
// GET /api/reviews/:review_id/comments

// Responds with:

// an array of comments for the given review_id of which each comment should have the following properties:

// comment_id
// votes
// created_at
// author which is the username from the users table
// body
// review_id