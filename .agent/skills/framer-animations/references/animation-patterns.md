# Animation Patterns

Code patterns for common micro-animations.

## MotionSection Wrapper

The existing `MotionSection` component wraps sections for scroll-triggered reveals:

```tsx
// components/ui/motion-section.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MotionSection({ children, className, delay = 0 }: MotionSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

## Stagger Container Pattern

For animating lists of items sequentially:

```tsx
"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function StaggeredGrid({ items }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          <Card {...item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

## Hover Card Pattern

For interactive card elements:

```tsx
"use client";

import { motion } from "framer-motion";

export function HoverCard({ children }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className="p-6 rounded-lg border bg-card"
    >
      {children}
    </motion.div>
  );
}
```

## Button Feedback Pattern

For button press feedback:

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
>
  Click me
</motion.button>
```

## Image Reveal Pattern

### Clip-path Wipe

```tsx
<motion.div
  initial={{ clipPath: "inset(100% 100% 0% 0%)" }}
  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
  viewport={{ once: true }}
  transition={{
    type: "spring",
    stiffness: 150,
    damping: 20,
    duration: 0.8
  }}
  className="overflow-hidden rounded-lg"
>
  <img src={image} alt="" className="w-full h-auto" />
</motion.div>
```

### Zoom-in Reveal

```tsx
<motion.div
  initial={{ scale: 1.1, opacity: 0 }}
  whileInView={{ scale: 1, opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="overflow-hidden rounded-lg"
>
  <img src={image} alt="" className="w-full h-auto" />
</motion.div>
```

## Text Reveal Pattern

### Fade-in with Offset

```tsx
<motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
  Headline Text
</motion.h1>
```

### Staggered Words (Advanced)

```tsx
const words = text.split(" ");

<motion.h1 className="flex flex-wrap gap-x-2">
  {words.map((word, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
    >
      {word}
    </motion.span>
  ))}
</motion.h1>
```

## Navbar Scroll Pattern

For navbar background on scroll:

```tsx
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      {/* Navbar content */}
    </nav>
  );
}
```

## Common Easing Values

```js
// Smooth entry
ease: "easeOut"

// Natural bounce
type: "spring", stiffness: 300, damping: 20

// Quick interaction
type: "spring", stiffness: 400, damping: 17

// Slow and smooth
duration: 0.6, ease: [0.25, 0.1, 0.25, 1]
```

## Viewport Options

```js
// Trigger once, 100px before entering viewport
viewport={{ once: true, margin: "-100px" }}

// Trigger once, immediately when visible
viewport={{ once: true }}

// Trigger every time (use sparingly)
viewport={{ amount: 0.3 }}
```
