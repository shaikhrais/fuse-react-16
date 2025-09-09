const express = require('express');
const cors = require('cors');
const LightApiDatabase = require('./database');

class LightApiService {
  constructor(port = 3001) {
    this.app = express();
    this.port = port;
    this.db = new LightApiDatabase();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Database status
    this.app.get('/status', (req, res) => {
      try {
        const counts = this.db.getAllCounts();
        const totalRecords = Object.values(counts).reduce((sum, count) => sum + count, 0);
        res.json({
          status: 'OK',
          totalRecords,
          collections: counts,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Generic GET all records for any table
    this.app.get('/:tableName', (req, res) => {
      try {
        const { tableName } = req.params;
        const { limit, offset = 0 } = req.query;
        
        const records = this.db.findAll(tableName, limit ? parseInt(limit) : null, parseInt(offset));
        const data = records.map(record => record.data);
        
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Generic GET single record by ID
    this.app.get('/:tableName/:id', (req, res) => {
      try {
        const { tableName, id } = req.params;
        const record = this.db.findById(tableName, id);
        
        if (!record) {
          return res.status(404).json({ error: 'Record not found' });
        }
        
        res.json(record.data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Generic POST create new record
    this.app.post('/:tableName', (req, res) => {
      try {
        const { tableName } = req.params;
        const data = req.body;
        const id = data.id || data.uuid || Date.now().toString();
        
        this.db.insert(tableName, id, data);
        
        res.status(201).json({ id, ...data });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Generic PUT update record
    this.app.put('/:tableName/:id', (req, res) => {
      try {
        const { tableName, id } = req.params;
        const data = req.body;
        
        const existing = this.db.findById(tableName, id);
        if (!existing) {
          return res.status(404).json({ error: 'Record not found' });
        }
        
        this.db.update(tableName, id, data);
        res.json({ id, ...data });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Generic DELETE record
    this.app.delete('/:tableName/:id', (req, res) => {
      try {
        const { tableName, id } = req.params;
        
        const existing = this.db.findById(tableName, id);
        if (!existing) {
          return res.status(404).json({ error: 'Record not found' });
        }
        
        this.db.delete(tableName, id);
        res.json({ message: 'Record deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Batch operations
    this.app.post('/:tableName/batch', (req, res) => {
      try {
        const { tableName } = req.params;
        const { items } = req.body;
        
        if (!Array.isArray(items)) {
          return res.status(400).json({ error: 'Items must be an array' });
        }
        
        this.db.insertMany(tableName, items);
        res.status(201).json({ message: `${items.length} records created successfully` });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Search functionality
    this.app.get('/:tableName/search/:query', (req, res) => {
      try {
        const { tableName, query } = req.params;
        const records = this.db.findAll(tableName);
        
        const filtered = records.filter(record => {
          const dataStr = JSON.stringify(record.data).toLowerCase();
          return dataStr.includes(query.toLowerCase());
        });
        
        const data = filtered.map(record => record.data);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Count records in table
    this.app.get('/:tableName/count', (req, res) => {
      try {
        const { tableName } = req.params;
        const count = this.db.count(tableName);
        res.json({ count, tableName });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Endpoint not found' });
    });

    // Error handler
    this.app.use((error, req, res, next) => {
      console.error('Unhandled error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  start() {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 LightAPI server running on port ${this.port}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`📈 Status: http://localhost:${this.port}/status`);
        resolve();
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          this.db.close();
          console.log('LightAPI server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = LightApiService;