# MSD Project — Full Audit Prompt (Find Issues Only, No Fixes)

Paste everything below into your IDE assistant (Cursor, Claude Code, Copilot Chat, etc.) with the project root open.

---

## ROLE

You are a senior QA engineer, security auditor and code reviewer. Audit the ENTIRE project in this workspace: React + Vite + TypeScript frontend (`src/`) and Node/Express + MongoDB backend (`backend/`). This is an **AUDIT ONLY** task.

## STRICT RULES

- DO NOT fix, edit, refactor, create or delete any file. Do not suggest code patches or corrected code. Only report findings.
- Read EVERY file, line by line, before reporting. Do not skip files because they are large (`Register.tsx`, `Admin.tsx`, `DigitalIdCard.tsx`, `memberController.js` are all large).
- Never guess. Every finding must cite the exact file path and line number(s) and quote the offending line.
- If you could not read a file or are unsure, say so under "Not verified" instead of inventing results.
- Do not include secrets or personal data in the report. Mask any real values (mobile numbers, emails, ID numbers, keys).

## SCOPE (read all, grouped as below)

**Frontend:** `src/App.tsx`, `main.tsx`, `pages/*`, `components/*`, `components/ui/*`, `components/layout/*`, `config/api.ts`, `hooks/*`, `lib/*`, `data/*.json`, image list JSON files, `index.css`, `App.css`, test files.

**Backend:** `server.js`, `routes/*`, `controllers/*`, `middleware/*`, `models/*`, `config/*`, `data/*`, `test/*`, `package.json`, `.env.example`, `nodemon.json`.

**Config / Deploy:** `package.json`, `vite.config.ts`, `vitest.config.ts`, `tsconfig*.json`, `eslint.config.js`, tailwind/postcss config, `vercel.json`, `render.yaml`, `.gitignore`, `.env.example`, `index.html`.

**Other:** `scripts/*`, `wacto/*`, `outputs/*.md`, `README.md`, references to `public/` assets.

---

## CHECK CATEGORIES (test each one explicitly)

### 1. ROUTING
- Every `<Route>` in `App.tsx` resolves to an existing component; check duplicate/overlapping routes, missing routes, dead links, and wrong paths in Header/Footer/buttons/`navigate()`/`<Link>`.
- Dynamic params (`/appointment/:id`) with invalid or missing ids.
- Catch-all 404, SPA rewrite in `vercel.json`, deep-link refresh behavior.
- Backend: every route in `server.js` and `routes/*.js` maps to a real controller export; check HTTP method mismatches, route order conflicts (e.g. `/:id` vs fixed paths), and missing auth middleware on any route.
- Frontend-to-backend contract: every `fetch`/`getApiUrl` call matches an actual backend route, method, headers, body shape and response shape.

### 2. SECURITY (OWASP Top 10 mindset)
- **Authentication and authorization:** JWT handling, secret fallbacks, token storage (localStorage), expiry, plaintext credential comparison, missing rate limiting or brute-force protection, routes missing `verifyToken`.
- **Injection:** NoSQL injection, regex injection (user input in `RegExp`), XSS (`dangerouslySetInnerHTML`, unsanitized output), SSRF (proxy endpoints fetching user-supplied URLs), path traversal in file read/write.
- **CORS:** configuration, credentials, allowed-origins logic.
- **File upload:** type/size validation, MIME trust, unauthenticated upload/delete endpoints, storage abuse.
- **Sensitive data exposure:** PII returned by public endpoints, PII or secrets committed in the repo (`data/*.json`, `.env.example`, `VITE_` prefixed secrets bundled into the client), verbose error messages, console logging of sensitive data.
- **Hardening:** security headers (helmet), HTTPS, cookie flags, dependency vulnerabilities (review `package.json` versions), unused risky packages.
- **Data persistence risks:** writing to local disk on ephemeral hosts, race conditions on file writes.

### 3. BUGS AND LOGIC ERRORS
- Null/undefined access, unhandled promise rejections, missing try/catch, missing `await`, race conditions, stale state, memory leaks, missing `useEffect` cleanup or dependencies, wrong conditionals, off-by-one, timezone/date bugs (DOB, age), ID generation collisions (`registrationId`), duplicate-registration logic, pagination edge cases.
- Validation mismatches between frontend (`Register.tsx`) and backend (`validateRegistrationData`, Mongoose schema).
- Error handling gaps, wrong status codes, inconsistent response shapes.
- Dead code, unused imports/variables/exports, `any` types, `ts-ignore`, commented-out code, TODO/FIXME.

### 4. UNIT TEST COVERAGE AND QUALITY
- List every existing test file and what it covers.
- For every source file, state whether it has tests (Yes / No / Partial).
- Identify untested critical paths: registration, status check, admin login, approve/reject/delete, upload, ID card generation, routing.
- Judge test quality: meaningless assertions, over-mocking, tests that always pass.
- Do NOT write tests. Only list which unit tests are missing and the exact function/route each should cover.

### 5. PERFORMANCE AND RELIABILITY
- Oversized components, unnecessary re-renders, large bundles/images, N+1 or unindexed queries, unbounded queries, sync file I/O in request handlers, startup behavior when the DB is down.

### 6. ACCESSIBILITY AND UX BUGS
- Missing alt text, aria-labels, keyboard traps, focus management in modals, form label association, color contrast hints, broken mobile layout logic.

### 7. CONFIG AND DEPLOYMENT
- Env var mismatches between `.env.example`, `render.yaml` and code (`process.env.*`, `import.meta.env.*`), hardcoded URLs, port conflicts, missing build/test scripts, tsconfig strictness, lint config gaps, `.gitignore` gaps.

---

## SCORING (apply to every category and every file)

For each CHECK ITEM give exactly one status:

| Status | Meaning |
|---|---|
| **PASS** | Verified correct, no issue found |
| **PARTIAL** | Works but has a weakness or edge-case risk |
| **FAIL** | Confirmed bug or vulnerability |
| **N/A** | Not applicable |

- Severity for every PARTIAL/FAIL: **Critical, High, Medium, Low**.
- Compute percentages using:

```
score = (PASS + 0.5 x PARTIAL) / (PASS + PARTIAL + FAIL) x 100
```

Exclude N/A. Report the score per category, per file, and an overall project score. Show the counts used so the math can be checked.

---

## OUTPUT FORMAT (in this order)

1. **Files reviewed:** full list with line count, and a separate "Not reviewed / Not verified" list.
2. **Summary table:** Category | PASS | PARTIAL | FAIL | Score %.
3. **Overall project score %**, plus separate Security score %, Routing score %, Test-coverage score %.
4. **Findings table**, sorted by severity: ID | Severity | Category | File:Line | Quoted code | What is wrong | Why it matters (impact/exploit scenario). No fixes.
5. **Per-file results table:** File | Status (PASS/PARTIAL/FAIL) | Score % | Number of findings.
6. **Frontend-to-backend route contract matrix:** Frontend call (file:line) | Backend route | Method match | Auth match | Response shape match | Status.
7. **Missing unit tests list:** File/function | What should be tested | Priority.
8. **Top 10 highest-risk issues** in plain language.
9. **Final verdict:** Ready / Not ready for production, with the single biggest blocker named.

Begin by listing all files, then review them one by one. State progress as you go (e.g. "Reviewed 23/114 files"). Do not stop early; if output is too long, continue in numbered parts until all files are covered.
