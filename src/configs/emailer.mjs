import nodemailer from "nodemailer";

function setTransporter(email, password, service) {
    const transporter = nodemailer.createTransport({
        service: service,
        auth: {
            user: email,
            pass: password,
        },
    });

    return transporter;
}

function setMailOptions(title, generatedOTP, to_email, from_email, subject) {
    const mailOptions = {
        from: {
            name: title,
            address: from_email,
        },
        to: to_email,
        subject: subject,
        text: `OTP: ${generatedOTP}`,
    };
    return mailOptions;
}

export { setTransporter, setMailOptions };
