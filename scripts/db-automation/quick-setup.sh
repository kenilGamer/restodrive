#!/bin/bash

# PostgreSQL Quick Setup Script
# This script provides a quick way to set up databases using the automation generator

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 PostgreSQL Database Automation - Quick Setup${NC}\n"

# Check if config file exists
if [ ! -f "$SCRIPT_DIR/config.json" ]; then
    echo -e "${YELLOW}⚠️  Config file not found. Creating from template...${NC}"
    cp "$SCRIPT_DIR/config.template.json" "$SCRIPT_DIR/config.json"
    echo -e "${GREEN}✅ Created config.json. Please edit it with your parameters.${NC}\n"
    echo -e "Edit the file: ${BLUE}$SCRIPT_DIR/config.json${NC}"
    exit 0
fi

# Generate SQL
echo -e "${BLUE}📝 Generating SQL script...${NC}"
OUTPUT_FILE="$SCRIPT_DIR/generated_setup.sql"

if command -v tsx &> /dev/null; then
    tsx "$SCRIPT_DIR/generator.ts" --config "$SCRIPT_DIR/config.json" --output "$OUTPUT_FILE"
elif command -v ts-node &> /dev/null; then
    ts-node "$SCRIPT_DIR/generator.ts" --config "$SCRIPT_DIR/config.json" --output "$OUTPUT_FILE"
else
    echo -e "${RED}❌ Error: tsx or ts-node not found. Please install:${NC}"
    echo -e "   npm install -g tsx"
    echo -e "   or"
    echo -e "   npm install -g ts-node typescript"
    exit 1
fi

echo -e "\n${GREEN}✅ SQL script generated: $OUTPUT_FILE${NC}\n"

# Ask if user wants to execute
read -p "Do you want to execute this SQL script? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "PostgreSQL admin user (default: postgres): " PGUSER
    PGUSER=${PGUSER:-postgres}
    
    read -p "PostgreSQL host (default: localhost): " PGHOST
    PGHOST=${PGHOST:-localhost}
    
    read -p "PostgreSQL port (default: 5432): " PGPORT
    PGPORT=${PGPORT:-5432}
    
    echo -e "\n${YELLOW}⚠️  Executing SQL script...${NC}"
    psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -f "$OUTPUT_FILE"
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✅ Database setup completed successfully!${NC}"
    else
        echo -e "\n${RED}❌ Error executing SQL script${NC}"
        exit 1
    fi
else
    echo -e "${BLUE}📄 SQL script saved. You can execute it manually:${NC}"
    echo -e "   psql -U postgres -f $OUTPUT_FILE"
fi

