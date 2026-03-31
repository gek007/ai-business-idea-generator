# IdeaGen — Planned Improvements

## 1. Regenerate Button

**File:** `pages/product.tsx`

- Extract the SSE fetch logic into a `generate()` callback (`useCallback`)
- Reset `idea` state to `''` before each call so the card clears
- Change the generate button label dynamically: `"Generate Idea"` on first load → `"Regenerate"` after first result
- Disable the button while streaming (`loading` state)

---

## 2. Idea Customization — Industry / Domain Selector

**Files:** `pages/product.tsx`, `api/index.py`

### Frontend
- Add an `industry` state (default: `'AI agents'`)
- Render pill/chip buttons for each industry option:
  - AI Agents, Healthcare, Finance, Education, Retail, Tech Industry, AI-Powered Tools
- Pass selected industry as a query param: `GET /api?industry=healthcare`

### Backend
- Add optional `industry: str = "AI agents"` query parameter to the `/api` endpoint
- Update prompt to: `"Reply with a new business idea for the {industry} industry, focusing on AI Agent opportunities. Format with headings, sub-headings and bullet points."`

---

## 3. Save / History (localStorage)

**File:** `pages/product.tsx`

### Data shape
```ts
interface SavedIdea {
  id: string;          // crypto.randomUUID()
  industry: string;
  content: string;
  timestamp: number;
}
```

### Behaviour
- `STORAGE_KEY = 'ideagen_history'`
- After the SSE stream closes (promise resolves), save the completed idea to localStorage
- Keep the last 20 ideas (slice on write)
- Load history from localStorage on component mount (`useEffect`)
- Show a collapsible "Recent Ideas (N)" panel below the content card
- Each history item shows: industry label, date, first ~100 chars of content (stripped of Markdown)
- Clicking a history item loads it into the main content card (no re-fetch)

---

## 4. Share / Export — Copy to Clipboard

**File:** `pages/product.tsx`

- Add a `"Copy"` button in the top-right corner of the content card
- Use `navigator.clipboard.writeText(idea)` on click
- Toggle label to `"✓ Copied!"` for 2 seconds, then reset
- Only render the button when `idea` is non-empty

---

## Summary of File Changes

| File | Changes |
|---|---|
| `api/index.py` | Add `industry` query param; update prompt |
| `pages/product.tsx` | Refactor into `generate()` callback; add industry chips; add history (localStorage); add copy button |
