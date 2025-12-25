import React, { useState } from 'react';
import { Camera, Plus, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { compressImage } from '@/lib/utils/imageUtils';
import { useToast } from '@/lib/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderGalleryProps {
    images?: {
        before: string[];
        after: string[];
    };
    onImagesChange: (images: { before: string[]; after: string[] }) => void;
}

export default function OrderGallery({ images = { before: [], after: [] }, onImagesChange }: OrderGalleryProps) {
    const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
    const { toast } = useToast();

    const handleUpload = async (category: 'before' | 'after', files: FileList | null) => {
        if (!files) return;

        const key = category;
        setIsUploading((prev) => ({ ...prev, [key]: true }));

        try {
            const newImages: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const compressed = await compressImage(files[i]);
                newImages.push(compressed);
            }

            onImagesChange({
                ...images,
                [category]: [...(images[category] || []), ...newImages],
            });

            toast({
                title: 'Sukces',
                description: `Dodano ${newImages.length} zdjęć`,
                variant: 'success',
            });
        } catch (error) {
            console.error('Error uploading images:', error);
            toast({
                title: 'Błąd',
                description: 'Nie udało się dodać zdjęć',
                variant: 'destructive',
            });
        } finally {
            setIsUploading((prev) => ({ ...prev, [key]: false }));
        }
    };

    const removeImage = (category: 'before' | 'after', index: number) => {
        const newCategoryImages = [...images[category]];
        newCategoryImages.splice(index, 1);
        onImagesChange({
            ...images,
            [category]: newCategoryImages,
        });
    };

    const ImageSection = ({ title, category, icon: Icon }: { title: string; category: 'before' | 'after'; icon: React.ElementType }) => (
        <Card className="border-white/5 bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-md font-semibold">{title}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        id={`upload-${category}`}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleUpload(category, e.target.files)}
                        disabled={isUploading[category]}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        disabled={isUploading[category]}
                        className="h-8 px-2 text-xs hover:bg-white/10"
                    >
                        <label htmlFor={`upload-${category}`} className="cursor-pointer flex items-center">
                            {isUploading[category] ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4 mr-1" />
                            )}
                            Dodaj
                        </label>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {(!images[category] || images[category].length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/30 mb-2" />
                        <p className="text-xs text-muted-foreground">Brak zdjęć w tej sekcji</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <AnimatePresence>
                            {images[category].map((img, idx) => (
                                <motion.div
                                    key={`${category}-${idx}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group relative aspect-square rounded-xl overflow-hidden border border-white/5"
                                >
                                    <img src={img} alt={`${title} ${idx}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8 rounded-full shadow-lg"
                                            onClick={() => removeImage(category, idx)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <ImageSection title="Przed realizacją" category="before" icon={Camera} />
            <ImageSection title="Efekt końcowy" category="after" icon={ImageIcon} />
        </div>
    );
}
