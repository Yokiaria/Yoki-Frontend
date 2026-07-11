  import React, { useState } from 'react';
  import { ActiveTab, UserProfile } from '../src/types';
  import { Eye, EyeOff, ArrowRight } from 'lucide-react';

  interface AuthProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
    setUser: (user: UserProfile) => void;
    onSuccessToast: (msg: string) => void;
  }

  export default function Auth({ activeTab, setActiveTab, setUser, onSuccessToast }: AuthProps) {
    const isSignUp = activeTab === 'auth-register';

    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(true);

    const handleTabToggle = (signUp: boolean) => {
      setActiveTab(signUp ? 'auth-register' : 'auth-login');
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (isSignUp) {
        if (!nama || !email || !password) {
          alert('Mohon lengkapi semua bidang!');
          return;
        }
        if (password !== confirmPassword) {
          alert('Konfirmasi kata sandi tidak cocok!');
          return;
        }
        if (!termsAccepted) {
          alert('Anda harus menyetujui Syarat & Ketentuan!');
          return;
        }

        // Perform register mock
        const registeredUser: UserProfile = {
          name: nama,
          email: email,
          phone: phone || '+62 812 3456 7890',
          loyaltyPoints: 0,
          tier: 'Regular Member',
        };
        setUser(registeredUser);
        onSuccess(`Registrasi Berhasil! Selamat datang, ${nama}.`);
      } else {
        if (!email || !password) {
          alert('Mohon lengkapi email dan kata sandi');
          return;
        }
        // Perform log in
        const defaultUser: UserProfile = {
          name: email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '),
          email: email,
          phone: '+62 812 3456 7890',
          loyaltyPoints: 12450,
          tier: 'Elite Member',
        };
        setUser(defaultUser);
        onSuccess(`Selamat Datang Kembali, ${defaultUser.name}!`);
      }
    };

    const onSuccess = (msg: string) => {
      onSuccessToast(msg);
      setActiveTab('dashboard');
    };

    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8 font-sans flex-grow w-full">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center select-none"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQtJ3LGW7cIb67d1jcdb6qxjNLzZYXAs3KImBG4zRBVLxuvfVGV81SU1cB48o-2-k1MwLlRWVlZTY6z_Nn6IDT2NjLA19zJ1CG3YqhEVQsk6bJ_kkcHQSIb7g36vc4VQX6lbjuLt2514T5OaVOmcvK7Dho5J6yQT2_rJlq1OKNq1VjydL6bDbdY6yJ_ZUlGroE4gGaThsuZKqkmxt0ureXDZUW2F5s9axG5qjP7IfNMw3_F0et5skRqUs58xdDAwD_pzi6-xVFup0')`,
          }}
          id="auth-bg-overlay"
        >
          <div className="absolute inset-0 bg-[#031636]/40 backdrop-blur-[2px]"></div>
        </div>

        {/* Main Container */}
        <main className="relative z-10 w-full max-w-md my-12" id="auth-glass-container">
          {/* Auth Card */}
          <div className="bg-white/85 dark:bg-[#1a2b4c]/85 backdrop-blur-2xl w-full rounded-[24px] shadow-2xl border border-white/20 overflow-hidden flex flex-col">
            {/* Header/Tabs */}
            <div className="flex flex-col pt-8 px-8 pb-4">
              <div className="flex justify-center mb-6">
                <span
                  onClick={() => setActiveTab('home')}
                  className="font-h1 text-xl md:text-2xl text-[#031636] dark:text-[#fed023] tracking-tighter font-black uppercase cursor-pointer"
                >
                  GRANDSTARIND
                </span>
              </div>
              <div className="flex w-full border-b border-gray-200 dark:border-gray-700 relative">
                <button
                  onClick={() => handleTabToggle(false)}
                  className={`flex-1 pb-4 text-center font-h2 text-sm md:text-base font-semibold transition-all duration-200 cursor-pointer ${
                    !isSignUp
                      ? 'text-[#031636] dark:text-[#fed023]'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white'
                  }`}
                >
                  Masuk
                  {!isSignUp && (
                    <div className="absolute bottom-0 left-0 w-1/2 h-[3px] bg-[#031636] dark:bg-[#fed023] rounded-t-full transition-all duration-300"></div>
                  )}
                </button>
                <button
                  onClick={() => handleTabToggle(true)}
                  className={`flex-1 pb-4 text-center font-h2 text-sm md:text-base font-semibold transition-all duration-200 cursor-pointer ${
                    isSignUp
                      ? 'text-[#031636] dark:text-[#fed023]'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white'
                  }`}
                >
                  Daftar
                  {isSignUp && (
                    <div className="absolute bottom-0 right-0 w-1/2 h-[3px] bg-[#031636] dark:bg-[#fed023] rounded-t-full transition-all duration-300"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-8 pt-4 flex-1">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {isSignUp ? (
                  /* Fields Sign Up */
                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400" htmlFor="nama">
                        Nama Lengkap
                      </label>
                      <input
                        className="w-full h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 font-body-lg text-sm text-[#031636] dark:text-white focus:outline-none transition-all focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023]"
                        id="nama"
                        placeholder="Masukkan nama Anda"
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="w-full h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 font-body-lg text-sm text-[#031636] dark:text-white focus:outline-none transition-all focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023]"
                        id="email"
                        placeholder="nama@email.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400" htmlFor="password">
                        Kata Sandi
                      </label>
                      <div className="relative">
                        <input
                          className="w-full h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-11 font-body-lg text-sm text-[#031636] dark:text-white focus:outline-none transition-all focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023]"
                          id="password"
                          placeholder="Minimal 8 karakter"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#031636] transition-colors"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-label-caps text-[10px] uppercase font-bold text-gray-400"
                        htmlFor="confirm_password"
                      >
                        Konfirmasi Kata Sandi
                      </label>
                      <div className="relative">
                        <input
                          className="w-full h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-11 font-body-lg text-sm text-[#031636] dark:text-white focus:outline-none transition-all focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023]"
                          id="confirm_password"
                          placeholder="Ulangi kata sandi"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#031636] transition-colors"
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Fields Login */
                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="w-full h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 font-body-lg text-sm text-[#031636] dark:text-white focus:outline-none transition-all focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023]"
                        id="email"
                        placeholder="Masukkan email Anda"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400" htmlFor="password">
                          Kata Sandi
                        </label>
                        <button
                          type="button"
                          onClick={() => alert('Fitur pemulihan kata sandi dikirim ke email Anda.')}
                          className="text-xs font-semibold text-[#031636] dark:text-[#fed023] hover:underline"
                        >
                          Lupa sandi?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          className="w-full h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-11 font-body-lg text-sm text-[#031636] dark:text-white focus:outline-none transition-all focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023]"
                          id="password"
                          placeholder="Masukkan kata sandi"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#031636] transition-colors"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms for sign up */}
                {isSignUp && (
                  <div className="flex items-start gap-3 text-left">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        className="w-5 h-5 border-gray-300 dark:border-gray-600 rounded text-[#031636] dark:text-[#fed023] focus:ring-1 focus:ring-[#031636] bg-white dark:bg-gray-800 cursor-pointer"
                        id="terms"
                        type="checkbox"
                      />
                    </div>
                    <label className="font-body-md text-xs text-gray-500 dark:text-gray-400 leading-normal" htmlFor="terms">
                      Saya menyetujui{' '}
                      <button
                        type="button"
                        onClick={() => alert('S&K: GRANDSTARIND menjamin kemewahan layanan perjalanan.')}
                        className="text-[#031636] dark:text-[#fed023] font-bold hover:underline"
                      >
                        Syarat &amp; Ketentuan
                      </button>{' '}
                      dan{' '}
                      <button
                        type="button"
                        onClick={() => alert('Privasi: GRANDSTARIND mengenkripsi semua data Anda.')}
                        className="text-[#031636] dark:text-[#fed023] font-bold hover:underline"
                      >
                        Kebijakan Privasi
                      </button>
                      .
                    </label>
                  </div>
                )}

                {/* Primary Action Submit button */}
                <button
                  className="w-full h-12 bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] rounded-full font-h2 text-sm font-extrabold hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                  type="submit"
                >
                  {isSignUp ? 'Daftar' : 'Masuk'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 py-1">
                  <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
                  <span className="font-label-caps text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {isSignUp ? 'Atau daftar dengan' : 'Atau lanjutkan dengan'}
                  </span>
                  <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Social Login buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      const defaultUser: UserProfile = {
                        name: 'Budi Santoso',
                        email: 'budi.santoso@gmail.com',
                        phone: '+62 812 3456 7890',
                        loyaltyPoints: 12450,
                        tier: 'Elite Member',
                      };
                      setUser(defaultUser);
                      onSuccess('Berhasil login dengan Google!');
                    }}
                    className="flex-1 h-12 bg-white hover:bg-gray-50 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-700 transition-colors cursor-pointer select-none"
                  >
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      ></path>
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      ></path>
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      ></path>
                    </svg>
                    <span className="hidden sm:inline">Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const defaultUser: UserProfile = {
                        name: 'Budi Santoso',
                        email: 'budi.santoso@example.com',
                        phone: '+62 812 3456 7890',
                        loyaltyPoints: 12450,
                        tier: 'Elite Member',
                      };
                      setUser(defaultUser);
                      onSuccess('Berhasil login dengan Facebook!');
                    }}
                    className="flex-1 h-12 bg-[#1877F2] text-white hover:bg-[#166FE5] border border-transparent rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors cursor-pointer select-none"
                  >
                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103v3.368s-.936-.002-1.117-.002c-1.69 0-1.97.351-1.97 1.488v2.602h3.198l-.348 3.667h-2.85v7.98h-4.239z"></path>
                    </svg>
                    <span className="hidden sm:inline">Facebook</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
