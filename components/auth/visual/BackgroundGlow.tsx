/**
 * BackgroundGlow Component
 * Animated background glow effect with orange accents
 */

export function BackgroundGlow() {
  return (
    <>
      {/* Primary glow - orange */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
      
      {/* Secondary glow - darker orange */}
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Tertiary glow - subtle */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400/5 rounded-full blur-3xl animate-pulse delay-2000" />
      
      {/* Corner glows */}
      <div className="fixed top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl" />
    </>
  );
}
