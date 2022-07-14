const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_TRAP_HOST,
        port: process.env.MAIL_TRAP_PORT,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASS
        }
    })

    const emailInfo = {
        from: 'Jamie Stewards <admin.ac.uk>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(emailInfo)
}

module.exports = sendEmail