import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Shield, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

interface SuggestionsPanelProps {
  suggestions: string[];
  securityIssues: string[];
  performanceIssues: string[];
  explanation: string;
}

export const SuggestionsPanel = ({ 
  suggestions, 
  securityIssues, 
  performanceIssues, 
  explanation 
}: SuggestionsPanelProps) => {
  return (
    <div className="space-y-4">
      {/* Explanation */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-blue-500" />
            <span>Analysis Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-sm leading-relaxed">{explanation}</p>
        </CardContent>
      </Card>

      {/* Security Issues */}
      {securityIssues.length > 0 && (
        <Card className="shadow-card border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <Shield className="w-5 h-5" />
              <span>Security Issues</span>
              <Badge variant="destructive" className="ml-2">
                {securityIssues.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {securityIssues.map((issue, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">{issue}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Performance Issues */}
      {performanceIssues.length > 0 && (
        <Card className="shadow-card border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
              <Zap className="w-5 h-5" />
              <span>Performance Issues</span>
              <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-600">
                {performanceIssues.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {performanceIssues.map((issue, index) => (
              <Alert key={index} className="border-yellow-200 dark:border-yellow-800">
                <Zap className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-sm">{issue}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card className="shadow-card border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <Lightbulb className="w-5 h-5" />
              <span>Improvement Suggestions</span>
              <Badge variant="outline" className="ml-2 border-green-500 text-green-600">
                {suggestions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <Alert key={index} className="border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-sm">{suggestion}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Issues Found */}
      {suggestions.length === 0 && securityIssues.length === 0 && performanceIssues.length === 0 && (
        <Card className="shadow-card border-green-200 dark:border-green-800">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
              Great Code Quality!
            </h3>
            <p className="text-muted-foreground text-sm">
              No significant issues detected in your code.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};