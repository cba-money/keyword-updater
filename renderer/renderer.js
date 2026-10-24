let generatedFile = null;

async function uploadFile(){
  const file = await window.electronAPI.uploadFile();
  if(file === undefined || file === null || file.length <= 0){
      document.getElementById('uploadedFilePath').value = "Please select a folder...";
      return;
  }
  console.log(`File uploaded:${file}`);
  document.getElementById('uploadedFilePath').value = file;
}

function isFolderPath(value) {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  const str = value.trim();

  // Exclude URLs and URI schemes.
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(str)) {
    return false;
  }
  // Windows absolute paths (C:\Users\Tyler or C:/Users/Tyler).
  if (/^[a-zA-Z]:[\\/]/.test(str)) {
    return true;
  }
  // Windows UNC paths (\\server\share or \\server\share\folder).
  if (/^\\\\[^\\]+\\[^\\]+/.test(str)) {
    return true;
  }
  // Unix absolute paths (/home/user, /var/log).
  if (str.startsWith("/")) {
    return true;
  }
  // Relative paths (./folder, ../folder).
  if (/^(?:\.{1,2})[\\/]/.test(str)) {
    return true;
  }
  // Paths containing directory separators.
  if (/[/\\]/.test(str)) {
    return true;
  }
  // Bare folder names without extensions.
  if (/^[^<>:"/\\|?*\r\n.]+(?: [^<>:"/\\|?*\r\n.]+)*$/.test(str)) {
    return true;
  }

  return false;
}

document.getElementById('fileUpload').addEventListener('click', uploadFile);
document.getElementById('uploadedFilePath').addEventListener('click', uploadFile);

document
  .getElementById('submitBtn')
  .addEventListener('click', async () => {

    const filePath = document.getElementById('uploadedFilePath').value;
    
    if(filePath === undefined || !isFolderPath(filePath) || filePath === "Please select a folder..." || filePath === null || filePath.length <= 0){
      alert("Please select a folder.");
      return;
    }

    document.getElementById('status').innerText = "Processing...";

    generatedFile =
      await window.electronAPI.processFile({
        filePath: filePath
      });

    document.getElementById('status').innerText = "Finished.";

  });
