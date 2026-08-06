## Design Plan
The final application will be developed so that it can be pointed to a directory of excel files, and it will go through each file, epdate all instances of a given keyword with its corresponding replacement. It will then save the file to a specified output folder for each .xlsx, .xls, or .csv file in the directory.

## Flow Chart
```
[Main Application]
|
|
V
User selects input path & output path, then presses "Start"
|
|
|
V
Progress bar appears. It is updated as the process updates.
|
|
/     \
Fail    Pass
Return.     Return to main window with "success" text
Show
Error  

```
