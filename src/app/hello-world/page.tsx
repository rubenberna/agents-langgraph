"use client";

import { useState } from "react";
import runHelloWorld from "@/app/lib/helloWorld/hello-world-llm";

export default function HelloWorld() {
  const [result, setResult] = useState<any[]>([]);

  const handleRunHelloWorld = async () => {
    const result = await runHelloWorld();
    setResult(result);
  };

  return (
    <div className="flex w-full justify-between lg:flex-row gap-8 mx-auto">
      {/* Main section */}
      <div className="flex flex-col gap-4 items-center justify-center flex-1">
        <h1 className="text-4xl font-bold">Hello World</h1>
        <button
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          onClick={handleRunHelloWorld}
        >
          Run Hello World
        </button>
      </div>

      {!!result?.length && (
        <div className="flex-1">
          {result.length > 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-auto">
              <pre className="text-sm">
                <code className="language-json">
                  {JSON.stringify(result, null, 2)}
                </code>
              </pre>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-gray-500 dark:text-gray-400 text-center">
              Click "Run Hello World" to see the JSON result here
            </div>
          )}
        </div>
      )}
    </div>
  );
}
