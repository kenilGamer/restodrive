# PostgreSQL Database Automation - Prompt Template

Use this template to quickly generate database configurations. Copy the template below and fill in your parameters.

## Quick Start Template

```json
{
  "database": {
    "name": "YOUR_DATABASE_NAME",
    "host": "localhost",
    "port": 5432,
    "adminUser": "postgres"
  },
  "users": [
    {
      "username": "YOUR_USERNAME",
      "password": "YOUR_SECURE_PASSWORD",
      "permissions": ["CONNECT", "CREATE", "USAGE"],
      "databases": ["YOUR_DATABASE_NAME"]
    }
  ],
  "tables": [
    {
      "name": "YOUR_TABLE_NAME",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "type": "UUID",
          "default": "gen_random_uuid()",
          "constraints": ["PRIMARY KEY", "NOT NULL"]
        },
        {
          "name": "name",
          "type": "VARCHAR(255)",
          "constraints": ["NOT NULL"]
        },
        {
          "name": "created_at",
          "type": "TIMESTAMP",
          "default": "CURRENT_TIMESTAMP",
          "constraints": ["NOT NULL"]
        }
      ],
      "indexes": [
        {
          "name": "idx_YOUR_TABLE_NAME_created_at",
          "columns": ["created_at"],
          "unique": false
        }
      ]
    }
  ],
  "tasks": []
}
```

## Common Column Types Reference

- **UUID**: `UUID` (with `gen_random_uuid()` default)
- **String**: `VARCHAR(255)`, `TEXT`
- **Integer**: `INTEGER`, `BIGINT`, `SMALLINT`
- **Decimal**: `DECIMAL(10, 2)`, `NUMERIC(10, 2)`
- **Boolean**: `BOOLEAN`
- **Date/Time**: `TIMESTAMP`, `DATE`, `TIME`
- **JSON**: `JSONB`, `JSON`
- **Array**: `TEXT[]`, `INTEGER[]`

## Common Constraints

- `PRIMARY KEY`
- `NOT NULL`
- `UNIQUE`
- `CHECK (condition)`
- `REFERENCES table(column)` (Foreign Key)

## Example: Complete Restaurant Table

```json
{
  "name": "restaurants",
  "schema": "public",
  "columns": [
    {
      "name": "id",
      "type": "UUID",
      "default": "gen_random_uuid()",
      "constraints": ["PRIMARY KEY", "NOT NULL"]
    },
    {
      "name": "name",
      "type": "VARCHAR(255)",
      "constraints": ["NOT NULL"]
    },
    {
      "name": "slug",
      "type": "VARCHAR(255)",
      "constraints": ["NOT NULL", "UNIQUE"]
    },
    {
      "name": "email",
      "type": "VARCHAR(255)",
      "constraints": ["NOT NULL", "UNIQUE"]
    },
    {
      "name": "phone",
      "type": "VARCHAR(20)"
    },
    {
      "name": "address",
      "type": "TEXT"
    },
    {
      "name": "is_active",
      "type": "BOOLEAN",
      "default": "true",
      "constraints": ["NOT NULL"]
    },
    {
      "name": "created_at",
      "type": "TIMESTAMP",
      "default": "CURRENT_TIMESTAMP",
      "constraints": ["NOT NULL"]
    },
    {
      "name": "updated_at",
      "type": "TIMESTAMP",
      "default": "CURRENT_TIMESTAMP",
      "constraints": ["NOT NULL"]
    }
  ],
  "indexes": [
    {
      "name": "idx_restaurants_slug",
      "columns": ["slug"],
      "unique": true
    },
    {
      "name": "idx_restaurants_email",
      "columns": ["email"],
      "unique": true
    },
    {
      "name": "idx_restaurants_created_at",
      "columns": ["created_at"],
      "unique": false
    }
  ]
}
```

## Usage Instructions

1. **Create a config file**: Copy `config.template.json` to `config.json`
2. **Fill in your parameters**: Edit the JSON with your database name, users, tables, etc.
3. **Generate SQL**: Run `tsx scripts/db-automation/generator.ts --config config.json --output setup.sql`
4. **Execute SQL**: Run `psql -U postgres -f setup.sql` or use your preferred PostgreSQL client

## Advanced: Multiple Environments

Create separate config files for different environments:

- `config.dev.json` - Development database
- `config.staging.json` - Staging database
- `config.prod.json` - Production database

Then generate SQL for each:
```bash
tsx scripts/db-automation/generator.ts --config config.dev.json --output setup-dev.sql
tsx scripts/db-automation/generator.ts --config config.staging.json --output setup-staging.sql
tsx scripts/db-automation/generator.ts --config config.prod.json --output setup-prod.sql
```

