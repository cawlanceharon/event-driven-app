const AWS = require('aws-sdk');
AWS.config.update({
    region: 'your-aws-region', 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
module.exports = sqs;