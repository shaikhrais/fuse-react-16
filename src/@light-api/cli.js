#!/usr/bin/env node

const DataImporter = require('./data-importer');
const LightApiService = require('./light-api');

class LightApiCLI {
  constructor() {
    this.importer = new DataImporter();
    this.service = null;
  }

  async handleCommand(command, ...args) {
    switch (command) {
      case 'import':
        return await this.importData(args[0]);
      
      case 'import-all':
        return await this.importAllData();
      
      case 'status':
        return this.showStatus();
      
      case 'list-types':
        return this.listDataTypes();
      
      case 'serve':
        return await this.startServer(args[0]);
      
      case 'help':
      default:
        return this.showHelp();
    }
  }

  async importData(dataType) {
    if (!dataType) {
      console.error('Please specify a data type to import');
      return;
    }

    console.log(`Importing ${dataType}...`);
    const result = await this.importer.importSpecificType(dataType);
    
    if (result.success) {
      console.log(`✅ Successfully imported ${result.imported} records for ${dataType}`);
    } else {
      console.error(`❌ Import failed: ${result.error}`);
    }

    this.importer.close();
  }

  async importAllData() {
    console.log('Importing all data from mockOpenApiSpecs.json...');
    const result = await this.importer.importAllData();
    
    if (result.success) {
      console.log(`✅ Successfully imported ${result.totalImported} total records`);
    } else {
      console.error(`❌ Import failed: ${result.error}`);
    }

    this.importer.close();
  }

  showStatus() {
    console.log('📊 Database Status:');
    const counts = this.importer.getDatabaseStatus();
    const totalRecords = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    console.log(`Total records: ${totalRecords}`);
    console.log('\nRecords per table:');
    Object.entries(counts).forEach(([table, count]) => {
      if (count > 0) {
        console.log(`  ${table}: ${count}`);
      }
    });

    this.importer.close();
  }

  listDataTypes() {
    console.log('📋 Available data types in mockOpenApiSpecs.json:');
    const types = this.importer.getAvailableDataTypes();
    
    types.forEach(type => {
      console.log(`  ${type.name}: ${type.count} records`);
    });

    console.log(`\nTotal: ${types.length} data types available`);
    this.importer.close();
  }

  async startServer(port = 3001) {
    try {
      this.service = new LightApiService(parseInt(port));
      
      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down LightAPI server...');
        await this.service.stop();
        process.exit(0);
      });

      await this.service.start();
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  showHelp() {
    console.log(`
🌟 LightAPI - SQLite-based Mock API Alternative

Usage: node cli.js <command> [options]

Commands:
  import <type>     Import specific data type from mockOpenApiSpecs.json
  import-all        Import all data from mockOpenApiSpecs.json
  status            Show database status and record counts
  list-types        List all available data types
  serve [port]      Start the LightAPI server (default port: 3001)
  help              Show this help message

Examples:
  node cli.js import users
  node cli.js import-all
  node cli.js status
  node cli.js serve 3001

API Endpoints (when server is running):
  GET    /health                 - Health check
  GET    /status                 - Database status
  GET    /<table>                - Get all records
  GET    /<table>/<id>           - Get record by ID
  POST   /<table>                - Create new record
  PUT    /<table>/<id>           - Update record
  DELETE /<table>/<id>           - Delete record
  POST   /<table>/batch          - Batch create records
  GET    /<table>/search/<query> - Search records
  GET    /<table>/count          - Count records
    `);
  }
}

// CLI entry point
if (require.main === module) {
  const cli = new LightApiCLI();
  const [command, ...args] = process.argv.slice(2);
  
  cli.handleCommand(command || 'help', ...args).catch(error => {
    console.error('CLI Error:', error);
    process.exit(1);
  });
}

module.exports = LightApiCLI;