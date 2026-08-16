# Keyword Updater
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
To install for Windows, download the latest .exe from the Releases. Run the .exe and the application should automatically install to the machine.

## Usage
To use, open the app. Click on "Choose folder" and select the input folder. Press the "Start Process" button and processing should begin.

Processed files will appear in an "Output" directory, in the same location as the input directory.

Note: The current version will **ONLY** update a keyword if it is either alone in the cell or followed by a dash *(-)*.

### Fix For Any Conflicting Dealers
There may be a further edge case such as if a dealer's name in the portal contains an admin keyword followed by a dash (such as *"Conway Cars - Jackson"*) however, this can be fixed using the below method.

1. Export list of all dealers. In the .CSV (change to .xlsx), then select Conditional Formatting (on the Dealer name column). Then you want to select all with conflicting keywords to turn red (for example ```"Cars -"```).
2. Then sort by the Dealer name column, under sort type select "fill" and place all the red on top.
3. Now on the Agent Wall Sheets where these conflicting dealers exist, simply change the final display name to have a different name (such as remove one of the spaces, maybe remove the dash entirely). Once you run the updater, it will not update that dealer.

