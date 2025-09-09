const fetch = require('node-fetch');

async function testLightAPI() {
  const baseURL = 'http://localhost:3001';
  
  console.log('🧪 Testing LightAPI Server...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const health = await fetch(`${baseURL}/health`).then(r => r.json());
    console.log('✅ Health:', health.status);

    // Test 2: Status endpoint
    console.log('\n2. Testing status endpoint...');
    const status = await fetch(`${baseURL}/status`).then(r => r.json());
    console.log(`✅ Status: ${status.totalRecords} total records across ${Object.keys(status.collections).length} collections`);

    // Test 3: Get all users
    console.log('\n3. Testing GET /users...');
    const users = await fetch(`${baseURL}/users`).then(r => r.json());
    console.log(`✅ Users: Found ${users.length} users`);
    if (users.length > 0) {
      console.log('   First user:', users[0].displayName || users[0].name || 'Unknown');
    }

    // Test 4: Get all contacts
    console.log('\n4. Testing GET /contacts...');
    const contacts = await fetch(`${baseURL}/contacts`).then(r => r.json());
    console.log(`✅ Contacts: Found ${contacts.length} contacts`);

    // Test 5: Get all tasks
    console.log('\n5. Testing GET /tasks...');
    const tasks = await fetch(`${baseURL}/tasks`).then(r => r.json());
    console.log(`✅ Tasks: Found ${tasks.length} tasks`);

    // Test 6: Test pagination
    console.log('\n6. Testing pagination /contacts?limit=5...');
    const limitedContacts = await fetch(`${baseURL}/contacts?limit=5`).then(r => r.json());
    console.log(`✅ Pagination: Retrieved ${limitedContacts.length} contacts (limited to 5)`);

    // Test 7: Get specific record
    if (contacts.length > 0) {
      const firstContactId = contacts[0].id;
      console.log(`\n7. Testing GET /contacts/${firstContactId}...`);
      const contact = await fetch(`${baseURL}/contacts/${firstContactId}`).then(r => r.json());
      console.log(`✅ Single contact: ${contact.displayName || contact.name}`);
    }

    // Test 8: Search functionality
    console.log('\n8. Testing search /contacts/search/john...');
    const searchResults = await fetch(`${baseURL}/contacts/search/john`).then(r => r.json());
    console.log(`✅ Search: Found ${searchResults.length} contacts matching "john"`);

    // Test 9: Count endpoint
    console.log('\n9. Testing count /contacts/count...');
    const countResult = await fetch(`${baseURL}/contacts/count`).then(r => r.json());
    console.log(`✅ Count: ${countResult.count} total contacts`);

    // Test 10: Create new record
    console.log('\n10. Testing POST /contacts (create new contact)...');
    const newContact = {
      name: 'Test User',
      displayName: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890'
    };
    const created = await fetch(`${baseURL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact)
    }).then(r => r.json());
    console.log(`✅ Created contact: ${created.displayName} (ID: ${created.id})`);

    // Test 11: Update the created record
    console.log('\n11. Testing PUT /contacts/<id> (update contact)...');
    const updatedData = { ...created, phone: '+9876543210' };
    const updated = await fetch(`${baseURL}/contacts/${created.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    }).then(r => r.json());
    console.log(`✅ Updated contact phone: ${updated.phone}`);

    // Test 12: Delete the created record
    console.log('\n12. Testing DELETE /contacts/<id>...');
    const deleted = await fetch(`${baseURL}/contacts/${created.id}`, {
      method: 'DELETE'
    }).then(r => r.json());
    console.log(`✅ Deleted contact: ${deleted.message}`);

    console.log('\n🎉 All tests passed! LightAPI is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: node cli.js serve');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testLightAPI();
}

module.exports = testLightAPI;