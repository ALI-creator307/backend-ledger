// Function to send email using Brevo HTTP API
const sendEmail = async (to, subject, text, html) => {
    try {
        const recipientList = Array.isArray(to) ? to : [to];
        const formattedTo = recipientList.map(email => ({ email }));

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'Backend Ledger', email: process.env.EMAIL_USER || 'asadali719310@gmail.com' },
                to: formattedTo,
                subject,
                textContent: text,
                htmlContent: html,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Error sending email via Brevo:', data);
            return;
        }

        console.log('Email sent successfully via Brevo:', data.messageId || data);
    } catch (error) {
        console.error('Error sending email:', error.message || error);
    }
};

async function sendRegisterationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!';
    const text = `Hello ${name},\n\nThank you for registering at Backend Ledger. We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
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