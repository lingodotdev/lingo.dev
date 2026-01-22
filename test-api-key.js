#!/usr/bin/env node

const API_KEY = "api_tw4y8ty5itlud69d3dltpr9q";
const API_URL = "https://engine.lingo.dev";

async function testApiKey() {
  console.log("Testing Lingo.dev API key...\n");
  console.log(`API Key: ${API_KEY}`);
  console.log(`API URL: ${API_URL}`);
  console.log("\nMaking request to /whoami endpoint...\n");

  try {
    const response = await fetch(`${API_URL}/whoami`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        ContentType: "application/json",
      },
    });

    console.log(`Response Status: ${response.status} ${response.statusText}\n`);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ API Key is VALID!\n");
      console.log("Account Details:");
      console.log(`  Email: ${data.email || "N/A"}`);
      console.log(`  ID: ${data.id || "N/A"}`);
      return true;
    } else if (response.status === 401) {
      console.log("❌ API Key is INVALID!");
      console.log("The API key was rejected (unauthorized).");
      return false;
    } else if (response.status >= 500) {
      console.log("⚠️  Server Error!");
      console.log("The Lingo.dev API is experiencing issues.");
      return false;
    } else {
      const text = await response.text();
      console.log(`❌ Unexpected Response: ${text}`);
      return false;
    }
  } catch (error) {
    console.log("❌ Request Failed!");
    console.log(`Error: ${error.message}`);
    return false;
  }
}

testApiKey().then((success) => {
  process.exit(success ? 0 : 1);
});
