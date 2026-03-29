# Overview

I want to implement an AI-driven travel assistant that provides a conversational user experience.
The assistant should handle off-topic dialogue gracefully while maintaining focus on user travel intent.
It must extract structured data (e.g., location, budget, dates, facilities) from user input, map it into search parameters, and invoke an existing Search API to retrieve relevant hotel results.
Given that the Search API is already available

# Tech Stack

- Vue 3
- Tailwind CSS
- Typescript
- Pinia
- Iconify
- Axios

# Flow

### 🔄 Full Request Flow

```
User: "I need a hotel in Bali for 2 people, budget $150, with a pool"
    │
    ▼
Vue → POST /api/chat { message, sessionId }
    │
    ▼
ClaudeService → Anthropic API (with search_hotels tool defined)
    │
Claude decides to call: search_hotels({
    location: "Bali",
    guests: 2,
    budget_max: 150,
    facilities: ["pool"]
})
    │
    ▼
HotelSearchService → Your existing Search API
    │
    ▼
Results returned to Claude → Claude writes natural response
    │
    ▼
Stream back to Vue → Display as chat + hotel cards
```

---

### 🛡️ Off-Topic Handling

This is handled entirely in the **system prompt**. You don't need code for it — just clear instructions:

```
If the user asks something unrelated to travel (e.g., recipes, politics, coding),
respond briefly and warmly, then redirect:
"That's outside my expertise! I'm here to help with hotels and travel.
Shall we find you a great place to stay?"
```

Because the Search API is already available, I don't need to implement it. I just need to implement the chat interface and the logic to call the Search API.
