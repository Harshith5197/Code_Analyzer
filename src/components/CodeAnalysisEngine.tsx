interface AnalysisResult {
  timeComplexity: string;
  spaceComplexity: string;
  cognitiveComplexity: number;
  maintainabilityIndex: number;
  linesOfCode: number;
  cyclomaticComplexity: number;
  duplicateCodePercentage: number;
  language: string;
  explanation: string;
  suggestions: string[];
  securityIssues: string[];
  performanceIssues: string[];
}

export class CodeAnalysisEngine {
  private static detectLanguage(code: string): string {
    const patterns = {
      javascript: [/function\s+\w+/, /const\s+\w+\s*=/, /let\s+\w+/, /import\s+.+from/, /=>/],
      typescript: [/interface\s+\w+/, /type\s+\w+\s*=/, /:\s*string|number|boolean/, /as\s+\w+/],
      python: [/def\s+\w+/, /import\s+\w+/, /from\s+\w+\s+import/, /if\s+__name__\s*==/, /:\s*$/m],
      java: [/public\s+class/, /private\s+\w+/, /public\s+static\s+void\s+main/, /extends\s+\w+/],
      cpp: [/#include\s*</, /using\s+namespace/, /int\s+main\s*\(/, /std::/],
      c: [/#include\s*"/, /int\s+main\s*\(/, /printf\s*\(/, /malloc\s*\(/],
      csharp: [/using\s+System/, /public\s+class/, /namespace\s+\w+/, /Console\.WriteLine/],
      go: [/package\s+main/, /func\s+main/, /import\s+\(/, /fmt\./],
      rust: [/fn\s+main/, /let\s+mut/, /use\s+std::/, /println!/],
      php: [/<\?php/, /\$\w+/, /function\s+\w+/, /echo\s+/]
    };

    for (const [language, regexes] of Object.entries(patterns)) {
      const matches = regexes.filter(regex => regex.test(code)).length;
      if (matches >= 2) return language;
    }
    return 'unknown';
  }

  private static analyzeTimeComplexity(code: string, language: string): string {
    const lines = code.toLowerCase();
    
    // Advanced pattern detection
    const nestedLoopCount = (lines.match(/for|while/g) || []).length;
    const recursivePatterns = lines.match(/(\w+)\s*\(\s*.*\1\s*\(|return\s+\w+\s*\(/g) || [];
    
    if (recursivePatterns.length > 0 && lines.includes('fibonacci')) return 'O(2ⁿ)';
    if (recursivePatterns.length > 0 && lines.includes('factorial')) return 'O(n)';
    if (nestedLoopCount >= 3) return 'O(n³)';
    if (nestedLoopCount >= 2) return 'O(n²)';
    if (lines.includes('sort') || lines.includes('mergesort') || lines.includes('quicksort')) return 'O(n log n)';
    if (lines.includes('binarysearch') || lines.includes('binary_search')) return 'O(log n)';
    if (nestedLoopCount >= 1) return 'O(n)';
    
    return 'O(1)';
  }

  private static analyzeSpaceComplexity(code: string, language: string): string {
    const lines = code.toLowerCase();
    
    if (lines.includes('recursion') || lines.includes('recursive')) return 'O(n)';
    if (lines.includes('array') || lines.includes('list') || lines.includes('vector')) {
      if (lines.includes('matrix') || lines.includes('2d')) return 'O(n²)';
      return 'O(n)';
    }
    if (lines.includes('map') || lines.includes('dict') || lines.includes('hash')) return 'O(n)';
    
    return 'O(1)';
  }

  private static calculateCyclomaticComplexity(code: string): number {
    const complexityKeywords = ['if', 'else', 'while', 'for', 'case', 'catch', '&&', '||', '?'];
    let complexity = 1; // Base complexity
    
    for (const keyword of complexityKeywords) {
      const matches = code.toLowerCase().split(keyword).length - 1;
      complexity += matches;
    }
    
    return Math.min(complexity, 20); // Cap at 20 for readability
  }

  private static calculateCognitiveComplexity(code: string): number {
    const lines = code.split('\n');
    let complexity = 0;
    let nestingLevel = 0;
    
    for (const line of lines) {
      const trimmed = line.trim().toLowerCase();
      
      if (trimmed.includes('if') || trimmed.includes('for') || trimmed.includes('while')) {
        complexity += (1 + nestingLevel);
        if (trimmed.includes('{')) nestingLevel++;
      }
      if (trimmed.includes('}')) nestingLevel = Math.max(0, nestingLevel - 1);
      if (trimmed.includes('&&') || trimmed.includes('||')) complexity++;
    }
    
    return Math.min(complexity, 50); // Cap for readability
  }

  private static calculateMaintainabilityIndex(code: string): number {
    const linesOfCode = code.split('\n').filter(line => line.trim()).length;
    const cyclomaticComplexity = this.calculateCyclomaticComplexity(code);
    const halsteadVolume = Math.log2(linesOfCode) * linesOfCode; // Simplified Halstead
    
    const maintainabilityIndex = Math.max(0, 
      171 - 5.2 * Math.log(halsteadVolume) - 0.23 * cyclomaticComplexity - 16.2 * Math.log(linesOfCode)
    );
    
    return Math.round(maintainabilityIndex);
  }

  private static detectDuplicateCode(code: string): number {
    const lines = code.split('\n').map(line => line.trim()).filter(line => line.length > 5);
    const duplicates = new Set<string>();
    const seen = new Set<string>();
    
    for (const line of lines) {
      if (seen.has(line)) duplicates.add(line);
      seen.add(line);
    }
    
    return Math.round((duplicates.size / lines.length) * 100);
  }

  private static generateSuggestions(analysis: Partial<AnalysisResult>): string[] {
    const suggestions: string[] = [];
    
    if (analysis.cyclomaticComplexity && analysis.cyclomaticComplexity > 10) {
      suggestions.push('Consider breaking down complex functions into smaller ones');
    }
    
    if (analysis.cognitiveComplexity && analysis.cognitiveComplexity > 15) {
      suggestions.push('Reduce nesting levels and simplify conditional logic');
    }
    
    if (analysis.duplicateCodePercentage && analysis.duplicateCodePercentage > 10) {
      suggestions.push('Extract duplicate code into reusable functions');
    }
    
    if (analysis.timeComplexity === 'O(n²)' || analysis.timeComplexity === 'O(n³)') {
      suggestions.push('Consider optimizing nested loops or using more efficient algorithms');
    }
    
    if (analysis.maintainabilityIndex && analysis.maintainabilityIndex < 20) {
      suggestions.push('Code maintainability is low - consider refactoring');
    }
    
    return suggestions;
  }

  private static detectSecurityIssues(code: string, language: string): string[] {
    const issues: string[] = [];
    const lowerCode = code.toLowerCase();
    
    if (lowerCode.includes('eval(') || lowerCode.includes('exec(')) {
      issues.push('Avoid using eval() or exec() - potential code injection risk');
    }
    
    if (lowerCode.includes('password') && lowerCode.includes('=')) {
      issues.push('Possible hardcoded password detected');
    }
    
    if (lowerCode.includes('sql') && (lowerCode.includes('+') || lowerCode.includes('concat'))) {
      issues.push('Potential SQL injection vulnerability');
    }
    
    if (language === 'javascript' && lowerCode.includes('innerhtml')) {
      issues.push('Using innerHTML can lead to XSS vulnerabilities');
    }
    
    return issues;
  }

  private static detectPerformanceIssues(code: string, language: string): string[] {
    const issues: string[] = [];
    const lowerCode = code.toLowerCase();
    
    if (lowerCode.includes('for') && lowerCode.includes('.length')) {
      issues.push('Cache array length in loops for better performance');
    }
    
    if (language === 'javascript' && lowerCode.includes('getelementsby')) {
      issues.push('Consider using querySelector for better performance');
    }
    
    if (lowerCode.includes('nested') && lowerCode.includes('loop')) {
      issues.push('Nested loops detected - consider algorithm optimization');
    }
    
    return issues;
  }

  public static analyze(code: string): AnalysisResult {
    const language = this.detectLanguage(code);
    const timeComplexity = this.analyzeTimeComplexity(code, language);
    const spaceComplexity = this.analyzeSpaceComplexity(code, language);
    const cyclomaticComplexity = this.calculateCyclomaticComplexity(code);
    const cognitiveComplexity = this.calculateCognitiveComplexity(code);
    const maintainabilityIndex = this.calculateMaintainabilityIndex(code);
    const duplicateCodePercentage = this.detectDuplicateCode(code);
    const linesOfCode = code.split('\n').filter(line => line.trim()).length;
    
    const result: AnalysisResult = {
      timeComplexity,
      spaceComplexity,
      cyclomaticComplexity,
      cognitiveComplexity,
      maintainabilityIndex,
      duplicateCodePercentage,
      linesOfCode,
      language,
      explanation: this.generateExplanation(timeComplexity, spaceComplexity, language),
      suggestions: [],
      securityIssues: this.detectSecurityIssues(code, language),
      performanceIssues: this.detectPerformanceIssues(code, language)
    };
    
    result.suggestions = this.generateSuggestions(result);
    
    return result;
  }

  private static generateExplanation(timeComplexity: string, spaceComplexity: string, language: string): string {
    const explanations = {
      'O(1)': 'Constant time - excellent performance',
      'O(log n)': 'Logarithmic time - very efficient for large datasets',
      'O(n)': 'Linear time - scales proportionally with input size',
      'O(n log n)': 'Efficient sorting algorithms complexity',
      'O(n²)': 'Quadratic time - consider optimization for large inputs',
      'O(n³)': 'Cubic time - significant performance concerns',
      'O(2ⁿ)': 'Exponential time - only suitable for small inputs'
    };
    
    return `Time complexity is ${explanations[timeComplexity] || timeComplexity}. Space complexity is ${spaceComplexity}. Language detected: ${language}.`;
  }
}