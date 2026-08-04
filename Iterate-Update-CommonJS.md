For CommonJS, I'd structure it as a reusable function that:

1. Loads the workbook.
2. Iterates through every worksheet.
3. Iterates through every row.
4. Iterates through every cell.
5. Replaces any matching values.
6. Saves the workbook.

## Install ExcelJS

```bash
npm install exceljs
```

---

## Example replacement dictionary

```javascript
const replacements = {
    "Administrator": "ADMIN",
    "Accounting": "ACCT",
    "Vehicle Protection": "VP",
    "Warranty": "WAR"
};
```

---

## Processing Function

```javascript
const ExcelJS = require("exceljs");
const path = require("path");

async function replaceWorkbookValues(inputFile, outputFile, replacements) {
    const workbook = new ExcelJS.Workbook();

    // Load workbook
    await workbook.xlsx.readFile(inputFile);

    // Iterate through every worksheet
    workbook.eachSheet((worksheet) => {
        console.log(`Processing sheet: ${worksheet.name}`);

        // Iterate through every row
        worksheet.eachRow((row) => {

            // Iterate through every cell
            row.eachCell((cell) => {

                // Only process string cells
                if (typeof cell.value !== "string") {
                    return;
                }

                // Exact match replacement
                if (replacements[cell.value]) {
                    console.log(
                        `Replacing "${cell.value}" -> "${replacements[cell.value]}"`
                    );

                    cell.value = replacements[cell.value];
                }

            });

        });

    });

    // Save workbook
    await workbook.xlsx.writeFile(outputFile);

    console.log("Workbook saved:", outputFile);
}
```

---

## Example Usage

```javascript
const replacements = {
    "Administrator": "ADMIN",
    "Accounting": "ACCT",
    "Vehicle Protection": "VP",
    "Warranty": "WAR"
};

replaceWorkbookValues(
    "./Weekly7.xlsx",
    "./Weekly7-Updated.xlsx",
    replacements
);
```

---

# Replacing Text Within Cells

If a cell contains more than just the keyword, such as:

```
Administrator Warranty
```

and you want:

```
ADMIN WAR
```

replace the cell loop with:

```javascript
row.eachCell((cell) => {

    if (typeof cell.value !== "string") {
        return;
    }

    let value = cell.value;

    for (const [oldValue, newValue] of Object.entries(replacements)) {
        value = value.replaceAll(oldValue, newValue);
    }

    cell.value = value;
});
```

---

# Handling Rich Text Cells

ExcelJS cells aren't always plain strings. If you want to preserve rich text formatting while still replacing words, you can extend the logic:

```javascript
row.eachCell((cell) => {

    // Plain strings
    if (typeof cell.value === "string") {

        let value = cell.value;

        for (const [oldValue, newValue] of Object.entries(replacements)) {
            value = value.replaceAll(oldValue, newValue);
        }

        cell.value = value;
    }

    // Rich text
    else if (
        cell.value &&
        cell.value.richText
    ) {

        cell.value.richText.forEach(part => {

            for (const [oldValue, newValue] of Object.entries(replacements)) {
                part.text = part.text.replaceAll(oldValue, newValue);
            }

        });

    }

});
```

---

# Processing Every Workbook in a Folder

Since you're building this as an Electron utility, you'll likely want to process an entire directory rather than a single file. Here's a reusable function:

```javascript
const fs = require("fs");
const path = require("path");

async function processFolder(folderPath, replacements) {

    const outputFolder = path.join(folderPath, "outputs");

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }

    const files = fs.readdirSync(folderPath);

    for (const file of files) {

        if (!file.endsWith(".xlsx")) {
            continue;
        }

        const input = path.join(folderPath, file);
        const output = path.join(outputFolder, file);

        console.log(`Processing ${file}`);

        await replaceWorkbookValues(input, output, replacements);
    }

    console.log("Finished.");
}
```

This pattern scales well for your A/R Desktop Suite utilities, where you can point the tool at a folder, apply a configurable replacement dictionary, and write all modified workbooks into an `outputs` subfolder while preserving the originals.
