// const fs = require("fs");
const connection = require("../../connection");

exports.selectReviewById = (id) =>  {
  return connection.query(
    `
SELECT * FROM reviews WHERE review_id=$1;
`, [id]
  )
  .then((result) => {
    
    return result.rows[0];
  });
}