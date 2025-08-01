import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Zap, 
  FileText,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CodeAnalysisEngine } from "./CodeAnalysisEngine";

interface CodeInputPanelProps {
  onAnalysis: (result: any) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const CodeInputPanel = ({ onAnalysis, isAnalyzing, setIsAnalyzing }: CodeInputPanelProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(false);
  const { toast } = useToast();

  // Real-time analysis effect
  useEffect(() => {
    if (realTimeAnalysis && code.trim() && code.length > 50) {
      const timeoutId = setTimeout(() => {
        const result = CodeAnalysisEngine.analyze(code);
        onAnalysis(result);
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [code, realTimeAnalysis, onAnalysis]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['.py', '.cpp', '.js', '.java', '.c', '.ts', '.jsx', '.tsx', '.cs', '.go', '.rs', '.php', '.rb', '.swift', '.kt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setError("Please upload a valid code file (.py, .cpp, .js, .java, .c, .ts, .jsx, .tsx, .cs, .go, .rs, .php, .rb, .swift, .kt)");
      return;
    }

    if (file.size > 1024 * 1024) { // 1MB limit
      setError("File size too large. Please upload files smaller than 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
      setError("");
      toast({
        title: "File uploaded successfully",
        description: `Loaded ${file.name} (${(file.size / 1024).toFixed(1)}KB)`,
      });
    };
    reader.readAsText(file);
  };

  const analyzeCode = () => {
    if (!code.trim()) {
      setError("Please enter some code or upload a file to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    
    // Simulate processing time for better UX
    setTimeout(() => {
      try {
        const result = CodeAnalysisEngine.analyze(code);
        onAnalysis(result);
        
        toast({
          title: "Analysis complete",
          description: `Analyzed ${result.linesOfCode} lines of ${result.language} code`,
        });
      } catch (error) {
        setError("An error occurred during analysis. Please try again.");
        console.error('Analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1000);
  };

  return (
    <Card className="shadow-card border-border/50 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Code Input</span>
        </CardTitle>
        <CardDescription>
          Upload a file or paste your code for comprehensive analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Real-time Analysis Toggle */}
        <div className="flex items-center space-x-2 p-3 bg-secondary/30 rounded-lg">
          <Switch
            id="real-time"
            checked={realTimeAnalysis}
            onCheckedChange={setRealTimeAnalysis}
          />
          <Label htmlFor="real-time" className="text-sm flex items-center space-x-1">
            <Sparkles className="w-4 h-4" />
            <span>Real-time Analysis</span>
          </Label>
        </div>

        {/* File Upload */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </Button>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">Python</Badge>
            <Badge variant="secondary" className="text-xs">JavaScript</Badge>
            <Badge variant="secondary" className="text-xs">Java</Badge>
            <Badge variant="secondary" className="text-xs">C++</Badge>
            <Badge variant="secondary" className="text-xs">+10 more</Badge>
          </div>
        </div>
        
        <input
          id="file-upload"
          type="file"
          accept=".py,.cpp,.js,.java,.c,.ts,.jsx,.tsx,.cs,.go,.rs,.php,.rb,.swift,.kt"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Code Textarea */}
        <div className="relative">
          <Textarea
            placeholder="Paste your code here or upload a file...

Example:
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-[350px] font-mono text-sm bg-secondary/50 resize-none"
          />
          {code && (
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
              {code.split('\n').length} lines, {code.length} characters
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Analyze Button */}
        <Button
          onClick={analyzeCode}
          disabled={isAnalyzing || !code.trim()}
          className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity font-semibold"
        >
          {isAnalyzing ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
              Analyzing Code...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Analyze Code Complexity
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};