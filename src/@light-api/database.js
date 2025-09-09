const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class LightApiDatabase {
  constructor(dbPath = './lightapi.db') {
    this.dbPath = dbPath;
    this.db = null;
    this.init();
  }

  init() {
    try {
      this.db = new Database(this.dbPath);
      this.db.pragma('journal_mode = WAL');
      this.createTables();
      console.log('LightAPI SQLite database initialized');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  createTables() {
    // Generic table creation for all mock API data types
    const tables = [
      'users', 'contacts', 'tasks', 'notifications', 'calendar_events', 'calendar_labels',
      'mailbox_mails', 'mailbox_filters', 'mailbox_labels', 'mailbox_folders',
      'scrumboard_members', 'scrumboard_lists', 'scrumboard_cards', 'scrumboard_boards',
      'scrumboard_labels', 'ecommerce_products', 'ecommerce_orders', 'academy_courses',
      'academy_course_steps', 'academy_course_step_contents', 'academy_categories',
      'ui_material_icons', 'ui_heroicons_icons', 'ui_feather_icons',
      'profile_albums', 'profile_media_items', 'profile_activities', 'profile_posts',
      'profile_about', 'help_center_guides', 'help_center_guide_categories',
      'help_center_faqs', 'help_center_faq_categories', 'messenger_contacts',
      'messenger_chat_list', 'messenger_messages', 'messenger_user_profiles',
      'notes_notes', 'notes_labels', 'file_manager_items',
      'project_dashboard_widgets', 'project_dashboard_projects', 
      'crypto_dashboard_widgets', 'finance_dashboard_widgets', 'analytics_dashboard_widgets',
      'app_account_settings', 'app_notification_settings', 'app_security_settings',
      'app_plan_billing_settings', 'app_team_members', 'tasks_tags', 'contacts_tags',
      'countries', 'ai_image_gen_presets', 'ai_image_gen_items'
    ];

    tables.forEach(table => {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS ${table} (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      this.db.exec(createTableSQL);
    });

    // Create indexes for better performance
    tables.forEach(table => {
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_${table}_created_at ON ${table}(created_at)`);
    });

    console.log(`Created ${tables.length} tables in SQLite database`);
  }

  // Generic CRUD operations
  insert(tableName, id, data) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO ${tableName} (id, data, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);
    return stmt.run(id, JSON.stringify(data));
  }

  insertMany(tableName, items) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO ${tableName} (id, data, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);
    
    const transaction = this.db.transaction((items) => {
      items.forEach(item => {
        const id = item.id || item.uuid || Date.now() + Math.random().toString();
        stmt.run(id, JSON.stringify(item));
      });
    });
    
    return transaction(items);
  }

  findById(tableName, id) {
    const stmt = this.db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`);
    const result = stmt.get(id);
    return result ? { ...result, data: JSON.parse(result.data) } : null;
  }

  findAll(tableName, limit = null, offset = 0) {
    let sql = `SELECT * FROM ${tableName} ORDER BY created_at DESC`;
    if (limit) {
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    
    const stmt = this.db.prepare(sql);
    const results = stmt.all();
    return results.map(result => ({ ...result, data: JSON.parse(result.data) }));
  }

  update(tableName, id, data) {
    const stmt = this.db.prepare(`
      UPDATE ${tableName} 
      SET data = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    return stmt.run(JSON.stringify(data), id);
  }

  delete(tableName, id) {
    const stmt = this.db.prepare(`DELETE FROM ${tableName} WHERE id = ?`);
    return stmt.run(id);
  }

  count(tableName) {
    const stmt = this.db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`);
    return stmt.get().count;
  }

  getAllCounts() {
    const tables = [
      'users', 'contacts', 'tasks', 'notifications', 'calendar_events', 'calendar_labels',
      'mailbox_mails', 'mailbox_filters', 'mailbox_labels', 'mailbox_folders',
      'scrumboard_members', 'scrumboard_lists', 'scrumboard_cards', 'scrumboard_boards',
      'scrumboard_labels', 'ecommerce_products', 'ecommerce_orders', 'academy_courses',
      'academy_course_steps', 'academy_course_step_contents', 'academy_categories',
      'ui_material_icons', 'ui_heroicons_icons', 'ui_feather_icons',
      'profile_albums', 'profile_media_items', 'profile_activities', 'profile_posts',
      'profile_about', 'help_center_guides', 'help_center_guide_categories',
      'help_center_faqs', 'help_center_faq_categories', 'messenger_contacts',
      'messenger_chat_list', 'messenger_messages', 'messenger_user_profiles',
      'notes_notes', 'notes_labels', 'file_manager_items',
      'project_dashboard_widgets', 'project_dashboard_projects', 
      'crypto_dashboard_widgets', 'finance_dashboard_widgets', 'analytics_dashboard_widgets',
      'app_account_settings', 'app_notification_settings', 'app_security_settings',
      'app_plan_billing_settings', 'app_team_members', 'tasks_tags', 'contacts_tags',
      'countries', 'ai_image_gen_presets', 'ai_image_gen_items'
    ];

    const counts = {};
    tables.forEach(table => {
      counts[table] = this.count(table);
    });
    return counts;
  }

  close() {
    if (this.db) {
      this.db.close();
      console.log('Database connection closed');
    }
  }
}

module.exports = LightApiDatabase;