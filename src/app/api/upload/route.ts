import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary from server-side environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64 buffer for Cloudinary uploader
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = buffer.toString(encoding);
    const fileUri = `data:${mimeType};${encoding},${base64Data}`;

    // Upload to Cloudinary under the "medical-store" directory
    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder: "medical-store",
    });

    return NextResponse.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload API error:", error);
    const errMsg = error instanceof Error ? `${error.message}\n${error.stack}` : String(error);
    try {
      fs.writeFileSync(path.join(process.cwd(), "upload_error.log"), errMsg);
    } catch (e) {
      console.error("Failed to write error log:", e);
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload image" },
      { status: 500 }
    );
  }
}
