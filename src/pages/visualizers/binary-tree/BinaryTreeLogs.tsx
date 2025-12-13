interface BinaryTreeLogsProps {
  logs: string[];
}

const BinaryTreeLogs = ({ logs }: BinaryTreeLogsProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Operation Logs</h3>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 h-32 overflow-y-auto text-sm">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-arena-gray">No operations performed yet</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1 pb-1 border-b border-gray-100 last:border-0">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BinaryTreeLogs;
