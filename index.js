const fs = require("fs");
const { parse } = require("csv-parse");

const PATH =
  "./abbruch-des-verkehrsversuchs-temporaere-fussgaengerzone-in-crailsheim.csv";

const comments = [];
const wordMap = {};
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
    filterComments();
    console.log(wordMap);
    console.log("Anzahl Unterschriften:", rowsCounter);
    console.log("Anzahl Kommentare:", commentsCounter);
    console.log("Anzahl öffentliche Kommentare:", publicCommentsCounter);
  });

function filterComments() {
  comments.map((comment) =>
    comment.split(" ").forEach((element) => {
      // Check if the word already exists in the wordCount object
      if (wordMap.hasOwnProperty(element)) {
        // Increment the count by 1
        wordMap[element]++;
      } else {
        // Add the word with a count of 1
        wordMap[element] = 1;
      }
    })
  );
}
