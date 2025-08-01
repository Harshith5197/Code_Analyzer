import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  LogOut,
  TrendingUp
} from "lucide-react";
import { CodeInputPanel } from "./CodeInputPanel";
import { MetricsCard } from "./MetricsCard";
import { SuggestionsPanel } from "./SuggestionsPanel";

interface ComplexityAnalyzerProps {
  onLogout: () => void;
}

const ComplexityAnalyzer = ({ onLogout }: ComplexityAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  const handleAnalysis = (result: any) => {
    setResults(result);
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Code Complexity Analyzer</h1>
              <p className="text-sm text-muted-foreground">Analyze time and space complexity</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="xl:col-span-1">
            <CodeInputPanel 
              onAnalysis={handleAnalysis}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
          </div>

          {/* Results Panel */}
          <div className="xl:col-span-2 space-y-6">
            {results ? (
              <>
                {/* Performance Overview */}
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Code Analysis Results</h2>
                </div>

                {/* Metrics Grid */}
                <MetricsCard 
                  timeComplexity={results.timeComplexity}
                  spaceComplexity={results.spaceComplexity}
                  cyclomaticComplexity={results.cyclomaticComplexity}
                  cognitiveComplexity={results.cognitiveComplexity}
                  maintainabilityIndex={results.maintainabilityIndex}
                  linesOfCode={results.linesOfCode}
                  duplicateCodePercentage={results.duplicateCodePercentage}
                  language={results.language}
                />

                {/* Suggestions and Issues */}
                <SuggestionsPanel 
                  suggestions={results.suggestions}
                  securityIssues={results.securityIssues}
                  performanceIssues={results.performanceIssues}
                  explanation={results.explanation}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Code className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    Advanced Code Analysis Ready
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Upload or paste your code to get comprehensive analysis including complexity metrics, 
                    security issues, performance suggestions, and maintainability insights.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplexityAnalyzer;