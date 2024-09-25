const sqs = require('./awsConfig');
const salesforceLogin = require('./salesforceAuth');
async function processQueueMessages() {
    const params = {
        QueueUrl: 'https://sqs.YOUR_AWS_REGION.amazonaws.com/YOUR_ACCOUNT_ID/YOUR_QUEUE_NAME',
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20 
    };
    try {
        const data = await sqs.receiveMessage(params).promise();
        if (data.Messages && data.Messages.length > 0) {
            await processMessages(data.Messages);
            for (const message of data.Messages) {
                const deleteParams = {
                    QueueUrl: params.QueueUrl,
                    ReceiptHandle: message.ReceiptHandle
                };
                await sqs.deleteMessage(deleteParams).promise();
            }
        } else {
            console.log('No messages in queue.');
        }
    } catch (err) {
        console.error('Error receiving messages from SQS:', err);
    }
}
async function processMessages(messages) {
    for (const message of messages) {
        const eventData = JSON.parse(message.Body);
        if (eventData.eventType === 'CREATE_LEAD') {
            await createLeadInSalesforce(eventData);
        }
    }
}
async function createLeadInSalesforce(leadData) {
    const conn = await salesforceLogin();
    const lead = {
        LastName: leadData.lastName,
        Company: leadData.company,
        Email: leadData.email
    };
    try {
        const result = await conn.sobject('Lead').create(lead);
        if (result.success) {
            console.log(`Lead created in Salesforce with ID: ${result.id}`);
        } else {
            console.error('Failed to create lead in Salesforce');
        }
    } catch (err) {
        console.error('Error creating lead in Salesforce:', err);
    }
}
setInterval(processQueueMessages, 10000);