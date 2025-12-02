#!/usr/bin/env tsx

/**
 * PostgreSQL Database Automation Generator
 * 
 * This script generates SQL commands from a configuration file,
 * allowing you to define database operations once and reuse them.
 * 
 * Usage:
 *   tsx scripts/db-automation/generator.ts --config config.json --output output.sql
 *   tsx scripts/db-automation/generator.ts --interactive
 */

import fs from "fs"
import path from "path"
import { z } from "zod"

// Configuration Schema
const ColumnSchema = z.object({
  name: z.string(),
  type: z.string(),
  default: z.string().optional(),
  constraints: z.array(z.string()).optional(),
  nullable: z.boolean().optional().default(true),
})

const IndexSchema = z.object({
  name: z.string(),
  columns: z.array(z.string()),
  unique: z.boolean().optional().default(false),
  where: z.string().optional(),
})

const TableSchema = z.object({
  name: z.string(),
  schema: z.string().optional().default("public"),
  columns: z.array(ColumnSchema),
  indexes: z.array(IndexSchema).optional().default([]),
  constraints: z.array(z.string()).optional().default([]),
})

const UserSchema = z.object({
  username: z.string(),
  password: z.string(),
  permissions: z.array(z.string()).optional().default([]),
  databases: z.array(z.string()).optional().default([]),
})

const TaskSchema = z.object({
  name: z.string(),
  type: z.enum(["GRANT", "REVOKE", "CREATE_EXTENSION", "CUSTOM"]),
  user: z.string().optional(),
  database: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  extension: z.string().optional(),
  sql: z.string().optional(),
})

const ConfigSchema = z.object({
  database: z.object({
    name: z.string(),
    host: z.string().optional().default("localhost"),
    port: z.number().optional().default(5432),
    adminUser: z.string().optional().default("postgres"),
  }),
  users: z.array(UserSchema).optional().default([]),
  tables: z.array(TableSchema).optional().default([]),
  tasks: z.array(TaskSchema).optional().default([]),
})

type Config = z.infer<typeof ConfigSchema>
type Table = z.infer<typeof TableSchema>
type Column = z.infer<typeof ColumnSchema>
type User = z.infer<typeof UserSchema>
type Task = z.infer<typeof TaskSchema>

class SQLGenerator {
  private config: Config

  constructor(config: Config) {
    this.config = config
  }

  /**
   * Generate CREATE DATABASE statement
   */
  generateCreateDatabase(): string {
    const { name } = this.config.database
    return `-- Create Database
CREATE DATABASE ${this.escapeIdentifier(name)};
\\c ${this.escapeIdentifier(name)}

`
  }

  /**
   * Generate CREATE USER statements
   */
  generateCreateUsers(): string {
    if (!this.config.users || this.config.users.length === 0) {
      return ""
    }

    let sql = "-- Create Users\n"
    
    for (const user of this.config.users) {
      sql += `CREATE USER ${this.escapeIdentifier(user.username)} WITH PASSWORD '${this.escapeString(user.password)}';\n`
      
      if (user.databases && user.databases.length > 0) {
        for (const db of user.databases) {
          sql += `GRANT CONNECT ON DATABASE ${this.escapeIdentifier(db)} TO ${this.escapeIdentifier(user.username)};\n`
        }
      }
    }

    return sql + "\n"
  }

  /**
   * Generate CREATE TABLE statements
   */
  generateCreateTables(): string {
    if (!this.config.tables || this.config.tables.length === 0) {
      return ""
    }

    let sql = "-- Create Tables\n"
    
    for (const table of this.config.tables) {
      sql += this.generateTableSQL(table)
    }

    return sql
  }

  /**
   * Generate SQL for a single table
   */
  private generateTableSQL(table: Table): string {
    const schemaPrefix = table.schema ? `${this.escapeIdentifier(table.schema)}.` : ""
    let sql = `\n-- Table: ${schemaPrefix}${this.escapeIdentifier(table.name)}\n`
    sql += `CREATE TABLE IF NOT EXISTS ${schemaPrefix}${this.escapeIdentifier(table.name)} (\n`

    const columnDefs = table.columns.map((col, index) => {
      let def = `  ${this.escapeIdentifier(col.name)} ${col.type}`
      
      if (col.default) {
        def += ` DEFAULT ${col.default}`
      }
      
      const constraints = col.constraints || []
      if (!col.nullable && !constraints.includes("NOT NULL")) {
        constraints.push("NOT NULL")
      }
      
      if (constraints.length > 0) {
        def += ` ${constraints.join(" ")}`
      }
      
      return def
    })

    sql += columnDefs.join(",\n")
    sql += "\n);\n"

    // Generate indexes
    if (table.indexes && table.indexes.length > 0) {
      sql += "\n"
      for (const index of table.indexes) {
        const unique = index.unique ? "UNIQUE " : ""
        const whereClause = index.where ? ` WHERE ${index.where}` : ""
        sql += `CREATE ${unique}INDEX IF NOT EXISTS ${this.escapeIdentifier(index.name)} ON ${schemaPrefix}${this.escapeIdentifier(table.name)} (${index.columns.map(c => this.escapeIdentifier(c)).join(", ")})${whereClause};\n`
      }
    }

    // Grant permissions to users
    if (this.config.users && this.config.users.length > 0) {
      sql += "\n"
      for (const user of this.config.users) {
        sql += `GRANT ALL PRIVILEGES ON TABLE ${schemaPrefix}${this.escapeIdentifier(table.name)} TO ${this.escapeIdentifier(user.username)};\n`
      }
    }

    return sql + "\n"
  }

