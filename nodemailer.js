const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport(
  {
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
  }
},
  {
    to: process.env.EMAIL,
  }
);
async function wrapedSendMail(message){
  return new Promise((resolve,reject)=>{
  transporter.sendMail(message, (err)=>{
    if(err){
      console.log(err)
      resolve(false)
    }else{
      resolve(true);
    }

})
})}

module.exports = wrapedSendMail