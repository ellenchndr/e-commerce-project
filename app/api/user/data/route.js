import { getAuth } from "@clerk/nextjs/server";


export async function GET(request) {
    try {
        const {userId} = getAuth(request);
    } catch (error) {
        
    }
}