const express = require('express');
const sqs = require('../awsConfig');
const router = express.Router();
router.post('/queue-lead', async (req, res) => {
    const eventData = {
        lastName: req.body.lastName,
        company: req.body.company,
        email: req.body.email,
        eventType: 'CREATE_LEAD'
    };
    const params = {
        MessageBody: JSON.stringify(eventData),
        QueueUrl: 'https://sqs.YOUR_AWS_REGION.amazonaws.com/YOUR_ACCOUNT_ID/YOUR_QUEUE_NAME',
    };
    try {
        const result = await sqs.sendMessage(params).promise();
        res.status(200).send('Event queued successfully.');
    } catch (err) {
        res.status(500).send('Failed to queue event.');
    }
});
module.exports = router;