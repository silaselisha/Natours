const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')

class Email {
    constructor(user, url) {
        this.firstName = user.name.split(' ')[0]
        this.to = user.email
        this.url = url
        this.from = `Jamie Stewards <${process.env.MAIL_FROM}>`
    }

    newTransporter() {
        if(process.env.NODE_ENV === 'production') {
            return 1
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_TRAP_HOST,
            port: process.env.MAIL_TRAP_PORT,
            auth: {
                user: process.env.MAIL_TRAP_USER,
                pass: process.env.MAIL_TRAP_PASS
            }
        })

        return transporter
    }

    async send(template, subject) {
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            email: this.to,
            subject: subject,
            url: this.url
        })

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html: html,
            text: htmlToText.convert(html)
        }

        await this.newTransporter().sendMail(mailOptions)
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!')
    }

    async sendResetToken() {
        await this.send('resetPassword', 'Password reset token. Should expire in 10 minutes.')
    }
}

module.exports = Email