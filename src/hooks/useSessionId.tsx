// Example React hook
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export function useThreadId() {
  const [threadId, setThreadId] = useState<string | null>(null);

  useEffect(() => {
    // Try to reuse an existing thread id from localStorage
    let id = localStorage.getItem("thread_id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("thread_id", id);
    }
    setThreadId(id);
  }, []);

  return threadId;
}
