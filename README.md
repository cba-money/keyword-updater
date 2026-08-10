# keyword-updater
This program simply iterates through all .xlsx files in a given directory and updates all instances of a keyword with an associated definition (given a dictionary file of associations).

## Development
Make sure Node.js and NPM are installed on your machine. Clone the repository and open a command prompt in the root of the direcotry.

Run:
```sh
npm install
```

To install dependencies, then run:

```sh
npm run dev
```

## Installing
To install for Windows, download the latest .exe from the Releases. Run the .exe and the application should automatically install to the machine/

## Usage
To use, open the app. Click on "Choose folder" and select the input folder. Press the "Start Process" button and processing should begin.

Processed files will appear in an "Output" directory, in the same location as the input directory.

Note: The current version will **ONLY** update a keyword if it is either alone in the cell or followed by a dash *(-)*.

