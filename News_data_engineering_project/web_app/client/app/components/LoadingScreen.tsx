'use client';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black">
            <div className="relative">
                {/* Animated logo placeholder */}
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-2xl font-bold text-cyan-400" style={{ fontFamily: 'var(--font-display)' }}>
                            NO
                        </div>
                    </div>
                </div>

                {/* Loading text */}
                <div className="mt-8 text-center">
                    <p className="text-white/60 text-sm uppercase tracking-widest animate-pulse" style={{ fontFamily: 'var(--font-primary)' }}>
                        Loading Intelligence...
                    </p>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 -z-10">
                    <div className="w-full h-full bg-cyan-500/20 rounded-full blur-3xl animate-glow"></div>
                </div>
            </div>
        </div>
    );
}
