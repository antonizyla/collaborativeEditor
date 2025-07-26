import { getUserById } from "$lib/server/users";
import type { RequestEvent } from "@sveltejs/kit"

export async function load(event: RequestEvent) {
    const userId = event.cookies.get("userId");
    if (!userId){
        return {email: ""}
    }
    const user = await getUserById(userId);
    if (!user){
        return {email: ""}
    }
    return {
        email: user.email
    }
}
