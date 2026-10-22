# MSD Project — Fix Prompt (Based on DigitalOcean Audit Report)

Paste everything below the divider into your IDE assistant (Cursor, Claude Code, Copilot Chat, etc.) with the project root open and `DIGITALOCEAN_AUDIT_REPORT.md` available in the workspace.

---

## ROLE

You are a senior full-stack engineer and security engineer. Your job is to **FIX the issues** listed in `DIGITALOCEAN_AUDIT_REPORT.md` and in the extra list below, in this React + Vite + TypeScript frontend (`src/`) and Node/Express + MongoDB backend (`backend/`) project. The target host is DigitalOcean (App Platform preferred, Droplet as an alternative), but the code must stay provider-neutral and configurable through environment variables.

## STRICT RULES

1. Read `DIGITALOCEAN_AUDIT_REPORT.md` fully first, then re-read each file you are about to change. Confirm the issue exists at the cited line before changing anything. If the line has moved or the issue is already fixed, say so and skip it.
2. Fix **one issue at a time**, in the order given below. After each fix, stop and report before starting the next.
3. Make the **smallest change** that fixes the problem. Do not refactor, rename, reformat or "improve" unrelated code.
4. Do not change existing API routes, response shapes or database field names unless the fix requires it. If it does, list every frontend call that must change and update them in the same fix.
5. Never write real secrets, passwords, tokens, connection strings or personal data into any file, log, test or report. Use placeholders such as `<your-value>`.
6. Do not delete user data. For anything destructive (removing files from git history, dropping data), explain the steps and ask me before running them.
7. After each fix, run the relevant checks (listed per issue). If a check fails, fix your change, not the check. Do not weaken, skip or delete tests to make them pass.
8. If you are unsure or cannot verify something, say "Not verified" instead of guessing.

---

## FIX ORDER

### PHASE 0 — Credentials and personal data (do these first)

**F0-1. Committed secrets and personal data** *(extra finding)*
- Problem: the audit report quotes `backend/.env` containing a real MongoDB Atlas connection string, and `backend/data/members_mongodb_data.json` contains real member records (names, mobile numbers, DOB, addresses, ID proof numbers).
- Fix: add `backend/.env`, `.env`, `.env.*` (except `.env.example`) and `backend/data/members_mongodb_data.json` to `.gitignore`; run `git rm --cached` on them; replace the data file with a small anonymized sample (fake names and numbers) if the seed script needs one; make sure `.env.example` files contain only placeholders.
- Do NOT rewrite git history yourself. Instead, print the exact commands (e.g. `git filter-repo` or BFG) for me to review and run.
- Tell me which credentials I must **rotate** (MongoDB user password, JWT secret, admin password, Cloudinary keys), because they should be treated as exposed.
- Verify: `git ls-files` no longer lists those files; `git grep -nE "mongodb\+srv://[^<]"` returns nothing.

**F0-2. Client-side secret** *(report checklist item 7)*
- Problem: `VITE_CLOUDINARY_API_SECRET` in the root `.env` / `.env.example`. Any `VITE_` variable is bundled into the public JavaScript.
- Fix: remove it from every `.env*` file and from any frontend code that reads it. If the frontend needs Cloudinary, it must call the backend upload route or use an unsigned upload preset with no secret. Search `src/` for every use of `import.meta.env.VITE_CLOUDINARY` first and list them.
- Verify: `git grep -n "VITE_CLOUDINARY_API_SECRET"` returns nothing; `npm run build` passes.

---

### PHASE 1 — Critical (from the audit report)

**F1. [DO-01] Hardcoded Render backend URL** — `src/config/api.ts:8`
- Fix: remove the hardcoded `https://msd-backend.onrender.com` fallback. In production, if `VITE_API_URL` is missing, fail loudly (clear error at build time or an explicit console error plus a visible config-error state) instead of silently calling another host. Keep the `http://localhost:5000` fallback for dev only.
- Verify: build with and without `VITE_API_URL` and show the behavior of both; `getApiUrl` unit test covers dev, prod-with-env, prod-without-env.

**F2. [DO-02] CORS whitelist and wildcard fallback** — `backend/server.js:~20-40`
- Fix: build the allowed origins from environment variables (`FRONTEND_URL`, plus an optional comma-separated `ALLOWED_ORIGINS`). Remove the hardcoded `msd-nine.vercel.app` and the `.endsWith(".vercel.app")` rule. Remove the final fallback that allows every origin, so unknown origins are rejected. Allow requests with no `Origin` header only where needed (health checks, server-to-server). Keep `localhost` origins only when `NODE_ENV !== "production"`.
- Verify: write tests showing an allowed origin passes, an unknown origin is rejected, and preflight `OPTIONS` works for the allowed origin.

---

### PHASE 2 — High

**F3. [DO-03] Card settings stored in a local JSON file** — `backend/controllers/memberController.js:~712-763`
- Fix: store card settings (seal, signature URL, signatory titles) in MongoDB using a small `Setting` (or `CardSettings`) Mongoose model with a single document. Replace the `fs.readFileSync` / `fs.writeFileSync` calls. Keep the same endpoints and response shape. Provide a one-time safe default when no document exists (use the values currently in `card_settings.json` as defaults, not as storage).
- Verify: update the existing card-settings tests; add tests for "no document yet returns defaults", "update persists", and "invalid input is rejected". Confirm no `fs` write remains for settings.

