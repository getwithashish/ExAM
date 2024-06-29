# IT Asset Management Tool

## Overview

This project is a Django-based web application with a MySQL database, utilizing Celery for asynchronous task processing and Gunicorn for serving the application in a production environment. The project is containerized using Docker and has a frontend built with React and TypeScript using Vite and Yarn for production builds.

## Project Structure

```
.
├── exam_django
│   ├── ai
│   │   ├── clients
│   │   │   └── gemini_client
│   │   ├── config
│   │   ├── migrations
│   │   └── service
│   │       └── database_service
│   ├── asset
│   │   ├── migrations
│   │   ├── models
│   │   ├── serializers
│   │   ├── service
│   │   │   ├── asset_approve_service
│   │   │   │   └── lead_role_service
│   │   │   ├── asset_assign_service
│   │   │   ├── asset_count_service
│   │   │   ├── asset_crud_service
│   │   │   ├── asset_lifecycle_crud_service
│   │   │   ├── asset_log_crud_service
│   │   │   ├── asset_type_crud_service
│   │   │   ├── asset_unassign_service
│   │   │   ├── business_unit_crud_service
│   │   │   ├── data_import_service
│   │   │   ├── employee_crud_service
│   │   │   ├── export_service
│   │   │   ├── location_crud_service
│   │   │   └── memory_crud_service
│   │   ├── tests
│   │   └── views
│   ├── exam_django
│   ├── notification
│   │   ├── client
│   │   ├── config
│   │   ├── migrations
│   │   ├── service
│   │   └── utils
│   │       └── email_body_contents
│   ├── static
│   ├── user_auth
│   │   ├── migrations
│   │   └── tests
│   └── utils
└── exam_frontend
    ├── public
    │   ├── images
    │   │   ├── authentication
    │   │   ├── products
    │   │   └── users
    │   └── static
    └── src
        ├── Test
        │   ├── AssetTable
        │   ├── Charts
        │   ├── DrawerComponent
        │   ├── DropDown
        │   ├── Export
        │   ├── GlobalSearch
        │   └── RejectedAssetPage
        ├── components
        │   ├── AddAsset
        │   │   └── types
        │   ├── AssetTable
        │   │   ├── api
        │   │   └── types
        │   ├── AssignAsset
        │   │   ├── AssetTable
        │   │   │   ├── CardComponent
        │   │   │   │   └── types
        │   │   │   └── types
        │   │   └── Assign
        │   │       └── types
        │   ├── AutocompleteBox
        │   │   └── api
        │   ├── Avatar
        │   ├── CardComponent
        │   │   └── types
        │   ├── ChatBot
        │   ├── DashBoardCardComponent
        │   │   └── types
        │   ├── DashboardAssetTable
        │   │   └── types
        │   ├── Deallocate
        │   │   └── AssetTable
        │   │       ├── CardComponent
        │   │       │   └── types
        │   │       └── types
        │   ├── DrawerComponent
        │   │   └── types
        │   ├── DropDown
        │   ├── Export
        │   ├── GlobalSearch
        │   │   └── types
        │   ├── Navbar
        │   ├── NoData
        │   ├── QueryBuilder
        │   │   ├── api
        │   │   └── types
        │   ├── SideDrawerComponent
        │   │   └── types
        │   ├── TableNavBar
        │   │   └── types
        │   ├── TimelineLog
        │   │   └── api
        │   ├── Tooltip
        │   │   └── types
        │   ├── Upload
        │   ├── UserContext
        │   ├── charts
        │   │   ├── api
        │   │   ├── chartHandlers
        │   │   │   ├── PieChartHandlers
        │   │   │   └── types
        │   │   └── types
        │   └── sidebar
        │       └── types
        ├── config
        ├── layouts
        └── pages
            ├── ApprovedRequest
            ├── AssignAsset
            ├── Deallocate
            ├── ExpiredAssets
            ├── MyApprovals
            ├── PendingRequest
            ├── RejectedAssetPage
            ├── RequestPage
            ├── UpdatableAssetPage
            ├── authentication
            └── index
                └── types
```

