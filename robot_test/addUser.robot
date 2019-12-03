*** Settings ***

Library  Selenium2Library


*** Variables ***
${text_test}  ROBOT FRAME WORK/
${SERVER}  http://10.1.11.52:3000/#/ 
${HOME}  http://10.1.11.52:3000/#/dashboard 
${GotoMyUserManagement}  http://10.1.11.52:3000/#/user 
${GotoMyInsertUser}  http://10.1.11.52:3000/#/user/insert 
${Browser}  chrome
${Result}  False


*** Keywords ***
LoginUser
    [Arguments]    ${user_username}    ${user_password}
    Input Text  name=user_username  ${user_username} 
    Input Text  name=user_password  ${user_password}  
    Click Button  button_login 

GotoMyUser
    Go To  ${GotoMyUserManagement} 
    Go To  ${GotoMyInsertUser} 

FormUser
    [Arguments]  ${user_name}  ${user_lastname}   ${user_mobile}  ${user_email}  ${user_username}  ${user_password}  ${user_address}  ${path_upload} 
    
    Select From List By Label   xpath=//select[@name="user_prefix"]  นางสาว
    Input Text  name=user_name  ${user_name}
    Input Text  name=user_lastname  ${user_lastname}
    Input Text  name=user_mobile  ${user_mobile}
    Input Text  name=user_email  ${user_email}
    Input Text  name=user_username  ${user_username}
    Input Text  name=user_password  ${user_password}
    Input Text  name=user_address  ${user_address}
    Select From List By Label   xpath=//select[@name="province_id"]  นครราชสีมา
    Select From List By Label   xpath=//select[@name="amphur_id"]  เมืองนครราชสีมา
    Select From List By Label   xpath=//select[@name="district_id"]  ในเมือง
    Choose File  //*[contains(@name, 'user_profile_img')]  ${path_upload} 
    Click Button  button_save
    

*** Test Cases *** 
1.OpenChromeBrowser
    Open Browser  ${SERVER}  ${Browser}
    Maximize Browser Window
    Set Selenium Speed   0.2  

2.InputLogin
    Title Should Be  IOT WASHING MACHINE
    LoginUser  atsadawut  atsadawutgot24

3.GotoInsertUser
    GotoMyUser

4.FormInsertUser
    FormUser  ทดสอบ  โรบอท  085658774  testUser@11.com  usertest  123456  BKK  C:\\Users\\Acer\\Downloads\\69545076_380077642674710_6287321643006033920_n.jpg