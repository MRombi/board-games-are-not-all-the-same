const connection = require("../../connection");
// const devData = require("../../data/development-data/index");
// const {categoryData, commentData, reviewData, userData} = require("../../data/test-data/index");

exports.selectCategories = () => {
  return connection.query(
      `
  SELECT slug, description FROM categories;
  `
    )
    .then((result) => {
      // console.log(result.rows);
      return result.rows;
    });
};
