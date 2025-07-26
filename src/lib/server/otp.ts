import { db } from "./database";
import { sendEmail } from "./emails";
import type { UUID } from "./sessions";
import { getUserById } from "./users";

interface Otp {
    otpId: UUID,
    userId: UUID,
    code: string,
    validUntil: Date,
}

const create = `
  CREATE TABLE IF NOT EXISTS OTP (
    otpID UUID NOT NULL PRIMARY KEY,
    userID UUID REFERENCES USERS(userID),
    code varchar(6) NOT NULL,
    validUntil INTEGER NOT NULL
  );
`

function generateOtpCode(): string {
    // TODO
    return "123456"
}

export async function sendUserOTP(email: string, code: string) {
    console.log("sending OTP code " + code + " to " + email);
    await sendEmail(email, code);
}

export async function createAndSetOTP(userId: UUID, keepAliveMin: number) {

    const currentTime = new Date();

    const record = await db.query("Insert into OTP (otpID, userID, code, validUntil) values (gen_random_uuid(), $1, $2, $3)",
        [
            userId,
            generateOtpCode(),
            Math.round(currentTime.getTime() / 1000 + keepAliveMin * 60) // storing it in seconds for some reason
        ])

    const user = await getUserById(userId);
    if (!user){
        return;
    }

    sendUserOTP(user.email, "123456");
    console.log("SET OTP IN DATBASE for " + userId)

}

export async function verifyOTP(userID: UUID, code: string): Promise<Boolean | null> {
    const stored = await db.query("Select code, validUntil from OTP where userID = $1", [userID]);
    if (stored.rowCount != 1) {
        return null;
    }

    const row = stored.rows[0];

    const storedCode = row['code'];
    const storedValidUntil = row['validuntil'];

    const time = new Date();
    if (Number(storedValidUntil) <= Math.round(time.getTime() / 1000)) {
        return null; // invalid
    }

    if (storedCode === code) {
        return true;
    }
    return false;
}