  /**
   * Generate task SQL statements
   */
  generateTasks(): string {
    if (!this.config.tasks || this.config.tasks.length === 0) {
      return ""
    }

    let sql = "-- Custom Tasks\n"
    
    for (const task of this.config.tasks) {
      sql += `\n-- Task: ${task.name}\n`
      sql += this.generateTaskSQL(task)
    }

    return sql + "\n"
  }

  /**
   * Generate SQL for a single task
   */
  private generateTaskSQL(task: Task): string {
    switch (task.type) {
      case "GRANT":
        if (!task.user || !task.database || !task.permissions) {
          return "-- Error: GRANT task requires user, database, and permissions\n"
        }
        const perms = task.permissions.join(", ")
        return `GRANT ${perms} ON DATABASE ${this.escapeIdentifier(task.database)} TO ${this.escapeIdentifier(task.user)};\n`

      case "REVOKE":
        if (!task.user || !task.database || !task.permissions) {
          return "-- Error: REVOKE task requires user, database, and permissions\n"
        }
        const revokePerms = task.permissions.join(", ")
        return `REVOKE ${revokePerms} ON DATABASE ${this.escapeIdentifier(task.database)} FROM ${this.escapeIdentifier(task.user)};\n`

      case "CREATE_EXTENSION":
        if (!task.extension) {
          return "-- Error: CREATE_EXTENSION task requires extension name\n"
        }
        return `CREATE EXTENSION IF NOT EXISTS ${this.escapeIdentifier(task.extension)};\n`

      case "CUSTOM":
        if (!task.sql) {
          return "-- Error: CUSTOM task requires sql field\n"
        }
        return task.sql + "\n"

      default:
        return `-- Unknown task type: ${task.type}\n`
    }
  }

  /**
   * Generate complete SQL script
   */
  generateCompleteSQL(): string {
    let sql = `-- PostgreSQL Database Automation Script
-- Generated: ${new Date().toISOString()}
-- Database: ${this.config.database.name}

-- ============================================
-- DATABASE SETUP
-- ============================================

${this.generateCreateDatabase()}

-- ============================================
-- USERS
-- ============================================

${this.generateCreateUsers()}

-- ============================================
-- TABLES
-- ============================================

${this.generateCreateTables()}

-- ============================================
-- TASKS
-- ============================================

${this.generateTasks()}

-- ============================================
-- COMPLETED
-- ============================================
`

    return sql
  }

  /**
   * Escape SQL identifier
   */
  private escapeIdentifier(identifier: string): string {
    // Simple escaping - wrap in double quotes if needed
    if (/^[a-z_][a-z0-9_]*$/i.test(identifier)) {
      return identifier
    }
    return `"${identifier.replace(/"/g, '""')}"`
  }

  /**
   * Escape SQL string
   */
  private escapeString(str: string): string {
    return str.replace(/'/g, "''")
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2)
  const configIndex = args.indexOf("--config")
  const outputIndex = args.indexOf("--output")
  const interactive = args.includes("--interactive")

  if (interactive) {
    runInteractiveMode()
    return
  }

  if (configIndex === -1 || !args[configIndex + 1]) {
    console.error("Usage: tsx generator.ts --config <config.json> [--output <output.sql>]")
    console.error("   or: tsx generator.ts --interactive")
    process.exit(1)
  }

  const configPath = args[configIndex + 1]
  const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : "output.sql"

  try {
    // Read and parse config
    const configContent = fs.readFileSync(configPath, "utf-8")
    const configData = JSON.parse(configContent)
    const config = ConfigSchema.parse(configData)

    // Generate SQL
    const generator = new SQLGenerator(config)
    const sql = generator.generateCompleteSQL()

    // Write output
    fs.writeFileSync(outputPath, sql, "utf-8")
    console.log(`✅ SQL script generated successfully: ${outputPath}`)
    console.log(`📊 Generated:`)
    console.log(`   - ${config.tables?.length || 0} tables`)
    console.log(`   - ${config.users?.length || 0} users`)
    console.log(`   - ${config.tasks?.length || 0} tasks`)

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.error("❌ Validation errors:")
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`)
      })
    } else if (error instanceof Error) {
      console.error("❌ Error:", error.message)
    } else {
      console.error("❌ Unknown error occurred")
    }
    process.exit(1)
  }
}

// Interactive mode for quick setup
function runInteractiveMode() {
  console.log("🔧 PostgreSQL Database Automation - Interactive Mode\n")
  console.log("This will guide you through creating a database configuration.\n")

  // Simple interactive prompts (in a real scenario, you'd use readline or inquirer)
  console.log("Interactive mode requires a configuration file.")
  console.log("Please create a config.json file using the template:")
  console.log("  cp scripts/db-automation/config.template.json config.json")
  console.log("\nThen edit config.json with your parameters and run:")
  console.log("  tsx scripts/db-automation/generator.ts --config config.json")
}

if (require.main === module) {
  main()
}

export { SQLGenerator, ConfigSchema }

