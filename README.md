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

