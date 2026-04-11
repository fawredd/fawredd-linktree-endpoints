'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
    label: string;
    type: 'profile' | 'hero' | 'service';
    onUploadSuccess: (url: string) => void;
    currentImage?: string | null;
}

export function ImageUploader({ label, type, onUploadSuccess, currentImage }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const convertToWebP = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Failed to get canvas context'));
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas to Blob failed'));
                }, 'image/webp', 0.85); // 85% quality webp
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be < 5MB');
            return;
        }

        setIsUploading(true);
        try {
            // Client-side webp conversion
            let uploadBlob: Blob | File = file;
            try {
                toast.info('Optimizing image...');
                uploadBlob = await convertToWebP(file);
            } catch (e) {
                console.warn('WebP conversion failed, uploading original', e);
                // Fallback to original
            }

            // Prepare form
            const formData = new FormData();
            formData.append('file', uploadBlob, file.name.replace(/\.[^/.]+$/, "") + ".webp");
            formData.append('type', type);

            const res = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to upload');
            }

            const data = await res.json();
            toast.success('Image uploaded successfully');
            onUploadSuccess(data.url);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Upload failed');
            } else {
                toast.error('Upload failed');
            }
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {isUploading ? 'Uploading...' : label}
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    className="hidden"
                />
            </div>
            {currentImage && (
                <p className="text-xs text-slate-500 truncate max-w-xs" title={currentImage}>
                    Current: {currentImage.split('/').pop()}
                </p>
            )}
        </div>
    );
}
