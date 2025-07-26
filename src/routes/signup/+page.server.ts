import { createAndSetOTP } from "$lib/server/otp";
import { createSession } from "$lib/server/sessions";
import { createUser, type User } from "$lib/server/users";
import { fail, redirect, type RequestEvent } from "@sveltejs/kit";

export function load(event: RequestEvent) {
    console.log("Signup Page Load")
}

export const actions = {
    signup: async (event: RequestEvent) => {

        // extract the user's email that was submitted
        const formData = await event.request.formData();
        const email = formData.get("Email")?.toString();

        if (typeof email !== "string" || email === "") {
            return fail(400, {
                message: "Invalid email address provided",
                email: ""
            });
        }

        // TODO VERIFY EMAIL INPUT e.g. @ and .domain

        // create a user account for this email
        const user = await createUser(email);
        if (!user) { // return if cannot create it
            return fail(400, {
                message: "Unable to create account with this email address",
                email: email
            });
        }

        await createAndSetOTP(user.userId, 10);

        event.cookies.set('userId', user.userId, {
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        throw redirect(300, "/auth")


    }
}
