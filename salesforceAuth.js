const jsforce = require('jsforce');
require('dotenv').config();
const { SALESFORCE_USERNAME, SALESFORCE_PASSWORD, SALESFORCE_TOKEN, SALESFORCE_LOGIN_URL } = process.env;
async function salesforceLogin() {
    const conn = new jsforce.Connection({ loginUrl: SALESFORCE_LOGIN_URL });
    try {
        await conn.login(SALESFORCE_USERNAME, SALESFORCE_PASSWORD + SALESFORCE_TOKEN);
        console.log('Salesforce authentication successful');
        return conn;
    } catch (err) {
        console.error('Salesforce login failed:', err);
        throw err;
    }
}
module.exports = salesforceLogin;