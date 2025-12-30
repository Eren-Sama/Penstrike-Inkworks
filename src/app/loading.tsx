'use client';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment-50">
      <div className="flex flex-col items-center gap-6">
        {/* Animated open book with flipping pages */}
        <div className="relative" style={{ perspective: '600px' }}>
          {/* Book base */}
          <div className="relative w-24 h-16">
            {/* Left page (static) */}
            <div className="absolute left-0 top-0 w-12 h-16 bg-parchment-100 rounded-l-sm border-l-4 border-brand-dark shadow-md origin-right">
              {/* Page lines */}
              <div className="p-2 space-y-1">
                <div className="h-0.5 w-6 bg-ink-200 rounded" />
                <div className="h-0.5 w-8 bg-ink-200 rounded" />
                <div className="h-0.5 w-5 bg-ink-200 rounded" />
                <div className="h-0.5 w-7 bg-ink-200 rounded" />
                <div className="h-0.5 w-4 bg-ink-200 rounded" />
              </div>
            </div>
            
            {/* Right page (static) */}
            <div className="absolute right-0 top-0 w-12 h-16 bg-parchment-100 rounded-r-sm border-r-4 border-brand-dark shadow-md origin-left">
              {/* Page lines */}
              <div className="p-2 space-y-1">
                <div className="h-0.5 w-7 bg-ink-200 rounded" />
                <div className="h-0.5 w-5 bg-ink-200 rounded" />
                <div className="h-0.5 w-8 bg-ink-200 rounded" />
                <div className="h-0.5 w-6 bg-ink-200 rounded" />
                <div className="h-0.5 w-4 bg-ink-200 rounded" />
              </div>
            </div>
            
            {/* Book spine */}
            <div className="absolute left-1/2 top-0 w-1 h-16 bg-brand-darker -translate-x-1/2 shadow-inner" />
            
            {/* Flipping page 1 */}
            <div 
              className="absolute left-1/2 top-0 w-12 h-16 bg-parchment-50 rounded-r-sm origin-left shadow-lg"
              style={{
                animation: 'flipPage 1.5s ease-in-out infinite',
                animationDelay: '0s',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="p-2 space-y-1">
                <div className="h-0.5 w-6 bg-ink-300 rounded" />
                <div className="h-0.5 w-8 bg-ink-300 rounded" />
                <div className="h-0.5 w-5 bg-ink-300 rounded" />
              </div>
            </div>
            
            {/* Flipping page 2 */}
            <div 
              className="absolute left-1/2 top-0 w-12 h-16 bg-parchment-100 rounded-r-sm origin-left shadow-lg"
              style={{
                animation: 'flipPage 1.5s ease-in-out infinite',
                animationDelay: '0.15s',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="p-2 space-y-1">
                <div className="h-0.5 w-7 bg-ink-300 rounded" />
                <div className="h-0.5 w-5 bg-ink-300 rounded" />
                <div className="h-0.5 w-6 bg-ink-300 rounded" />
              </div>
            </div>
            
            {/* Flipping page 3 */}
            <div 
              className="absolute left-1/2 top-0 w-12 h-16 bg-parchment-200 rounded-r-sm origin-left shadow-lg"
              style={{
                animation: 'flipPage 1.5s ease-in-out infinite',
                animationDelay: '0.3s',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="p-2 space-y-1">
                <div className="h-0.5 w-5 bg-ink-300 rounded" />
                <div className="h-0.5 w-8 bg-ink-300 rounded" />
                <div className="h-0.5 w-4 bg-ink-300 rounded" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading text with pen animation */}
        <div className="flex items-center gap-2 text-ink-600">
          <span className="text-sm font-medium tracking-wide">Reading your story</span>
          <span className="flex gap-0.5">
            <span 
              className="w-1.5 h-1.5 rounded-full bg-brand" 
              style={{ animation: 'dotPulse 1.2s ease-in-out infinite', animationDelay: '0ms' }} 
            />
            <span 
              className="w-1.5 h-1.5 rounded-full bg-brand" 
              style={{ animation: 'dotPulse 1.2s ease-in-out infinite', animationDelay: '200ms' }} 
            />
            <span 
              className="w-1.5 h-1.5 rounded-full bg-brand" 
              style={{ animation: 'dotPulse 1.2s ease-in-out infinite', animationDelay: '400ms' }} 
            />
          </span>
        </div>
      </div>
      
      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes flipPage {
          0%, 100% {
            transform: rotateY(0deg);
            z-index: 1;
          }
          50% {
            transform: rotateY(-180deg);
            z-index: 10;
          }
        }
        
        @keyframes dotPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