**F4. [DO-04] SPA deep-link 404 on DigitalOcean** — missing DO config
- Fix: add `.do/app.yaml` for App Platform with a static site (`catchall_document: index.html`, `VITE_API_URL` as a `BUILD_TIME` variable pointing at the backend's public URL) and a backend web service (`source_dir: backend`, health check, secrets declared with `type: SECRET` and no values). Use the blueprint in section 4 of the audit report as the starting point, but replace `<your-org>` with a placeholder and verify every key against current DigitalOcean App Platform spec documentation if you can; otherwise mark it "Not verified".
- Also add a health route (e.g. `GET /health` returning 200 and `{ status: "ok" }`, no sensitive data) if `/` is not suitable, and point the health check at it.
- Verify: validate the YAML syntax; list every route in `src/App.tsx` and confirm each is covered by the catch-all.

**F5. [DO-05] Missing deployment manifests**
- Fix: add only what is needed for the chosen path: `.do/app.yaml` (done in F4). For the Droplet alternative, add `deploy/nginx.conf.example` and `deploy/ecosystem.config.js.example` (clearly named examples, not auto-used). Add a short `DEPLOY.md` listing required environment variables (names only, no values) for frontend and backend, and the exact deploy steps. Do not add a Dockerfile unless I ask.

**F6. [DO-06] MongoDB Atlas network access**
- This is a configuration decision, not a code change. Do NOT change code for it. Instead, add a section to `DEPLOY.md` explaining the options: (a) allow `0.0.0.0/0` in Atlas only if the database user has a strong unique password and least-privilege role, (b) use a fixed outbound IP (Droplet, or a reserved/static egress option if available), (c) use a managed database in the same provider network. State the trade-offs and recommend the safest option that fits a small budget. Also make `connectDB` fail fast with a clear error and non-zero exit code when the connection cannot be made, rather than starting a half-working server.
- Verify: describe how to test the connection from the deployed environment.

---

### PHASE 3 — Medium (from the audit report)

**F7. [DO-07] Production process management** — `backend/package.json`
- Fix: keep `npm start` as `node server.js` for App Platform. Add handlers in `server.js` for `unhandledRejection` and `uncaughtException` that log safely and exit non-zero so the platform restarts the process, and handle `SIGTERM` with graceful shutdown (close server, close Mongo connection). Add `deploy/ecosystem.config.js.example` for Droplet users (from F5).

**F8. [DO-08] Binding and exposure** — `backend/server.js:~65`
- Fix: read the bind host from an env var (`HOST`, default `0.0.0.0` for containers); document in `DEPLOY.md` that on a Droplet the firewall must block port 5000 and only Nginx should be public. Add `app.set("trust proxy", 1)` when behind a proxy so client IPs and rate limiting work correctly.

---

### PHASE 4 — Extra security findings from the earlier project audit (not in the DO report)

Fix each one in the same one-at-a-time way.

**F9. Unauthenticated upload and delete** — `backend/routes/uploadRoutes.js`
- Add the existing `verifyToken` middleware to `POST /api/upload` and `DELETE /api/upload`, unless a public upload is truly needed for registration photos. If registration needs a public photo upload, keep that one route public but add file type allow-list (jpeg/png/webp), a size limit, and rate limiting; keep delete admin-only.
- Verify: tests for 401 without a token, 200 with a valid token, 400 for wrong file type, 413 for oversized file.

**F10. SSRF in the photo proxy** — `backend/controllers/memberController.js` (`proxyPhoto`)
- Allow only `https` URLs whose hostname is on an allow-list (e.g. `res.cloudinary.com` and your Cloudinary cloud name path). Reject anything else, including IP addresses, `localhost`, private ranges, redirects to other hosts, and non-image content types. Add a response size limit and timeout.
- Verify: tests for allowed host, `http://169.254.169.254/...`, `http://localhost`, a URL with credentials, and a redirect to a blocked host.

**F11. Admin login hardening** — `backend/controllers/memberController.js` (`adminLogin`), `middleware/auth.js`
- Compare credentials with a constant-time comparison (`crypto.timingSafeEqual`) or store a bcrypt hash of the admin password in an env var and compare with bcrypt. Add rate limiting and a short lockout on repeated failed logins (e.g. `express-rate-limit`). Remove any fallback JWT secret: the server must refuse to start in production if `JWT_SECRET` is missing or shorter than 32 characters. Keep token expiry short.
- Verify: tests for wrong password, missing secret at startup, rate limit reached.

**F12. Regex injection in admin search** — `memberController.js`
- Escape user input before using it in `RegExp` / `$regex`, and cap the search string length. Validate `page` and `limit` as integers with a maximum.
- Verify: tests with inputs like `.*`, `(a+)+$`, and `[`.

**F13. Over-sharing in the public status lookup** — `memberController.js` (status check)
- Return only what a member needs to see (name, registration ID, status, wing). Remove address, mobile, DOB and ID proof data from the public response. Require both registration ID and mobile together (not mobile alone) to look up a record, and rate-limit the endpoint. Update `Register.tsx` / `DigitalIdCard.tsx` if they depended on removed fields, and list every place changed.
- Verify: tests asserting the response keys, and that mobile-only lookup is rejected.

**F14. Security headers and body limits** — `backend/server.js`
- Add `helmet` with sensible defaults, set a JSON body size limit, and make sure error responses do not leak stack traces in production.

---

## AFTER EVERY FIX, REPORT IN THIS FORMAT

```
Fix ID:            (e.g. F3)
Status:            FIXED / PARTIALLY FIXED / SKIPPED (reason) / NOT VERIFIED
Files changed:     list with line ranges
What changed:      2-4 plain sentences
Frontend impact:   routes/calls/fields changed (or "none")
Tests added/updated: names
Commands run:      exact commands and PASS/FAIL result
Remaining risk:    anything left
```

## FINAL CHECK (after all fixes)

Run and report PASS/FAIL for each:

1. `npm run lint`
2. `npm test` in the project root
3. `npm test` inside `backend/`
4. `npm run build` with `VITE_API_URL` set
5. Start the backend locally with a test `.env` and call: `GET /health`, a public route, an admin route without a token (expect 401), an admin route with a token (expect 200), and a CORS preflight from an allowed and a disallowed origin.
6. `git grep` for leftovers: `onrender.com`, `vercel.app`, `VITE_CLOUDINARY_API_SECRET`, `mongodb+srv://`, `fs.writeFileSync`.

Then give me:
- A table: Fix ID | Status | Files changed.
- A list of manual steps I must do myself (rotate credentials, set env vars in the DigitalOcean dashboard, Atlas network access, git history cleanup).
- The updated score for each audit category, using `score = (PASS + 0.5 x PARTIAL) / (PASS + PARTIAL + FAIL) x 100`.

Begin with F0-1. Do not start F0-2 until you have reported on F0-1.
