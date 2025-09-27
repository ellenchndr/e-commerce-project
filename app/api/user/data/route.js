import dbConnect from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        // If no userId, the user is not authenticated
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        console.log("\n🔍 API route /api/user/data hit.");
        console.log("🆔 Trying to find user with Clerk ID:", userId);

        await dbConnect();
        const user = await User.findById(userId);

        if (!user) {
            console.log("❌ User not found in database for ID:", userId);
            // Use status 404 for Not Found
            return NextResponse.json({ success: false, message: "User Not Found" }, { status: 404 });
        }

        console.log("✅ Found user in database:", user);
        return NextResponse.json({ success: true, user: user }); 
    } catch (error) {
        // Use status 500 for server errors
        console.error("🚨 ERROR in /api/user/data:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}