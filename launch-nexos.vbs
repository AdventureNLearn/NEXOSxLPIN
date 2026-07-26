' NEXOSxLPIN desktop launcher — avoids 0x800700E8 pipe errors from broken cmd /c quoting
Option Explicit
Dim sh, root, bat, rc
Set sh = CreateObject("WScript.Shell")
root = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = root
bat = root & "\START.bat"
' 1 = normal window, False = do not wait (parent can exit cleanly)
rc = sh.Run("cmd.exe /k cd /d """ & root & """ && call """ & bat & """", 1, False)
