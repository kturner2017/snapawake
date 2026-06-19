# Deploying SnapAwake

## Step 1 — Push to GitHub

1. Create a new repo on github.com (call it `snapawake`)
2. In your terminal, from this folder:

```bash
git init
git add .
git commit -m "Initial SnapAwake app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/snapawake.git
git push -u origin main
```

---

## Step 2 — Deploy the Netlify backend

1. Go to netlify.com → Sign up or log in
2. Click **"Add new site" → "Import an existing project"**
3. Connect GitHub and pick the `snapawake` repo
4. Build settings:
   - **Build command:** *(leave blank)*
   - **Publish directory:** `dist`
5. Click **Deploy**

### Add the Anthropic API key

1. In Netlify dashboard → **Site settings → Environment variables**
2. Add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` *(your key from console.anthropic.com)*
3. Re-deploy (Deploys → Trigger deploy)

### Note your URL

After deploy, Netlify gives you a URL like `https://snapawake-abc123.netlify.app`

---

## Step 3 — Point the app at your backend

1. Copy `.env.example` to `.env`
2. Set `EXPO_PUBLIC_VERIFY_URL` to your full Netlify function URL:

```
EXPO_PUBLIC_VERIFY_URL=https://snapawake-abc123.netlify.app/.netlify/functions/verify
```

3. Run the app: `npx expo start`

---

## Local development

Install the Netlify CLI and run functions locally:

```bash
npm install -g netlify-cli
netlify dev
```

This runs the function at `http://localhost:8888/.netlify/functions/verify`.
Set `EXPO_PUBLIC_VERIFY_URL=http://localhost:8888/.netlify/functions/verify` in `.env` while testing.

---

## Getting an Anthropic API key

1. Go to console.anthropic.com
2. Sign up or log in
3. API Keys → Create Key
4. Copy the key and paste it into Netlify environment variables (never put it in the app code)
