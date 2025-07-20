import { useState } from 'react';
import { testApiConnection } from '../utils/testApi';

export const ApiTest = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState('');

  const runTest = async () => {
    setTesting(true);
    setResults('Running API tests...\n');
    
    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    let logs = '';
    
    console.log = (...args) => {
      logs += args.join(' ') + '\n';
      originalLog(...args);
    };
    
    console.error = (...args) => {
      logs += 'ERROR: ' + args.join(' ') + '\n';
      originalError(...args);
    };
    
    try {
      await testApiConnection();
    } catch (error) {
      logs += 'Test failed: ' + error.message + '\n';
    }
    
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    
    setResults(logs);
    setTesting(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🔧 API Connection Test</h3>
      
      <button
        onClick={runTest}
        disabled={testing}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors mb-4"
      >
        {testing ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {results && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
          {results}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Expected results:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Health endpoint should return status 200</li>
          <li>Todos endpoint should return status 200</li>
          <li>Create todo should return status 201</li>
        </ul>
        
        <p className="mt-4"><strong>Common issues:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><strong>Connection refused:</strong> Backend server not running</li>
          <li><strong>CORS error:</strong> Frontend URL not in CORS allowlist</li>
          <li><strong>404 errors:</strong> Wrong API endpoint URLs</li>
          <li><strong>422 errors:</strong> Invalid request data format</li>
        </ul>
      </div>
    </div>
  );
};