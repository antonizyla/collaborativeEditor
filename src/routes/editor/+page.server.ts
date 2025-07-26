import { type RequestEvent } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { getUserById } from "$lib/server/users";

export async function load(event: RequestEvent) {
    
    const userId = event.cookies.get("userId");
    if (!userId) {
        console.log("redirecting to Signup")
        throw redirect(307, "/signup");
    }

    const user = await getUserById(userId);
    if (!user){
        throw redirect(307, "/signup");
    }

    if (!user.verified){
        throw redirect(307, "/auth")
    }

}

