# Setup 03 — Fork & Clone the Course Repo

Companion to Section 3, Clip 3.

## Step 1 — Fork

Open the course repository on GitHub and click **Fork** (top-right) to create your own copy.
You need your own fork so you can commit and push — which you'll do for the CI pipelines in
Section 15.

## Step 2 — Clone your fork

```bash
git clone git@github.com:<your-username>/vibeandroidtesting.git
cd vibeandroidtesting
```
(or the HTTPS URL if you don't use SSH keys).

## Step 3 — Credentials file

Copy the example env file and add the test login. `.env` files are gitignored — never commit
credentials.

**macOS / Linux:**
```bash
cp snippets/env-setup.sh .env && source .env
```
**Windows (PowerShell):**
```powershell
Copy-Item snippets\env-setup.sh .env
```
Then edit `.env` and set:
```
TEST_EMAIL=demo@techshop.com
TEST_PASSWORD=password123
```

**✅ Check:** you can `cd` into `vibeandroidtesting` and see the `techshop/`, `prompts/`, and
`docs/` folders.

Next: install Maestro (Setup 04).
