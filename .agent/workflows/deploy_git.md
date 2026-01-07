---
description: Workflow to push changes to git when git is not in PATH
---
The system git is not in the variable PATH. Use the absolute path or the helper script.

Method 1: Use the helper script (Recommended)
// turbo
cmd /c push.bat "your commit message"

Method 2: Manual Absolute Path
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "message"
"C:\Program Files\Git\cmd\git.exe" push
