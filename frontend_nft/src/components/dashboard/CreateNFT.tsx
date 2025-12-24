import { useContext, useEffect, useState } from "react";
import { AppContext, type NFT } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CreateNFT() {
    const { createNFT, updateNFT, getNFTById, loading } = useContext(AppContext)!;
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState<NFT | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        if (isEditMode && id) {
            const fetchData = async () => {
                setIsLoadingData(true);
                try {
                    const data = await getNFTById(parseInt(id));
                    if (data) {
                        setInitialData(data);
                        setImagePreview(data.image);
                    }
                } catch (error) {
                    toast.error("Failed to load NFT data");
                    navigate("/author/dashboard");
                } finally {
                    setIsLoadingData(false);
                }
            };
            fetchData();
        }
    }, [id, isEditMode, getNFTById, navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        try {
            let success;
            if (isEditMode && id) {
                // If editing, and no new image selected, backend handles keeping old image if field is empty/omitted
                success = await updateNFT(parseInt(id), formData);
                if (success) {
                    toast.success("NFT Updated Successfully");
                    navigate("/author/my-nfts");
                }
            } else {
                success = await createNFT(formData);
                if (success) {
                    toast.success("NFT Created Successfully");
                    navigate("/author/my-nfts"); // Redirect to My NFTs usually better
                }
            }
        } catch (error) {
            console.error("Error saving NFT:", error);
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">{isEditMode ? 'Edit NFT' : 'Create New NFT'}</h1>
                <p className="text-muted-foreground mt-1">
                    {isEditMode ? 'Update your digital asset details' : 'Mint your digital asset to the marketplace'}
                </p>
            </div>

            <Card className="bg-secondary/5 border-white/5 backdrop-blur-sm text-white">
                <CardHeader>
                    <CardTitle>Item Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6" key={initialData?.id || 'new'}>
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="image">Upload Image</Label>
                            <div className="flex flex-col items-center justify-center w-full">
                                <label
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white/5 border-white/10 transition-colors relative overflow-hidden"
                                >
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-contain p-2"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <ImagePlus className="w-10 h-10 mb-3 text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF (MAX. 10MB)
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        id="image-upload"
                                        name="image"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        {...(!isEditMode && { required: true })} // Required only on create
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Title & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Item Name</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g. 'Cosmic Ape #42'"
                                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                                    required
                                    defaultValue={initialData?.title}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (ETH)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    placeholder="e.g. 0.5"
                                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                                    required
                                    defaultValue={initialData?.price}
                                />
                            </div>
                        </div>

                        {/* Status & Listing Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="status">Listing Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    defaultValue={initialData?.status || "draft"}
                                    onChange={(e) => {
                                        const dateInput = document.getElementById('listing-date-container');
                                        if (e.target.value === 'pre_listing') {
                                            dateInput?.classList.remove('hidden');
                                        } else {
                                            dateInput?.classList.add('hidden');
                                        }
                                    }}
                                >
                                    <option value="draft" className="bg-[#1e1e1e]">Draft (Private)</option>
                                    <option value="pre_listing" className="bg-[#1e1e1e]">Pre-Listing (Scheduled)</option>
                                    <option value="listed" className="bg-[#1e1e1e]">Live Listing (Public)</option>
                                </select>
                            </div>

                            <div
                                id="listing-date-container"
                                className={`space-y-2 ${initialData?.status === 'pre_listing' ? '' : 'hidden'}`}
                            >
                                <Label htmlFor="listing_date">Listing Date & Time</Label>
                                <Input
                                    id="listing_date"
                                    name="listing_date"
                                    type="datetime-local"
                                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                                    defaultValue={initialData?.listing_date ? new Date(initialData.listing_date).toISOString().slice(0, 16) : ''}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Set when this item should go live.
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe your item..."
                                className="min-h-[120px] bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                                required
                                defaultValue={initialData?.description}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting || loading}
                                className="bg-primary hover:bg-primary/90 text-white font-semibold min-w-[150px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isEditMode ? 'Updating...' : 'Minting...'}
                                    </>
                                ) : (
                                    isEditMode ? "Update Item" : "Create Item"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
