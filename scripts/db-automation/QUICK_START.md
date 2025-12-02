# Quick Start Guide

## 🚀 Fastest Way to Get Started

### Option 1: Interactive Mode (Recommended for First Time)

```bash
npm run db:interactive
```

Follow the prompts to create your configuration automatically.

### Option 2: Use Template

1. **Copy the template:**
   ```bash
   cp scripts/db-automation/config.template.json scripts/db-automation/config.json
   ```

2. **Edit `config.json`** with your parameters (see examples below)

3. **Generate SQL:**
   ```bash
   npm run db:generate
   ```

4. **Execute SQL:**
   ```bash
   psql -U postgres -f scripts/db-automation/generated_setup.sql
   ```

## 📝 Minimal Example

Create `scripts/db-automation/config.json`:

```json
{
  "database": {
    "name": "my_database"
  },
  "users": [
    {
      "username": "my_user",
      "password": "my_password",
      "databases": ["my_database"]
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

Then run:
```bash
npm run db:generate
psql -U postgres -f scripts/db-automation/generated_setup.sql
```

## 🎯 Common Scenarios

### Scenario 1: New Project Setup

```json
{
  "database": { "name": "project_db" },
  "users": [
    {
      "username": "app_user",
      "password": "app_password",
      "databases": ["project_db"]
    }
  ],
  "tables": []
}
```

### Scenario 2: Add Tables to Existing Database

Just add to the `tables` array - the generator uses `IF NOT EXISTS` so it's safe to run multiple times.

### Scenario 3: Create Multiple Environments

- `config.dev.json` → `setup-dev.sql`
- `config.prod.json` → `setup-prod.sql`

Generate each separately:
```bash
tsx scripts/db-automation/generator.ts --config config.dev.json --output setup-dev.sql
tsx scripts/db-automation/generator.ts --config config.prod.json --output setup-prod.sql
```

## 💡 Pro Tips

1. **Reuse Configs**: Save your configs as templates for future projects
2. **Version Control**: Commit config templates, but use `.gitignore` for actual configs with passwords
3. **Environment Variables**: For production, consider using env vars for sensitive data
4. **Test First**: Always test on dev/staging before production

## 📚 More Information

- See `README.md` for full documentation
- See `prompt-template.md` for configuration templates
- See `USAGE.md` for detailed usage examples

