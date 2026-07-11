import React, { useState } from 'react';
import { ActiveTab, Hotel, UserProfile } from '../types';
import { ArrowLeft, Key, QrCode, MessageSquare, Send, CheckCircle2, Lock, Unlock, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CheckInOnlineProps {
    hotel: Hotel;
    user: UserProfile;
}

interface ChatMessage {
    id: number;
    sender: 'concierge' | 'user';
    text: string;
    time: string;
}

export default function CheckInOnline({ hotel, user }: CheckInOnlineProps) {
    const navigate = useNavigate();
    const [digitalKeyActivated, setDigitalKeyActivated] = useState(false);
    const [isDoorUnlocked, setIsDoorUnlocked] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatLog, setChatLog] = useState<ChatMessage[]>([
        {
            id: 1,
            sender: 'concierge',
            text: `Selamat datang di ${hotel.name}, Pak ${user.name.split(' ')[0]}. Kami senang melayani Anda. Ada yang bisa kami bantu mengenai reservasi kamar Anda?`,
            time: '08:00',
        },
    ]);

    const handleActivateKey = () => {
        setDigitalKeyActivated(true);
        alert('Kunci Digital Kamar Berhasil Diaktifkan! Silakan gunakan tombol Buka Pintu.');
    };

    const handleUnlockDoor = () => {
        setIsDoorUnlocked(true);
        setTimeout(() => {
            setIsDoorUnlocked(false);
        }, 4000);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg: ChatMessage = {
            id: chatLog.length + 1,
            sender: 'user',
            text: chatInput,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };

        setChatLog((prev) => [...prev, userMsg]);
        setChatInput('');

        // Generate smart concierge response
        setTimeout(() => {
            let responseText = `Baik Pak ${user.name.split(' ')[0]}, permintaan Anda telah kami terima dan segera dikoordinasikan dengan tim terkait.`;
            const txt = chatInput.toLowerCase();
            if (txt.includes('bantal') || txt.includes('pillow')) {
                responseText = 'Tentu, permintaan bantal tambahan Anda telah diteruskan ke bagian Housekeeping. Petugas kami akan segera mengantarkannya ke Kamar 502 dalam waktu 10 menit.';
            } else if (txt.includes('handuk') || txt.includes('towel')) {
                responseText = 'Tentu, handuk bersih tambahan segera kami antarkan ke Kamar 502. Apakah Anda membutuhkan perlengkapan mandi lainnya?';
            } else if (txt.includes('makan') || txt.includes('lapar') || txt.includes('sarapan')) {
                responseText = 'Menu Room Service kami telah diperbarui. Anda dapat memesan makanan langsung dari aplikasi ini atau memanggil nomor 1 dari telepon kamar Anda.';
            } else if (txt.includes('wifi')) {
                responseText = `Informasi Wi-Fi hotel: SSID "${hotel.name.replace(/\s+/g, '')}_Guest", Kata Sandi: "grandstarluxury5". Silakan hubungi kami kembali jika mengalami kendala.`;
            }

            const conciergeMsg: ChatMessage = {
                id: chatLog.length + 2,
                sender: 'concierge',
                text: responseText,
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            };
            setChatLog((prev) => [...prev, conciergeMsg]);
        }, 1500);
    };

    return (
        <main
            className="max-w-7xl mx-auto px-4 md:px-8 py-8 text-left font-sans flex-grow w-full pb-32 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-forwards"
            id="check-in-online-container" >
            {/* Top Back Action Bar (12 Columns) */}
            <div className="col-span-12">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#031636] dark:hover:text-[#fed023] font-bold text-xs font-label-caps uppercase tracking-wider mb-2 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
                </button>
                <h1 className="font-h1 text-xl md:text-2xl font-bold text-[#031636] dark:text-white uppercase tracking-tight mt-2">
                    Check-in Online &amp; Digital Pass
                </h1>
                <p className="font-body-md text-sm text-gray-400 dark:text-gray-300">
                    Kelola kunci digital kamar dan komunikasikan kebutuhan Anda secara langsung.
                </p>
            </div>

            {/* Left Column: Digital Boarding Pass & Key (6 Columns) */}
            <section className="col-span-12 lg:col-span-6 space-y-6">
                {/* Pass Card wrapper */}
                <div className="bg-[#1A2B4C] text-white rounded-[24px] overflow-hidden shadow-xl border border-white/10 flex flex-col relative select-none">
                    {/* Header */}
                    <div className="bg-[#031636] p-6 flex justify-between items-center border-b border-white/5">
                        <span className="font-h1 text-sm font-black tracking-widest uppercase">GRANDSTARIND</span>
                        <span className="bg-[#fed023]/20 text-[#fed023] border border-[#fed023]/20 font-label-caps text-[9px] font-bold px-3 py-1 rounded-full uppercase">
                            Digital Pass
                        </span>
                    </div>

                    {/* Details Row */}
                    <div className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 justify-between items-start">
                        <div className="space-y-4 flex-grow text-left">
                            <div>
                                <span className="text-white/40 block text-[9px] uppercase font-bold tracking-widest mb-0.5">Hotel</span>
                                <h3 className="font-h2 text-base md:text-lg font-bold text-white leading-snug">
                                    {hotel.name}
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-white/40 block text-[9px] uppercase font-bold tracking-widest mb-0.5">Kamar</span>
                                    <span className="font-price-display text-lg font-black text-[#fed023]">Room 502</span>
                                </div>
                                <div>
                                    <span className="text-white/40 block text-[9px] uppercase font-bold tracking-widest mb-0.5">Kode Booking</span>
                                    <span className="font-mono text-sm font-bold text-[#fed023]">GS-H-4927</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-white/40 block text-[9px] uppercase font-bold tracking-widest mb-0.5">Tamu</span>
                                <span className="font-body-md text-sm font-semibold text-white">{user.name}</span>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-3 rounded-2xl flex items-center justify-center shrink-0 self-center shadow-lg border border-white/10">
                            <img
                                alt="QR Code Kunci Kamar"
                                className="w-28 h-28"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnr8oE1lQyHZpqvxJz33MeEsAzxY0-yD_jpBGk1wrfL5fiiVA1r0Yu4rapBBAgOkf5NzVLjIPRt61ooSnMayfi0iCRFZQHYkd0OtZMqOs3GT9M_kY72ptUwG9MokiFALaI3emSoKqjFzNtKpaNa11dOnMwKEzlfBLcKV_Y92U84ezLzp6UnbGpmkLfBSdieobVd77-qcppjTHh8YxEpsWmcCrUceBMbuOVNQVYq11Gq1NvKDy4Hm5Nn1IPNB846ydV2nXcPjJbYA8"
                            />
                        </div>
                    </div>

                    {/* Footer Line */}
                    <div className="bg-[#031636]/50 p-6 border-t border-white/5 flex justify-between items-center text-xs text-white/75 font-body-md">
                        <span>Tunjukkan QR Code ini pada resepsionis atau gunakan Kunci Digital di bawah.</span>
                    </div>
                </div>

                {/* Digital Key Activation */}
                <div className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 p-6 flex flex-col gap-6 text-center">
                    <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm ${digitalKeyActivated
                            ? 'bg-[#00a858]/15 text-[#00a858] border border-[#00a858]/25'
                            : 'bg-[#fed023]/15 text-[#735c00] border border-[#fed023]/25'
                            }`}>
                            <Key className="w-8 h-8" />
                        </div>
                        <h3 className="font-h2 text-base font-bold text-[#031636] dark:text-white mb-1">
                            Kunci Kamar Digital
                        </h3>
                        <p className="font-body-md text-xs text-gray-400 dark:text-gray-300 max-w-sm">
                            Gunakan ponsel Anda sebagai kunci fisik kamar. Berfungsi instan setelah check-in disetujui.
                        </p>
                    </div>

                    {!digitalKeyActivated ? (
                        <button
                            onClick={handleActivateKey}
                            className="bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] h-[48px] px-6 rounded-full font-bold text-xs font-label-caps uppercase tracking-wider transition-all select-none cursor-pointer active:scale-95 shadow-sm"
                        >
                            Aktifkan Kunci Digital
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <button
                                onClick={handleUnlockDoor}
                                className={`w-full h-[56px] rounded-full font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer select-none ${isDoorUnlocked
                                    ? 'bg-[#00a858] text-white animate-pulse'
                                    : 'bg-[#1A2B4C] hover:bg-[#031636] text-white'
                                    }`}
                            >
                                {isDoorUnlocked ? (
                                    <>
                                        <Unlock className="w-5 h-5 animate-bounce" /> PINTU TERBUKA (4 Detik)
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" /> BUKA PINTU KAMAR
                                    </>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-1.5 text-[#00a858] font-body-md text-xs font-bold bg-[#00a858]/5 p-3 rounded-xl border border-[#00a858]/10">
                                <CheckCircle2 className="w-4 h-4" /> Kunci Digital Aktif • Dekatkan HP ke gagang pintu kamar.
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Right Column: E-Concierge Chat (6 Columns) */}
            <section className="col-span-12 lg:col-span-6">
                <div className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[520px]">
                    {/* Concierge Chat Header */}
                    <div className="bg-gray-50 dark:bg-[#031636] px-6 py-4 border-b border-gray-150 dark:border-gray-800/80 flex justify-between items-center shrink-0">
                        <div className="flex items-center space-x-3 text-left">
                            <div className="w-10 h-10 rounded-full bg-[#1a2b4c] border border-white/10 overflow-hidden flex items-center justify-center text-[#fed023] font-bold">
                                C
                            </div>
                            <div>
                                <h3 className="font-h2 text-sm font-bold text-[#031636] dark:text-white leading-tight">
                                    E-Concierge GrandStarind
                                </h3>
                                <span className="text-[10px] text-[#00a858] font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                                    <span className="w-1.5 h-1.5 bg-[#00a858] rounded-full"></span> Online
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => alert('Menghubungkan panggilan suara ke resepsionis...')}
                            className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 transition-all cursor-pointer"
                            title="Hubungi Concierge"
                        >
                            <PhoneCall className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Log */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/20 dark:bg-gray-800/10">
                        {chatLog.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'ml-auto text-right' : 'mr-auto text-left'}`}
                            >
                                <div
                                    className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-[#1A2B4C] text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none shadow-sm'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <span className="text-[9px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
                                    {msg.time}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Chat text Input form */}
                    <form
                        onSubmit={handleSendMessage}
                        className="p-4 bg-white dark:bg-[#1A2B4C] border-t border-gray-150 dark:border-gray-800/80 flex gap-2 shrink-0"
                    >
                        <input
                            type="text"
                            placeholder="Tulis pesan... (cth: butuh handuk tambahan, wifi...)"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="flex-grow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023] rounded-full px-5 py-2.5 font-body-md text-xs md:text-sm text-[#031636] dark:text-white"
                        />
                        <button
                            type="submit"
                            className="bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] w-11 h-11 rounded-full flex items-center justify-center shrink-0 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
