import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import "dotenv/config"

const sesClient = new SESClient({});

export async function sendEmail(email: string, code: string) {
    const params = {
        Destination: {
            CcAddresses: [],
            ToAddresses: [email],
        },
        Source: "antoni@antonizyla.com",
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `Your OTP passcode for realtime editor is: ${code}, It will expire 10 minutes from now.`,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "TEXT_FORMAT_BODY",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: `OTP PASSCODE: ${code}`,
            },
        },
        ReplyToAddresses: ["antoni@antonizyla.com"],
    };
    const command = new SendEmailCommand(params);
    sesClient.send(command);
}
