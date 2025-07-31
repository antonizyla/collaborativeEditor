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

	await sendUserOTP(user.email, otp);
	console.log(`Sending otp to ${user.email} with value: ${otp}`);
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

export async function getOTPValidUntilDate(userId: UUID): Promise<Date | null> {
	const store = await db.query('select validuntil from otp where userid=$1', [userId]);
	if (store.rowCount !== 1) {
		return null;
	}
	const date = new Date(store.rows[0]['validuntil'] * 1000);
	return date;
}
