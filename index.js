const fs = require("fs");
const { parse } = require("csv-parse");

const PATH =
  "./abbruch-des-verkehrsversuchs-temporaere-fussgaengerzone-in-crailsheim.csv";

const comments = [];
let rowsCounter = 0;
let commentsCounter = 0;
let publicCommentsCounter = 0;
fs.createReadStream(PATH)
  .pipe(parse({ delimiter: ";", relax_quotes: true, from_line: 2 }))
  .on("data", function(row) {
    rowsCounter += 1;
    const singleComment = row[row.length - 1];
    if (singleComment.length > 0) {
      commentsCounter += 1;
      if (singleComment !== "geheim") {
        publicCommentsCounter += 1;
        console.log(singleComment);
      }
    }
  })
  .on("end", function() {
    console.log("Anzahl Unterschriften:", rowsCounter);
    console.log("Anzahl Kommentare:", commentsCounter);
    console.log("Anzahl öffentliche Kommentare:", publicCommentsCounter);
  });
