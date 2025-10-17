import { useState } from "react";
import Landing from "@/components/Landing";
import ChatInterface from "@/components/ChatInterface";
import ConceptReveal from "@/components/ConceptReveal";
import { useToast } from "@/hooks/use-toast";

type AppStage = "landing" | "chat" | "concept" | "complete";

const Index = () => {
  const [stage, setStage] = useState<AppStage>("landing");
  const [generatedConcept, setGeneratedConcept] = useState("");
  const { toast } = useToast();

  const handleStartChat = () => {
    setStage("chat");
  };

  const handleConceptGenerated = (concept: string) => {
    setGeneratedConcept(concept);
    setStage("concept");
  };

  const handleBookConsultation = () => {
    toast({
      title: "Opening booking calendar",
      description: "Redirecting to Motion calendar...",
    });
    // Integration with Motion API would go here
    setTimeout(() => {
      toast({
        title: "Consultation booked",
        description: "You'll receive a confirmation email shortly.",
      });
      setStage("complete");
    }, 2000);
  };

  const handleRequestBrochure = () => {
    toast({
      title: "Generating your brochure",
      description: "Creating personalized project materials...",
    });
    // Integration with Qwilr API would go here
    setTimeout(() => {
      toast({
        title: "Brochure ready",
        description: "Check your email for the link to your personalized brochure.",
      });
      setStage("complete");
    }, 2000);
  };

  const handleStartVideoChat = () => {
    toast({
      title: "Opening WhatsApp",
      description: "Starting video call with Paul Cameron...",
    });
    // Integration with WhatsApp Business would go here
    window.open("https://wa.me/", "_blank");
    setStage("complete");
  };

  return (
    <>
      {stage === "landing" && <Landing onStartChat={handleStartChat} />}
      {stage === "chat" && <ChatInterface onConceptGenerated={handleConceptGenerated} />}
      {stage === "concept" && (
        <ConceptReveal
          concept={generatedConcept}
          onBookConsultation={handleBookConsultation}
          onRequestBrochure={handleRequestBrochure}
          onStartVideoChat={handleStartVideoChat}
        />
      )}
      {stage === "complete" && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-6">
          <div className="text-center max-w-2xl animate-fade-in">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Thank You
            </h1>
            <p className="font-sans text-lg text-muted-foreground mb-8">
              We're excited to begin this journey with you. You'll hear from us shortly.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setStage("landing")}
                className="font-sans text-forest-green hover:text-forest-green/80 underline"
              >
                Start Over
              </button>
              <a
                href="https://treehouselife.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-forest-green hover:text-forest-green/80 underline"
              >
                Visit Website
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
