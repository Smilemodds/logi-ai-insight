import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG";
  message: string;
  source?: string;
}

interface LogViewerProps {
  logs: string;
  searchTerm?: string;
}

export const LogViewer = ({ logs, searchTerm = "" }: LogViewerProps) => {
  const [parsedLogs, setParsedLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Parse logs into structured format
    const lines = logs.split("\n").filter(line => line.trim());
    const parsed = lines.map((line, index) => {
      const logEntry: LogEntry = {
        id: `log-${index}`,
        timestamp: extractTimestamp(line) || new Date().toISOString(),
        level: extractLevel(line),
        message: line,
        source: extractSource(line)
      };
      return logEntry;
    });
    setParsedLogs(parsed);
  }, [logs]);

  useEffect(() => {
    // Filter logs based on search term
    if (!searchTerm) {
      setFilteredLogs(parsedLogs);
    } else {
      const filtered = parsedLogs.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.level.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLogs(filtered);
    }
  }, [parsedLogs, searchTerm]);

  const extractTimestamp = (line: string): string | null => {
    // Common timestamp patterns
    const patterns = [
      /\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/,
      /\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}/,
      /\[\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\]/
    ];
    
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) return match[0];
    }
    return null;
  };

  const extractLevel = (line: string): LogEntry["level"] => {
    const upperLine = line.toUpperCase();
    if (upperLine.includes("ERROR") || upperLine.includes("FATAL")) return "ERROR";
    if (upperLine.includes("WARN")) return "WARN";
    if (upperLine.includes("DEBUG")) return "DEBUG";
    return "INFO";
  };

  const extractSource = (line: string): string | undefined => {
    const sourceMatch = line.match(/\[([^\]]+)\]/);
    return sourceMatch ? sourceMatch[1] : undefined;
  };

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "ERROR": return "destructive";
      case "WARN": return "warning";
      case "INFO": return "info";
      case "DEBUG": return "debug";
      default: return "secondary";
    }
  };

  const copyLogs = () => {
    navigator.clipboard.writeText(logs);
  };

  const downloadLogs = () => {
    const blob = new Blob([logs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logs.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-4 bg-gradient-card border-border shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Raw Logs</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyLogs}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadLogs}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[500px] w-full">
        <div className="space-y-2 font-mono text-sm">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 rounded-md bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <Badge variant="outline" className={`log-${log.level.toLowerCase()} text-xs shrink-0`}>
                {log.level}
              </Badge>
              <span className="text-xs text-muted-foreground shrink-0 w-20">
                {log.timestamp.split("T")[1]?.split(".")[0] || "00:00:00"}
              </span>
              <span className="flex-1 break-all">
                {log.message}
              </span>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No logs match your search criteria
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};