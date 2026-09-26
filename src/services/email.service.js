const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send email using Resend
const sendEmail = async (to, subject, text, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Backend Ledger <onboarding@resend.dev>',
            to: Array.isArray(to) ? to : [to],
            subject,
            text,
            html,
        });

        if (error) {
            console.error('Error sending email via Resend:', error);
            return;
        }

        console.log('Message sent via Resend:', data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendRegisterationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!'
    const text = `Hello ${name},\n\nThank you for registerating at Backend Ledger.
    We're excited to have you on board!\n\nBest regards,\nThe Bacend Ledger team`
    const html = `<p>Hello ${name},</p><p>\n\nThank you for registerating at Backend Ledger.
    We're excited to have you on board!</p><p>Best regards,<br>The Bacend Ledger team</p>`

    await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Successful!';
    const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Your transaction of $${amount} to account ${toAccount} was successful.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Failed';
    const text = `Hello ${name},\n\nWe regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegisterationEmail,
    sendRegistrationEmail: sendRegisterationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};