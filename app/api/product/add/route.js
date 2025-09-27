import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
    } catch (error) {
        
    }
}