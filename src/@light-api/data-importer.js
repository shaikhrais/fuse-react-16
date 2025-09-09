const fs = require('fs');
const path = require('path');
const LightApiDatabase = require('./database');

class DataImporter {
  constructor() {
    this.db = new LightApiDatabase();
    this.mockDataPath = path.join(__dirname, '../@mock-utils/mockOpenApiSpecs.json');
  }

  async importAllData() {
    try {
      console.log('Starting data import from mockOpenApiSpecs.json...');
      
      const mockData = JSON.parse(fs.readFileSync(this.mockDataPath, 'utf8'));
      const examples = mockData.components?.examples;
      
      if (!examples) {
        throw new Error('No examples found in mockOpenApiSpecs.json');
      }

      let totalImported = 0;
      
      for (const [exampleKey, exampleData] of Object.entries(examples)) {
        try {
          const data = exampleData.value;
          if (Array.isArray(data) && data.length > 0) {
            console.log(`Importing ${data.length} records into ${exampleKey}...`);
            this.db.insertMany(exampleKey, data);
            totalImported += data.length;
          } else if (typeof data === 'object' && data !== null) {
            console.log(`Importing single record into ${exampleKey}...`);
            const id = data.id || data.uuid || exampleKey;
            this.db.insert(exampleKey, id, data);
            totalImported += 1;
          }
        } catch (error) {
          console.warn(`Failed to import ${exampleKey}:`, error.message);
        }
      }

      const counts = this.db.getAllCounts();
      console.log('\n=== Import Summary ===');
      console.log(`Total records imported: ${totalImported}`);
      console.log('Records per table:');
      Object.entries(counts).forEach(([table, count]) => {
        if (count > 0) {
          console.log(`  ${table}: ${count}`);
        }
      });

      return { success: true, totalImported, counts };
    } catch (error) {
      console.error('Data import failed:', error);
      return { success: false, error: error.message };
    }
  }

  async importSpecificType(dataType) {
    try {
      const mockData = JSON.parse(fs.readFileSync(this.mockDataPath, 'utf8'));
      const examples = mockData.components?.examples;
      
      if (!examples || !examples[dataType]) {
        throw new Error(`Data type ${dataType} not found in mockOpenApiSpecs.json`);
      }

      const data = examples[dataType].value;
      let imported = 0;

      if (Array.isArray(data) && data.length > 0) {
        this.db.insertMany(dataType, data);
        imported = data.length;
      } else if (typeof data === 'object' && data !== null) {
        const id = data.id || data.uuid || dataType;
        this.db.insert(dataType, id, data);
        imported = 1;
      }

      console.log(`Successfully imported ${imported} records into ${dataType}`);
      return { success: true, imported, dataType };
    } catch (error) {
      console.error(`Failed to import ${dataType}:`, error);
      return { success: false, error: error.message };
    }
  }

  getAvailableDataTypes() {
    try {
      const mockData = JSON.parse(fs.readFileSync(this.mockDataPath, 'utf8'));
      const examples = mockData.components?.examples;
      
      if (!examples) {
        return [];
      }

      return Object.keys(examples).map(key => ({
        name: key,
        count: Array.isArray(examples[key].value) ? examples[key].value.length : 1
      }));
    } catch (error) {
      console.error('Failed to get available data types:', error);
      return [];
    }
  }

  getDatabaseStatus() {
    return this.db.getAllCounts();
  }

  close() {
    this.db.close();
  }
}

module.exports = DataImporter;