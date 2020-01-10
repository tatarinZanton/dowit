const csv = require('csv-parser');
const fs = require('fs');
const results = [];

module.exports.parse = (pathToCsv, next) => {
  fs.createReadStream(__dirname + '/' + pathToCsv)
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', () => {
      next(null, results);
    });
};
