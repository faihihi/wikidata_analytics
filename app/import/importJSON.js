var exec = require("child_process").exec;
const fs = require("fs");
var directoryPath = "/Users/puifai/Downloads/web_sample/assignment2/dataset/revisions/";
var importcommand = 'mongoimport --jsonArray --db testwiki --collection revisions --file ' + directoryPath;

//check if directory exist
if(fs.existsSync(directoryPath)){
  console.log("Directory path existed!");
  //read files in directory
  fs.readdir(directoryPath, function(err, filenames){
    if(err){
      console.log(err);
      return;
    }
    filenames.forEach(function(filename){
      fs.readFile(directoryPath + filename, 'utf-8', function(err, content){
        if(err){
          console.log(err);
          return;
        }
        console.log("Importing... " + filename);
        exec(importcommand + filename);
        //onFileContent(filename, content);
      });
    });
  });
}
else{
  console.log("Directory not found");
}
