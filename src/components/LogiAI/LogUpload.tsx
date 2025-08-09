import { useState, useCallback } from "react";
import { Upload, FileText, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LogUploadProps {
  onLogsUploaded: (logs: string) => void;
}

export const LogUpload = ({ onLogsUploaded }: LogUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [pastedLogs, setPastedLogs] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onLogsUploaded(result);
      };
      reader.readAsText(file);
    }
  }, [onLogsUploaded]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onLogsUploaded(result);
      };
      reader.readAsText(file);
    }
  };

  const handlePasteSubmit = () => {
    if (pastedLogs.trim()) {
      onLogsUploaded(pastedLogs);
      setPastedLogs("");
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border shadow-card">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="paste" className="flex items-center gap-2">
            <Clipboard className="w-4 h-4" />
            Paste Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              dragActive
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop your log files here</h3>
            <p className="text-muted-foreground mb-4">
              Supports .log, .txt, and other text files
            </p>
            <input
              type="file"
              accept=".log,.txt,.out"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="mt-2">
              Browse Files
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="paste">
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your logs here..."
              value={pastedLogs}
              onChange={(e) => setPastedLogs(e.target.value)}
              className="min-h-[200px] font-mono text-sm bg-muted/30 border-border"
            />
            <Button 
              onClick={handlePasteSubmit} 
              className="w-full bg-gradient-primary hover:opacity-90"
              disabled={!pastedLogs.trim()}
            >
              Analyze Logs
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};