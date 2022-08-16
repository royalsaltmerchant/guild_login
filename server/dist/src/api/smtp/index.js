"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const nodemailer = require("nodemailer");
class Mail {
    constructor() {
        this.sendMessage = ({ user, title, message }) => __awaiter(this, void 0, void 0, function* () {
            yield this.transporter.sendMail({
                from: '"SF Audio Guild" <sfaudioguild@gmail.com>',
                to: user.email,
                subject: title,
                html: /*html*/ `
        <div>
          <h2>Hello ${user.username}!</h2>
          <p>${message}</p>
        </div>
      `
            });
        });
        this.transporter = nodemailer.createTransport({
            host: "smtp.googlemail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }
}
const mail = new Mail();
module.exports = mail;
