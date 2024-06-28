#!/bin/bash

# Sign up
curl --request POST \
  --url http://localhost:8000/api/v1/user/register \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.6.1' \
  --data '{
    "username":"getwithashish.sysadmin",
    "password":"getwithashish@sysadmin",
    "email":"getwithashish@sysadmin.in",
    "mobile": "94460209999",
    "user_scope": "SYSTEM_ADMIN"
}'

# Sign in
response=$(curl --request POST \
  --url http://localhost:8000/api/v1/user/signin \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.6.1' \
  --data '{
    "username":"getwithashish.sysadmin",
    "password":"getwithashish@sysadmin"
}')

access_token=$(echo $response | ./jq -r '.access')

if ! command -v ./jq &> /dev/null
then
    echo "jq could not be found. Please install it to continue."
    exit
fi

# Create Laptop Asset Type
curl --request POST \
  --url http://localhost:8000/api/v1/asset/asset_type \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data '{
	"asset_type_name": "Laptop"
}'

# Create Software Asset Type
curl --request POST \
  --url http://localhost:8000/api/v1/asset/asset_type \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data '{
	"asset_type_name": "Software"
}'

# Create Location
curl --request POST \
  --url http://localhost:8000/api/v1/asset/location \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data '{
"location_name": "Trivandrum"
}'

# Create Business Unit
curl --request POST \
  --url http://localhost:8000/api/v1/asset/business_unit \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data '{
    "business_unit_name":"DU1"
}'

# Create Memory
curl --request POST \
  --url http://localhost:8000/api/v1/asset/memory_list \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data '{
	"memory_space": 20480
}'

# Create Employee
curl --request POST \
  --url http://localhost:8000/api/v1/asset/employee \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.6.1' \
  --data '{
			"employee_name": "Mahesh",
			"employee_department": "DU3",
			"employee_designation": "Senior Lead"
		}'

# Create Asset
curl --request POST \
  --url http://localhost:8000/api/v1/asset/ \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data '{
  "asset_id":"91023",
   "version":"5",
   "asset_category":"HARDWARE",
   "asset_type":"1",
   "product_name":"HP Pavilion Yahoo Smart Glass",
    "model_number" :"HPModel2423",
    "serial_number":"001234",
    "owner":"EXPERION",
    "custodian":"1",
    "date_of_purchase":"2024-02-20" ,
     "status":"IN STORE",
      "warranty_period":"4",
        "location":"1", 
        "invoice_location":"1",
				"business_unit": "1",
             "os":"WINDOWS",
             "os_version":"11",
							"memory": "",
               "configuration":"i5/8GB/256GB+SSD",
                "accessories":"bag,charger",
                 "approval_status":"PENDING",
						"conceder": "1",
                  "created_at":"20/02/24",
                  "notes":"Asset laptop added"
}
'
