# Mock scripts for CRM Example API [DEPRECATED]

## DEPRECATED

These scripts are currently deprecated and are replaced by the local ExpressJS server / Postgres database for local development.

The scripts are kept as reference until no longer needed.

## Description

These javascript files contains functions that can be used to mock the CRM Example API endpoints locally.
## Database

The mock 'database' is stored in a JSON string within the localStorage of the user's browser.

Each record takes the form a JSON object, with a generated property name/key acting as the primary key.

You can convert the 'table' into an array via the `Object.values()` native javascript method.

This mock solution is not intended for production usage nor any usage that requires a lot of data. The localStorage solution has a maximum size of 5MB and is synchronous blocking javascript.

### Format / Schema

Note: Subject to change.

```json
{
  "users": { // Users 'table'
    "user_id": { // Primary key
      "email": "string",
      "key": "primary key",
      "date_created": 000, // Number - Unix timestamp
      "date_modified": 000, // Number - Unix timestamp
    }
  },
  "contacts": { // Contacts 'table'.
    "contact_id": { // Primary key
      "name": "string",
      "email": "string",
      "phone": "string",
      "notes": "string",
      "archived": false, // Boolean
      "user_id": "Foreign key of the user who owns this contact",
      "key": "primary key",
      "date_created": 000, // Number - Unix timestamp,
      "date_modified": 000, // Number - Unix timestamp
    }
  },
  "tasks": { // Tasks 'table'.
    "task_id": { // Primary key
      "title": "string",
      "due_date": 0,  // Number - Unix timestamp (optional)
      "notes": "string",
      "contact_id": "Foreign key associated with a contact (optional)",
      "user_id": "Foreign key of the user who owns this contact",
      "key": "primary key",
      "date_created": 000, // Number - Unix timestamp,
      "date_modified": 000, // Number - Unix timestamp
    }
  }
}
```

Other fields may be present but can be ignored.

### Example

```json
{
  "users": {
    "04985203438566834": {
      "email": "test@test",
      "key": "04985203438566834",
      "date_created": 1705285723430,
      "date_modified": 1705285723430
    }
  },
  "contacts": {
    "0882811156379298": {
      "name": "Test1234",
      "email": "test@test2",
      "phone": null,
      "notes": "A test contact",
      "archived": false,
      "user_id": "04985203438566834",
      "key": "0882811156379298",
      "date_created": 1705285729851,
      "date_modified": 1705526150651
    }
  },
  "tasks": {
    "016837566084146594": {
      "autoContact": null, // Note - this was from the client side and can be ignored.
      "title": "test activity",
      "due_date": 0,
      "notes": null,
      "contact_id": "0007621839444483802",
      "user_id": "04985203438566834",
      "key": "016837566084146594",
      "date_created": 1705290631962,
      "date_modified": 1705290631962
    }
  }
}
```

## Responses

The mock responses generally take the form of a JSON object:

```json
{
  "statusCode": 200, // HTTP status code
  "ok": true, // True or false whether the response is good.
  "message": "Test" // Optional message of the response
  // As well as other data in the object.
}
```
