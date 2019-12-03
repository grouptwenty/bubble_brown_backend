*** Settings ***

Library  Selenium2Library


*** Variables ***
${text_test}  ROBOT FRAME WORK/
${SERVER}  http://192.168.0.176:3000/#/ 
${HOME}  http://192.168.0.176:3000/#/dashboard 
${GotoEntrepreneurManagement}  http://192.168.0.176:3000/#/laundry 
${Browser}  chrome
${Result}  False


*** Keywords ***
LoginUser
    [Arguments]    ${user_username}    ${user_password}
    Input Text  name=user_username  ${user_username} 
    Input Text  name=user_password  ${user_password}  
    Click Button  button_login 

GotoMyLaundry
    Go To  ${GotoLaundryManagement} 
    Click Button  add_laundry

FormEntrepreneur
    [Arguments]  ${laundry_name_th}  ${laundry_name_en}  ${entrepreneur_tel}  ${entrepreneur_email}  ${entrepreneur_username}  ${entrepreneur_password}  ${entrepreneur_address}  ${path_upload} 
    
    # Select From List By Label   xpath=//select[@name="entrepreneur_prefix"]  นาย
    Input Text  name=entrepreneur_name_th  ${entrepreneur_name_th}
    Input Text  name=entrepreneur_name_en  ${entrepreneur_name_en}
    Input Text  name=entrepreneur_email  ${entrepreneur_email}
    Input Text  name=entrepreneur_tel  ${entrepreneur_tel}
    Input Text  name=entrepreneur_username  ${entrepreneur_username}
    Input Text  name=entrepreneur_password  ${entrepreneur_password}
    Input Text  tag=textarea  ${entrepreneur_address}
    Select From List By Label   xpath=//select[@name="province_id"]  ยโสธร
    Select From List By Label   xpath=//select[@name="amphur_id"]  เมืองยโสธร
    Select From List By Label   xpath=//select[@name="district_id"]  ในเมือง
    Choose File  //*[contains(@id, 'entrepreneur_img')]  ${path_upload} 
    # Click Button  button_save

*** Test Cases *** 
1.OpenChromeBrowser
    Open Browser  ${SERVER}  ${Browser}
    Maximize Browser Window
    Set Selenium Speed   0.2  

2.InputLogin
    Title Should Be  IOT WASHING MACHINE
    LoginUser  atsadawut  atsadawutgot24

3.GotoInsertEntrepreneur
    GotoMyEntrepreneur

4.FormInsertEntrepreneur
    FormEntrepreneur  ทดสอบผู้ประกอบการ  โรบอท  robot@rrrq.com  089999999  271/55 ตรอกวัดท่าตะโก  entrepreneur  123456  C:\\Users\\GOTJI\\Downloads\\71667277_797598410643573_1768351405719945216_o.jpg
#     # [Teardown]    Close All Browsers  