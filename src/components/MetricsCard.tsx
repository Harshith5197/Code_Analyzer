import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Database, 
  Brain, 
  Wrench, 
  Code2, 
  Copy,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";

interface MetricsCardProps {
  timeComplexity: string;
  spaceComplexity: string;
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  maintainabilityIndex: number;
  linesOfCode: number;
  duplicateCodePercentage: number;
  language: string;
}

export const MetricsCard = ({
  timeComplexity,
  spaceComplexity,
  cyclomaticComplexity,
  cognitiveComplexity,
  maintainabilityIndex,
  linesOfCode,
  duplicateCodePercentage,
  language
}: MetricsCardProps) => {
  const getComplexityColor = (complexity: number, thresholds: number[]) => {
    if (complexity <= thresholds[0]) return "text-green-500";
    if (complexity <= thresholds[1]) return "text-yellow-500";
    return "text-red-500";
  };

  const getMaintainabilityColor = (index: number) => {
    if (index >= 70) return "text-green-500";
    if (index >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Time Complexity */}
      <Card className="shadow-card border-border/50 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-primary text-sm">
            <Clock className="w-4 h-4" />
            <span>Time Complexity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary mb-1">
            {timeComplexity}
          </div>
          <p className="text-xs text-muted-foreground">
            Computational time growth
          </p>
        </CardContent>
      </Card>

      {/* Space Complexity */}
      <Card className="shadow-card border-border/50 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-accent text-sm">
            <Database className="w-4 h-4" />
            <span>Space Complexity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent mb-1">
            {spaceComplexity}
          </div>
          <p className="text-xs text-muted-foreground">
            Memory usage growth
          </p>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="shadow-card border-border/50 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-foreground text-sm">
            <Code2 className="w-4 h-4" />
            <span>Language</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="text-sm capitalize">
            {language}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            Auto-detected language
          </p>
        </CardContent>
      </Card>

      {/* Cyclomatic Complexity */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Cyclomatic Complexity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold mb-1 ${getComplexityColor(cyclomaticComplexity, [5, 10])}`}>
            {cyclomaticComplexity}
          </div>
          <Progress value={Math.min(cyclomaticComplexity * 5, 100)} className="h-2 mb-1" />
          <p className="text-xs text-muted-foreground">
            Code path complexity
          </p>
        </CardContent>
      </Card>

      {/* Cognitive Complexity */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Brain className="w-4 h-4" />
            <span>Cognitive Complexity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold mb-1 ${getComplexityColor(cognitiveComplexity, [10, 20])}`}>
            {cognitiveComplexity}
          </div>
          <Progress value={Math.min(cognitiveComplexity * 2, 100)} className="h-2 mb-1" />
          <p className="text-xs text-muted-foreground">
            Mental burden to understand
          </p>
        </CardContent>
      </Card>

      {/* Maintainability Index */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Wrench className="w-4 h-4" />
            <span>Maintainability</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold mb-1 ${getMaintainabilityColor(maintainabilityIndex)}`}>
            {maintainabilityIndex}
          </div>
          <Progress value={maintainabilityIndex} className="h-2 mb-1" />
          <p className="text-xs text-muted-foreground">
            How easy to maintain
          </p>
        </CardContent>
      </Card>

      {/* Lines of Code */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Code2 className="w-4 h-4" />
            <span>Lines of Code</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground mb-1">
            {linesOfCode}
          </div>
          <p className="text-xs text-muted-foreground">
            Non-empty lines
          </p>
        </CardContent>
      </Card>

      {/* Duplicate Code */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Copy className="w-4 h-4" />
            <span>Code Duplication</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold mb-1 ${getComplexityColor(duplicateCodePercentage, [5, 15])}`}>
            {duplicateCodePercentage}%
          </div>
          <Progress value={duplicateCodePercentage} className="h-2 mb-1" />
          <p className="text-xs text-muted-foreground">
            Duplicate code percentage
          </p>
        </CardContent>
      </Card>
    </div>
  );
};