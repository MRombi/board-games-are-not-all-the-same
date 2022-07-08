const connection = require("../../db/connection");

exports.selectCommentById = (id) => {
  if (isNaN(id) === false) {
    if (id)
      return connection
        .query(
          `
        SELECT 
        comments.*
        FROM comments
        WHERE comments.comment_id = $1;
  `,
          [id]
        )
        .then((result) => {
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            return Promise.reject({
              status: 404,
              message: "Path not found, invilid comment_id",
            });
          }
        });
  } else {
    return Promise.reject({
      status: 400,
      message: "Bad request, comment_id must be a number",
    });
  }
};

exports.selectCommentByReviewId = (id) => {
  if (isNaN(id) === false) {
    if (id)
      return connection
        .query(
          `
        SELECT 
        comments.*
        FROM comments
        WHERE comments.review_id = $1;
  `,
          [id]
        )
        .then((result) => {
          return result.rows;
        });
  } else {
    return Promise.reject({
      status: 400,
      message: "Bad request, review_id must be a number",
    });
  }
};

exports.insertCommentByReviewId = (id, comments) => {
  let name = Object.values(comments)[0];
  let comment = Object.values(comments)[1];
  let username = Object.keys(comments)[0];
  let body = Object.keys(comments)[1];

  if (username !== "username" || body !== "body") {
    return Promise.reject({
      status: 404,
      message: "bad request, the request body must contain username and body",
    });
  } else if (isNaN(id) === false) {
    if (typeof name !== "string" || typeof comment !== "string") {
      return Promise.reject({
        status: 400,
        message: "Bad request, username and body must be strings",
      });
    } else {
      return connection
        .query(
          `
  INSERT INTO comments 
  (body, review_id, author)
  VALUES
  ($1, $2, $3)
  RETURNING comment_id, author, body;
  `,
          [comment, id, name]
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

exports.removeCommentById = (id) => {
  if (isNaN(id) === false) {
    return connection
      .query(
        `
        DELETE FROM comments WHERE comment_id = $1;
  `,
        [id]
      )
      .then((result) => {
        return result.rows;
      });
  } else {
    return Promise.reject({
      status: 400,
      message: "Bad request, comment_id must be a number",
    });
  }
};
