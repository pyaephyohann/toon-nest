/**
 * FloatingShapes Component
 * Animated geometric shapes floating in the background
 */

export function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Circle shapes */}
      <div className="absolute top-[10%] left-[5%] w-20 h-20 border border-orange-500/20 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-[20%] right-[10%] w-16 h-16 border border-orange-400/15 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[15%] left-[15%] w-24 h-24 border border-orange-600/10 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Square shapes */}
      <div className="absolute top-[30%] left-[20%] w-12 h-12 border border-orange-500/15 rotate-45 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-[25%] right-[20%] w-16 h-16 border border-orange-400/10 rotate-12 animate-float" style={{ animationDelay: '3s' }} />
      
      {/* Triangle shapes */}
      <div className="absolute top-[60%] left-[8%] w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-orange-500/10 animate-float" style={{ animationDelay: '2.5s' }} />
      <div className="absolute top-[40%] right-[15%] w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-orange-400/8 animate-float" style={{ animationDelay: '4.5s' }} />
      
      {/* Small dots */}
      <div className="absolute top-[15%] left-[30%] w-2 h-2 bg-orange-500/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-[45%] right-[25%] w-3 h-3 bg-orange-400/15 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[35%] left-[25%] w-2 h-2 bg-orange-600/15 rounded-full animate-float" style={{ animationDelay: '3.5s' }} />
      <div className="absolute top-[70%] right-[30%] w-3 h-3 bg-orange-500/10 rounded-full animate-float" style={{ animationDelay: '5s' }} />
    </div>
  );
}
