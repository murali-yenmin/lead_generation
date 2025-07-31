
'use client';

import * as React from 'react';
import { ChangeEvent } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Trash2, Download, Eye } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTrigger } from './dialog';
import { ImageObject } from '../linkedin-post-composer';
import { DialogTitle } from '@radix-ui/react-dialog';


interface ImageUploadProps {
    value: ImageObject[] | null;
    onFilesChange: (images: ImageObject[] | null) => void;
    className?: string;
    contentClassName?: string;
    loading?: boolean;
    multiple?: boolean;
    hidePreview?: boolean;
    isAiGenerated?: boolean;
    generatedImageHistory?: ImageObject[];
    onSelectFromHistory?: (image: ImageObject, index: number) => void;
}

export function ImageUpload({ 
    value, 
    onFilesChange, 
    className, 
    contentClassName, 
    loading = false,
    multiple = false,
    hidePreview = false,
    isAiGenerated = false,
    generatedImageHistory = [],
    onSelectFromHistory = () => {},
}: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = React.useState<ImageObject | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
        const filePromises = Array.from(files).map(file => {
            return new Promise<ImageObject>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({ name: file.name, url: reader.result as string });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises).then(newImages => {
            if (multiple) {
                onFilesChange(value ? [...value, ...newImages] : newImages);
            } else {
                onFilesChange(newImages.length > 0 ? [newImages[0]] : null);
            }
        });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>, indexToRemove: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (value) {
        const newImages = value.filter((_, index) => index !== indexToRemove);
        onFilesChange(newImages.length > 0 ? newImages : null);
    }
  };
  
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>, imageUrl: string, imageName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = imageName || 'download.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        variant: 'success',
        title: 'Image Downloaded',
        description: 'The image has been saved to your computer.',
      });
    }
  };

  const triggerFileSelect = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current && !loading) {
        fileInputRef.current.click();
    }
  }

  const hasImages = value && value.length > 0;

  if (loading) {
     return (
        <div className={cn("w-full space-y-4", className)}>
            <div
                className={cn(
                'relative flex w-full flex-col items-center justify-center rounded-lg border-2 bg-card transition-colors group/upload aspect-video',
                'border-input overflow-hidden p-0',
                contentClassName
                )}
            >
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground p-4">
                    <Skeleton className="h-full w-full absolute inset-0" />
                    <div className="absolute flex flex-col items-center justify-center gap-2 text-center z-10">
                        <Loader2 className="size-8 animate-spin" />
                        <p className="text-sm font-medium">Generating your image...</p>
                    </div>
                </div>
            </div>
        </div>
     )
  }

  if (hidePreview) {
    return (
        <div className={cn("w-full", className)}>
             <div onClick={triggerFileSelect} className={cn('cursor-pointer', contentClassName)}>
                {/* This content is projected by the parent */}
             </div>
             <input
              ref={fileInputRef}
              id="image-upload-input-hidden"
              type="file"
              className="sr-only"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
              disabled={loading}
              multiple={multiple}
            />
        </div>
    )
  }

  const renderContent = () => {
    if (hasImages) {
        return (
            <Dialog>
                <div
                    className={cn(
                    'relative flex w-full flex-col items-center justify-center rounded-lg border-2 bg-card transition-colors group/upload aspect-video',
                    'border-input overflow-hidden p-0',
                    contentClassName
                    )}
                >
                    <Image
                        src={value![0].url}
                        alt={value![0].name}
                        title={value![0].name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                        <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white h-10 w-10">
                                <Eye className="size-6" />
                            </Button>
                        </DialogTrigger>
                    </div>
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                        {isAiGenerated && (
                            <Button
                                type="button"
                                size="sm"
                                onClick={(e) => handleDownload(e, value![0].url, value![0].name)}
                            >
                                <Download className="mr-2" />
                                Download
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={(e) => handleRemoveImage(e, 0)}
                        >
                            <Trash2 className="mr-2" />
                            Remove
                        </Button>
                    </div>
                </div>
                <DialogContent className="max-w-3xl">
                    <DialogTitle className="sr-only">Image Preview: {value![0].name}</DialogTitle>
                    <Image
                        src={value![0].url}
                        alt={value![0].name}
                        width={1200}
                        height={800}
                        className="object-contain w-full h-full rounded-lg"
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <div
            onClick={triggerFileSelect}
            className={cn(
                'relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-input hover:bg-accent cursor-pointer transition-colors group/upload aspect-video',
                loading && 'cursor-wait opacity-50',
                'h-full'
            )}
        >
            <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground text-center p-2">
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">Click to upload Image</span>
            </div>
        </div>
    );
  }
  
  return (
    <div className={cn("w-full space-y-4", className)}>
        {renderContent()}
        {multiple && !isAiGenerated && hasImages && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {value!.slice(1).map((image, index) => (
                    <div key={index + 1} className="relative group aspect-square rounded-lg overflow-hidden border">
                        <Image src={image.url} alt={image.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <Button type="button" variant="destructive" size="icon" className="h-8 w-8 z-10" onClick={(e) => handleRemoveImage(e, index + 1)}>
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {isAiGenerated && generatedImageHistory.length > 0 && ( 
                <div className="flex justify-center gap-2 m-0" style={{margin:"0 !important"}}>
                    {generatedImageHistory.map((image, index) => (
                        <div 
                            key={index} 
                            className="relative group size-20 rounded-lg overflow-hidden border cursor-pointer"
                            onClick={() => onSelectFromHistory(image, index)}
                        >
                            <Image src={image.url} alt={image.name} fill className="object-cover" />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <p className="text-white text-xs font-bold">Use</p>
                            </div>
                        </div>
                    ))}
                </div> 
        )}

        {multiple && (
            <div className="flex justify-center mt-2">
                <Button type="button" variant="outline" onClick={triggerFileSelect}>
                    <Upload className="mr-2" />
                    Upload Image{multiple && 's'}
                </Button>
            </div>
        )}
         <input
            ref={fileInputRef}
            id="image-upload-input"
            type="file"
            className="sr-only"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
            disabled={loading}
            multiple={multiple}
        />
    </div>
  );
}
