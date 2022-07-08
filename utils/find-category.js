const connection = require("../db/connection");

exports.findCategory = () => {
  return connection
    .query(
      `
        SELECT 
        slug
        FROM categories
  `
    )
    .then((results) => {
      const arrOfCategories = results.rows.reduce((arr, category) => {
        arr.push(category.slug);
        return arr;
      }, []);
      const set = new Set(arrOfCategories);
      return set;
    });
};
