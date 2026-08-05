With **ExcelJS** in CommonJS, you simply:

1. Load the workbook.
2. Modify cells, rows, sheets, etc.
3. Save the workbook back to the same file (or a new file).

```javascript
const ExcelJS = require("exceljs");

async function updateExcelFile(filePath) {
  const workbook = new ExcelJS.Workbook();

  // Load existing workbook
  await workbook.xlsx.readFile(filePath);

  // Get a worksheet
  const worksheet = workbook.getWorksheet(1); // First sheet
  // Or:
  // const worksheet = workbook.getWorksheet("Sheet1");

  // Update a cell
  worksheet.getCell("A1").value = "Updated Value";

  // Update by row/column numbers
  worksheet.getRow(2).getCell(3).value = "Hello";

  // Save back to the same file
  await workbook.xlsx.writeFile(filePath);

  console.log("Workbook updated successfully.");
}

updateExcelFile("C:/path/to/workbook.xlsx")
  .catch(console.error);
```

## Updating every occurrence of a value

```javascript
const ExcelJS = require("exceljs");

async function replaceValues(filePath, oldValue, newValue) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  workbook.eachSheet((worksheet) => {
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (cell.value === oldValue) {
          cell.value = newValue;
        }
      });
    });
  });

  await workbook.xlsx.writeFile(filePath);

  console.log("All replacements complete.");
}

replaceValues("example.xlsx", "Old Name", "New Name");
```

## Updating using a lookup dictionary

This is useful if you have many replacements.

```javascript
const ExcelJS = require("exceljs");

const replacements = {
  "APPLE": "APL",
  "ORANGE": "ORG",
  "BANANA": "BAN"
};

async function replaceFromDictionary(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  workbook.eachSheet((worksheet) => {
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (typeof cell.value === "string" && replacements[cell.value]) {
          cell.value = replacements[cell.value];
        }
      });
    });
  });

  // Overwrite original file
  await workbook.xlsx.writeFile(filePath);

  console.log("Workbook updated.");
}

replaceFromDictionary("example.xlsx");
```

## Saving as a new file instead

Instead of overwriting:

```javascript
await workbook.xlsx.writeFile("updated-example.xlsx");
```

This preserves the original workbook while writing the modified version.
