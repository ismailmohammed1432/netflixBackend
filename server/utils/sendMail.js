import nodemailer from "nodemailer"
import config from "config"

const userEmail = config.get("EMAIL")
const userPassword = config.get("PASSWORD")


async function sendMail(emailData){
    try {
        let transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure:true,
            auth :{
                user : userEmail,
                pass : userPassword
            }
        })

        let info = await transporter.sendMail({
            from : `"Mohammed Ismail" ${userEmail}`,
            subject: emailData.subject,
            to: emailData.to,
            html:emailData.html,
            text: emailData.text
                })
            
            console.log("Email Sent", info.messageId);
    } catch (error) {
        console.log(error);
    }
}

export default sendMail