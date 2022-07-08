const connection = require("../connection");

exports.findCategory = () => {
  return connection
    .query(
      `
        SELECT 
        category
        FROM reviews
  `
    )
    .then((results) => {
      const arrOfCategories = results.rows.reduce((arr, category) => {
        arr.push(category.category);
        return arr;
      }, []);
      const set = new Set(arrOfCategories);
      return set;
    });
};
