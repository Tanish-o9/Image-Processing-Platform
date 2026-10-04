const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async ({
    to,
    name,
    otp,
    purpose
}) => {
    let subject;
    let heading;
    let description;

    if (purpose === "verify") {
        subject = "Verify your ImageRise account";
        heading = "Email Verification";
        description =
            "Use the OTP below to verify your ImageRise account.";
    } else if (purpose === "reset") {
        subject = "Reset your ImageRise password";
        heading = "Password Reset";
        description =
            "Use the OTP below to reset your ImageRise password.";
    } else {
        throw new Error("Invalid email purpose");
    }

    const expires =
        process.env.OTP_EXPIRES_MINUTES || 10;

    const { data, error } = await resend.emails.send({
        from: "ImageRise <onboarding@resend.dev>",
        to: [to],
        subject,
        text: `
Hello ${name},

${description}

Your OTP is: ${otp}

This OTP will expire in ${expires} minutes.

If you did not request this, please ignore this email.

Regards,
ImageRise Team
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${subject}</title>
</head>

<body style="font-family: Arial, sans-serif;">

    <h2>${heading}</h2>

    <p>Hello ${name},</p>

    <p>${description}</p>

    <div style="
        font-size: 30px;
        font-weight: bold;
        letter-spacing: 8px;
        margin: 20px 0;
    ">
        ${otp}
    </div>

    <p>
        This OTP will expire in ${expires} minutes.
    </p>

    <p>
        If you did not request this, please ignore this email.
    </p>

    <p>
        Regards,<br>
        ImageRise Team
    </p>

</body>
</html>
        `
    });

    if (error) {
        console.error("Resend email error:", error);
        throw new Error("Failed to send email");
    }

    return data;
};

module.exports = {
    sendOtpEmail
};