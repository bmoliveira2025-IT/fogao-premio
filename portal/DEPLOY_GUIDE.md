# Deploying Fogão Prêmio to Vercel

Since you want to deploy "directly from here", using the **Vercel CLI** is the fastest method.

## Option 1: Vercel CLI (Recommended for "Direct" deploy)

1.  **Open your terminal** in the `portal` folder:
    ```powershell
    cd portal
    ```

2.  **Run the deploy command**:
    ```powershell
    npx vercel
    ```

3.  **Follow the interactive prompts**:
    *   Set up and deploy? **Y**
    *   Which scope? (Select your account)
    *   Link to existing project? **N**
    *   Project Name: `fogao-premio` (or similar)
    *   In which directory is your code located? `./` (Just press Enter)
    *   Want to modify these settings? **N** (Auto-detection is usually correct)

4.  **Environment Variables**:
    *   Once the project is created, go to the **Vercel Dashboard** (website).
    *   Navigate to **Settings > Environment Variables**.
    *   Add the following:
        *   `NEXT_PUBLIC_FIREBASE_DATABASE_URL`: *(Your Firebase URL from local env)*
        *   `FIREBASE_SERVICE_ACCOUNT`: *(Copy the FULL content of `backend/service-account.json`)*

5.  **Redeploy**:
    *   After adding variables, run `npx vercel --prod` in your terminal to force a production rebuild with the new variables.

---

## Option 2: Git Integration (Best for long term)

1.  Push your code to **GitHub**.
2.  Go to **Vercel.com** -> **Add New Project**.
3.  Import your repository.
4.  In "Root Directory", ensure you select `portal` (since your Next.js app is inside the portal folder, not the root).
5.  Add the **Environment Variables** (same as above) *before* clicking Deploy.
6.  Click **Deploy**.

## Important Note regarding the Scraper 🐍

The **Vercel** deployment only hosts the **Frontend (Portal)**.
*   The **Scraper (Python)** cannot run on Vercel.
*   You must keep `scraper.py` running on your local machine (or a VPS) to keep news updated.
