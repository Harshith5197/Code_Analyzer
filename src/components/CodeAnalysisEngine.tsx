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
    const codeClean = code.trim().toLowerCase();
    
    // Enhanced patterns with weights for more accurate detection
    const languagePatterns = {
      python: {
        patterns: [
          { regex: /def\s+\w+\s*\(/, weight: 3 },
          { regex: /import\s+\w+/, weight: 2 },
          { regex: /from\s+\w+\s+import/, weight: 3 },
          { regex: /if\s+__name__\s*==\s*['"']__main__['"]/, weight: 4 },
          { regex: /:\s*$/m, weight: 2 },
          { regex: /print\s*\(/, weight: 2 },
          { regex: /elif\s+/, weight: 2 },
          { regex: /\.append\s*\(/, weight: 2 },
          { regex: /range\s*\(/, weight: 2 },
          { regex: /len\s*\(/, weight: 1 }
        ]
      },
      javascript: {
        patterns: [
          { regex: /function\s+\w+\s*\(/, weight: 3 },
          { regex: /const\s+\w+\s*=/, weight: 2 },
          { regex: /let\s+\w+/, weight: 2 },
          { regex: /var\s+\w+/, weight: 2 },
          { regex: /=>\s*[{(]/, weight: 3 },
          { regex: /console\.log\s*\(/, weight: 3 },
          { regex: /document\./, weight: 2 },
          { regex: /window\./, weight: 2 },
          { regex: /\.forEach\s*\(/, weight: 2 },
          { regex: /require\s*\(/, weight: 2 }
        ]
      },
      typescript: {
        patterns: [
          { regex: /interface\s+\w+/, weight: 4 },
          { regex: /type\s+\w+\s*=/, weight: 3 },
          { regex: /:\s*(string|number|boolean|void)/, weight: 3 },
          { regex: /as\s+\w+/, weight: 2 },
          { regex: /export\s+(interface|type)/, weight: 3 },
          { regex: /<[A-Z]\w*>/, weight: 2 },
          { regex: /public\s+\w+\s*\(/, weight: 2 },
          { regex: /private\s+\w+\s*:/, weight: 2 }
        ]
      },
      java: {
        patterns: [
          { regex: /public\s+class\s+\w+/, weight: 4 },
          { regex: /public\s+static\s+void\s+main/, weight: 4 },
          { regex: /private\s+\w+/, weight: 2 },
          { regex: /protected\s+\w+/, weight: 2 },
          { regex: /extends\s+\w+/, weight: 3 },
          { regex: /implements\s+\w+/, weight: 3 },
          { regex: /System\.out\.print/, weight: 3 },
          { regex: /new\s+\w+\s*\(/, weight: 2 },
          { regex: /import\s+java\./, weight: 3 }
        ]
      },
      cpp: {
        patterns: [
          { regex: /#include\s*<\w+>/, weight: 3 },
          { regex: /using\s+namespace\s+std/, weight: 4 },
          { regex: /int\s+main\s*\(/, weight: 3 },
          { regex: /std::/, weight: 3 },
          { regex: /cout\s*<</, weight: 3 },
          { regex: /cin\s*>>/, weight: 3 },
          { regex: /vector\s*</, weight: 2 },
          { regex: /string\s+\w+/, weight: 2 },
          { regex: /#ifndef|#define|#endif/, weight: 2 }
        ]
      },
      c: {
        patterns: [
          { regex: /#include\s*[<"]\w+\.h[>"]/, weight: 3 },
          { regex: /int\s+main\s*\(/, weight: 3 },
          { regex: /printf\s*\(/, weight: 3 },
          { regex: /scanf\s*\(/, weight: 3 },
          { regex: /malloc\s*\(/, weight: 3 },
          { regex: /free\s*\(/, weight: 2 },
          { regex: /struct\s+\w+/, weight: 2 },
          { regex: /typedef\s+/, weight: 2 }
        ]
      },
      csharp: {
        patterns: [
          { regex: /using\s+System/, weight: 3 },
          { regex: /namespace\s+\w+/, weight: 3 },
          { regex: /class\s+\w+/, weight: 2 },
          { regex: /Console\.WriteLine/, weight: 4 },
          { regex: /public\s+static\s+void\s+Main/, weight: 4 },
          { regex: /string\[\]\s+args/, weight: 3 },
          { regex: /\.ToString\s*\(/, weight: 2 }
        ]
      },
      go: {
        patterns: [
          { regex: /package\s+main/, weight: 4 },
          { regex: /func\s+main\s*\(/, weight: 3 },
          { regex: /import\s+\(/, weight: 3 },
          { regex: /fmt\./, weight: 3 },
          { regex: /func\s+\w+\s*\(/, weight: 2 },
          { regex: /:=/, weight: 2 },
          { regex: /var\s+\w+\s+\w+/, weight: 2 }
        ]
      },
      rust: {
        patterns: [
          { regex: /fn\s+main\s*\(/, weight: 4 },
          { regex: /let\s+mut\s+/, weight: 3 },
          { regex: /use\s+std::/, weight: 3 },
          { regex: /println!\s*\(/, weight: 3 },
          { regex: /match\s+\w+/, weight: 2 },
          { regex: /impl\s+/, weight: 2 },
          { regex: /struct\s+\w+/, weight: 2 }
        ]
      },
      php: {
        patterns: [
          { regex: /<\?php/, weight: 4 },
          { regex: /\$\w+/, weight: 3 },
          { regex: /function\s+\w+\s*\(/, weight: 2 },
          { regex: /echo\s+/, weight: 2 },
          { regex: /->/, weight: 2 },
          { regex: /array\s*\(/, weight: 2 }
        ]
      },
      ruby: {
        patterns: [
          { regex: /def\s+\w+/, weight: 3 },
          { regex: /end\s*$/, weight: 2 },
          { regex: /puts\s+/, weight: 2 },
          { regex: /require\s+['"]/, weight: 2 },
          { regex: /class\s+\w+/, weight: 2 },
          { regex: /elsif/, weight: 2 }
        ]
      },
      swift: {
        patterns: [
          { regex: /func\s+\w+\s*\(/, weight: 3 },
          { regex: /var\s+\w+\s*:/, weight: 2 },
          { regex: /let\s+\w+\s*=/, weight: 2 },
          { regex: /print\s*\(/, weight: 2 },
          { regex: /import\s+Foundation/, weight: 3 }
        ]
      },
      kotlin: {
        patterns: [
          { regex: /fun\s+main\s*\(/, weight: 4 },
          { regex: /fun\s+\w+\s*\(/, weight: 3 },
          { regex: /val\s+\w+/, weight: 2 },
          { regex: /var\s+\w+/, weight: 2 },
          { regex: /println\s*\(/, weight: 2 }
        ]
      },
      scala: {
        patterns: [
          { regex: /object\s+\w+/, weight: 3 },
          { regex: /def\s+main\s*\(/, weight: 4 },
          { regex: /val\s+\w+/, weight: 2 },
          { regex: /var\s+\w+/, weight: 2 },
          { regex: /println\s*\(/, weight: 2 }
        ]
      }
    };

    let bestMatch = { language: 'unknown', score: 0 };

    for (const [language, config] of Object.entries(languagePatterns)) {
      let score = 0;
      for (const { regex, weight } of config.patterns) {
        if (regex.test(codeClean)) {
          score += weight;
        }
      }
      
      if (score > bestMatch.score && score >= 3) { // Minimum threshold
        bestMatch = { language, score };
      }
    }

    return bestMatch.language;
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