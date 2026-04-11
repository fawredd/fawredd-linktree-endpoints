import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (type !== 'profile' && type !== 'hero' && type !== 'service') {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        // Limit to 5MB here (web allows 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size must be < 5MB' }, { status: 400 });
        }

        const filename = `${userId}-${type}-${Date.now()}-${file.name}`;

        // We assume the caller already formatted it as webp before uploading.
        // If it's another image type, vercel blob will store it.
        const blob = await put(filename, file, {
            access: 'public',
            multipart: true
        });

        return NextResponse.json({ url: blob.url });
    } catch (error) {
        console.error('Error in upload route:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
