# Example Prompt Template

Copy and paste this prompt, fill in your parameters, and you're done!

## 🎯 Copy-Paste Template

```json
{
  "database": {
    "name": "YOUR_DATABASE_NAME_HERE",
    "host": "localhost",
    "port": 5432,
    "adminUser": "postgres"
  },
  "users": [
    {
      "username": "YOUR_USERNAME_HERE",
      "password": "YOUR_PASSWORD_HERE",
      "permissions": ["CONNECT", "CREATE", "USAGE"],
      "databases": ["YOUR_DATABASE_NAME_HERE"]
    }
  ],
  "tables": [
    {
      "name": "YOUR_TABLE_NAME_HERE",
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

## 📋 Step-by-Step Instructions

1. **Replace these placeholders:**
   - `YOUR_DATABASE_NAME_HERE` → Your database name
   - `YOUR_USERNAME_HERE` → Your PostgreSQL username
   - `YOUR_PASSWORD_HERE` → Your secure password
   - `YOUR_TABLE_NAME_HERE` → Your table name

2. **Add more columns** by copying the column object and modifying

3. **Add more tables** by copying the table object and modifying

4. **Save as** `scripts/db-automation/config.json`

5. **Run:**
   ```bash
   npm run db:generate
   ```

6. **Execute:**
   ```bash
   psql -U postgres -f scripts/db-automation/generated_setup.sql
   ```

## 🔄 Reusing for New Projects

1. Copy your working `config.json`
2. Change database name, usernames, table names
3. Run `npm run db:generate`
4. Done! ✨

No need to write SQL manually ever again!

