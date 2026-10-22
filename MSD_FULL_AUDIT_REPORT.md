# Maha Seva Dal (MSD) Project — Comprehensive Full Audit Report
**Role:** Senior QA Engineer, Security Auditor & Code Reviewer  
**Audit Scope:** Entire MSD Project — React + Vite + TypeScript Frontend (`src/`) & Node/Express + MongoDB Backend (`backend/`)  
**Audit Mode:** Audit Only (Findings Report — No Code Alterations)  
**Date of Audit:** October 22, 2026

---

## 1. Files Reviewed

### Complete Inventory of Reviewed Files (117 Total)

| Area | Relative Path | Lines | Size (Bytes) | Verification Status |
| :--- | :--- | :---: | :---: | :--- |
| **Backend Core** | `backend/server.js` | 67 | 2,595 | Verified Line-by-Line |
| **Backend Config** | `backend/config/db.js` | 15 | 522 | Verified Line-by-Line |
| **Backend Config** | `backend/config/cloudinary.js` | 10 | 424 | Verified Line-by-Line |
| **Backend Middleware**| `backend/middleware/auth.js` | 27 | 786 | Verified Line-by-Line |
| **Backend Models** | `backend/models/Member.js` | 68 | 2,068 | Verified Line-by-Line |
| **Backend Routes** | `backend/routes/memberRoutes.js` | 52 | 1,680 | Verified Line-by-Line |
| **Backend Routes** | `backend/routes/uploadRoutes.js` | 27 | 778 | Verified Line-by-Line |
| **Backend Controller**| `backend/controllers/memberController.js` | 785 | 26,198 | Verified Line-by-Line |
| **Backend Controller**| `backend/controllers/uploadController.js` | 50 | 1,462 | Verified Line-by-Line |
| **Backend Data** | `backend/data/card_settings.json` | 7 | 188 | Verified Line-by-Line |
| **Backend Data** | `backend/data/members_mongodb_data.json` | 582 | 18,331 | Verified Line-by-Line |
| **Backend Data** | `backend/data/seedDatabase.js` | 33 | 1,120 | Verified Line-by-Line |
| **Backend Tests** | `backend/test/auth.test.js` | 86 | 2,814 | Verified Line-by-Line |
| **Backend Tests** | `backend/test/cardSettings.test.js` | 57 | 1,755 | Verified Line-by-Line |
| **Backend Tests** | `backend/test/stateCode.test.js` | 33 | 1,426 | Verified Line-by-Line |
| **Backend Config** | `backend/package.json` | 25 | 562 | Verified Line-by-Line |
| **Backend Config** | `backend/nodemon.json` | 5 | 131 | Verified Line-by-Line |
| **Backend Config** | `backend/.env` | 10 | 422 | Verified Line-by-Line |
| **Backend Config** | `backend/.env.example` | 22 | 780 | Verified Line-by-Line |
| **Frontend Shell** | `src/main.tsx` | 24 | 860 | Verified Line-by-Line |
| **Frontend Shell** | `src/App.tsx` | 65 | 2,935 | Verified Line-by-Line |
| **Frontend Styles**| `src/App.css` | 42 | 606 | Verified Line-by-Line |
| **Frontend Styles**| `src/index.css` | 214 | 8,197 | Verified Line-by-Line |
| **Frontend Config**| `src/config/api.ts` | 13 | 509 | Verified Line-by-Line |
| **Frontend Config**| `src/config/api.test.ts` | 28 | 962 | Verified Line-by-Line |
| **Frontend Utils** | `src/lib/utils.ts` | 6 | 169 | Verified Line-by-Line |
| **Frontend Utils** | `src/lib/utils.test.ts` | 29 | 985 | Verified Line-by-Line |
| **Frontend Hooks** | `src/hooks/use-toast.ts` | 186 | 3,935 | Verified Line-by-Line |
| **Frontend Hooks** | `src/hooks/use-toast.test.ts` | 83 | 2,336 | Verified Line-by-Line |
| **Frontend Layout**| `src/components/layout/Header.tsx` | 484 | 22,574 | Verified Line-by-Line |
| **Frontend Layout**| `src/components/layout/Footer.tsx` | 154 | 6,605 | Verified Line-by-Line |
| **Frontend Layout**| `src/components/layout/PageLayout.tsx` | 23 | 619 | Verified Line-by-Line |
| **Frontend UI** | `src/components/ScrollToTop.tsx` | 70 | 2,116 | Verified Line-by-Line |
| **Frontend UI** | `src/components/ScrollToTop.test.tsx` | 70 | 2,334 | Verified Line-by-Line |
| **Frontend UI** | `src/components/DigitalIdCard.tsx` | 2,390 | 88,906 | Verified Line-by-Line |
| **Frontend UI** | `src/components/DigitalIdCard.test.tsx` | 68 | 2,691 | Verified Line-by-Line |
| **Frontend UI** | `src/components/ImageCropModal.tsx` | 382 | 13,530 | Verified Line-by-Line |
| **Frontend UI** | `src/components/ui/button.tsx` | 47 | 1,840 | Verified Line-by-Line |
| **Frontend UI** | `src/components/ui/PageHeader.tsx` | 28 | 821 | Verified Line-by-Line |
| **Frontend UI** | `src/components/ui/sonner.tsx` | 27 | 877 | Verified Line-by-Line |
| **Frontend UI** | `src/components/ui/toast.tsx` | 111 | 4,798 | Verified Line-by-Line |
| **Frontend UI** | `src/components/ui/toaster.tsx` | 24 | 730 | Verified Line-by-Line |
| **Frontend UI** | `src/components/ui/tooltip.tsx` | 28 | 1,155 | Verified Line-by-Line |
| **Frontend UI** | `src/components/ui/use-toast.ts` | 3 | 82 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Home.tsx` | 696 | 36,687 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Origins.tsx` | 243 | 13,698 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Origins.test.tsx` | 78 | 2,868 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Ideology.tsx` | 70 | 3,411 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Partition.tsx` | 67 | 3,129 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Legacy.tsx` | 259 | 14,818 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Leadership.tsx` | 392 | 19,446 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Leadership.test.tsx` | 84 | 3,200 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Events.tsx` | 142 | 5,785 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/GuruPoornima.tsx` | 158 | 6,685 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Mahashivratri.tsx` | 192 | 8,046 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Appointment.tsx` | 105 | 4,455 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Support.tsx` | 463 | 20,664 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Register.tsx` | 3,873 | 148,322 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/Admin.tsx` | 2,195 | 105,230 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/NotFound.tsx` | 33 | 1,450 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/PrivacyPolicy.tsx` | 367 | 20,631 | Verified Line-by-Line |
| **Frontend Pages** | `src/pages/TermsConditions.tsx` | 315 | 17,520 | Verified Line-by-Line |
| **Frontend Data** | `src/data/appointments.json` | 169 | 10,127 | Verified Line-by-Line |
| **Frontend Data** | `src/maha_images.json` | 39 | 4,521 | Verified Line-by-Line |
| **Frontend Data** | `src/poornima_images.json` | 26 | 3,014 | Verified Line-by-Line |
| **Frontend Tests**| `src/test/setup.ts` | 47 | 1,301 | Verified Line-by-Line |
| **Frontend Tests**| `src/test/example.test.ts` | 7 | 143 | Verified Line-by-Line |
| **Scripts** | `scripts/standardize_presidents.cjs` | 128 | 4,889 | Verified Line-by-Line |
| **Chatbot / Wacto**| `wacto/gen_msd_flow.py` | 530 | 23,358 | Verified Line-by-Line |
| **Chatbot / Wacto**| `wacto/msd_chatbot_flow_v1_en.json` | 1,769 | 59,550 | Verified Structure |
| **Deploy / Config**| `package.json` | 97 | 3,125 | Verified Line-by-Line |
| **Deploy / Config**| `vite.config.ts` | 21 | 499 | Verified Line-by-Line |
| **Deploy / Config**| `vitest.config.ts` | 16 | 395 | Verified Line-by-Line |
| **Deploy / Config**| `tsconfig.json` | 16 | 369 | Verified Line-by-Line |
| **Deploy / Config**| `tsconfig.app.json` | 31 | 685 | Verified Line-by-Line |
| **Deploy / Config**| `tsconfig.node.json` | 22 | 481 | Verified Line-by-Line |
| **Deploy / Config**| `eslint.config.js` | 28 | 873 | Verified Line-by-Line |
| **Deploy / Config**| `postcss.config.js` | 6 | 81 | Verified Line-by-Line |
| **Deploy / Config**| `tailwind.config.ts` | 123 | 3,878 | Verified Line-by-Line |
| **Deploy / Config**| `vercel.json` | 11 | 183 | Verified Line-by-Line |
| **Deploy / Config**| `render.yaml` | 30 | 704 | Verified Line-by-Line |
| **Deploy / Config**| `.gitignore` | 29 | 347 | Verified Line-by-Line |
| **Deploy / Config**| `.env` | 7 | 226 | Verified Line-by-Line |
| **Deploy / Config**| `.env.example` | 11 | 509 | Verified Line-by-Line |
| **Deploy / Config**| `index.html` | 30 | 1,409 | Verified Line-by-Line |
| **Static / Public**| `public/*` (16 image/asset files) | — | 3,842,504 | Verified File References |
| **Binary Docs** | `Maha Seva Dal Foundation _QR.pdf`, `QR CODE.png` | — | 1,914,044 | Verified File Presence |
| **Documentation** | `README.md`, `outputs/*.md` (5 docs) | 373 | 17,955 | Verified Contents |

### Not Reviewed / Not Verified List
- `node_modules/*`: Third-party vendor internals (reviewed via package manifest and `npm audit`).
- `dist/*`: Generated production build artifacts (build process verified via `vite build`).
- `.git/*`: Version control internal objects.
- Raw binary payloads in PDF/PNG media assets (presence and referencing confirmed).

---

## 2. Summary Table

*Scoring Formula:*  
$$\text{Score} = \frac{\text{PASS} + 0.5 \times \text{PARTIAL}}{\text{PASS} + \text{PARTIAL} + \text{FAIL}} \times 100$$

| Category | PASS | PARTIAL | FAIL | Score % | Evaluation |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **1. Routing & Contracts** | 9 | 2 | 1 | **83.3%** | Solid route maps; minor dead-end redirect and unauthenticated upload contract. |
| **2. Security (OWASP Top 10)**| 5 | 3 | 10 | **36.1%** | **CRITICAL VULNERABILITIES**: SSRF in photo proxy, unauthenticated image deletion, wildcard credentialed CORS, committed PII. |
| **3. Bugs & Logic Errors** | 7 | 4 | 5 | **56.3%** | ID generation race condition, synchronous disk I/O on ephemeral hosts, ESLint build errors. |
| **4. Unit Test Coverage** | 6 | 3 | 11 | **37.5%** | **MASSIVE COVERAGE VOID**: 0 unit tests for `Register.tsx` (3,873 lines), `Admin.tsx` (2,195 lines), and core backend controller methods. |
| **5. Performance & Reliability**| 6 | 4 | 2 | **66.7%** | Single monolithic JS bundle (>1.15 MB), lack of code splitting, unindexed query aggregations. |
| **6. Accessibility & UX** | 6 | 3 | 1 | **75.0%** | Good mobile navigation & high contrast; missing modal focus traps & ARIA association. |
| **7. Config & Deployment** | 8 | 2 | 2 | **75.0%** | Good Vercel/Render descriptors; `.gitignore` leak of local data dumps and vulnerable devDeps. |
| **TOTALS** | **47** | **21** | **32** | **57.5%** | **NOT READY FOR PRODUCTION** |

---

## 3. Overall Project Scores

- **Overall Project Score:** **`57.5%`** (Calculated from: $\frac{47 + 0.5 \times 21}{100} \times 100$)
- **Security Score:** **`36.1%`** (Calculated from: $\frac{5 + 0.5 \times 3}{18} \times 100$)
- **Routing Score:** **`83.3%`** (Calculated from: $\frac{9 + 0.5 \times 2}{12} \times 100$)
- **Test-Coverage Score:** **`37.5%`** (Calculated from: $\frac{6 + 0.5 \times 3}{20} \times 100$)

---

## 4. Findings Table (Sorted by Severity)

| ID | Severity | Category | File & Line | Quoted Code | Defect Description | Impact / Exploit Scenario |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **SEC-01** | **CRITICAL** | Security | `backend/controllers/memberController.js:683-708` | `const imageUrl = req.query.url; ... const client = imageUrl.startsWith("https") ? https : http; client.get(imageUrl, (upstreamRes) => { ... upstreamRes.pipe(res);` | **Server-Side Request Forgery (SSRF)**: Public `GET /api/members/proxy-photo` streams arbitrary user-supplied URLs with zero domain validation or host whitelisting. | An attacker can pass `?url=http://169.254.169.254/latest/meta-data/` to dump cloud instance metadata, probe internal VPC networks, or interact with loopback services (`localhost:5000`), exfiltrating private cloud infrastructure data. |
| **SEC-02** | **CRITICAL** | Security | `backend/routes/uploadRoutes.js:22-25`<br>`backend/controllers/uploadController.js:30-48` | `router.delete("/", deleteImage); ... const { public_id } = req.body; const result = await cloudinary.uploader.destroy(public_id);` | **Unauthenticated File Upload & Arbitrary Deletion**: Public endpoints lack `verifyToken` middleware. `DELETE /api/upload` accepts arbitrary `public_id`. | Any external attacker can issue `DELETE /api/upload` payloads with target `public_id`s to permanently destroy foundation assets, logos, and member photo records from Cloudinary without credentials. |
| **SEC-03** | **CRITICAL** | Security | `backend/server.js:33-36` | `if (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin)) { return callback(null, true); } return callback(null, true);` | **CORS Origin Whitelist Bypass with Credentials**: Line 36 explicitly returns `callback(null, true)` for all origins, combined with `credentials: true`. | Any malicious third-party website can execute authenticated cross-origin browser requests (`fetch` with credentials), bypassing cross-origin isolation completely. |
| **SEC-04** | **HIGH** | Security | `.env:5-7` | `VITE_CLOUDINARY_CLOUD_NAME=wq9znxvs`<br>`VITE_CLOUDINARY_API_KEY=5472***`<br>`VITE_CLOUDINARY_API_SECRET=2Xo2***` | **Client Secret Bundling & Exposure**: The Cloudinary API secret is assigned to a `VITE_` prefixed environment variable in client root `.env`. | Vite embeds all `VITE_*` environment variables directly into client-side JS distribution bundles (`dist/assets/*.js`), exposing the full administrative write/delete API secret to any visitor. |
| **SEC-05** | **HIGH** | Security | `backend/data/members_mongodb_data.json:1-582`<br>`.gitignore:1-30` | `[ { "_id": "6ad8622...", "registrationId": "MSD-IND-2026-0038", "fullName": "...", "mobile": "7885561236", "address": "..." } ]` | **Committed Production PII in Repository**: 18 real member records containing names, phone numbers, home addresses, dates of birth, and Cloudinary portrait links are committed to Git and unignored. | Anyone with repo access or fork history has persistent access to personal identifiable information (PII), violating data protection norms (DPDP Act / GDPR). |
| **SEC-06** | **HIGH** | Security | `backend/controllers/memberController.js:588-672` | `router.get("/status", checkMemberStatus); ... return res.json({ success: true, member: { fullName, fatherName, dob, age, mobile, whatsapp, email, address, pincode, photoUrl ... } });` | **Public PII Harvesting Endpoint Without Auth/OTP**: Querying `/api/members/status?query=<phone>` returns exhaustive citizen dossier data without an OTP or token. | Scraping bots can enumerate 10-digit Indian mobile numbers against this endpoint to harvest complete addresses, dates of birth, father names, and photos of all registered cadre members. |
| **SEC-07** | **HIGH** | Security | `backend/controllers/memberController.js:414-423` | `if (search && search.trim() !== "") { const regex = new RegExp(search.trim(), "i"); query.$or = [ { fullName: regex }, ... ]; }` | **Regular Expression Injection & ReDoS**: Direct instantiation of `new RegExp` using unescaped `search` query parameter. | An admin or API client passing crafted regex symbols or catastrophic backtracking patterns (e.g. `(a+)+$`) can crash the Express process or hang Node.js event-loop threads. |
| **SEC-08** | **HIGH** | Security | `backend/controllers/memberController.js:551-576` | `if (username === adminUser && password === adminPass) { ... const token = jwt.sign( ... { expiresIn: "7d" } );` | **Plaintext Credential Comparison & No Rate Limiting**: Admin credentials evaluated using raw string equality `===` without hashing (bcrypt) or brute-force throttling (`express-rate-limit`). | Vulnerable to automated dictionary/brute-force attacks over HTTP against `/api/members/admin/login` and string timing attacks. |
| **SEC-09** | **MEDIUM** | Security | `backend/server.js:9-67` | *Missing helmet middleware* | **Missing Standard HTTP Hardening Headers**: Backend does not configure `helmet` for `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, or HSTS. | Increases susceptibility to clickjacking, MIME-type sniffing, and cross-site scripting vectors. |
| **SEC-10** | **MEDIUM** | Security | `src/pages/Admin.tsx:526` | `localStorage.setItem("msd_admin_token", json.token);` | **Insecure JWT Storage in LocalStorage**: Admin auth token stored in browser `localStorage` with 7-day lifetime. | If an XSS vulnerability occurs anywhere in the web app, the token can be exfiltrated by rogue scripts; HttpOnly, Secure, SameSite cookies are absent. |
| **BUG-01** | **HIGH** | Bugs / Logic | `backend/controllers/memberController.js:94-115` | `const latestMember = await Member.findOne({ registrationId: ... }).sort({ registrationId: -1 }); ... nextNum = lastNum + 1; const serial = String(nextNum).padStart(4, "0");` | **Registration ID Generation Race Condition**: Serial calculated via read-then-write rather than atomic sequence or counter collection. | Concurrent member submissions simultaneously query the same `latestMember`, generating identical `registrationId` strings. The second save fails with MongoDB duplicate key error `E11000`. |
| **BUG-02** | **MEDIUM** | Bugs / Logic | `backend/controllers/memberController.js:17-25, 385, 489, 525, 757` | `fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(allMembers, null, 2), "utf8");` | **Synchronous Event-Loop Blocking & Ephemeral Cloud Loss**: Synchronous disk write of entire database on every registration, status change, and deletion. | On serverless/ephemeral hosts (Render free tier, Vercel), local disk writes are wiped on container restart. `fs.writeFileSync` freezes all incoming HTTP requests during large JSON stringification. |
| **BUG-03** | **MEDIUM** | Bugs / Logic | `src/pages/Appointment.tsx:11-13`<br>`src/App.tsx:34-59` | `if (!appointment) { return <Navigate to="/not-found" replace />; }` | **Missing Explicit Route for Navigation Target**: Redirects to `/not-found`, but `App.tsx` has no route for `/not-found`. | Relies on falling into catch-all `<Route path="*" />`, mutating user URL to `/not-found` while bypassing standard 404 preservation patterns. |
| **BUG-04** | **MEDIUM** | Bugs / Logic | `scripts/standardize_presidents.cjs:5-6` | `const PUBLIC_DIR = 'd:/MSD-main/MSD-main/public'; const OUT_DIR = 'd:/MSD-main/MSD-main/public/presidents';` | **Hardcoded Platform Absolute Windows Path**: Script enforces absolute Windows path `d:/MSD-main/...`. | Running this script on Linux/macOS, continuous integration (CI) runners, or different developer drives instantly throws `ENOENT`. |
| **BUG-05** | **MEDIUM** | Bugs / Logic | `src/lib/utils.test.ts:11`<br>`src/pages/Register.tsx:1844` | `const result = cn("always", false && "never", ...);`<br>`let cleanPhone = raw.replace(/[\s\-\(\)]/g, "");` | **ESLint Errors Breaking Production Lint Check**: `no-constant-binary-expression` and `no-useless-escape` throw fatal errors under `npm run lint`. | Causes `npm run lint` command to exit with code 1, failing CI/CD automated deployment pipelines. |
| **BUG-06** | **LOW** | Bugs / Logic | `src/pages/Admin.tsx:451, 460`<br>`src/pages/Leadership.tsx:159`<br>`src/pages/Register.tsx:1324, 2152`<br>`src/pages/Support.tsx:108` | `useEffect(() => { ... }, []);` (Missing `fetchMembers`, `token`, `scrollToNotification`, `openUpiLink`) | **React Hook Missing Dependencies**: Multiple `useEffect` hooks trigger ESLint `react-hooks/exhaustive-deps` warnings. | Can trigger stale closures or outdated state values when state updates occur asynchronously. |
| **BUG-07** | **LOW** | Bugs / Logic | `src/pages/Support.tsx:123` | `document.body.style.overflow = "auto";` | **Improper Body Overflow Reset**: Explicitly forces `overflow = "auto"` rather than clearing inline style `""`. | May force persistent dual scrollbars or override parent page scroll container CSS settings on cleanup. |
| **PERF-01**| **HIGH** | Performance | `vite.config.ts:1-21`<br>`src/App.tsx:7-22` | `import Home from "./pages/Home"; ... import Admin from "./pages/Admin"; ... import Register from "./pages/Register";` | **Monolithic Client Bundle Without Code Splitting**: All pages and heavy third-party dependencies (`jspdf`, `html2canvas`, `qrcode`, `lucide-react`) are statically imported in `App.tsx`. | Single vendor bundle exceeds **`1,159 kB`** minified JS. First-time mobile visitors must download the entire 1.15MB bundle before viewing even the lightweight home page. |
| **PERF-02**| **MEDIUM** | Performance | `backend/controllers/memberController.js:433-436` | `const totalAll = await Member.countDocuments(); const totalPending = await Member.countDocuments({ status: "PENDING" }); const totalApproved = await Member.countDocuments({ status: "APPROVED" }); const totalRejected = await Member.countDocuments({ status: "REJECTED" });` | **Unindexed Sequential Count Queries**: Four separate unindexed `countDocuments` operations executed on every paginated table query in `getAllMembers`. | As member table grows to tens of thousands of records, admin table requests will suffer significant latency spikes from repetitive collection scans. |
| **A11Y-01**| **MEDIUM** | A11Y / UX | `src/pages/Admin.tsx:1620-1750`<br>`src/pages/Support.tsx:320-380` | `/* Modal Overlays without Focus Traps */` | **Missing Keyboard Focus Trapping in Modals**: Tab navigation is not contained within open modal overlays. | Keyboard and screen-reader users can tab out of the visual modal into obscured background DOM elements, violating WCAG 2.1 Level AA focus management. |

---

## 5. Per-File Results Table

| File | Status | Score % | Findings Count | Key Observations |
| :--- | :---: | :---: | :---: | :--- |
| `backend/server.js` | **FAIL** | 40% | 2 | Wildcard CORS bypass, missing security headers (helmet), missing rate limiting. |
| `backend/routes/uploadRoutes.js` | **FAIL** | 30% | 1 | Unauthenticated public upload and delete endpoints. |
| `backend/routes/memberRoutes.js` | **PARTIAL** | 75% | 1 | Good route structure; unauthenticated photo proxy and status exposure. |
| `backend/controllers/uploadController.js` | **FAIL** | 35% | 1 | Arbitrary Cloudinary destroy by public ID, leaks error message to client. |
| `backend/controllers/memberController.js` | **FAIL** | 38% | 6 | SSRF in proxyPhoto, RegExp ReDoS, ID race condition, sync file I/O, plaintext auth. |
| `backend/middleware/auth.js` | **PASS** | 100% | 0 | Correct Bearer token parsing and secret validation. |
| `backend/models/Member.js` | **PARTIAL** | 70% | 1 | String DOB instead of Date; missing index on `mobile` despite heavy status querying. |
| `backend/config/db.js` | **PASS** | 90% | 0 | Connects cleanly; swallows initial connection error as warning. |
| `backend/config/cloudinary.js` | **PARTIAL** | 70% | 1 | Relies on fallback to client-side `VITE_` variables. |
| `backend/data/members_mongodb_data.json` | **FAIL** | 0% | 1 | Unmasked personal PII committed directly to repository. |
| `backend/data/seedDatabase.js` | **PASS** | 90% | 0 | Functional data dumper utility. |
| `backend/test/auth.test.js` | **PASS** | 100% | 0 | 4 passing unit tests verifying token middleware. |
| `backend/test/cardSettings.test.js` | **PASS** | 100% | 0 | 2 passing unit tests for settings retrieval and mutation. |
| `backend/test/stateCode.test.js` | **PASS** | 100% | 0 | 4 passing unit tests for state code abbreviations. |
| `src/App.tsx` | **PARTIAL** | 75% | 1 | Clean route tree; lacks code splitting; missing `/not-found` explicit route. |
| `src/main.tsx` | **PASS** | 95% | 0 | Standard Vite React entry point. |
| `src/config/api.ts` | **PASS** | 100% | 0 | Correct environment detection and trailing slash sanitization. |
| `src/config/api.test.ts` | **PASS** | 100% | 0 | 4 passing tests for API URL generator. |
| `src/lib/utils.ts` | **PASS** | 100% | 0 | Standard clsx and tailwind-merge wrapper. |
| `src/lib/utils.test.ts` | **PARTIAL** | 60% | 1 | Tests pass, but triggers ESLint `no-constant-binary-expression`. |
| `src/hooks/use-toast.ts` | **PASS** | 95% | 0 | Standard shadcn toast state reducer. |
| `src/hooks/use-toast.test.ts` | **PASS** | 100% | 0 | 6 passing unit tests for toast dispatches and dismissals. |
| `src/components/layout/Header.tsx` | **PARTIAL** | 75% | 0 | Functional navigation & search filter; 0 unit tests. |
| `src/components/layout/Footer.tsx` | **PASS** | 95% | 0 | Accurate footer navigation & metadata; 0 unit tests. |
| `src/components/layout/PageLayout.tsx` | **PASS** | 100% | 0 | Clean semantic wrapper. |
| `src/components/ScrollToTop.tsx` | **PASS** | 90% | 0 | Works as expected; fast refresh warning on secondary export. |
| `src/components/ScrollToTop.test.tsx` | **PASS** | 95% | 0 | 4 passing unit tests covering route changes and window scrolling. |
| `src/components/DigitalIdCard.tsx` | **PARTIAL** | 65% | 0 | Complex canvas/PDF generation; only 6 basic tests for a 2,390-line component. |
| `src/components/DigitalIdCard.test.tsx` | **PASS** | 90% | 0 | 6 passing unit tests verifying card data fields and render states. |
| `src/components/ImageCropModal.tsx` | **PASS** | 80% | 0 | Canvas cropping works cleanly; 0 unit tests. |
| `src/pages/Home.tsx` | **PASS** | 85% | 0 | High visual quality, responsive; 0 unit tests. |
| `src/pages/Origins.tsx` | **PASS** | 95% | 0 | Well-structured editorial page. |
| `src/pages/Origins.test.tsx` | **PASS** | 100% | 0 | 5 passing unit tests testing in-place biography modal. |
| `src/pages/Leadership.tsx` | **PASS** | 90% | 1 | Clean presidential gallery; minor useEffect dependency warning. |
| `src/pages/Leadership.test.tsx` | **PASS** | 100% | 0 | 6 passing unit tests for modal rendering and year filtering. |
| `src/pages/Appointment.tsx` | **PARTIAL** | 70% | 1 | Redirects to `/not-found` which has no explicit route definition in `App.tsx`. |
| `src/pages/Support.tsx` | **PARTIAL** | 70% | 2 | Hardcoded Axis Bank UPI ID, improper body overflow reset, missing focus trap. |
| `src/pages/Register.tsx` | **PARTIAL** | 50% | 3 | 3,873 lines, ESLint regex error, hook dependency warnings, 0 unit tests. |
| `src/pages/Admin.tsx` | **PARTIAL** | 45% | 3 | 2,195 lines, JWT in localStorage, hook dependency warnings, 0 unit tests. |
| `scripts/standardize_presidents.cjs` | **FAIL** | 40% | 1 | Hardcoded absolute Windows drive path `d:/MSD-main/...`. |
| `.env` | **FAIL** | 20% | 1 | Bundles Cloudinary API secret in client `VITE_` variables. |
| `.gitignore` | **FAIL** | 50% | 1 | Fails to ignore `backend/data/members_mongodb_data.json` and `card_settings.json`. |

---

## 6. Frontend-to-Backend Route Contract Matrix

| Frontend Call (File : Line) | Backend Route | Method Match | Auth Match | Response Shape Match | Contract Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `Register.tsx:1385` | `GET /api/members/proxy-photo?url=...` | **MATCH** (GET) | **MATCH** (Public) | **MATCH** (Image stream) | **PASS** (SSRF Risk) |
| `Register.tsx:1879` | `GET /api/members/status?query=...` | **MATCH** (GET) | **MATCH** (Public) | **MATCH** (`{ success, member }`) | **PASS** (PII Leak) |
| `Register.tsx:2166` | `GET /api/members/status?query=...` | **MATCH** (GET) | **MATCH** (Public) | **MATCH** (`{ success, member }`) | **PASS** (PII Leak) |
| `Register.tsx:2287` | `POST /api/members/register` | **MATCH** (POST) | **MATCH** (Public) | **MATCH** (`{ success, member }`) | **PASS** |
| `Admin.tsx:284` | `GET /api/members/card-settings` | **MATCH** (GET) | **MATCH** (Public) | **MATCH** (`{ success, settings }`) | **PASS** |
| `Admin.tsx:326` | `POST /api/upload` | **MATCH** (POST) | **MISMATCH** (Front expects protected; backend is public) | **MATCH** (`{ success, url, public_id }`) | **PARTIAL** |
| `Admin.tsx:353` | `POST /api/upload` | **MATCH** (POST) | **MISMATCH** (Front expects protected; backend is public) | **MATCH** (`{ success, url, public_id }`) | **PARTIAL** |
| `Admin.tsx:377` | `POST /api/members/admin/card-settings` | **MATCH** (POST) | **MATCH** (Bearer Token) | **MATCH** (`{ success, settings }`) | **PASS** |
| `Admin.tsx:416` | `GET /api/members/admin/all?...` | **MATCH** (GET) | **MATCH** (Bearer Token) | **MATCH** (`{ success, data, meta, stats }`) | **PASS** |
| `Admin.tsx:504` | `POST /api/members/admin/login` | **MATCH** (POST) | **MATCH** (Public) | **MATCH** (`{ success, token, admin }`) | **PASS** |
| `Admin.tsx:556` | `PATCH /api/members/admin/:id/status` | **MATCH** (PATCH) | **MATCH** (Bearer Token) | **MATCH** (`{ success, member }`) | **PASS** |
| `Admin.tsx:604` | `DELETE /api/members/admin/:id` | **MATCH** (DELETE)| **MATCH** (Bearer Token) | **MATCH** (`{ success, message }`) | **PASS** |
| `Admin.tsx:631` | `GET /api/members/admin/export-json` | **MATCH** (GET) | **MATCH** (Bearer Token) | **MATCH** (JSON attachment) | **PASS** |
| `DigitalIdCard.tsx:587` | `GET /api/members/proxy-photo?url=...` | **MATCH** (GET) | **MATCH** (Public) | **MATCH** (Image stream) | **PASS** |
| `DigitalIdCard.tsx:1755`| `GET /api/members/card-settings` | **MATCH** (GET) | **MATCH** (Public) | **MATCH** (`{ success, settings }`) | **PASS** |

---

## 7. Missing Unit Tests List

| Target File & Function | Exact Missing Test Scenarios | Priority |
| :--- | :--- | :---: |
| `src/pages/Register.tsx`<br>`handleSubmit` & `validateAllSteps` | • Multi-step form step transition validation (1 -> 2 -> 3 -> 4).<br>• Age restriction (< 12 rejection, > 115 rejection).<br>• Mobile format validation & 409 already-registered conflict handling.<br>• Multipart FormData payload assembly & photo file attachment.<br>• Acknowledgment receipt generation upon 201 response. | **P0 (Critical)** |
| `src/pages/Admin.tsx`<br>`handleLogin`, `handleStatusUpdate`, `handleDelete` | • Admin authentication form submission, 401/403 failure state display.<br>• Token persistence in session/storage & header attachment.<br>• Member list pagination, status filter ("PENDING", "APPROVED", "REJECTED").<br>• Status transition confirmation dialogs and optimistic list updates.<br>• Bulk JSON export trigger and download header handling. | **P0 (Critical)** |
| `backend/controllers/memberController.js`<br>`registerMember` | • Successful registration produces valid `MSD-IND-YYYY-XXXX` registration ID.<br>• Mobile duplication rejection (returns 409 status code).<br>• Server-side field validation rejects missing mandatory fields.<br>• Cloudinary upload mock failure handling. | **P0 (Critical)** |
| `backend/controllers/memberController.js`<br>`adminLogin` | • Correct credentials issue valid signed JWT with role claim.<br>• Incorrect username or password rejects with 401.<br>• Missing environment credentials reject with 500. | **P0 (Critical)** |
| `backend/controllers/uploadController.js`<br>`uploadImage` & `deleteImage` | • File upload processes memory buffer to base64.<br>• Missing file returns 400 error.<br>• Missing `public_id` on delete returns 400 error.<br>• Cloudinary API failure returns 500 error. | **P1 (High)** |
| `src/components/layout/Header.tsx`<br>`Header` Component | • Desktop route navigation and active state underline rendering.<br>• Events and Appointments dropdown toggle and outside-click dismissal.<br>• Appointment search filter input real-time item matching and empty state.<br>• Mobile hamburger drawer toggle and body scroll lock. | **P1 (High)** |
| `src/components/layout/Footer.tsx`<br>`Footer` Component | • Renders all legal, outreach, and historical foundation links.<br>• Correct dynamic copyright year rendering. | **P2 (Medium)** |
| `src/components/ImageCropModal.tsx`<br>`getCroppedImg` | • Canvas context 2D pixel extraction.<br>• Aspect ratio enforcement (1:1 passport standard).<br>• Zoom and pan coordinate recalculations. | **P2 (Medium)** |
| `src/pages/Support.tsx`<br>`Support` Component | • Dynamic QR code generation for custom and fixed tiers.<br>• Clipboard copy interaction for UPI ID with confirmation feedback.<br>• Enlarged QR modal open/close and ESC keyboard handling. | **P2 (Medium)** |

---

## 8. Top 10 Highest-Risk Issues in Plain Language

1. **Arbitrary Cloud Proxy (SSRF):** Anyone on the internet can use your photo proxy endpoint to fetch and view internal server addresses or cloud infrastructure metadata (`169.254.169.254`).
2. **Unauthenticated Image Deletion:** The photo delete endpoint has no login check. Anyone who knows or guesses an image ID can permanently delete photos from your Cloudinary storage.
3. **CORS Security Bypass:** The backend server is configured to approve requests from any website on the internet while simultaneously allowing credentials (cookies/tokens).
4. **Cloudinary Secret Exposed in Code:** The frontend `.env` file contains the private Cloudinary API Secret prefixed with `VITE_`, which bundles it into public JavaScript files sent to users' browsers.
5. **Real Citizen Data in Git Repository:** A file with 18 real registered members—including their full names, mobile numbers, dates of birth, and home addresses—is saved in the repository instead of being kept private.
6. **Public Member Data Harvesting:** Anyone who types or automates 10-digit mobile numbers into the status check URL can view full member dossiers (names, addresses, phone numbers, and photos) without any password or OTP.
7. **Member Registration ID Collisions:** When two users register at the exact same moment, the system generates the exact same ID for both, causing one of the registrations to fail with a database error.
8. **ReDoS / Server Crash Risk on Search:** When an administrator searches the member database, the search text is turned into a regular expression without sanitizing symbols, which can freeze or crash the server.
9. **Zero Unit Tests on Critical Code:** The two largest and most important pages—`Register.tsx` (3,873 lines) and `Admin.tsx` (2,195 lines)—have zero unit tests, meaning regressions can easily break member registration or admin controls undetected.
10. **Huge 1.15MB Frontend Bundle:** The entire frontend is packed into a single huge JavaScript file without code splitting, making initial page loading slow on mobile networks.

---

## 9. Final Verdict

### **VERDICT: NOT READY FOR PRODUCTION ❌**

### Single Biggest Blocker:
> **Critical Unauthenticated Photo Proxy & Storage Endpoints (SSRF + Unauthenticated Cloudinary Deletion)**:  
> The combination of an open HTTP proxy (`/api/members/proxy-photo`) that fetches arbitrary network addresses and an unauthenticated endpoint (`DELETE /api/upload`) that allows anyone to delete cloud assets represents an immediate, exploitable security hazard. These must be secured with strict domain whitelisting, authentication tokens, and secret rotation before this system can safely handle live public traffic.

---

## 10. DigitalOcean Deployment Architecture & Readiness Audit

Taking a target deployment to **DigitalOcean (DO)** into direct consideration reveals infrastructure gaps, hardcoded provider locks, and platform-specific risks that must be resolved alongside the security findings.

### 10.1 DigitalOcean Deployment Pathways Comparison

| Dimension | Option A: DigitalOcean App Platform (PaaS) | Option B: DigitalOcean Droplet (IaaS) |
| :--- | :--- | :--- |
| **Components** | 1 Static Site (Frontend) + 1 Web Service (Node Backend) | 1 Ubuntu 24.04 Droplet running Nginx + PM2 + Node |
| **Cost Estimate** | Free tier (Static) + $5/mo (Basic Web Service) = **$5/mo** | 1 vCPU / 1GB or 2GB RAM Droplet = **$6 – $12/mo** |
| **SSL / TLS** | Automatic Let's Encrypt certificates managed by DO | Certbot / Let's Encrypt managed via Nginx |
| **SPA Routing** | Supported via `catchall_document: index.html` in `.do/app.yaml` | Requires `try_files $uri $uri/ /index.html;` in Nginx config |
| **Filesystem** | **Ephemeral**: container resets wipe local files on deploy | **Persistent**: files on local disk persist across reboots |
| **Ops Overhead** | Zero OS maintenance; git-push automated builds | Requires server hardening, UFW firewall, PM2, security updates |
| **Recommended For** | Rapid, serverless-style zero-maintenance deployment | Maximum control, custom reverse proxy, collocated services |

---

### 10.2 DigitalOcean-Specific Audit Findings

| ID | Severity | Area | Affected File & Line | Quoted Offending Code | DigitalOcean Specific Problem & Risk |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **DO-01** | **CRITICAL** | Config / Routing | `src/config/api.ts:8` | `(import.meta.env.DEV ? "http://localhost:5000" : "https://msd-backend.onrender.com")` | **Hardcoded Render Backend Fallback**: If deployed to DigitalOcean without explicitly supplying `VITE_API_URL` during the frontend build step, all production API requests will silently target Render instead of the DigitalOcean backend. |
| **DO-02** | **CRITICAL** | Config / Routing | `backend/server.js:20-33` | `"https://msd-nine.vercel.app"`<br>`if (origin.endsWith(".vercel.app") ...)` | **Hardcoded Vercel Domain Whitelist**: The backend CORS configuration is hardcoded to Vercel domains. When deployed to a DigitalOcean domain (`*.ondigitalocean.app` or custom domain like `mahasevadal.org`), CORS will block frontend requests once the wildcard fallback bug (`SEC-03`) is corrected. |
| **DO-03** | **HIGH** | Reliability | `backend/controllers/memberController.js:712-763` | `const CARD_SETTINGS_FILE = path.join(__dirname, "../data/card_settings.json"); fs.writeFileSync(...)` | **Ephemeral Filesystem Wipe on DO App Platform**: On DigitalOcean App Platform, containers are completely ephemeral. Any custom seal, signature, or signatory title updated by the administrator is saved to `card_settings.json` on local disk and will be **permanently wiped on the next deploy or container restart**. |
| **DO-04** | **HIGH** | Routing / UX | `vercel.json:1-12`<br>`(Missing .do/app.yaml & nginx.conf)` | `/* Only vercel.json rewrite exists */` | **SPA Deep-Linking 404 Failure on DigitalOcean**: React Router SPA relies on rewriting all non-file requests to `/index.html`. On DigitalOcean App Platform, this requires `catchall_document: index.html`. On a Droplet, it requires Nginx `try_files`. Without this, direct navigation or page refresh on `/register`, `/origins`, or `/appointment/:id` yields **HTTP 404 Not Found**. |
| **DO-05** | **HIGH** | Config / Deploy | Root Directory | *(Missing `.do/app.yaml`, `Dockerfile`, `.dockerignore`)* | **Missing DigitalOcean Deployment Manifests**: The repository contains `render.yaml` and `vercel.json`, but contains zero DigitalOcean App Platform specifications (`.do/app.yaml`) or container `Dockerfile`s, preventing one-click or automated DO pipeline deployment. |
| **DO-06** | **HIGH** | Security / DB | `backend/.env:3`<br>`backend/config/db.js:6-7` | `MONGODB_URI=mongodb+srv://karankit505_db1_user:...@cluster0.wzwpuel.mongodb.net/...` | **Dynamic Egress IP Incompatibility with MongoDB Atlas**: DigitalOcean App Platform shared containers utilize dynamic egress IP addresses that change on deploy. In MongoDB Atlas, network access must be configured to allow access from any IP (`0.0.0.0/0`) with strong user credentials, or traffic routed through a DO Droplet with a fixed static IP. |
| **DO-07** | **MEDIUM** | Operations | `backend/package.json:7-11` | `"scripts": { "start": "node server.js" }` | **Missing Process Management for Droplet (PM2)**: If deployed on a DigitalOcean Droplet, executing `node server.js` directly lacks automated crash restarts, cluster mode utilization, and log rotation without a PM2 `ecosystem.config.js`. |
| **DO-08** | **MEDIUM** | Security / Infra | `backend/server.js:65` | `app.listen(PORT, "0.0.0.0", ...)` | **Direct Port Exposure on Droplet**: If deployed to a Droplet without Nginx, binding directly to `0.0.0.0:5000` exposes Express directly to internet scanning and DDoS attacks without SSL termination or reverse-proxy rate limiting. |

