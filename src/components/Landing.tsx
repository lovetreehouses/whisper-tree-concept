import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-forest.jpg";

interface LandingProps {
  onStartChat: () => void;
}

const Landing = ({ onStartChat }: LandingProps) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-deep-slate/70 via-deep-slate/50 to-deep-slate/80" />
      </div>

      {/* Floating Leaf Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 opacity-20 animate-float">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-soft-sage">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </div>
        <div className="absolute top-40 right-20 w-6 h-6 opacity-15 animate-float" style={{ animationDelay: "2s" }}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-fresh-green">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </div>
        <div className="absolute bottom-32 left-1/4 w-10 h-10 opacity-10 animate-float" style={{ animationDelay: "4s" }}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-forest-green">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-in">
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Welcome to Treehouse Life
        </h1>
        <p className="font-sans text-xl md:text-2xl text-white/90 mb-4 font-light">
          Where your family dreams take shape
        </p>
        <p className="font-sans text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light">
          Let me guide you through discovering your perfect treehouse concept, 
          tailored to your wishes and your unique setting.
        </p>
        <Button 
          onClick={onStartChat}
          size="lg"
          className="font-sans text-lg px-8 py-6 bg-forest-green hover:bg-forest-green/90 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-forest-green/50"
        >
          Start Your Wish-List Chat
        </Button>
        <p className="font-sans text-sm text-white/60 mt-6 font-light">
          — Paul Cameron, Founder
        </p>
      </div>
    </div>
  );
};

export default Landing;
