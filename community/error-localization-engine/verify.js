const axios = require('axios');

async function runTests() {
    const baseURL = 'http://127.0.0.1:3000/api/auth';
    
    console.log('--- Starting Verification ---');

    // Test 1: Signup Validation Error (Spanish)
    try {
        console.log('\n[Test 1] POST /signup?lang=es (Invalid Email)');
        await axios.post(`${baseURL}/signup?lang=es`, {
            email: 'invalid',
            password: '123'
        });
        console.log('❌ FAIL: Expected 400 error, got success');
    } catch (err) {
        if (err.response) {
            console.log('Response Status:', err.response.status);
            console.log('Response Body:', err.response.data);
            const msg = err.response.data.message || '';
            if (msg.includes('[es]')) {
                console.log('✅ PASS: Localized to Spanish');
            } else {
                console.log('❌ FAIL: Not localized correctly');
            }
        } else {
            console.error('❌ FAIL: Network/Server Error:', err.message);
        }
    }

    // Test 2: Signup Validation Error (French via Header)
    try {
        console.log('\n[Test 2] POST /signup (Header: fr) (Short Password)');
        await axios.post(`${baseURL}/signup`, {
            email: 'valid@email.com',
            password: '123'
        }, {
             headers: { 'Accept-Language': 'fr' }
        });
        console.log('❌ FAIL: Expected 400 error, got success');
    } catch (err) {
        if (err.response) {
            console.log('Response Status:', err.response.status);
            console.log('Response Body:', err.response.data);
             const msg = err.response.data.message || '';
            if (msg.includes('[fr]')) {
                console.log('✅ PASS: Localized to French');
            } else {
                console.log('❌ FAIL: Not localized correctly');
            }
        } else {
            console.error('❌ FAIL: Network/Server Error:', err.message);
        }
    }

    // Test 3: Success Case (English Default)
    try {
        console.log('\n[Test 3] POST /signup (Valid Data)');
        const res = await axios.post(`${baseURL}/signup`, {
            email: `user${Date.now()}@example.com`,
            password: 'securepassword123'
        });
        console.log('Response Status:', res.status);
        console.log('Response Body:', res.data);
        if (res.data.message && !res.data.message.includes('[')) {
             console.log('✅ PASS: English default (no mock prefix)');
        } else {
             console.log('❌ FAIL: Unexpected content in success message');
        }
    } catch (err) {
        console.error('❌ FAIL: Unexpected Error:', err.response ? err.response.data : err.message);
    }
}

runTests();