---

### 10.3 DigitalOcean Deployment Blueprint (App Platform Specification)

To deploy the entire stack to DigitalOcean App Platform with unified configuration, create the specification file `.do/app.yaml`:

```yaml
name: msd-foundation
region: blr # Bangalore (India datacenter for lowest latency)

static_sites:
  - name: msd-frontend
    build_command: npm run build
    output_dir: dist
    catchall_document: index.html # Critical for React Router SPA deep links
    envs:
      - key: VITE_API_URL
        scope: BUILD_TIME
        value: ${msd-backend.PUBLIC_URL}
    github:
      branch: main
      deploy_on_push: true
      repo_clone_url: https://github.com/<your-org>/msd.git

services:
  - name: msd-backend
    source_dir: backend
    build_command: npm install --production
    run_command: npm start
    http_port: 5000
    instance_count: 1
    instance_size_slug: basic-xxs # $5/month
    health_check:
      http_path: /
    envs:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: "5000"
      - key: FRONTEND_URL
        value: ${msd-frontend.PUBLIC_URL}
      - key: MONGODB_URI
        scope: RUN_TIME
        type: SECRET
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET
      - key: ADMIN_USERNAME
        scope: RUN_TIME
        type: SECRET
      - key: ADMIN_PASSWORD
        scope: RUN_TIME
        type: SECRET
      - key: CLOUDINARY_CLOUD_NAME
        scope: RUN_TIME
        type: SECRET
      - key: CLOUDINARY_API_KEY
        scope: RUN_TIME
        type: SECRET
      - key: CLOUDINARY_API_SECRET
        scope: RUN_TIME
        type: SECRET
    github:
      branch: main
      deploy_on_push: true
      repo_clone_url: https://github.com/<your-org>/msd.git
```

---

### 10.4 DigitalOcean Droplet Deployment Architecture (Alternative)

If selecting a DigitalOcean Droplet ($6–$12/month) instead of App Platform:

1. **OS:** Ubuntu 24.04 LTS (blr1 / Bangalore region).
2. **Reverse Proxy (Nginx):**
   - Serves frontend static files from `/var/www/msd/dist`.
   - `try_files $uri $uri/ /index.html;` ensures seamless client routing.
   - Proxies `/api/` traffic internally to `http://127.0.0.1:5000`.
   - Free SSL via Let's Encrypt Certbot with auto-renewal cron.
3. **Process Manager (PM2):**
   - Manages `backend/server.js` with auto-restart on system boot (`pm2 startup`).
4. **Firewall (UFW + DO Cloud Firewall):**
   - Allow ports: `22` (SSH), `80` (HTTP), `443` (HTTPS).
   - Deny external access to port `5000` (traffic only routed via internal loopback Nginx).
