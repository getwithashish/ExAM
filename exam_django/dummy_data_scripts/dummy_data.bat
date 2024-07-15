@echo off

:: Check if hostname argument is provided
if "%~1"=="" (
    echo Usage: %0 ^<hostname^>
    exit /b 1
)

set "hostname=%~1"

set "target_filename=jq.exe"

:: Download jq
curl -L -o "%target_filename%" "https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-win64.exe" --ssl-no-revoke

:: Check if jq is available
where /q jq.exe
if errorlevel 1 (
    echo jq could not be found. Please install it to continue.
    exit /b 1
)

:: Function to make a curl request
:make_curl_request
set "username=%~1"
set "password=%~2"
set "mobile=%~3"
set "email=%~4"
set "scope=%~5"

curl --request POST ^
  --url "http://%hostname%:8000/api/v1/user/register" ^
  --header "Content-Type: application/json" ^
  --header "User-Agent: insomnia/8.6.1" ^
  --data "{\"username\":\"%username%\",\"password\":\"%password%\",\"email\":\"%email%\",\"mobile\":\"%mobile%\",\"user_scope\":\"%scope%\"}"
goto :eof

:: Sign up
call :make_curl_request "aidrin.sysadmin" "aidrin@sysadmin" "94460209991" "aidrin@sysadmin.in" "SYSTEM_ADMIN"
call :make_curl_request "aidrin.lead" "aidrin@lead" "94460209992" "aidrin@lead.in" "LEAD"
call :make_curl_request "ananthan.sysadmin" "ananthan@sysadmin" "94460209993" "ananthan@sysadmin.in" "SYSTEM_ADMIN"
call :make_curl_request "ananthan.lead" "ananthan@lead" "94460209994" "ananthan@lead.in" "LEAD"
call :make_curl_request "asima.sysadmin" "asima@sysadmin" "94460209995" "asima@sysadmin.in" "SYSTEM_ADMIN"
call :make_curl_request "asima.lead" "asima@lead" "94460209996" "asima@lead.in" "LEAD"
call :make_curl_request "pavithra.sysadmin" "pavithra@sysadmin" "94460209997" "pavithra@sysadmin.in" "SYSTEM_ADMIN"
call :make_curl_request "pavithra.lead" "pavithra@lead" "94460209998" "pavithra@lead.in" "LEAD"
call :make_curl_request "getwithashish.sysadmin" "getwithashish@sysadmin" "94460209999" "getwithashish@sysadmin.in" "SYSTEM_ADMIN"
call :make_curl_request "getwithashish.lead" "getwithashish@lead" "94460209990" "getwithashish@lead.in" "LEAD"

:: Sign in
set "response="
for /f "delims=" %%i in ('curl --request POST --url http://%hostname%:8000/api/v1/user/signin --header "Content-Type: application/json" --header "User-Agent: insomnia/8.6.1" --data "{\"username\":\"getwithashish.sysadmin\",\"password\":\"getwithashish@sysadmin\"}"') do set "response=%%i"

for /f "delims=" %%i in ('echo %response% ^| %target_filename% -r ".access"') do set "access_token=%%i"

:: Create Laptop Asset Type
curl --request POST ^
  --url http://%hostname%:8000/api/v1/asset/asset_type ^
  --header "Authorization: Bearer %access_token%" ^
  --header "Content-Type: application/json" ^
  --data "{\"asset_type_name\": \"Laptop\"}"

:: Create Software Asset Type
curl --request POST ^
  --url http://%hostname%:8000/api/v1/asset/asset_type ^
  --header "Authorization: Bearer %access_token%" ^
  --header "Content-Type: application/json" ^
  --data "{\"asset_type_name\": \"Software\"}"

:: Create Location
curl --request POST ^
  --url http://%hostname%:8000/api/v1/asset/location ^
  --header "Authorization: Bearer %access_token%" ^
  --header "Content-Type: application/json" ^
  --data "{\"location_name\": \"Trivandrum\"}"

:: Create Business Unit
curl --request POST ^
  --url http://%hostname%:8000/api/v1/asset/business_unit ^
  --header "Authorization: Bearer %access_token%" ^
  --header "Content-Type: application/json" ^
  --data "{\"business_unit_name\":\"DU1\"}"

:: Create Memory
curl --request POST ^
  --url http://%hostname%:8000/api/v1/asset/memory_list ^
  --header "Authorization: Bearer %access_token%" ^
  --header "Content-Type: application/json" ^
  --data "{\"memory_space\": 20480}"

:: Create Employee
curl --request POST ^
  --url http://%hostname%:8000/api/v1/asset/employee ^
  --header "Authorization: Bearer %access_token%" ^
  --header "Content-Type: application/json" ^
  --header "User-Agent: insomnia/8.6.1" ^
  --data "{\"employee_name\": \"Mahesh\",\"employee_department\": \"DU3\",\"employee_designation\": \"Senior Lead\"}"

:: Create Asset
curl --request POST ^
  --url http://%hostname%:8000/api/v1/asset/ ^
  --header "Authorization: Bearer %access_token%" ^
  --header "Content-Type: application/json" ^
  --data "{\"asset_id\":\"91023\",\"version\":\"5\",\"asset_category\":\"HARDWARE\",\"asset_type\":\"1\",\"product_name\":\"HP Pavilion Yahoo Smart Glass\",\"model_number\":\"HPModel2423\",\"serial_number\":\"001234\",\"owner\":\"EXPERION\",\"custodian\":\"1\",\"date_of_purchase\":\"2024-02-20\",\"status\":\"STOCK\",\"warranty_period\":\"4\",\"location\":\"1\",\"invoice_location\":\"1\",\"business_unit\":\"1\",\"os\":\"WINDOWS\",\"os_version\":\"11\",\"memory\":\"\",\"configuration\":\"i5/8GB/256GB+SSD\",\"accessories\":\"bag,charger\",\"approval_status\":\"PENDING\",\"conceder\":\"1\",\"created_at\":\"20/02/24\",\"notes\":\"Asset laptop added\"}"

:: Remove jq
del "%target_filename%"
