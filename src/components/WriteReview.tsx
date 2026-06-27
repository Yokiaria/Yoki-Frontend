import React, { useState } from 'react';
import { ActiveTab, Hotel, HotelReview } from '../types';
import { Star, Camera, CheckCircle, Upload, ArrowLeft } from 'lucide-react';

interface WriteReviewProps {
    setActiveTab: (tab: ActiveTab) => void;
    hotel: Hotel;
    onSuccessToast: (msg: string) => void;
}

export default function WriteReview({ setActiveTab, hotel, onSuccessToast }: WriteReviewProps) {
    const [ratings, setRatings] = useState({
        kebersihan: 5,
        pelayanan: 5,
        lokasi: 5,
        fasilitas: 5,
    });
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<string[]>([]);

    const handleRatingChange = (category: 'kebersihan' | 'pelayanan' | 'lokasi' | 'fasilitas', value: number) => {
        setRatings({
            ...ratings,
            [category]: value,
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages([...images, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment) {
            alert('Mohon tulis komentar ulasan Anda!');
            return;
        }

        onSuccessToast(`Ulasan Anda untuk ${hotel.name} berhasil dikirim! Terima kasih.`);
        setActiveTab('dashboard');
    };

    return (
        <main
            className="max-w-3xl mx-auto px-4 md:px-8 py-8 text-left font-sans flex-grow w-full pb-32"
            id="write-review-container"
        >
            <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 text-gray-500 hover:text-[#031636] dark:hover:text-[#fed023] font-bold text-xs font-label-caps uppercase tracking-wider mb-6 cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
            </button>

            <div className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 p-6 md:p-8 shadow-sm">
                <h1 className="font-h1 text-xl md:text-2xl font-bold text-[#031636] dark:text-white mb-2 uppercase tracking-tight">
                    Tulis Ulasan Stay Anda
                </h1>
                <p className="font-body-md text-sm text-gray-400 dark:text-gray-300 mb-8 leading-normal">
                    Bantu pelancong lain dengan membagikan pengalaman jujur Anda di <span className="font-bold text-[#031636] dark:text-[#fed023]">{hotel.name}</span>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8 text-left">
                    {/* Category Star Ratings */}
                    <section className="space-y-6">
                        <h3 className="font-h2 text-sm font-bold text-[#031636] dark:text-white uppercase tracking-wider border-b border-gray-50 dark:border-gray-800 pb-2">
                            Penilaian Kategori
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(['kebersihan', 'pelayanan', 'lokasi', 'fasilitas'] as const).map((category) => (
                                <div key={category} className="flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-150 dark:border-gray-700/50">
                                    <span className="font-body-md text-sm font-semibold capitalize text-[#031636] dark:text-gray-200">
                                        {category}
                                    </span>
                                    <div className="flex items-center gap-1 select-none">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleRatingChange(category, star)}
                                                className="transition-transform active:scale-125 focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-6 h-6 cursor-pointer ${star <= ratings[category]
                                                            ? 'fill-[#fed023] stroke-[#fed023]'
                                                            : 'text-gray-200 dark:text-gray-700'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Comment Box */}
                    <section className="flex flex-col gap-2">
                        <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400" htmlFor="comment">
                            Ulasan Anda
                        </label>
                        <textarea
                            id="comment"
                            rows={5}
                            placeholder="Ceritakan apa yang membuat stay Anda istimewa, pelayanan staf, keindahan kolam renang, makanan restoran, atau hal menarik lainnya..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border border-gray-200 dark:border-gray-700 rounded-[20px] p-4 bg-white dark:bg-gray-800 focus:border-[#031636] focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023] outline-none transition-all font-body-md text-sm text-[#031636] dark:text-white"
                        ></textarea>
                    </section>

                    {/* Photo Uploader */}
                    <section className="space-y-4">
                        <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400">
                            TAMBAHKAN FOTO (OPSIONAL)
                        </label>

                        <div className="flex flex-wrap gap-4 items-center">
                            {/* Box input */}
                            <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#031636] dark:hover:border-[#fed023] bg-gray-50/50 dark:bg-gray-800/30 flex flex-col items-center justify-center cursor-pointer group transition-all text-gray-400 hover:text-[#031636] dark:hover:text-[#fed023]">
                                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform mb-1" />
                                <span className="font-body-md text-[9px] font-bold uppercase tracking-wider">Upload</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>

                            {/* Previews */}
                            {images.map((img, idx) => (
                                <div key={idx} className="w-24 h-24 rounded-2xl overflow-hidden relative shadow-sm select-none">
                                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA Submit */}
                    <button
                        type="submit"
                        className="w-full h-[56px] bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] rounded-full font-bold text-sm tracking-wide shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        Kirim Ulasan <CheckCircle className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </main>
    );
}
