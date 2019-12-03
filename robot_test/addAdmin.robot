*** Settings ***

Library  Selenium2Library


*** Variables ***
${text_test}  ROBOT FRAME WORK/
${SERVER}  http://192.168.0.176:3000/#/ 
${HOME}  http://192.168.0.176:3000/#/dashboard 
${GotoMyAdminManagement}  http://192.168.0.176:3000/#/admin 
${GotoMyInsertAdmin}  http://192.168.0.176:3000/#/admin/insert 
${Browser}  chrome
${Result}  False


*** Keywords ***
LoginUser
    [Arguments]    ${user_username}    ${user_password}
    Input Text  name=user_username  ${user_username} 
    Input Text  name=user_password  ${user_password}  
    Click Button  button_login 

GotoMyAdmin
    Go To  ${GotoMyAdminManagement} 
    Go To  ${GotoMyInsertAdmin} 

FormAdmin
    [Arguments]  ${admin_name}  ${admin_lastname}  ${admin_email}  ${admin_mobile}  ${admin_username}  ${admin_password}  ${path_upload} 
    
    Select From List By Label   xpath=//select[@name="admin_prefix"]  นาย
    Input Text  name=admin_name  ${admin_name}
    Input Text  name=admin_lastname  ${admin_lastname}
    Input Text  name=admin_email  ${admin_email}
    Input Text  name=admin_mobile  ${admin_mobile}
    Input Text  name=admin_username  ${admin_username}
    Input Text  name=admin_password  ${admin_password}
    Select From List By Label   xpath=//select[@name="province_id"]  ยโสธร
    Select From List By Label   xpath=//select[@name="amphur_id"]  เมืองยโสธร
    Select From List By Label   xpath=//select[@name="district_id"]  ในเมือง
    Choose File  //*[contains(@id, 'admin_img')]  ${path_upload} 
    Click Button  button_save
    

*** Test Cases *** 
1.OpenChromeBrowser
    Open Browser  ${SERVER}  ${Browser}
    Maximize Browser Window
    Set Selenium Speed   0.2  

2.InputLogin
    Title Should Be  IOT WASHING MACHINE
    LoginUser  atsadawut  atsadawutgot24

3.GotoInsertAdmin
    GotoMyAdmin

4.FormInsertAdmin
    FormAdmin  ทดสอบ  โรบอท  robot@rrrq.com  089999999  test  123456  C:\\Users\\GOTJI\\Downloads\\71136720_756580931453330_1533118507934285824_n.jpg
    # [Teardown]    Close All Browsers  