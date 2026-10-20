# Adding Material Symbols SVG Icons in Next.js (App Router + Turbopack)

This guide explains how to add **Google Material Symbols (SVG version)** into a Next.js App Router project using **Turbopack** and convert them into reusable React components.

---

## 1️⃣ Download or Copy Icons from Google

Go to:

👉 [https://fonts.google.com/icons](https://fonts.google.com/icons)

### Steps:

1. Search for your icon (example: `local library`)
2. Choose:

   * Filled / Outlined / Rounded / Sharp
   * Weight
   * Grade
   * Optical size
3. Customize from the side menu
4. Then either:

   * **Copy SVG code**
   * OR **Download SVG file**

---

## 2️⃣ Create an `icons` Folder (Outside `app` Directory)

Create a folder in the project root:

```
/icons
```

### Why outside `app`?

* Keeps icons as reusable UI assets (not routes)
* Avoids App Router treating files as pages/layouts
* Better project structure separation
* Cleaner import paths
* Prevents accidental server component boundary issues

---

## 3️⃣ Add SVG Files

### Option A — If You Copied SVG Code

1. Create a file inside `/icons`, for example:

```
icons/local_library.svg
```

2. Open it in text mode
3. Paste the copied `<svg>...</svg>` code

---

### Option B — If You Downloaded SVG

Just move the downloaded `.svg` file into:

```
/icons
```

---

## 4️⃣ Important: Convert SVG to React Component (Next.js 15+ / 16+)

In older Next.js versions (Webpack-based), SVGs could sometimes be imported directly as components depending on configuration.

From **Next.js 15+ with Turbopack (default in Next.js 16)**, SVG files must be transformed into components using a loader.

We use:

```
@svgr/webpack
```

---

## 5️⃣ Install SVGR

```bash
pnpm add -D @svgr/webpack
# or
npm install -D @svgr/webpack
```

---

## 6️⃣ Configure `next.config.ts`

Edit your `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
```

### Official Reference:

[https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)

---

## 7️⃣ Create `icons/index.ts`

Inside `/icons` folder create:

```
icons/index.ts
```

Export all icons:

```ts
export { default as LocalLibrary } from "./local_library.svg";
export { default as BookOpen } from "./book_open.svg";
export { default as AutoStories } from "./auto_stories.svg";
export { default as SignLanguage } from "./sign_language.svg";
```

Now every SVG becomes a React component.

---

## 8️⃣ Optional: Create a Reusable `Icon` Component

Instead of importing each icon manually everywhere, create:

```
components/Icon.tsx
```

```tsx
import * as Icons from "@/icons";

export type IconName = keyof typeof Icons;

export default function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const SvgIcon = Icons[name];
  return <SvgIcon className={className} />;
}
```

### Benefits:

* Type-safe icon names
* Centralized control
* Cleaner usage
* Easy refactoring
* Works with Tailwind (`fill="currentColor"` support)

---

## 9️⃣ Important: Use `fill="currentColor"` in SVG

Make sure your SVG file does NOT hardcode fill color like:

```xml
fill="#1f1f1f"
```

Instead use:

```xml
fill="currentColor"
```

This allows Tailwind text colors to control icon color.

---

## 🔟 Usage Examples

### Example 1 — Direct SVG Component

```tsx
import { LocalLibrary } from "@/icons";

<LocalLibrary className="w-6 h-6 text-black" />
```

---

### Example 2 — Using Reusable `Icon` Component

```tsx
import Icon from "@/components/Icon";

<Icon name="LocalLibrary" className="w-6 h-6 text-black" />
```

---

### Example 3 — Dynamic Active Styling

```tsx
<Icon
  name="BookOpen"
  className="w-7 h-7 text-gray-700"
/>
```

---
