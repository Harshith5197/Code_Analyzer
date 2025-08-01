import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Code, 
  Upload, 
  Zap, 
  Clock, 
  Database, 
  LogOut,
  FileText,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComplexityAnalyzerProps {
  onLogout: () => void;
}

const ComplexityAnalyzer = ({ onLogout }: ComplexityAnalyzerProps) => {
  const [code, setCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    timeComplexity: string;
    spaceComplexity: string;
    explanation: string;
  } | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['.py', '.cpp', '.js', '.java', '.c', '.ts', '.jsx', '.tsx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setError("Please upload a valid code file (.py, .cpp, .js, .java, .c, .ts, .jsx, .tsx)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
      setError("");
      toast({
        title: "File uploaded successfully",
        description: `Loaded ${file.name}`,
      });
    };
    reader.readAsText(file);
  };

  const analyzeComplexity = async () => {
    if (!code.trim()) {
      setError("Please enter some code or upload a file to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    
    // Simulate API call with heuristic analysis
    setTimeout(() => {
      // Simple heuristic analysis for demo
      let timeComplexity = "O(n)";
      let spaceComplexity = "O(1)";
      let explanation = "Based on heuristic analysis of your code structure.";

      if (code.includes("for") && code.includes("while")) {
        timeComplexity = "O(n²)";
        spaceComplexity = "O(n)";
        explanation = "Detected nested loops, resulting in quadratic time complexity.";
      } else if (code.includes("for") || code.includes("while")) {
        timeComplexity = "O(n)";
        explanation = "Detected single loop, resulting in linear time complexity.";
      } else if (code.includes("sort") || code.includes("Sort")) {
        timeComplexity = "O(n log n)";
        explanation = "Detected sorting operation, typically O(n log n) complexity.";
      } else if (code.includes("recursive") || code.includes("return") && code.includes("function")) {
        timeComplexity = "O(2ⁿ)";
        spaceComplexity = "O(n)";
        explanation = "Potential recursive function detected, may have exponential time complexity.";
      }

      setResults({ timeComplexity, spaceComplexity, explanation });
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Your code complexity has been analyzed",
      });
    }, 2000);
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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Code Input</span>
                </CardTitle>
                <CardDescription>
                  Paste your code or upload a file to analyze its complexity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload File</span>
                  </Button>
                  <Badge variant="secondary" className="text-xs">
                    .py, .cpp, .js, .java, .c, .ts
                  </Badge>
                </div>
                
                <input
                  id="file-upload"
                  type="file"
                  accept=".py,.cpp,.js,.java,.c,.ts,.jsx,.tsx"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Code Textarea */}
                <Textarea
                  placeholder="Paste your code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[300px] font-mono text-sm bg-secondary/50"
                />

                {/* Error Display */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Analyze Button */}
                <Button
                  onClick={analyzeComplexity}
                  disabled={isAnalyzing}
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Complexity
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Time Complexity Card */}
                <Card className="shadow-card border-border/50 bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-primary">
                      <Clock className="w-5 h-5" />
                      <span>Time Complexity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {results.timeComplexity}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Estimated computational time growth
                    </p>
                  </CardContent>
                </Card>

                {/* Space Complexity Card */}
                <Card className="shadow-card border-border/50 bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-accent">
                      <Database className="w-5 h-5" />
                      <span>Space Complexity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent mb-2">
                      {results.spaceComplexity}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Estimated memory usage growth
                    </p>
                  </CardContent>
                </Card>

                {/* Explanation Card */}
                <Card className="shadow-card border-border/50">
                  <CardHeader>
                    <CardTitle>Analysis Explanation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{results.explanation}</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-card border-border/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Code className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-muted-foreground">
                    Upload or paste your code to get started with complexity analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplexityAnalyzer;