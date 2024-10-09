
const { AvaProtocol } = require('@avaprotocol/sdk');
const Web3 = require('web3');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Replace with your Polygon RPC endpoint (Infura/Alchemy)
const polygonRpcUrl = "https://polygon-mainnet.g.alchemy.com/v2/your_alchemy_api_key";
const web3 = new Web3(new Web3.providers.HttpProvider(polygonRpcUrl));

// Initialize the SDK for Polygon
const avaProtocol = new AvaProtocol({
  network: 'polygon',
  provider: web3,
  apiKey: process.env.AVA_API_KEY,  // Use environment variable for security
});

// Your contract's ABI and address
const contractABI = [ /* Your contract's ABI here */ ];
const contractAddress = 'your_contract_address_here';
const contract = new avaProtocol.eth.Contract(contractABI, contractAddress);

// Configure Nodemailer
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your email
    pass: process.env.EMAIL_PASS  // Your email password
  }
});

// Function to send email
function sendEmail(evaluatorEmail, rwaTokenAddress) {
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: evaluatorEmail,
    subject: 'New RWA Evaluation Submitted',
    text: `A new evaluation for the token ${rwaTokenAddress} has been submitted. Please review the details in the platform.`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// Monitor events from the contract
async function monitorEvents() {
  console.log('Starting event monitoring...');

  // Listening for the EvaluationSubmitted event
  contract.events.EvaluationSubmitted({
    fromBlock: 'latest'
  })
  .on('data', (event) => {
    console.log('Evaluation Submitted:', event.returnValues);

    // Get evaluator's email from the event (you may need to retrieve it from your database)
    const evaluatorEmail = 'evaluator_email@example.com';  // Replace with logic to get email from event or DB
    const rwaTokenAddress = event.returnValues.rwaTokenAddress;

    // Send email to the evaluator
    sendEmail(evaluatorEmail, rwaTokenAddress);
  })
  .on('error', console.error);
}

// Start monitoring events
monitorEvents();
