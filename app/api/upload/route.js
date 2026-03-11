import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const S3 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
});

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/webm", "audio/ogg"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only audio files are allowed." },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split(".").pop() || "mp3";
        const filename = `recordings/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

        // Upload to Cloudflare R2
        const command = new PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
        });

        await S3.send(command);

        // Construct the public URL
        const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${filename}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: filename,
        });
    } catch (error) {
        console.error("Error uploading file to Cloudflare R2:", error);
        return NextResponse.json(
            { error: "Failed to upload file", details: error.message },
            { status: 500 }
        );
    }
}
