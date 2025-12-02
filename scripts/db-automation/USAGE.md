# Database Automation - Usage Guide

## Quick Reference

### Method 1: Interactive Prompt (Easiest)

```bash
npm run db:interactive
```

This will guide you through creating a configuration step-by-step.

### Method 2: Edit Config File

1. Copy template:
```bash
cp scripts/db-automation/config.template.json scripts/db-automation/config.json
```

2. Edit `config.json` with your parameters

3. Generate SQL:
```bash
npm run db:generate
```

4. Execute SQL:
```bash
psql -U postgres -f scripts/db-automation/generated_setup.sql
```

### Method 3: Quick Setup Script

```bash
npm run db:setup
```

This combines generation and execution in one step.

## Common Use Cases

### Create a New Database with One Table

**config.json:**
```json
{
  "database": { "name": "myapp_db" },
  "users": [
    {
      "username": "app_user",
      "password": "secure_password",
      "databases": ["myapp_db"]
    }
  ],
  "tables": [
    {
      "name": "users",
      "columns": [
        {
          "name": "id",
          "type": "UUID",
          "default": "gen_random_uuid()",
          "constraints": ["PRIMARY KEY"]
        },
        {
          "name": "email",
          "type": "VARCHAR(255)",
          "constraints": ["NOT NULL", "UNIQUE"]
        }
      ]
    }
  ]
}
```

### Add a New Table to Existing Database

Just add to the `tables` array in your config and regenerate:

```json
{
  "tables": [
    // ... existing tables ...
    {
      "name": "new_table",
      "columns": [...]
    }
  ]
}
```

### Create Multiple Users with Different Permissions

```json
{
  "users": [
    {
      "username": "admin_user",
      "password": "admin_pass",
      "permissions": ["ALL PRIVILEGES"],
      "databases": ["myapp_db"]
    },
    {
      "username": "readonly_user",
      "password": "readonly_pass",
      "permissions": ["CONNECT"],
      "databases": ["myapp_db"]
    }
  ]
}
```

## Tips for Reusability

1. **Use Variables**: For production, use environment variables:
   ```bash
   DATABASE_NAME=myapp_prod npm run db:generate
   ```

2. **Template Inheritance**: Create base config and extend:
   - `config.base.json` - Common structure
   - `config.dev.json` - Development overrides
   - `config.prod.json` - Production overrides

3. **Version Control**: Keep configs in git, but use `.gitignore` for sensitive data

4. **Documentation**: Add comments in your config (though JSON doesn't support comments, you can use a `_comment` field)

## Advanced: Programmatic Usage

```typescript
import { SQLGenerator, ConfigSchema } from './scripts/db-automation/generator'

// Load and validate config
const configData = JSON.parse(fs.readFileSync('config.json', 'utf-8'))
const config = ConfigSchema.parse(configData)

// Generate SQL
const generator = new SQLGenerator(config)
const sql = generator.generateCompleteSQL()

// Use the SQL as needed
console.log(sql)
```

## Troubleshooting

**Q: "tsx command not found"**
A: Install tsx: `npm install -g tsx` or use npx: `npx tsx ...`

**Q: "Permission denied" when executing SQL**
A: Make sure you're using a user with sufficient privileges (usually `postgres`)

**Q: "Table already exists"**
A: The generator uses `IF NOT EXISTS`, so it's safe to run multiple times. To recreate, drop first.

**Q: "Invalid JSON"**
A: Validate your JSON using a JSON validator or use the interactive prompt

