export const JsonRenderer = ({
  jsonResult,
  title,
}: {
  jsonResult: any;
  title?: string;
}) => {
  if (!jsonResult) return null;
  return (
    <div className="flex-1">
      {jsonResult.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-auto">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          <pre className="text-sm">
            <code className="language-json">
              {JSON.stringify(jsonResult, null, 2)}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};
