const PushAPI = require("@pushprotocol/restapi");
const ethers = require('ethers');
const path = require('path');

const envPath = path.join(__dirname + './../../.env');
console.log(envPath)

require('dotenv').config({
  path: envPath,
});

// Define the parameters we would need in order to initialize the SDK
const  PK = process.env.CHANNEL_PK; // the private key of the channel
console.log(PK);
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);

const notificationData = {
    title : "Push protocol running...",
    body : "working fine",
}

const payloadData = {
    title : "payload Push protocol running",
    body : "payload working fine",
    cta : '',
    img : 'https://play-lh.googleusercontent.com/1-hPxafOxdYpYZEOKzNIkSP43HXCNftVJVttoo4ucl7rsMASXW3Xr6GlXURCubE1tA=w3840-h2160-rw',
}

const channelAddress = 'eip155:5:0xedAAfb3B4a2B5D340e3bCaB4a1337a8f2FB70Cc5';

const pushRecipients = 'eip155:5:0xedAAfb3B4a2B5D340e3bCaB4a1337a8f2FB70Cc5';

exports.getNotifications = async()=> {
    console.log("Function Call");
    const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 1, // broadcast
        identityType: 2, // direct payload
        notification: notificationData,
        payload: payloadData,
        channel: channelAddress, // your channel address
        recipients: pushRecipients,
        env: 'staging'
      });
    }