## Prerequisites

- Docker and Docker Compose
- Python 3.10+
- Node.js 18.20+ and yarn
- MySQL

## Run using Docker

Profiles are used for running docker containers in different environments.

### For Development

> Note: **Add .env in exam_django with the configurations required for deploying in development environment**
>
> Note: **Add aad.config.json in exam_django with the corresponding configurations**
>
> Note: **Update .env in exam_frontend with the configurations required for deploying in development environment**

```bash
docker compose --profile development up
```

### For Stage

> Note: **Add .prod.env in exam_django with the configurations required for deploying in stage environment**
>
> Note: **Add aad.config.json in exam_django with the corresponding configurations**
>
> Note: **Update .env in exam_frontend with the configurations required for deploying in stage environment**

```bash
docker compose --profile stage up
```

## Backend Setup for Development

### Install Dependencies

```bash
cd exam_django
// Create python virtual environment
pip install -r requirements.txt
```

### Update Configurations in .env

```
// Dummy Values

DJANGO_SECRET_KEY=3r5@t!s6%j8(2)u@l*9z4&c%k1#s@9a7*
DEBUG_STATUS=True

DB_NAME=asset_management_database
DB_USER=my_user
DB_PORT=3306

DB_PASSWORD=my_password
DB_HOST=localhost

ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ORIGIN_WHITELIST=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173

CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

EMAIL_HOST_USER=myemail@gmail.com
EMAIL_HOST_PASSWORD=abcd efgh ijk lmno
EMAIL_PORT=587
EMAIL_USE_TLS=True

SENTRY_DSN=https://72b3f8d4d2e4a2fc56d0c00e2a94b82e@r6248150176033174.ingest.us.sentry.io/234723642389
HEALTH_CHECK_APP=http://localhost:8000/health/app/
HEALTH_CHECK_EXTERNAL=http://localhost:8000/health/external/

BACKUP_PARENT_DIR=backup
FULL_BACKUP_DIR=full_backup

GOOGLE_API_KEY=your_api_key

```

### Update configurations in aad.config.json

Change values of:

- client_id
- client_credential
- authority

```
// Dummy values

{
    "type": {
        "client_type": "CONFIDENTIAL",
        "authority_type": "SINGLE_TENANT",
        "framework": "DJANGO"
    },
    "client": {
        "client_id": "12312cab-2342342-df324-32434c",
        "client_credential": "kasjdflasjdf3ou.asdjf~sdf23i9",
        "authority": "https://login.microsoftonline.com/723ba763cdf2370238"
    },
    "auth_request": {
        "redirect_uri": null,
        "scopes": [],
        "response_type": "code"
    },
    "flask": null,
    "django": {
        "id_web_configs": "MS_ID_WEB_CONFIGS",
        "auth_endpoints": {
            "prefix": "auth",
            "sign_in": "sign_in",
            "edit_profile": "edit_profile",
            "redirect": "redirect",
            "sign_out": "sign_out",
            "post_sign_out": "post_sign_out"
        }
    }
}
```

### Migrations

```
python manage.py migrate
```

### Run Development Server

```
python manage.py runserver
```

The development server will be hosted on http://localhost:8000 by default.

### Celery Setup

#### Run Celery Worker

In another terminal,

```
celery -A exam_django worker --pool=solo --loglevel=info
```

#### Run Celery Beat

In another terminal,

```
celery -A exam_django beat --loglevel=info
```

## Frontend Setup for Development

### Install Dependencies

```
cd exam_frontend
yarn install
```

### Update Configurations in .env

```
// Dummy values

VITE_CONFIG_URL=http://localhost:8000/api/v1
VITE_ADD_ASSET_URL=http://localhost:8000/api/v1/asset/
VITE_LOGIN_URL=http://localhost:8000/auth/sign_in
VITE_GET_ASSET_TYPE=http://localhost:8000/api/v1/asset/asset_type
```

### Run Development Server

```
yarn dev
```

# Contribution

Feel free to open issues or pull requests if you find any bugs or have improvements.
