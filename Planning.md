I think this is a good fit for a small Electron utility. I'd actually make it a little more flexible than described so you don't have to recompile it whenever the administrator codes change.

## Proposed Features

### Home Screen

```
┌──────────────────────────────────────────────────────┐
│ Administrator Code Updater                          │
├──────────────────────────────────────────────────────┤
│ Dictionary File                                      │
│ [ C:\Codes\ADMINISTRATOR CODES 2026.xlsx ] [Browse]  │
│                                                      │
│ Folder to Process                                    │
│ [ C:\Reports\Weekly7 ]                  [Browse]     │
│                                                      │
│ Output Folder                                        │
│ C:\Reports\Weekly7\outputs                          │
│                                                      │
│ ☑ Process subfolders                                 │
│ ☑ Replace whole-cell values only                     │
│ ☑ Preserve formulas                                  │
│                                                      │
│             [ Start Processing ]                     │
└──────────────────────────────────────────────────────┘
```

---

## Settings

I'd save the dictionary path in settings.

```json
{
  "dictionaryFile": "C:\\Codes\\ADMINISTRATOR CODES 2026.xlsx",
  "lastInputFolder": "C:\\Reports\\Weekly7"
}
```

That way, when administrator definitions change, you simply replace the Excel file or select a newer one.

No code changes required.

---

# Dictionary Loading

The dictionary workbook would be loaded dynamically.

Definitions begin on **row 4**.

For every row:

| C          | D    |
| ---------- | ---- |
| JOHN PAK   | JPAK |
| TYLER RUFF | TRUF |
| ...        | ...  |

Create a Map:

```ts
Map<string, string>
```

Example

```ts
{
    "JOHN PAK" => "JPAK",
    "TYLER RUFF" => "TRUF"
}
```

I'd normalize everything

```ts
trim()
toUpperCase()
collapse multiple spaces
```

so that

```
John Pak
JOHN PAK
John  Pak
```

all resolve correctly.

---

# Processing

The application walks

```
Input Folder
```

recursively.

For every

```
*.xlsx
```

file

```
Reports
    Jan.xlsx
    Feb.xlsx
    Dealer A
        Week1.xlsx
        Week2.xlsx
```

---

# Output

Mirror the directory structure

```
Reports

    outputs

        Jan.xlsx

        Feb.xlsx

        Dealer A

            Week1.xlsx

            Week2.xlsx
```

rather than dumping hundreds of files into one folder.

---

# Replacement Logic

Every worksheet.

Every row.

Every cell.

If the cell is a **string**

```ts
const normalized = normalize(cell.value);

if (dictionary.has(normalized)) {
    cell.value = dictionary.get(normalized);
}
```

---

If formulas exist

```
=SUM(...)
```

leave them untouched.

---

Dates

```
1/1/2026
```

leave untouched.

---

Numbers

```
100
```

leave untouched.

---

Formatting

ExcelJS preserves

* fonts
* colors
* borders
* fills
* merged cells
* formulas
* widths

so only the cell value changes.

---

# Processing Log

```
Loaded dictionary

523 definitions

Searching...

Processing

Dealer1.xlsx

✓ 18 replacements

Dealer2.xlsx

✓ 0 replacements

Dealer3.xlsx

✓ 43 replacements

Finished

312 files

2,841 replacements
```

---

# Summary Screen

```
Completed

Files Processed

312

Files Modified

281

Total Replacements

2,841

Output Folder

C:\Reports\outputs
```

---

# Electron Stack

I'd use exactly what you've been using in your other desktop utilities:

* Electron
* React
* TypeScript
* Vite
* ExcelJS
* electron-store (for settings)
* ShadCN UI

---

## One enhancement I'd recommend

Instead of replacing **every occurrence** of a keyword anywhere in the workbook, add an option to restrict replacements to specific columns or exact cell values.

For example:

* **Exact cell match only (recommended)**: A cell containing `JOHN PAK` becomes `JPAK`, but `Processed by JOHN PAK` is left unchanged.
* **Substring replacement (optional)**: Replaces occurrences within longer text.

This greatly reduces the risk of accidentally modifying comments, notes, descriptions, or formulas that happen to contain one of the administrator names.

Given your workflow, I'd make **Exact cell match only** the default behavior while still allowing substring replacement as an advanced option if you ever need it.
