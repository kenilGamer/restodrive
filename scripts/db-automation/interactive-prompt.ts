#!/usr/bin/env tsx

/**
 * Interactive Prompt for Database Configuration
 * 
 * This script provides an interactive CLI to create database configurations
 * without manually editing JSON files.
 * 
 * Usage:
 *   tsx scripts/db-automation/interactive-prompt.ts
 */

import * as readline from "readline"
import fs from "fs"
import path from "path"

interface Config {
  database: {
    name: string
    host?: string
    port?: number
    adminUser?: string
  }
  users: Array<{
    username: string
    password: string
    permissions?: string[]
    databases?: string[]
  }>
  tables: Array<{
    name: string
    schema?: string
    columns: Array<{
      name: string
      type: string
      default?: string
      constraints?: string[]
      nullable?: boolean
    }>
    indexes?: Array<{
      name: string
      columns: string[]
      unique?: boolean
      where?: string
    }>
  }>
  tasks: Array<{
    name: string
    type: "GRANT" | "REVOKE" | "CREATE_EXTENSION" | "CUSTOM"
    user?: string
    database?: string
    permissions?: string[]
    extension?: string
    sql?: string
  }>
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function promptDatabase(): Promise<Config["database"]> {
  console.log("\n📊 Database Configuration\n")
  
  const name = await question("Database name: ")
  const host = await question("Host (default: localhost): ") || "localhost"
  const portStr = await question("Port (default: 5432): ") || "5432"
  const adminUser = await question("Admin user (default: postgres): ") || "postgres"

  return {
    name,
    host,
    port: parseInt(portStr, 10),
    adminUser,
  }
}

async function promptUsers(): Promise<Config["users"]> {
  console.log("\n👤 User Configuration\n")
  
  const users: Config["users"] = []
  let addMore = true

  while (addMore) {
    const username = await question("Username: ")
    const password = await question("Password: ")
    const permissionsStr = await question("Permissions (comma-separated, default: CONNECT,CREATE,USAGE): ") || "CONNECT,CREATE,USAGE"
    const databasesStr = await question("Databases (comma-separated): ")

    users.push({
      username,
      password,
      permissions: permissionsStr.split(",").map((p) => p.trim()),
      databases: databasesStr ? databasesStr.split(",").map((d) => d.trim()) : [],
    })

    const continueStr = await question("\nAdd another user? (y/N): ")
    addMore = continueStr.toLowerCase() === "y"
  }

  return users
}

async function promptColumn(): Promise<Config["tables"][0]["columns"][0]> {
  const name = await question("  Column name: ")
  const type = await question("  Column type (e.g., VARCHAR(255), INTEGER, UUID): ")
  const defaultVal = await question("  Default value (optional, press Enter to skip): ") || undefined
  const constraintsStr = await question("  Constraints (comma-separated, e.g., PRIMARY KEY,NOT NULL): ") || ""
  const nullableStr = await question("  Nullable? (Y/n): ") || "y"

  return {
    name,
    type,
    default: defaultVal,
    constraints: constraintsStr ? constraintsStr.split(",").map((c) => c.trim()) : [],
    nullable: nullableStr.toLowerCase() !== "n",
  }
}

async function promptIndex(): Promise<Config["tables"][0]["indexes"]![0]> {
  const name = await question("  Index name: ")
  const columnsStr = await question("  Columns (comma-separated): ")
  const uniqueStr = await question("  Unique? (y/N): ") || "n"
  const where = await question("  WHERE clause (optional, press Enter to skip): ") || undefined

  return {
    name,
    columns: columnsStr.split(",").map((c) => c.trim()),
    unique: uniqueStr.toLowerCase() === "y",
    where,
  }
}

async function promptTable(): Promise<Config["tables"][0]> {
  console.log("\n📋 Table Configuration\n")
  
  const name = await question("Table name: ")
  const schema = await question("Schema (default: public): ") || "public"

  console.log("\nColumns:")
  const columns: Config["tables"][0]["columns"] = []
  let addMoreColumns = true

  while (addMoreColumns) {
    console.log(`\nColumn ${columns.length + 1}:`)
    const column = await promptColumn()
    columns.push(column)

    const continueStr = await question("\nAdd another column? (y/N): ")
    addMoreColumns = continueStr.toLowerCase() === "y"
  }

  const indexes: Config["tables"][0]["indexes"] = []
  const addIndexesStr = await question("\nAdd indexes? (y/N): ")
  if (addIndexesStr.toLowerCase() === "y") {
    let addMoreIndexes = true
    while (addMoreIndexes) {
      console.log(`\nIndex ${indexes.length + 1}:`)
      const index = await promptIndex()
      indexes.push(index)

      const continueStr = await question("\nAdd another index? (y/N): ")
      addMoreIndexes = continueStr.toLowerCase() === "y"
    }
  }

  return {
    name,
    schema,
    columns,
    indexes: indexes.length > 0 ? indexes : undefined,
  }
}

async function promptTables(): Promise<Config["tables"]> {
  console.log("\n📋 Tables Configuration\n")
  
  const tables: Config["tables"] = []
  let addMore = true

  while (addMore) {
    const table = await promptTable()
    tables.push(table)

    const continueStr = await question("\nAdd another table? (y/N): ")
    addMore = continueStr.toLowerCase() === "y"
  }

  return tables
}

async function main() {
  console.log("🚀 PostgreSQL Database Automation - Interactive Configuration\n")
  console.log("This will guide you through creating a database configuration file.\n")

  const config: Config = {
    database: await promptDatabase(),
    users: await promptUsers(),
    tables: await promptTables(),
    tasks: [], // Tasks can be added manually or in a future version
  }

  // Save configuration
  const outputPath = path.join(__dirname, "config.json")
  fs.writeFileSync(outputPath, JSON.stringify(config, null, 2), "utf-8")

  console.log(`\n✅ Configuration saved to: ${outputPath}`)
  console.log("\nNext steps:")
  console.log(`  1. Review the configuration: cat ${outputPath}`)
  console.log(`  2. Generate SQL: tsx generator.ts --config ${outputPath} --output setup.sql`)
  console.log(`  3. Execute SQL: psql -U postgres -f setup.sql`)

  rl.close()
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Error:", error)
    process.exit(1)
  })
}

