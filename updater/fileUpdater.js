const ExcelJS = require("exceljs");
const path = require("path");
const os = require("os");
const fs = require('fs');

/* TODO: Add Updater logic */

/*
    1. Takes in supplied input path. It will first build a list of all .xlsx files located within the given directory.
    2. Next it will load up the specific dictionary so that values can be tested against it.
    3. Next, it will begin the "Main Loop" -- This is simply an iteration over the initial list of all .xlsx files in the given directory.
    4. For each iteration of the "Main Loop", it will start a "Sub Loop Process", whereupon it iterates through all columns and rows within the document, updating any values present in the dictionary to 
    their corresponding associations.
    5. Once each file is complete, it will save the new updated file to [INPUT PATH]/output/[FILE NAME].xlsx
    6. Once the full process is complete it will update the UI and save a log file to the [INPUT PATH]/output/process-log.log.txt file
*/

function findXlsxFilesRecursively(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recursively search subdirectories
            findXlsxFilesRecursively(filePath, fileList);
        } else if (path.extname(file).toLowerCase() === '.xlsx') {
            // Add the full path of the matching .xlsx file
            fileList.push(filePath);
        }
    });

    return fileList;
}

async function startProcess(inputPath, dictionaryPath){
    let logs = [];
    logs.push("Starting processing...");

    // Find all .xlsx files in the directory

    // Base search
    const xlsxFiles = fs.readdirSync(inputPath).filter(file => {
        // Keep only files that end with .xlsx
        return path.extname(file).toLowerCase() === '.xlsx';
    });

    // Deep Search (recursive)
    //const xlsxFiles = findXlsxFilesRecursively(inputPath);

    // Start Main Loop
    for(let i = 0; i < xlsxFiles.length; i++){
        //const workbook = new ExcelJS.Workbook();
        //await workbook.xlsx.readFile();
        console.log(xlsxFiles[i]);
    }


}


module.exports = {
  startProcess
};