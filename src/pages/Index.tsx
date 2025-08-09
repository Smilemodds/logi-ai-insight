import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/LogiAI/Header";
import { LogUpload } from "@/components/LogiAI/LogUpload";
import { LogViewer } from "@/components/LogiAI/LogViewer";
import { AIInsights } from "@/components/LogiAI/AIInsights";
import { FileText, Brain, AlertTriangle, BarChart3 } from "lucide-react";

const Index = () => {
  const [currentLogs, setCurrentLogs] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogsUploaded = (logs: string) => {
    setCurrentLogs(logs);
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {!currentLogs ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Transform Your Log Analysis with AI
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload your logs and let AI provide intelligent insights, error analysis, and actionable recommendations.
              </p>
            </div>
            <LogUpload onLogsUploaded={handleLogsUploaded} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Log Analysis Dashboard</h2>
              <div className="text-sm text-muted-foreground">
                {currentLogs.split('\n').length} log entries loaded
              </div>
            </div>

            <Tabs defaultValue="raw" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="raw" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Raw Logs
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger value="errors" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Errors
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="raw">
                <LogViewer logs={currentLogs} searchTerm={searchTerm} />
              </TabsContent>

              <TabsContent value="insights">
                <AIInsights logs={currentLogs} />
              </TabsContent>

              <TabsContent value="errors">
                <LogViewer 
                  logs={currentLogs.split('\n').filter(line => 
                    line.toLowerCase().includes('error') || 
                    line.toLowerCase().includes('fatal') ||
                    line.toLowerCase().includes('exception')
                  ).join('\n')} 
                  searchTerm={searchTerm} 
                />
              </TabsContent>

              <TabsContent value="analytics">
                <div className="text-center py-20 text-muted-foreground">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                  <p>Visual analytics and metrics coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;