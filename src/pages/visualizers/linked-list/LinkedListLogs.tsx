interface LinkedListLogsProps {
  logs: string[];
}

export const LinkedListLogs = ({ logs }: LinkedListLogsProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2 text-foreground">Operation Logs</h3>
      <div className="bg-secondary border border-border rounded-lg p-2 h-32 overflow-y-auto text-sm">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">No operations performed yet</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1 pb-1 border-b border-border last:border-0 text-foreground">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LinkedListLogs;
