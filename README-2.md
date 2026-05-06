# RAG Doctor 🩺

**Diagnose your RAG system. Find what's broken. Know exactly how to fix it.**

RAG Doctor evaluates your Retrieval Augmented Generation pipeline across 4 dimensions — Faithfulness, Context Precision, Context Recall, and Answer Relevance — and tells you which layer of your pipeline (chunking, retrieval, or generation) is responsible for failures.

Built with Claude Sonnet as the eval engine. Zero backend dependencies — just a lightweight Vercel proxy to keep the API key safe.

---

## Features

- **Single diagnosis** — paste one question + chunks + answer, get a full scored report
- **Batch CSV eval** — upload a dataset of QA pairs, evaluate all at once, get aggregate insights
- **CSV export** — download full results with scores, explanations, and fix recommendations per row
- **Pipeline blame** — understand whether your failure is in chunking, retrieval, or generation
- **Cost tracking** — see token usage and estimated API cost per run

---

## Live Demo

> [Your Vercel URL here]

---

## Self-hosting

### 1. Clone the repo

```bash
git clone https://github.com/smit411-debug/merchant-distress-a2a.git
cd merchant-distress-a2a
```

### 2. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### 3. Set your API key

In the Vercel dashboard → your project → Settings → Environment Variables:

```
ANTHROPIC_API_KEY = sk-ant-...
```

Redeploy after setting the key.

### 4. That's it

The frontend (`index.html`) calls `/api/diagnose` which proxies to Anthropic. Your key never touches the browser.

---

## CSV Format

| Column | Required | Description |
|--------|----------|-------------|
| `question` | ✅ | The user question sent to your RAG system |
| `chunk_1` | ✅ | First retrieved chunk |
| `chunk_2` … `chunk_5` | optional | Additional chunks |
| `answer` | ✅ | The answer your RAG system generated |
| `ground_truth` | optional | Correct answer — enables Context Recall scoring |

---

## Eval Dimensions

| Dimension | What it measures |
|-----------|-----------------|
| **Faithfulness** | Are all claims in the answer grounded in the retrieved chunks? |
| **Context Precision** | What % of retrieved chunks were actually useful? |
| **Context Recall** | Did the chunks contain enough info to answer correctly? (requires ground truth) |
| **Answer Relevance** | Does the answer actually address what was asked? |

---

## Rate Limiting

The public demo has a 150-call/day cap to prevent abuse. Fork and deploy your own instance with your own key for unlimited use.

---

## Stack

- **Frontend**: Vanilla HTML/CSS/JS — no framework, no build step
- **Eval engine**: Claude Sonnet via Anthropic API
- **Proxy**: Vercel serverless function (Node.js)
- **Hosting**: GitHub Pages (frontend) + Vercel (API proxy)

---

## Built by

[@smit411](https://github.com/smit411-debug) · Built as part of a hands-on AI PM learning project.
