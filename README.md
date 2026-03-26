# 🐾 Villanova Pet Registry

A community pet registry app where residents can register their cats and dogs, browse all registered pets, and contact owners anonymously via WhatsApp.

**Privacy-first:** Owner names, addresses, and phone numbers are never shown publicly. The only way to contact an owner is through a WhatsApp button that opens a chat — the owner's number stays hidden until they choose to reply.

---

## 🚀 Go Live in 4 Steps

You need a computer with internet access. Total time: roughly 30–45 minutes if this is your first time.

---

### STEP 1 — Create a free Supabase database (10 min)

Supabase is a free cloud database that stores all the pet registrations and photos.

1. Go to **https://supabase.com** and click **Start your project** (sign up with GitHub or email)
2. Click **New Project**, pick a name like `villanova-pets`, set a database password (save it somewhere), and choose the region closest to you
3. Wait about 2 minutes for the project to finish setting up
4. Once ready, go to **SQL Editor** (left sidebar) and click **New query**
5. Open the file `supabase-setup.sql` from this project, copy the entire contents, paste it into the SQL editor, and click **Run**
6. You should see "Success. No rows returned" — your database and photo storage are ready

Now get your credentials:
1. Go to **Settings** → **API** (left sidebar)
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy the **anon / public** key (the long string under "Project API keys")

---

### STEP 2 — Upload the code to GitHub (5 min)

1. Go to **https://github.com** and sign in (or create a free account)
2. Click the **+** button (top right) → **New repository**
3. Name it `villanova-pet-registry`, keep it Public, and click **Create repository**
4. Upload all the files from this project folder to the repository:
   - Click **uploading an existing file** on the setup page
   - Drag and drop ALL files and folders from this project
   - Click **Commit changes**

**Important:** Do NOT upload the `.env` file — it contains your secret keys. The `.gitignore` file already prevents this.

---

### STEP 3 — Deploy to Vercel for free (10 min)

Vercel hosts your website for free and gives you a public URL.

1. Go to **https://vercel.com** and click **Sign Up** (use your GitHub account)
2. Click **Add New** → **Project**
3. Find your `villanova-pet-registry` repo and click **Import**
4. Before clicking Deploy, add your environment variables:
   - Expand **Environment Variables**
   - Add: `VITE_SUPABASE_URL` = your Supabase Project URL from Step 1
   - Add: `VITE_SUPABASE_ANON_KEY` = your Supabase anon key from Step 1
5. Click **Deploy** and wait about 1–2 minutes
6. You'll get a URL like **`villanova-pet-registry.vercel.app`** — this is your live app!

---

### STEP 4 — Share with your WhatsApp group (2 min)

Send a message like this to your Villanova WhatsApp group:

> 🐾 **Villanova Pet Registry is live!**
>
> Register your cat or dog so our community knows who belongs to who. If you ever spot a pet in distress, you can look them up and contact the owner instantly via WhatsApp.
>
> 👉 **https://villanova-pet-registry.vercel.app**
>
> **Tip:** Tap the link, then tap "Add to Home Screen" on your phone to use it like an app!

---

## 📱 How Users "Install" the App

This is a **PWA (Progressive Web App)** — it works like a native app without needing the App Store.

**iPhone users:**
1. Open the link in Safari
2. Tap the Share button (box with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add** — the app icon appears on their home screen

**Android users:**
1. Open the link in Chrome
2. Tap the three-dot menu (top right)
3. Tap **Add to Home Screen** or **Install App**
4. Tap **Add** — done!

---

## 🔒 Privacy Design

The app is built with privacy as a core feature:

- **WhatsApp number** → Required but never displayed. It only powers the `wa.me` link behind the "Contact Owner" button. The database view (`pets_public`) strips the raw number and only exposes an obfuscated WhatsApp link.
- **Owner name** → Optional. Stored privately, never shown on listings.
- **Address** → Optional. Stored privately, never shown on listings.
- **Pet photos, name, breed, description** → Shown publicly so the community can identify pets.

---

## 🛠 Local Development

If you want to make changes locally:

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/villanova-pet-registry.git
cd villanova-pet-registry

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Edit .env and add your Supabase URL and anon key

# Start the dev server
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 📁 Project Structure

```
villanova-pet-registry/
├── public/
│   ├── favicon.svg          # Paw print favicon
│   ├── manifest.json         # PWA manifest (app name, icon, theme)
│   ├── paw-icon-192.png      # App icon (home screen)
│   ├── paw-icon-512.png      # App icon (splash screen)
│   └── sw.js                 # Service worker for PWA
├── src/
│   ├── App.jsx               # Main app (all UI components)
│   ├── breeds.js             # Cat and dog breed lists
│   ├── main.jsx              # React entry point
│   └── supabase.js           # Supabase client + CRUD helpers
├── .env.example              # Template for environment variables
├── .gitignore
├── index.html                # HTML entry point
├── package.json
├── supabase-setup.sql        # Run this in Supabase SQL Editor
└── vite.config.js
```

---

## 🔮 Future Ideas

- **AI pet matching:** Upload a photo of a spotted pet, and the app compares it against registered profiles using image similarity to find the closest match
- **Lost & Found board:** Mark a pet as lost/found with last-seen location
- **Multiple communities:** Let other neighbourhoods create their own registries
- **Admin panel:** Let community admins manage and moderate listings
