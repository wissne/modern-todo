// Test API connectivity and endpoints
const API_BASE = 'http://localhost:8000/api/todos';

export const testApiConnection = async () => {
  console.log('🔍 Testing API connection...');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:8000/health');
    console.log('Health status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.text();
      console.log('Health response:', healthData);
    }
    
    // Test todos endpoint
    console.log('2. Testing todos endpoint...');
    const todosResponse = await fetch(`${API_BASE}/`);
    console.log('Todos status:', todosResponse.status);
    
    if (todosResponse.ok) {
      const todosData = await todosResponse.json();
      console.log('Todos response:', todosData);
    } else {
      const errorText = await todosResponse.text();
      console.error('Todos error:', errorText);
    }
    
    // Test create todo
    console.log('3. Testing create todo...');
    const testTodo = {
      text: 'Test Todo',
      priority: 'medium',
      due_date: null,
      parent_id: null
    };
    
    const createResponse = await fetch(`${API_BASE}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testTodo),
    });
    
    console.log('Create status:', createResponse.status);
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('Create response:', createData);
    } else {
      const errorText = await createResponse.text();
      console.error('Create error:', errorText);
    }
    
  } catch (error) {
    console.error('API test failed:', error);
  }
};

// Call this function to test
// testApiConnection();