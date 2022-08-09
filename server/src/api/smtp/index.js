const nodemailer = require("nodemailer")

class Mail {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.googlemail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    })
  
  }
  sendMessage = async ({user, title, message}) => {
    await this.transporter.sendMail({
      from: '"SF Audio Guild" <sfaudioguild@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: title, // Subject line
      html: /*html*/ `
        <div>
          <h2>Hello ${user.username}!</h2>
          <p>${message}</p>
        </div>
      `
    })
  }
}

const mail = new Mail()

module.exports = mail

