' NEXOSxLPIN launcher ??? always uses this script's folder
Option Explicit
Dim sh, fso, root, bat, cmdline
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
root = fso.GetParentFolderName(WScript.ScriptFullName)
bat = root & "\START.bat"
If Not fso.FileExists(bat) Then
  MsgBox "START.bat not found:" & vbCrLf & bat, vbCritical, "NEXOSxLPIN"
  WScript.Quit 1
End If
sh.CurrentDirectory = root
cmdline = "cmd.exe /k cd /d """ & root & """ && call ""START.bat"""
sh.Run cmdline, 1, False
