// this file will contain all of the code for sending emails related to user account
 

const sgMail=require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)//now we have the API key setup when we send an email, send-grid will know it's associated with my account.


/*
                             ////////////// 2. Exploring SendGrid //////////////
//this allows us to send individual email
sgMail.send({
    to:"sara.aboeldahab205@gmail.com",
    from:"sara.aboeldahab205@gmail.com",
    subject:"this is 1st email",
    text:"Hello"
})*/

                 //////////////// 3. Sending Welcome and Cancellation Emails //////////////

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"sara.aboeldahab205@gmail.com",
        subject:"this is 1st email",
        text:`welcome ${name} to our app :)`
    })
}

const sendGoodBye=(email,name)=>{
    sgMail.send({
        to:email,
        from:"sara.aboeldahab205@gmail.com",
        subject:"this is last email",
        text:`Goodbye ${name} ^_^`
    })
}
module.exports={
    sendWelcomeEmail,
    sendGoodBye
}

