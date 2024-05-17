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
        comments.push(singleComment);
        // console.log(singleComment);
      }
    }
  })
  .on("end", function() {
    filterComments();
    printWordMap();

    console.log("Anzahl Unterschriften:", rowsCounter);
    console.log("Anzahl Kommentare:", commentsCounter);
    console.log("Anzahl öffentliche Kommentare:", publicCommentsCounter);
    console.log("Anzahl einzigartige Worte:", Object.keys(wordMap).length);
  });

function filterComments() {
  comments
    .map((comment) => comment.replaceAll("\n", ""))
    .map((comment) => comment.replaceAll('"', ""))
    .map((comment) => comment.replaceAll(",", ""))
    .map((comment) => comment.replaceAll(".", ""))
    .map((comment) => comment.replaceAll("!", ""))
    .map((comment) => comment.replaceAll("?", ""))
    .map((comment) => comment.replaceAll("-", ""))
    .map((comment) => comment.replaceAll(";", ""))
    .map((comment) => comment.replaceAll("“", ""))
    .map((comment) => comment.replaceAll("„", ""))
    .map((comment) => comment.replaceAll("'", ""))
    .map((comment) => comment.replaceAll("(", ""))
    .map((comment) => comment.replaceAll(")", ""))
    .map((comment) => comment.replaceAll("…", ""))
    .map((comment) => comment.replaceAll(":", ""))
    .map((comment) => comment.toLowerCase())
    .map((comment) =>
      comment.split(" ").forEach((element) => {
        if (wordMap.hasOwnProperty(element)) {
          wordMap[element]++;
        } else {
          wordMap[element] = 1;
        }
      })
    );
}

function printWordMap() {
  let sortedWordMap = Object.entries(wordMap);

  sortedWordMap.sort((a, b) => b[1] - a[1]);

  for (let [word, count] of sortedWordMap) {
    console.log(`${word}: ${count}`);
  }

  let fileContent = sortedWordMap.map(([word, count]) => `${word}: ${count}`);

  fileContent.unshift("");
  fileContent.unshift("---------");
  fileContent.unshift("");
  fileContent.unshift(
    "Anzahl einzigartige Worte: " + Object.keys(wordMap).length
  );
  fileContent.unshift(
    "Anzahl öffentliche Kommentare: " + publicCommentsCounter
  );
  fileContent.unshift("Anzahl Kommentare: " + commentsCounter);
  fileContent.unshift("Anzahl Unterschriften: " + rowsCounter);
  writeFile(fileContent.join("\n"));
}

function writeFile(fileContent) {
  fs.writeFile("wordCount.txt", fileContent, (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("File written successfully");
    }
  });
}
