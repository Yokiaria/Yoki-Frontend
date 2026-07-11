import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { Award, ChevronRight, CheckCircle, Crown, Shield, Star, Info } from 'lucide-react';
import { UserProfile } from '../types';

interface LoyaltyInfo {
  totalPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTierPoints: number;
  benefits: string[];
}

interface LoyaltyDashboardProps {
  user?: UserProfile;
  setUser?: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export default function LoyaltyDashboard({ user, setUser }: LoyaltyDashboardProps) {
  const navigate = useNavigate();
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLoyaltyData = async () => {
      try {
        const userData: any = await apiClient.get('/auth/profile');
        if (isMounted && userData && setUser) {
           setUser(prevUser => ({
               ...(prevUser || {} as UserProfile),
               ...userData,
               balance: userData.balance ? Number(userData.balance) : 0,
           }));
        }
        const points = userData.loyaltyPoints || 0;
        
        let tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Bronze';
        let nextTierPoints = 501;
        let benefits = ['Diskon kamar standar 5%'];

        if (points >= 3001) {
          tier = 'Platinum';
          nextTierPoints = 0; // Max tier
          benefits = ['Diskon kamar 20%', 'Free Breakfast', 'Jaminan Late Check-out', 'Free Room Upgrade'];
        } else if (points >= 1501) {
          tier = 'Gold';
          nextTierPoints = 3001 - points;
          benefits = ['Diskon kamar 15%', 'Free Breakfast', 'Jaminan Late Check-out'];
        } else if (points >= 501) {
          tier = 'Silver';
          nextTierPoints = 1501 - points;
          benefits = ['Diskon kamar 10%', 'Free Breakfast'];
        } else {
          nextTierPoints = 501 - points;
        }

        if (isMounted) {
          setLoyaltyData({
            totalPoints: points,
            tier,
            nextTierPoints,
            benefits,
          });
        }
      } catch (err) {
        console.error('Failed to fetch loyalty data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchLoyaltyData();

    return () => {
      isMounted = false;
    };
  }, []);


  if (loading) {
    // Elegant Skeleton Loading UI
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 w-full animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-md w-48 animate-pulse"></div>
        </div>
        <div className="space-y-10">
          <div className="h-[280px] md:h-[240px] bg-gray-200 dark:bg-gray-800 rounded-3xl w-full animate-pulse"></div>
          <div className="h-[120px] bg-gray-200 dark:bg-gray-800 rounded-3xl w-full animate-pulse"></div>
          <div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-md w-40 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full animate-pulse"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loyaltyData) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[60vh] animate-in fade-in">
        <p className="text-gray-500">Gagal memuat data loyalty. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  const { totalPoints, tier, nextTierPoints, benefits } = loyaltyData;

  // Determine current tier styles and icons
  let tierColors = '';
  let TierIcon = Shield;
  let maxPoints = 500;
  
  if (tier === 'Platinum') {
    tierColors = 'from-slate-700 via-slate-500 to-slate-400 border-slate-300 text-white';
    TierIcon = Crown;
    maxPoints = totalPoints;
  } else if (tier === 'Gold') {
    tierColors = 'from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-300 text-white';
    TierIcon = Crown;
    maxPoints = 3000;
  } else if (tier === 'Silver') {
    tierColors = 'from-gray-300 via-gray-400 to-gray-500 border-gray-300 text-white';
    TierIcon = Star;
    maxPoints = 1500;
  } else {
    tierColors = 'from-amber-600 via-amber-700 to-amber-900 border-amber-600 text-white';
    TierIcon = Shield;
    maxPoints = 500;
  }

  const progressPercentage = tier === 'Platinum' ? 100 : Math.min(100, Math.max(0, (totalPoints / maxPoints) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-forwards">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="group p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out border border-gray-200 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 rotate-180 text-gray-600 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-[#031636] dark:text-white flex items-center gap-2">
          <Award className="w-8 h-8 text-[#fed023] animate-bounce" style={{ animationDuration: '3s' }} />
          Loyalty Member
        </h1>
      </div>

      {/* Member Card */}
      <div className={`relative overflow-hidden rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ease-in-out bg-gradient-to-br ${tierColors} mb-10 group`}>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700 ease-out">
          <TierIcon className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md shadow-sm border border-white/10">
              <TierIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">{tier} MEMBER</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4 drop-shadow-md flex items-end gap-2">
              {totalPoints.toLocaleString('id-ID')} 
              <span className="text-xl md:text-2xl font-medium opacity-90 pb-1">Poin</span>
            </h2>
          </div>
          
          <div className="text-right w-full md:w-auto">
            {tier !== 'Platinum' ? (
              <p className="text-sm font-medium opacity-90 bg-black/20 px-4 py-3 rounded-xl backdrop-blur-sm max-w-xs md:max-w-md ml-auto border border-black/10 shadow-inner">
                Kamu hanya butuh <strong className="text-lg text-yellow-300">{nextTierPoints}</strong> Grandstar Poin lagi untuk naik ke tingkat <strong className="uppercase">{tier === 'Bronze' ? 'Silver' : tier === 'Silver' ? 'Gold' : 'Platinum'}</strong> dan menikmati benefit eksklusif.
              </p>
            ) : (
              <p className="text-sm font-medium opacity-90 bg-black/20 px-4 py-3 rounded-xl backdrop-blur-sm flex items-center gap-2 justify-center border border-black/10 shadow-inner">
                <Crown className="w-5 h-5 text-yellow-300 animate-pulse" />
                Anda berada di Level Tertinggi!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {tier !== 'Platinum' && (
        <div className="bg-white dark:bg-[#1A2B4C] p-6 rounded-3xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-in-out border border-gray-100 dark:border-gray-800 mb-10 group">
          <div className="flex justify-between text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
            <span>Progress ke Level Berikutnya</span>
            <span className="text-[#fed023] font-black">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-[#eec209] to-[#fed023] h-full rounded-full shadow-sm" style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors">
            <Info className="w-3.5 h-3.5" />
            Dapatkan 10 poin untuk setiap transaksi Rp 100.000
          </p>
        </div>
      )}

      {/* Benefits List */}
      <h3 className="text-xl font-black text-[#031636] dark:text-white mb-6">Benefit Aktif Anda</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-[#1A2B4C] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out group cursor-default"
          >
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-xl group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out shrink-0">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="pt-0.5">
              <p className="font-bold text-[#031636] dark:text-gray-100 text-sm md:text-base leading-relaxed group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-300">
                {benefit}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
