import { db } from './database';
import { sendEmail } from './emails';
import type { UUID } from './sessions';
import { getUserById } from './users';

interface Otp {
	otpId: UUID;
	userId: UUID;
	code: string;
	validUntil: Date;
}

const create = `
  CREATE TABLE IF NOT EXISTS OTP (
    otpID UUID NOT NULL PRIMARY KEY,
    userID UUID REFERENCES USERS(userID),
    code varchar(6) NOT NULL,
    validUntil INTEGER NOT NULL
  );
`;

export function generateOtpCode(): string {
	const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	let generated = '';

	while (generated.length < 6) {
		generated = generated + chars.at(Math.round(Math.random() * chars.length));
	}

	return generated;
}

export async function sendUserOTP(email: string, code: string) {
	await sendEmail(email, code);
}

export async function createAndSetOTP(userId: UUID, keepAliveMin: number) {
	const currentTime = new Date();

	const otp = generateOtpCode();

	await db.query(
		'Insert into OTP (otpID, userID, code, validUntil) values (gen_random_uuid(), $1, $2, $3)',
		[
			userId,
			otp,
			Math.round(currentTime.getTime() / 1000 + keepAliveMin * 60) // storing it in seconds for some reason
		]
	);

	const user = await getUserById(userId);
	if (!user) {
		return;
	}

	sendUserOTP(user.email, otp);
}

export async function verifyOTP(userID: UUID, code: string): Promise<Boolean | null> {
	const stored = await db.query('Select code, validUntil from OTP where userID = $1', [userID]);
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
