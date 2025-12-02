# PostgreSQL Database Automation

A reusable, efficient system for automating PostgreSQL database operations including table creation, user management, and custom tasks.

## Features

- ✅ **One-time configuration** - Define database structure once in JSON
- ✅ **Automatic SQL generation** - Generates complete SQL scripts
- ✅ **User management** - Create users with permissions
- ✅ **Table creation** - Define tables with columns, indexes, constraints
- ✅ **Custom tasks** - Execute grants, extensions, custom SQL
- ✅ **Reusable templates** - Easy to copy and modify for new projects
- ✅ **Type-safe** - Uses Zod for configuration validation

## Quick Start

### 1. Create Configuration File

Copy the template:
```bash
cp scripts/db-automation/config.template.json scripts/db-automation/config.json
```

### 2. Edit Configuration

Open `config.json` and fill in your parameters:

```json
{
  "database": {
    "name": "my_database"
  },
  "users": [
    {
      "username": "my_user",
      "password": "secure_password"
    }
  ],
  "tables": [
    {
      "name": "my_table",
      "columns": [
        {
          "name": "id",
          "type": "UUID",
          "default": "gen_random_uuid()",
          "constraints": ["PRIMARY KEY", "NOT NULL"]
        }
      ]
    }
  ]
}
```

### 3. Generate SQL

```bash
# Using tsx (recommended)
tsx scripts/db-automation/generator.ts --config scripts/db-automation/config.json --output setup.sql

# Or use the quick setup script
chmod +x scripts/db-automation/quick-setup.sh
./scripts/db-automation/quick-setup.sh
```

### 4. Execute SQL

```bash
psql -U postgres -f setup.sql
```

## Configuration Schema

### Database

```json
{
  "database": {
    "name": "database_name",
    "host": "localhost",        // optional
    "port": 5432,               // optional
    "adminUser": "postgres"     // optional
  }
}
```

### Users

```json
{
  "users": [
    {
      "username": "app_user",
      "password": "secure_password",
      "permissions": ["CONNECT", "CREATE", "USAGE"],
      "databases": ["my_database"]
    }
  ]
}
```

### Tables

```json
{
  "tables": [
    {
      "name": "table_name",
      "schema": "public",       // optional, default: "public"
      "columns": [
        {
          "name": "column_name",
          "type": "VARCHAR(255)",
          "default": "default_value",  // optional
          "constraints": ["NOT NULL"], // optional
          "nullable": false            // optional, default: true
        }
      ],
      "indexes": [              // optional
        {
          "name": "idx_name",
          "columns": ["column_name"],
          "unique": false,      // optional
          "where": "condition"  // optional
        }
      ]
    }
  ]
}
```

### Tasks

```json
{
  "tasks": [
    {
      "name": "grant_permissions",
      "type": "GRANT",
      "user": "app_user",
      "database": "my_database",
      "permissions": ["ALL PRIVILEGES"]
    },
    {
      "name": "create_extension",
      "type": "CREATE_EXTENSION",
      "extension": "uuid-ossp"
    },
    {
      "name": "custom_sql",
      "type": "CUSTOM",
      "sql": "ALTER TABLE my_table ADD COLUMN new_column TEXT;"
    }
  ]
}
```

## Examples

### Example 1: Simple Table

```json
{
  "database": { "name": "blog_db" },
  "tables": [
    {
      "name": "posts",
      "columns": [
        {
          "name": "id",
          "type": "SERIAL",
          "constraints": ["PRIMARY KEY"]
        },
        {
          "name": "title",
          "type": "VARCHAR(255)",
          "constraints": ["NOT NULL"]
        },
        {
          "name": "content",
          "type": "TEXT"
        },
        {
          "name": "created_at",
          "type": "TIMESTAMP",
          "default": "CURRENT_TIMESTAMP"
        }
      ]
    }
  ]
}
```

### Example 2: Table with Foreign Key

```json
{
  "tables": [
    {
      "name": "comments",
      "columns": [
        {
          "name": "id",
          "type": "UUID",
          "default": "gen_random_uuid()",
          "constraints": ["PRIMARY KEY"]
        },
        {
          "name": "post_id",
          "type": "UUID",
          "constraints": ["NOT NULL", "REFERENCES posts(id)"]
        },
        {
          "name": "author",
          "type": "VARCHAR(100)",
          "constraints": ["NOT NULL"]
        }
      ],
      "indexes": [
        {
          "name": "idx_comments_post_id",
          "columns": ["post_id"]
        }
      ]
    }
  ]
}
```

### Example 3: Multiple Environments

Create separate configs:

**config.dev.json:**
```json
{
  "database": { "name": "myapp_dev" },
  "users": [
    {
      "username": "dev_user",
      "password": "dev_password"
    }
  ]
}
```

**config.prod.json:**
```json
{
  "database": { "name": "myapp_prod" },
  "users": [
    {
      "username": "prod_user",
      "password": "secure_prod_password"
    }
  ]
}
```

Generate SQL for each:
```bash
tsx generator.ts --config config.dev.json --output setup-dev.sql
tsx generator.ts --config config.prod.json --output setup-prod.sql
```

## API Usage

You can also use the generator programmatically:

```typescript
import { SQLGenerator, ConfigSchema } from './scripts/db-automation/generator'

const config = ConfigSchema.parse({
  database: { name: "my_db" },
  tables: [
    {
      name: "users",
      columns: [
        { name: "id", type: "UUID", default: "gen_random_uuid()", constraints: ["PRIMARY KEY"] },
        { name: "email", type: "VARCHAR(255)", constraints: ["NOT NULL", "UNIQUE"] }
      ]
    }
  ]
})

const generator = new SQLGenerator(config)
const sql = generator.generateCompleteSQL()
console.log(sql)
```

## Common PostgreSQL Types

| Type | Description | Example |
|------|-------------|---------|
| `UUID` | UUID identifier | `UUID` |
| `VARCHAR(n)` | Variable length string | `VARCHAR(255)` |
| `TEXT` | Unlimited text | `TEXT` |
| `INTEGER` | 32-bit integer | `INTEGER` |
| `BIGINT` | 64-bit integer | `BIGINT` |
| `DECIMAL(p,s)` | Exact numeric | `DECIMAL(10, 2)` |
| `BOOLEAN` | True/false | `BOOLEAN` |
| `TIMESTAMP` | Date and time | `TIMESTAMP` |
| `DATE` | Date only | `DATE` |
| `JSONB` | JSON binary | `JSONB` |
| `TEXT[]` | Text array | `TEXT[]` |

## Tips

1. **Use templates**: Start with `config.template.json` and modify
2. **Version control**: Keep config files in git (but exclude passwords in production)
3. **Environment variables**: For production, use environment variables for passwords
4. **Test first**: Always test generated SQL on a development database first
5. **Backup**: Always backup before running setup scripts on production

## Troubleshooting

### "tsx not found"
Install tsx globally:
```bash
npm install -g tsx
```

Or use npx:
```bash
npx tsx scripts/db-automation/generator.ts --config config.json
```

### "Permission denied"
Make sure the PostgreSQL user has necessary permissions:
```sql
GRANT CREATE ON DATABASE my_database TO my_user;
```

### "Table already exists"
The generator uses `CREATE TABLE IF NOT EXISTS`, so existing tables won't be overwritten. To recreate, drop first:
```sql
DROP TABLE IF EXISTS table_name CASCADE;
```

## License

Part of the RestoDrive project.

