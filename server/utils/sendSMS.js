import twilio from "twilio"
import config from "config"

const accountSID = config.get("TWILIO_SID")
const authtoken = config.get("TWILIO_TOKEN")
const phone = config.get("TWILIO_NUMBER")
const client = new twilio(accountSID, authtoken)

async function sendSMS(smsData){
    try {
        await client.messages.create({
            body: smsData.body,
            to: smsData.to,
            from:phone     
           })
        console.log("SMS Sent");
    } catch (error) {
        console.log(error);
    }
}

export default sendSMS