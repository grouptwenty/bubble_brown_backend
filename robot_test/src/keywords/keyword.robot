
*** Keywords ***
OpenChromeBrowser
    Open Browser  ${SERVER}  ${Browser}
    Maximize Browser Window
    Set Selenium Speed   0.1


LoginUser
    [Arguments]    ${user_username}    ${user_password}
    Input Text  name=user_username  ${user_username} 
    Input Text  name=user_password  ${user_password}  
    Click Button  button_login 

GotoMyAdmin
    Go To  ${GotoMyAdminManagement} 

# SemiInputInfoAndSave
#     [Arguments]    ${member_email}   ${member_password}  ${member_password_confirm}  ${prefix_name}  ${position_name}  ${member_name_en}  ${member_name_th}  ${member_middle_name_en}  ${member_middle_name_th}  ${member_lastname_en}  ${member_lastname_th}  ${institution_name}  ${faculty_name}  ${department_name}  ${country_name}  ${member_postal_code}  ${member_phone} 
#     Input Text  member_email  ${member_email}
#     Input Text  member_password  ${member_password} 
#     Input Text  member_password_confirm   ${member_password_confirm} 

#     Wait Until Element Is Visible   xpath=//div[@id="prefix_name"]
#     Click Element    xpath=//div[@id="prefix_name"] 
#     Wait Until Element Is Visible  xpath=//div[@id="prefix_name"]/div[2]/div/div[${prefix_name}]	
#     Click Element    xpath=//div[@id="prefix_name"]/div[2]/div/div[${prefix_name}] 

#     Wait Until Element Is Visible   xpath=//div[@id="position_name"]
#     Click Element    xpath=//div[@id="position_name"] 
#     Wait Until Element Is Visible  xpath=//div[@id="position_name"]/div[2]/div/div[${position_name}]	
#     Click Element    xpath=//div[@id="position_name"]/div[2]/div/div[${position_name}] 
     
#     Input Text  member_name_en   ${member_name_en} 
#     Input Text  name=member_name_th   ${member_name_th} 
#     Input Text  name=member_middle_name_en   ${member_middle_name_en} 
#     Input Text  name=member_middle_name_th   ${member_middle_name_th} 
#     Input Text  name=member_lastname_en   ${member_lastname_en} 
#     Input Text  name=member_lastname_th   ${member_lastname_th}  

#     Wait Until Element Is Visible   xpath=//div[@id="institution_name"]
#     Click Element    xpath=//div[@id="institution_name"] 
#     Wait Until Element Is Visible  xpath=//div[@id="institution_name"]/div[2]/div/div[${institution_name}]	
#     Click Element    xpath=//div[@id="institution_name"]/div[2]/div/div[${institution_name}]


#     Wait Until Element Is Visible   xpath=//div[@id="faculty_name"]
#     Click Element    xpath=//div[@id="faculty_name"] 
#     Wait Until Element Is Visible  xpath=//div[@id="faculty_name"]/div[2]/div/div[${faculty_name}]	
#     Click Element    xpath=//div[@id="faculty_name"]/div[2]/div/div[${faculty_name}]
 

#     Wait Until Element Is Visible   xpath=//div[@id="department_name"]
#     Click Element    xpath=//div[@id="department_name"] 
#     Wait Until Element Is Visible  xpath=//div[@id="department_name"]/div[2]/div/div[${department_name}]	
#     Click Element    xpath=//div[@id="department_name"]/div[2]/div/div[${department_name}]
 

#     Wait Until Element Is Visible   xpath=//div[@id="country_name"]
#     Click Element    xpath=//div[@id="country_name"] 
#     Wait Until Element Is Visible  xpath=//div[@id="country_name"]/div[2]/div/div[${country_name}]	
#     Click Element    xpath=//div[@id="country_name"]/div[2]/div/div[${country_name}]

 
#     Input Text  name=member_postal_code   ${member_postal_code} 
#     Input Text  name=member_phone   ${member_phone} 
#     Click Button  //button[@id="save_data"] 

# FullInputInfoAndSave
#     [Arguments]    ${member_email}   ${member_password}  ${member_password_confirm}  ${prefix_name}  ${prefix_name_other}  ${position_name}  ${position_name_other}  ${member_name_en}  ${member_name_th}  ${member_middle_name_en}  ${member_middle_name_th}  ${member_lastname_en}  ${member_lastname_th}  ${institution_name}  ${institution_name_other}  ${faculty_name}  ${faculty_name_other}  ${department_name}  ${department_name_other}  ${country_name}  ${member_postal_code}  ${member_phone} 
#     Input Text  member_email  ${member_email}
#     Input Text  member_password  ${member_password} 
#     Input Text  member_password_confirm   ${member_password_confirm} 
#     Input Text  prefix_name   ${prefix_name} 
#     Input Text  prefix_name_other   ${prefix_name_other} 
#     Input Text  position_name   ${position_name} 
#     Input Text  position_name_other   ${position_name_other} 
#     Input Text  member_name_en   ${member_name_en} 
#     Input Text  name=member_name_th   ${member_name_th} 
#     Input Text  name=member_middle_name_en   ${member_middle_name_en} 
#     Input Text  name=member_middle_name_th   ${member_middle_name_th} 
#     Input Text  name=member_lastname_en   ${member_lastname_en} 
#     Input Text  name=member_lastname_th   ${member_lastname_th} 
#     Input Text  name=institution_name   ${institution_name} 
#     Input Text  name=institution_name_other   ${institution_name_other} 
#     Input Text  name=faculty_name   ${faculty_name} 
#     Input Text  name=faculty_name_other   ${faculty_name_other} 
#     Input Text  name=department_name   ${department_name} 
#     Input Text  name=department_name_other   ${department_name_other} 
#     Input Text  name=country_name   ${country_name} 
#     Input Text  name=member_postal_code   ${member_postal_code} 
#     Input Text  name=member_phone   ${member_phone} 
#     Click Button  //button[@id="save_data"] 

# LogText
#     Log  ${text_test}

# Close
# [Teardown]    Close Browser