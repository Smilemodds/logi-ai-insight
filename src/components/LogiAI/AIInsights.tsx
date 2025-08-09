import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, AlertTriangle, CheckCircle, Info, Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AIInsight {
  type: "summary" | "error" | "anomaly" | "suggestion";
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  count?: number;
  suggestion?: string;
}

interface AIInsightsProps {
  logs: string;
}

export const AIInsights = ({ logs }: AIInsightsProps) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (logs) {
      analyzeLogsWithAI();
    }
  }, [logs]);

  const analyzeLogsWithAI = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis - in a real app, this would call OpenAI/Claude
    setTimeout(() => {
      const mockInsights: AIInsight[] = [
        {
          type: "summary",
          title: "Log Analysis Summary",
          description: "Analyzed 1,247 log entries spanning 2 hours. Detected 12 errors, 34 warnings, and 3 potential anomalies.",
          severity: "medium"
        },
        {
          type: "error",
          title: "Database Connection Failures",
          description: "Multiple database connection timeouts detected. This appears to be affecting user authentication.",
          severity: "high",
          count: 12,
          suggestion: "Check database server health and connection pool configuration. Consider implementing connection retry logic."
        },
        {
          type: "anomaly",
          title: "Unusual Memory Usage Pattern",
          description: "Memory consumption spiked between 14:30-14:45, reaching 95% capacity.",
          severity: "medium",
          count: 1,
          suggestion: "Review memory-intensive operations during this timeframe. Possible memory leak in user session handling."
        },
        {
          type: "suggestion",
          title: "Performance Optimization",
          description: "API response times have increased by 40% compared to baseline. Consider implementing caching.",
          severity: "low",
          suggestion: "Implement Redis caching for frequently accessed data. Review database query performance."
        }
      ];
      
      setInsights(mockInsights);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getInsightIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "summary": return <Info className="w-5 h-5" />;
      case "error": return <AlertTriangle className="w-5 h-5" />;
      case "anomaly": return <Brain className="w-5 h-5" />;
      case "suggestion": return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: AIInsight["severity"]) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "info";
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="p-6 bg-gradient-card border-border shadow-card">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="w-6 h-6 animate-pulse text-primary" />
          <span className="text-lg">AI is analyzing your logs...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-card border-border shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Insights
        </h3>
        <Button variant="outline" size="sm" onClick={analyzeLogsWithAI}>
          Re-analyze
        </Button>
      </div>

      <ScrollArea className="h-[500px] w-full">
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <Alert key={index} className="border-border bg-muted/20">
              <div className="flex items-start gap-3">
                <div className={`text-${getSeverityColor(insight.severity)} mt-1`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{insight.title}</h4>
                    <Badge variant="outline" className={`text-${getSeverityColor(insight.severity)}`}>
                      {insight.severity}
                    </Badge>
                    {insight.count && (
                      <Badge variant="secondary">
                        {insight.count} occurrences
                      </Badge>
                    )}
                  </div>
                  <AlertDescription className="mb-3">
                    {insight.description}
                  </AlertDescription>
                  {insight.suggestion && (
                    <div className="p-3 bg-accent/30 rounded-md border border-accent/50">
                      <p className="text-sm font-medium text-accent-foreground flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Recommended Action:
                      </p>
                      <p className="text-sm text-accent-foreground/80 mt-1">
                        {insight.suggestion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};