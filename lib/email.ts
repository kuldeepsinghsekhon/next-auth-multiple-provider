const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });
  
  // async..await is not allowed in global scope, must use a wrapper
 

export async function sendVerificationEmail(params:{email:string, link:string}) {
    console.log('Sending verification email to:', params.email)
    console.log('Link:', params.link)
     // send mail with defined transport object
     const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: params.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>params.link</b>", // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  
    
}
