import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General feedback
      alert('To install Sur Sadhana on your Android phone, tap your browser menu (⋮) and select "Install app" or "Add to Home screen".');
    }
  };

  if (isInstalled) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:from-[#ffd700] hover:to-[#c69a1b] text-[#140508] font-bold text-xs shadow-md transition"
        title="Install Sur Sadhana as an Android or Desktop App"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#1b080d] border border-[#d4af37]/40 p-6 text-[#f5e6d3] shadow-2xl">
            <h3 className="font-cinzel text-lg font-bold text-[#ffd700]">
              Install on iOS / Safari
            </h3>
            <p className="mt-3 text-xs text-[#d4af37]/90 leading-relaxed">
              1. Tap the <strong>Share button</strong> (square with arrow) at the bottom of Safari.<br /><br />
              2. Scroll down and tap <strong>Add to Home Screen</strong> (ہوم اسکرین پر شامل کریں).<br /><br />
              3. Launch Sur Sadhana directly from your home screen for full-screen offline riyaz!
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full rounded-xl bg-[#2b0e14] border border-[#d4af37]/30 py-2.5 text-xs font-bold text-[#ffd700] hover:bg-[#3d141e] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
