#!/usr/bin/env node

/**
 * IST Authentication System - Integration Test
 * Tests the complete frontend-backend integration
 */

const API_BASE = 'https://ist-auth-system-sparkling-wind-9681.fly.dev/api';
const FRONTEND_URL = 'https://ist-auth-system.vercel.app';

async function testEndpoint(name, url, options = {}) {
  console.log(`\n🧪 Testing ${name}...`);
  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => response.text());
    
    if (response.ok) {
      console.log(`✅ ${name}: SUCCESS`);
      return { success: true, data };
    } else {
      console.log(`❌ ${name}: FAILED (${response.status})`);
      console.log(`   Error: ${JSON.stringify(data)}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`❌ ${name}: ERROR`);
    console.log(`   ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runIntegrationTests() {
  console.log('🚀 IST Authentication System - Integration Test Suite');
  console.log('=' .repeat(60));
  
  const results = [];
  
  // Test 1: Health Check
  const health = await testEndpoint(
    'Backend Health Check',
    `${API_BASE}/actuator/health`
  );
  results.push(health);
  
  // Test 2: JWKS Endpoint
  const jwks = await testEndpoint(
    'JWKS Public Keys',
    'https://ist-auth-system-sparkling-wind-9681.fly.dev/.well-known/jwks.json'
  );
  results.push(jwks);
  
  // Test 3: OpenID Configuration
  const openid = await testEndpoint(
    'OpenID Configuration',
    'https://ist-auth-system-sparkling-wind-9681.fly.dev/.well-known/openid_configuration'
  );
  results.push(openid);
  
  // Test 4: User Registration
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    password: 'TestPassword123!',
    role: 'STUDENT'
  };
  
  const registration = await testEndpoint(
    'User Registration',
    `${API_BASE}/auth/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    }
  );
  results.push(registration);
  
  // Test 5: User Login (should fail due to email verification)
  const login = await testEndpoint(
    'User Login (Unverified)',
    `${API_BASE}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrUsername: testUser.email,
        password: testUser.password
      })
    }
  );
  results.push(login);
  
  // Test 6: Frontend Accessibility
  const frontend = await testEndpoint(
    'Frontend Accessibility',
    FRONTEND_URL
  );
  results.push(frontend);
  
  // Test 7: API Documentation
  const docs = await testEndpoint(
    'API Documentation',
    'https://ist-auth-system-sparkling-wind-9681.fly.dev/swagger-ui.html'
  );
  results.push(docs);
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 ALL TESTS PASSED! Integration is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above for details.');
  }
  
  console.log('\n🔗 Quick Links:');
  console.log(`   Frontend: ${FRONTEND_URL}`);
  console.log(`   Backend API: ${API_BASE}`);
  console.log(`   API Docs: https://ist-auth-system-sparkling-wind-9681.fly.dev/swagger-ui.html`);
  
  return passed === total;
}

// Run tests if called directly
if (require.main === module) {
  runIntegrationTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = { runIntegrationTests };