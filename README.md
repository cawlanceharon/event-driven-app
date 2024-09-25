
# Event-Driven Architecture with Node.js, AWS SQS, and Salesforce

This project implements an event-driven architecture where **Node.js (Express.js)** acts as both a producer and consumer of events. The project queues events to **AWS SQS**, and a separate consumer service processes the queued messages and sends data to **Salesforce** asynchronously.

## Features

- Publish events to **AWS SQS** from a Node.js Express application.
- Asynchronously consume events from AWS SQS and send data to **Salesforce**.
- **Decoupled architecture**: Events are queued and processed later, ensuring better performance and scalability.
- **Error handling** with AWS SQS retry mechanisms and Dead-Letter Queues (DLQ) for failed events.

## Project Structure

```bash
.
├── app.js               # Main Express server
├── awsConfig.js         # AWS SQS configuration
├── salesforceAuth.js    # Salesforce authentication logic
├── sqsConsumer.js       # SQS consumer that processes messages and sends data to Salesforce
├── routes
│   └── index.js         # Express route for publishing events to SQS
├── package.json         # Node.js dependencies and scripts
├── .env.example         # Example environment variable file
├── .gitignore           # Git ignore file
└── README.md            # Project README file
```

## Prerequisites

### 1. Salesforce
- A Salesforce **Connected App** with API access enabled.
- Salesforce **Platform Event** or **REST API** access.
- Salesforce **Security Token**.

### 2. AWS
- An **AWS account** with **SQS** queues set up.
- AWS **Access Key** and **Secret Key** for authentication.

### 3. Node.js
- **Node.js v12+**
- **npm**

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repository.git
   cd your-repository
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the root directory with the following values:

   ```bash
   # Salesforce
   SALESFORCE_USERNAME=your-salesforce-username
   SALESFORCE_PASSWORD=your-salesforce-password
   SALESFORCE_TOKEN=your-salesforce-security-token
   SALESFORCE_LOGIN_URL=https://login.salesforce.com   # Use https://test.salesforce.com for sandbox
   SALESFORCE_CLIENT_ID=your-salesforce-client-id
   SALESFORCE_CLIENT_SECRET=your-salesforce-client-secret

   # AWS
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   ```

## AWS SQS Configuration

1. Go to **AWS SQS** Console and create a new queue:
   - Choose between **Standard** or **FIFO** queues.
   - Copy the **Queue URL** and set it in your `awsConfig.js` file.

2. Modify the `awsConfig.js` to include your AWS region and credentials:

   ```javascript
   const AWS = require('aws-sdk');

   AWS.config.update({
       region: 'your-aws-region', // e.g., 'us-west-1'
       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
   });

   const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

   module.exports = sqs;
   ```

## Salesforce Setup

1. Create a **Connected App** in Salesforce and enable **OAuth** with the following scopes:
   - `Access and manage your data (api)`
   - `Full access (full)`

2. Retrieve the **Consumer Key** and **Consumer Secret** for use in your `.env` file.

3. If you're using **Platform Events**, ensure the event is created in Salesforce with the necessary fields.

## Running the Application

### 1. Start the Express Server

This starts the server, allowing clients to queue events.

```bash
npm start
```

You can now send POST requests to the server to queue messages.

Example:

```bash
curl -X POST http://localhost:3000/queue-lead -H "Content-Type: application/json" -d '{"lastName": "Smith", "company": "Tech Inc", "email": "smith@techinc.com"}'
```

### 2. Start the SQS Consumer

Run the consumer script in a separate process to continuously poll AWS SQS and process events:

```bash
npm run sqs-consumer
```

The consumer will read messages from the SQS queue, process them, and send data to Salesforce.

### 3. Using PM2 (Optional)

You can use **PM2** to manage the processes and keep the SQS consumer running in the background:

```bash
npm install -g pm2
pm2 start sqsConsumer.js --name sqs-consumer
pm2 start app.js --name express-app
```

## Endpoints

- **POST /queue-lead**  
  Queues a new event to AWS SQS, which contains lead information to be processed and sent to Salesforce.

  **Request Body**:
  ```json
  {
      "lastName": "Doe",
      "company": "ACME Inc",
      "email": "john.doe@example.com"
  }
  ```

  **Response**:
  ```json
  {
      "message": "Event queued successfully."
  }
  ```

## Handling Errors and Dead-Letter Queues

If messages fail to be processed (e.g., Salesforce API is down), they will remain in the queue for retry. Configure a **Dead-Letter Queue (DLQ)** in AWS SQS to handle messages that exceed the retry limit.

1. Go to AWS SQS Console.
2. Create a **Dead-Letter Queue** and attach it to your primary queue.
3. Set the **MaxReceiveCount** to specify the number of times a message can fail before being moved to the DLQ.

## Important Notes

- The system is designed to **decouple** the message producer and consumer, ensuring Salesforce does not get overwhelmed with requests.
- Messages are processed **asynchronously**, allowing the main application to handle user requests without waiting for Salesforce to respond.
- **AWS SQS** provides reliability by storing messages until they are successfully processed, and the consumer is designed to process the messages from the queue reliably.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

