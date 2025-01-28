import { createTransport } from "nodemailer";
import env from "../env";

const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "83d7e2001@smtp-brevo.com",
        pass: env.SMTP_PASSWORD,
    },
});


export async function sendVerificationCode(toEmail: string, verificationCode: string) {
    await transporter.sendMail({
        from: "muchiripatrick86@gmail.com",
        to: toEmail,
        subject: "Your verification code",
        html: `<p>This is your verification code. It will expire in 10 minutes.</p><strong>${verificationCode}</strong>`
    })
};


export async function sendPasswordResetCode(toEmail: string, verificationCode: string) {
    await transporter.sendMail({
        from: "muchiripatrick86@gmail.com",
        to: toEmail,
        subject: "Reset your password",
        html: `<p>A password reset request has been sent for this account.
        Use this verification code to reset your password.
        It will expire in 10 minutes.</p>
        <p><strong> ${verificationCode} </strong></p>
        If you did not request password reset, please ignore this email.`
    })
}