 ┌───────┐
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
 └─────┘
