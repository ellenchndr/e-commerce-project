import dbConnect from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { connect } from "mongoose";
import { NextResponse } from "next/server";

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request) {
    try {
        // ambil userID dari request
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if(!isSeller) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');

        const files = formData.getAll('images');

        if(!files || files.length === 0) {
            return NextResponse.json({ success: false, message: 'No files uploaded' }, { status: 400 });
        }

        const result = await Promise.all(
            files.map(async (file) => {
                // cloudinary terimanya file buffer jadi diubah dlu dari File object ke Buffer
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        ( error, result) => {
                            if (error){
                                reject(error);
                            } else{
                                resolve (result);
                            }
                        }
                    )
                    stream.end(buffer);
                })
            })
        )

        const image = result.map(result => result.secure_url);

        await dbConnect();
        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price:Number(price),
            offerPrice: Number(offerPrice),
            image,
            date: Date.now(),
        })

        return NextResponse.json({ success: true, message: 'Product added successfully', newProduct }); 

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}