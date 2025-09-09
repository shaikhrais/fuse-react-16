# LightAPI - SQLite Mock API Alternative

A standalone SQLite-based API service that mirrors your MockAPI structure using data from `mockOpenApiSpecs.json`.

## Features

- 🗃️ SQLite database with all mock API data
- 🚀 RESTful API endpoints matching mock API structure
- 📊 55+ data collections with 3,310+ records
- 🔄 Full CRUD operations
- 🔍 Search functionality
- 📈 Batch operations
- 💾 Persistent data storage
- 🌐 CORS enabled for frontend integration

## Quick Start

### 1. Install Dependencies
```bash
cd src/@light-api
npm install
```

### 2. Import Data
```bash
# Import all data from mockOpenApiSpecs.json
node cli.js import-all

# Or import specific data type
node cli.js import users
```

### 3. Start Server
```bash
# Start on default port 3001
node cli.js serve

# Or specify custom port
node cli.js serve 3002
```

## CLI Commands

```bash
# Import all data
node cli.js import-all

# Import specific data type
node cli.js import <type>

# Show database status
node cli.js status

# List available data types
node cli.js list-types

# Start API server
node cli.js serve [port]

# Show help
node cli.js help
```

## API Endpoints

### Base URL: `http://localhost:3001`

### Health & Status
- `GET /health` - Health check
- `GET /status` - Database status with record counts

### Data Operations
- `GET /<table>` - Get all records
- `GET /<table>/<id>` - Get record by ID
- `POST /<table>` - Create new record
- `PUT /<table>/<id>` - Update record
- `DELETE /<table>/<id>` - Delete record

### Advanced Operations
- `POST /<table>/batch` - Batch create records
- `GET /<table>/search/<query>` - Search records
- `GET /<table>/count` - Count records

## Available Data Collections

The following data types are available (imported from mockOpenApiSpecs.json):

**Core Data:**
- `users` - User accounts and profiles
- `contacts` - Contact information
- `tasks` - Task management data
- `notifications` - System notifications

**Calendar & Time:**
- `calendar_events` - Calendar events
- `calendar_labels` - Calendar labels

**Messaging:**
- `mailbox_mails` - Email messages
- `mailbox_filters` - Email filters
- `mailbox_labels` - Email labels
- `mailbox_folders` - Email folders
- `messenger_contacts` - Messenger contacts
- `messenger_messages` - Chat messages
- `messenger_chat_list` - Chat conversations

**Project Management:**
- `scrumboard_members` - Team members
- `scrumboard_lists` - Board lists
- `scrumboard_cards` - Task cards
- `scrumboard_boards` - Project boards
- `scrumboard_labels` - Board labels

**E-commerce:**
- `ecommerce_products` - Product catalog
- `ecommerce_orders` - Order history

**Learning:**
- `academy_courses` - Course catalog
- `academy_course_steps` - Course steps
- `academy_categories` - Course categories

**UI Elements:**
- `ui_material_icons` - Material Design icons
- `ui_heroicons_icons` - Hero icons
- `ui_feather_icons` - Feather icons

**Profile & Social:**
- `profile_albums` - Photo albums
- `profile_media_items` - Media files
- `profile_activities` - User activities
- `profile_posts` - Social posts

**Help & Support:**
- `help_center_guides` - Help guides
- `help_center_faqs` - FAQ items
- `help_center_guide_categories` - Guide categories

**File Management:**
- `file_manager_items` - File system items
- `notes_notes` - Note items

**Dashboard Widgets:**
- `project_dashboard_widgets` - Project dashboard
- `crypto_dashboard_widgets` - Crypto dashboard
- `finance_dashboard_widgets` - Finance dashboard
- `analytics_dashboard_widgets` - Analytics dashboard

**Settings:**
- `app_account_settings` - Account settings
- `app_notification_settings` - Notification preferences
- `app_security_settings` - Security settings
- `app_team_members` - Team management

**Reference Data:**
- `countries` - Country list
- `ai_image_gen_presets` - AI image presets
- `ai_image_gen_items` - AI generated images

## Usage Examples

### JavaScript/Fetch
```javascript
// Get all users
const users = await fetch('http://localhost:3001/users').then(r => r.json());

// Get specific user
const user = await fetch('http://localhost:3001/users/1').then(r => r.json());

// Create new user
const newUser = await fetch('http://localhost:3001/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' })
}).then(r => r.json());

// Search contacts
const searchResults = await fetch('http://localhost:3001/contacts/search/john').then(r => r.json());
```

### React Hook
```javascript
const useLightApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/${endpoint}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [endpoint]);

  return { data, loading };
};

// Usage
const { data: users, loading } = useLightApi('users');
```

## Architecture

- **Database:** SQLite with better-sqlite3 for performance
- **Server:** Express.js with CORS support
- **Storage:** JSON data stored as TEXT in SQLite with indexing
- **API:** RESTful endpoints with consistent response format

## Development

The LightAPI is designed to be a drop-in replacement for your mock API endpoints. Simply change your frontend API calls from your mock API URLs to `http://localhost:3001/<table>`.

## Benefits vs Mock API

1. **Persistent Data:** Changes survive server restarts
2. **Better Performance:** SQLite is faster than JSON file parsing
3. **Advanced Queries:** Search, pagination, filtering
4. **CRUD Operations:** Full create, read, update, delete support
5. **Batch Operations:** Import/export data in bulk
6. **Local Control:** No external dependencies or rate limits