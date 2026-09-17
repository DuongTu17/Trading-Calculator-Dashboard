import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TradingCategory } from './types';
import { Header } from './components/Header';
import { HomeSelector } from './components/HomeSelector';
import { VnStockDashboard } from './components/vn/VnStockDashboard';
import { CryptoDashboard } from './components/crypto/CryptoDashboard';
import { ArchitectureViewer } from './components/ArchitectureModal';
import { Code2, ShieldAlert, Sparkles, TrendingUp, Heart } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<TradingCategory>('selector');
  const [p2pRate, setP2pRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('trading_calc_p2p');
      return saved ? parseFloat(saved) : 25450;
    } catch {
      return 25450;
    }
  });
  const [showArchModal, setShowArchModal] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('trading_calc_p2p', p2pRate.toString());
    } catch {
      // ignore
    }
  }, [p2pRate]);

  const handleResetAll = () => {
    if (window.confirm('Bạn có chắc muốn đặt lại tất cả các thông số về mặc định?')) {
      setP2pRate(25450);
      setActiveCategory('selector');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#EAECEF] flex flex-col justify-between selection:bg-[#0ECB81]/20 selection:text-[#0ECB81]">
      {/* Top Fixed Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        p2pRate={p2pRate}
        onUpdateP2pRate={setP2pRate}
        onResetAll={handleResetAll}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeCategory === 'selector' && (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <HomeSelector
                onSelectCategory={setActiveCategory}
                p2pRate={p2pRate}
              />
            </motion.div>
          )}

          {activeCategory === 'vn' && (
            <motion.div
              key="vn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <VnStockDashboard />
            </motion.div>
          )}

          {activeCategory === 'crypto' && (
            <motion.div
              key="crypto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CryptoDashboard
                p2pRate={p2pRate}
                onUpdateP2pRate={setP2pRate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom Quick Action */}
      <div className="fixed bottom-4 right-4 z-20">
        <button
          id="btn-open-arch-viewer"
          type="button"
          onClick={() => setShowArchModal(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#161A25] hover:bg-[#1E232F] text-white border border-[#2B313F] hover:border-[#0ECB81] shadow-xl text-xs font-semibold transition-all group backdrop-blur-md"
          title="Xem tài liệu cấu trúc code & Layout"
        >
          <Code2 className="w-4 h-4 text-[#0ECB81] group-hover:rotate-12 transition-transform" />
          <span>Cấu trúc Code & Layout</span>
        </button>
      </div>

      {/* Architecture & Code Modal */}
      <ArchitectureViewer
        isOpen={showArchModal}
        onClose={() => setShowArchModal(false)}
      />

      {/* Footer */}
      <footer className="bg-[#080B10] border-t border-[#1E232F] py-6 px-4 text-xs text-[#848E9C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0ECB81] animate-pulse"></span>
            <span className="font-bold text-white tracking-tight">Trading Calculator Dashboard</span>
            <span>• Chuẩn Quản Trị Rủi Ro Chuyên Nghiệp</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveCategory('vn')}
              className="hover:text-white transition-colors"
            >
              🇻🇳 Chứng Khoán VN
            </button>
            <button
              onClick={() => setActiveCategory('crypto')}
              className="hover:text-white transition-colors"
            >
              🌐 Crypto & Phái Sinh
            </button>
            <button
              onClick={() => setShowArchModal(true)}
              className="hover:text-[#0ECB81] transition-colors"
            >
              Cấu trúc Component
            </button>
          </div>

          <div className="text-[11px] text-[#555E6D]">
            Công cụ hỗ trợ tính toán tài chính. Hãy luôn tự chịu trách nhiệm với quyết định đầu tư cá nhân.
          </div>
        </div>
      </footer>
    </div>
  );
}
