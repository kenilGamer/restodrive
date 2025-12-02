#!/usr/bin/env tsx

/**
 * Simple CLI wrapper for database automation
 * Provides easy-to-remember commands
 */

import { SQLGenerator, ConfigSchema } from "./generator"
import { z } from "zod"
import fs from "fs"
import path from "path"

const commands = {
  init: () => {
    const templatePath = path.join(__dirname, "config.template.json")
    const configPath = path.join(__dirname, "config.json")
    
    if (fs.existsSync(configPath)) {
      console.log("⚠️  config.json already exists. Use --force to overwrite.")
      return
    }
    
    fs.copyFileSync(templatePath, configPath)
    console.log("✅ Created config.json from template")
    console.log(`📝 Edit: ${configPath}`)
  },
  
  generate: (output?: string) => {
    const configPath = path.join(__dirname, "config.json")
    const outputPath = output || path.join(__dirname, "generated_setup.sql")
    
    if (!fs.existsSync(configPath)) {
      console.log("❌ config.json not found. Run 'init' first.")
      process.exit(1)
    }
    
    const configContent = fs.readFileSync(configPath, "utf-8")
    const config = ConfigSchema.parse(JSON.parse(configContent))
    const generator = new SQLGenerator(config)
    const sql = generator.generateCompleteSQL()
    
    fs.writeFileSync(outputPath, sql, "utf-8")
    console.log(`✅ SQL generated: ${outputPath}`)
    console.log(`📊 Summary:`)
    console.log(`   - Database: ${config.database.name}`)
    console.log(`   - Tables: ${config.tables?.length || 0}`)
    console.log(`   - Users: ${config.users?.length || 0}`)
    console.log(`   - Tasks: ${config.tasks?.length || 0}`)
  },
  
  validate: () => {
    const configPath = path.join(__dirname, "config.json")
    
    if (!fs.existsSync(configPath)) {
      console.log("❌ config.json not found")
      process.exit(1)
    }
    
    try {
      const configContent = fs.readFileSync(configPath, "utf-8")
      const config = ConfigSchema.parse(JSON.parse(configContent))
      console.log("✅ Configuration is valid!")
      console.log(`📊 Database: ${config.database.name}`)
      console.log(`📋 Tables: ${config.tables?.length || 0}`)
      console.log(`👤 Users: ${config.users?.length || 0}`)
    } catch (error: unknown) {
      console.log("❌ Configuration validation failed:")
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          console.log(`   - ${issue.path.join(".")}: ${issue.message}`)
        })
      } else if (error instanceof Error) {
        console.log(`   ${error.message}`)
      } else {
        console.log(`   Unknown error occurred`)
      }
      process.exit(1)
    }
  },
  
  help: () => {
    console.log(`
🚀 PostgreSQL Database Automation CLI

Commands:
  init              Create config.json from template
  generate [file]   Generate SQL script (default: generated_setup.sql)
  validate          Validate config.json
  help              Show this help message

Examples:
  npm run db:init
  npm run db:generate
  npm run db:generate setup.sql
  npm run db:validate

For interactive mode:
  npm run db:interactive
`)
  }
}

function main() {
  const args = process.argv.slice(2)
  const command = args[0] || "help"
  
  switch (command) {
    case "init":
      commands.init()
      break
    case "generate":
      commands.generate(args[1])
      break
    case "validate":
      commands.validate()
      break
    case "help":
    case "--help":
    case "-h":
      commands.help()
      break
    default:
      console.log(`❌ Unknown command: ${command}`)
      commands.help()
      process.exit(1)
  }
}

if (require.main === module) {
  main()
}

