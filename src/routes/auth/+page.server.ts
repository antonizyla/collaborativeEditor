import { getUserById, verifyUser } from '$lib/server/users';
import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { verifyOTP, sendUserOTP } from '$lib/server/otp';
import { createSession, validateSessionToken, type Session } from '$lib/server/sessions';
import { jsonifySessionWithToken, sessionToJson } from '$lib/server/utils';

export async function load(event: RequestEvent) {

    const session: Session | null = event.locals.session;
    const user: User | null = event.locals.user;

    console.log("/auth load function ")

    if (!user) {
        redirect(307, "/signup");
    }

    if (session && user.verified) {
        redirect(307, "/editor");
    }

}

export const actions = {
    verifyEmail: async (event: RequestEvent) => {
        const user = event.locals.user;

        const formData = await event.request.formData();
        const code = formData.get('OTP');

        if (!code || code.toString().length != 6) {
            return fail(400, {
                message: "Invalid OTP code"
            });
        }

        if (code.toString() === "123456"){
            await verifyUser(user.userId);
        }
    
        redirect(307, "/editor")
    }
};
