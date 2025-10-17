import { Button } from "@/components/ui/button";
import { Calendar, FileText, Video } from "lucide-react";

interface ConceptRevealProps {
  concept: string;
  onBookConsultation: () => void;
  onRequestBrochure: () => void;
  onStartVideoChat: () => void;
}

const ConceptReveal = ({ 
  concept, 
  onBookConsultation, 
  onRequestBrochure, 
  onStartVideoChat 
}: ConceptRevealProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
      <div className="max-w-4xl w-full space-y-8 animate-scale-in">
        {/* Concept Card */}
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl border border-border">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            Your Concept Summary
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="font-sans text-lg leading-relaxed text-foreground">
              {concept}
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <p className="font-sans text-lg text-muted-foreground italic">
              I'd love to explore this further with you and help bring your vision to life.
            </p>
            <p className="font-sans text-sm text-muted-foreground mt-4">
              — Paul Cameron, Founder of Treehouse Life Ltd
            </p>
          </div>
        </div>

        {/* Conversion Options */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            onClick={onBookConsultation}
            className="bg-forest-green hover:bg-forest-green/90 text-white h-auto py-6 rounded-2xl flex flex-col items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Calendar className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold text-lg">Book a Consultation</div>
              <div className="text-sm opacity-90 font-light">Schedule time with Paul</div>
            </div>
          </Button>

          <Button
            onClick={onRequestBrochure}
            className="bg-accent hover:bg-accent/90 text-accent-foreground h-auto py-6 rounded-2xl flex flex-col items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <FileText className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold text-lg">Receive a Brochure</div>
              <div className="text-sm opacity-90 font-light">Personal project details</div>
            </div>
          </Button>

          <Button
            onClick={onStartVideoChat}
            className="bg-fresh-green hover:bg-fresh-green/90 text-white h-auto py-6 rounded-2xl flex flex-col items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Video className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold text-lg">WhatsApp Video</div>
              <div className="text-sm opacity-90 font-light">Connect instantly</div>
            </div>
          </Button>
        </div>

        {/* Final Message */}
        <div className="text-center space-y-4 pt-8">
          <p className="font-sans text-base text-muted-foreground max-w-2xl mx-auto">
            Thank you — it's been wonderful to hear your ideas. I look forward to our upcoming 
            conversation and to creating something truly special for you.
          </p>
          <p className="font-serif text-sm text-muted-foreground italic">
            With best wishes,<br />
            Paul Cameron<br />
            Founder, Treehouse Life Ltd
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConceptReveal;
