For your A/R Desktop Suite, I'd recommend separating this into three reusable functions:

1. Load every workbook in a directory.
2. Replace values using a lookup table.
3. Save the modified workbook.

This makes it easy to reuse in other utilities.

## Example dictionary

You mentioned you have an object that maps `x -> y`.

```ts
const replacements: Record<string, string> = {
  "Administrator": "ADMIN",
  "Accounting": "ACCT",
  "Vehicle Protection": "VP",
  "Warranty": "WAR",
};
```

Or if you prefer a `Map`:

```ts
const replacements = new Map<string, string>([
  ["Administrator", "ADMIN"],
  ["Accounting", "ACCT"],
  ["Vehicle Protection", "VP"],
]);
```

---

## Load workbook

```ts
import ExcelJS from "exceljs";

async function loadWorkbook(file: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file);
    return workbook;
}
```

---

## Iterate through every sheet, row, and cell

```ts
function replaceWorkbookValues(
    workbook: ExcelJS.Workbook,
    replacements: Record<string, string>
) {
    workbook.eachSheet((worksheet) => {

        worksheet.eachRow((row) => {

            row.eachCell((cell) => {

                if (typeof cell.value !== "string") {
                    return;
                }

                const replacement = replacements[cell.value];

                if (replacement) {
                    cell.value = replacement;
                }

            });

        });

    });
}
```

This only replaces **exact matches**.

Example:

```
ABC
```

becomes

```
XYZ
```

if

```ts
{
    ABC: "XYZ"
}
```

---

# Replace text inside larger strings

If a cell contains

```
Administrator Warranty
```

and you want

```
ADMIN WAR
```

use:

```ts
function replaceWorkbookValues(
    workbook: ExcelJS.Workbook,
    replacements: Record<string, string>
) {
    workbook.eachSheet((worksheet) => {

        worksheet.eachRow((row) => {

            row.eachCell((cell) => {

                if (typeof cell.value !== "string") {
                    return;
                }

                let text = cell.value;

                for (const [oldValue, newValue] of Object.entries(replacements)) {
                    text = text.replaceAll(oldValue, newValue);
                }

                cell.value = text;

            });

        });

    });
}
```

---

# Save workbook

```ts
await workbook.xlsx.writeFile(outputFile);
```

---

# Complete example

```ts
import ExcelJS from "exceljs";

const replacements: Record<string, string> = {
    "Administrator": "ADMIN",
    "Accounting": "ACCT",
    "Warranty": "WAR",
};

async function processWorkbook(input: string, output: string) {

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(input);

    workbook.eachSheet((worksheet) => {

        worksheet.eachRow((row) => {

            row.eachCell((cell) => {

                if (typeof cell.value !== "string") {
                    return;
                }

                const replacement = replacements[cell.value];

                if (replacement) {
                    cell.value = replacement;
                }

            });

        });

    });

    await workbook.xlsx.writeFile(output);
}
```

---

## Handling all ExcelJS cell types

Since you're already building a fairly sophisticated Electron application, I'd recommend handling every type of cell value. ExcelJS cells aren't always plain strings—they can be numbers, dates, hyperlinks, formulas, rich text, or shared strings.

A more robust approach is:

```ts
row.eachCell((cell) => {
    const value = cell.value;

    if (typeof value === "string") {
        const replacement = replacements[value];
        if (replacement) {
            cell.value = replacement;
        }
    }

    if (
        value &&
        typeof value === "object" &&
        "text" in value &&
        typeof value.text === "string"
    ) {
        const replacement = replacements[value.text];
        if (replacement) {
            value.text = replacement;
            cell.value = value;
        }
    }
});
```

This prevents accidentally breaking formulas, hyperlinks, dates, and other structured cell types while still replacing text wherever appropriate. It's a good foundation if this utility will be processing many different Weekly 7 workbook formats.
