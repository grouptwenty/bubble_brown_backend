*** Settings ***
Library  Builtin
Library  Selenium2Library
Resource   src/variables/variable.robot 
Resource   src/keywords/keyword.robot

*** Test Cases ***
1. Open google
    OpenChromeBrowser
3. Register
    SemiInputInfoAndSave  jidapa_pook@hotmail.com  Revel1234Lnw@  Revel1234Lnw@  1  1  Thana  ธนะ  Boong  บุ้ง  Tepchuleepornsil  เทพชุลีพรศิลป์  1  1  1  2  30000  +660946594639