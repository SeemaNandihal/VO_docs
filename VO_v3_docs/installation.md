# 📦 Next.js Project Installation & Setup Guide

This document outlines the complete setup process for **Next.js (App Router)** project, including UI, state management, data fetching, and API configuration.

---

## 1️⃣ Create Next.js Project

Run the following command:

```bash
pnpm create next-app@latest app-name --yes
```

### What `--yes` does

It skips interactive prompts and uses defaults or saved preferences.

### Default Setup Includes

* ✅ TypeScript
* ✅ Tailwind CSS
* ✅ ESLint
* ✅ App Router
* ✅ Turbopack
* ✅ Import alias `@/*`

---

## 2️⃣ Install shadcn/ui

Official Docs:
[https://ui.shadcn.com/docs/installation/next](https://ui.shadcn.com/docs/installation/next)

### Initialize shadcn

```bash
pnpm dlx shadcn@latest init
```

During setup, you’ll be prompted:

```
? Which color would you like to use as the base color?
❯ Neutral
  Gray
  Zinc
  Stone
  Slate
```

Select the required base color as per project design preference.

---

## 3️⃣ Tailwind CSS Verification (Important)

In case Tailwind/PostCSS was not properly installed via shadcn:

```bash
pnpm install tailwindcss @tailwindcss/postcss postcss
```

### ✅ Verify `postcss.config.mjs`

Ensure it contains:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### ✅ Verify `globals.css`

Check if this import exists:

```css
@import "tailwindcss";
```

If missing, add it at the top of `globals.css`.

---

## 4️⃣ Install TanStack Query (React Query)

```bash
pnpm add @tanstack/react-query
```

Since we are using **App Router**, we need a client provider.

---

### Step 1: Create a Query Provider

Create a file:

```
/providers/query-provider.tsx
```

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

### Step 2: Wrap in `layout.tsx`

In:

```
app/layout.tsx
```
Below is a sample implementation:
```tsx
import QueryProvider from "@/providers/query-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

---

## 5️⃣ Install Zustand

```bash
pnpm add zustand
```

### ⚠ Important Architectural Note

If your project meets the following requirement:

Pages use SSR / SSG / ISR where appropriate

Because of this:

* ❌ Zustand should NOT replace server state (TanStack Query handles that)
* ✅ Zustand can be used for:

  * UI state (sidebar open/close)
  * Selected language/version
  * Theme preference
  * Client-only state

It should not interfere with server rendering strategy.

Refer this source if needed: `https://zustand.docs.pmnd.rs/guides/nextjs`

Example store:

```ts
import { create } from "zustand";

interface AppState {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: "en",
  setLanguage: (lang) => set({ language: lang }),
}));
```

---

## 6️⃣ Install Axios

```bash
pnpm add axios
```

---

## 7️⃣ (Optional but Recommended) Create Axios Instance

Create a file:

```
lib/api.ts
```
Below is an example with an environment variable named `NEXT_PUBLIC_API_URL`:
```ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

---

### Environment Variable Setup

Create a .env.local file and add your environment variables:

Example:

```
NEXT_PUBLIC_API_URL=https://your-api-base-url.com
```

> Any environment variable prefixed with `NEXT_PUBLIC_` will be exposed to the browser.

---


# ✅ Installation Summary

```bash
pnpm create next-app@latest app-name --yes
pnpm dlx shadcn@latest init
pnpm install tailwindcss @tailwindcss/postcss postcss
pnpm add @tanstack/react-query
pnpm add zustand
pnpm add axios
```

---