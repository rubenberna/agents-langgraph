interface DiagramRendererProps {
  title?: string;
}

export const DiagramRenderer = ({
  title = "Agent Flow Diagram",
}: DiagramRendererProps) => {
  const diagram = ` ┌───────┐
 │ START │
 └───┬───┘
     │
     ▼
 ┌────────┐
 │ llmCall│
 └───┬────┘
     │
     │ shouldContinue(state)
     │
     ├─────────────► if tool calls? ─────┐
     │                                   │
     │                                   ▼
     │                              ┌─────────┐
     │                              │ toolNode│
     │                              └────┬────┘
     │                                   │
     │      unconditional back to llmCall│
     │                                   │
     └───────────────────────────────────┘
     │
     ▼
 ┌─────┐
 │ END │
 └─────┘`;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre">
        {diagram}
      </pre>
    </div>
  );
};
