#!/bin/bash

# Check if hostname argument is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <hostname>"
    exit 1
fi

hostname=$1

target_filename="jq"

curl -L -o "$target_filename" "https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-linux64"

chmod +x "$target_filename"

make_curl_request() {
    local username="$1"
    local password="$2"
    local mobile="$3"
    local email="$4"
    local scope="$5"
    

    curl --request POST \
      --url "http://$hostname:8000/api/v1/user/register" \
      --header 'Content-Type: application/json' \
      --header 'User-Agent: insomnia/8.6.1' \
      --data "{
        \"username\":\"$username\",
        \"password\":\"$password\",
        \"email\":\"$email\",
        \"mobile\": \"$mobile\",
        \"user_scope\": \"$scope\"
    }"
}

# Sign up
make_curl_request "aidrin.sysadmin" "aidrin@sysadmin" "94460209991" "aidrin@sysadmin.in" "SYSTEM_ADMIN"
make_curl_request "aidrin.lead" "aidrin@lead" "94460209992" "aidrin@lead.in" "LEAD"
make_curl_request "ananthan.sysadmin" "ananthan@sysadmin" "94460209993" "ananthan@sysadmin.in" "SYSTEM_ADMIN"
make_curl_request "ananthan.lead" "ananthan@lead" "94460209994" "ananthan@lead.in" "LEAD"
make_curl_request "asima.sysadmin" "asima@sysadmin" "94460209995" "asima@sysadmin.in" "SYSTEM_ADMIN"
make_curl_request "asima.lead" "asima@lead" "94460209996" "asima@lead.in" "LEAD"
make_curl_request "pavithra.sysadmin" "pavithra@sysadmin" "94460209997" "pavithra@sysadmin.in" "SYSTEM_ADMIN"
make_curl_request "pavithra.lead" "pavithra@lead" "94460209998" "pavithra@lead.in" "LEAD"
make_curl_request "getwirhashish.sysadmin" "getwithashish@sysadmin" "94460209999" "getwithashish@sysadmin.in" "SYSTEM_ADMIN"
make_curl_request "getwithashish.lead" "getwithashish@lead" "94460209990" "getwithashish@lead.in" "LEAD"

# Sign in
response=$(curl --request POST \
  --url http://$hostname:8000/api/v1/user/signin \
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
  --url http://$hostname:8000/api/v1/asset/asset_type \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data '{
	"asset_type_name": "Laptop"
}'

# Create Software Asset Type
curl --request POST \
  --url http://$hostname:8000/api/v1/asset/asset_type \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data '{
	"asset_type_name": "Software"
}'

# Create Location
curl --request POST \
  --url http://$hostname:8000/api/v1/asset/location \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data '{
"location_name": "Trivandrum"
}'

# Create Business Unit
curl --request POST \
  --url http://$hostname:8000/api/v1/asset/business_unit \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data '{
    "business_unit_name":"DU1"
}'

# Create Memory
curl --request POST \
  --url http://$hostname:8000/api/v1/asset/memory_list \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data '{
	"memory_space": 20480
}'

# Create Employee
curl --request POST \
  --url http://$hostname:8000/api/v1/asset/employee \
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
  --url http://$hostname:8000/api/v1/asset/ \
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

rm "$target_filename"
