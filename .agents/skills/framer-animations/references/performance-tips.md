# Animation Performance Tips

Guidelines for smooth 60fps animations.

## GPU-Accelerated Properties

**Always animate these (composited, GPU-accelerated):**
- `opacity`
- `transform` (includes `scale`, `translate`, `rotate`, `skew`)

**Never animate these (trigger layout/paint):**
- `width`, `height`
- `top`, `right`, `bottom`, `left`
- `margin`, `padding`
- `border-width`
- `font-size`

## Performance Rules

### 1. Animate Once

```jsx
// GOOD - animates only on first scroll
viewport={{ once: true }}

// BAD - re-animates every time (jarring, wastes resources)
viewport={{ amount: 0.3 }}
```

### 2. Use will-change Sparingly

```jsx
// Only for known animations, remove after
<motion.div className="will-change-transform">
```

### 3. Keep Durations Short

```jsx
// GOOD - subtle, professional
transition={{ duration: 0.4 }}

// BAD - feels slow, blocks interaction
transition={{ duration: 1.5 }}
```

**Recommended durations:**
- Micro-interactions: 0.15-0.25s
- Section reveals: 0.4-0.6s
- Page transitions: 0.3-0.5s

### 4. Limit Simultaneous Animations

```jsx
// GOOD - stagger to avoid overwhelming GPU
transition={{ staggerChildren: 0.1 }}

// BAD - all items animate at once
// (no stagger)
```

### 5. Use Spring Physics Wisely

```jsx
// GOOD - feels natural
type: "spring", stiffness: 300, damping: 20

// BAD - too bouncy, annoying
type: "spring", stiffness: 100, damping: 5
```

### 6. Reduce Motion for Accessibility

```jsx
import { useReducedMotion } from "framer-motion";

export function AnimatedSection({ children }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}
```

Or with CSS:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Viewport Margin

Trigger animations before elements fully enter viewport:

```jsx
// Starts animation 100px before element enters
viewport={{ once: true, margin: "-100px" }}

// For sections near bottom of page
viewport={{ once: true, margin: "0px 0px -50px 0px" }}
```

## Avoid Layout Thrashing

```jsx
// BAD - causes layout recalculation
<motion.div
  animate={{ height: isOpen ? "auto" : 0 }}
>

// GOOD - use scale instead
<motion.div
  animate={{
    scaleY: isOpen ? 1 : 0,
    opacity: isOpen ? 1 : 0
  }}
  style={{ transformOrigin: "top" }}
>
```

## Mobile Considerations

1. **Reduce animation complexity on mobile:**
   ```jsx
   const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

   <motion.div
     initial={{ opacity: 0, y: isMobile ? 10 : 30 }}
   >
   ```

2. **Disable hover animations on touch:**
   ```jsx
   whileHover={!('ontouchstart' in window) ? { scale: 1.02 } : undefined}
   ```

3. **Keep stagger delays shorter:**
   ```jsx
   staggerChildren: isMobile ? 0.05 : 0.1
   ```

## Testing Performance

1. **Chrome DevTools:**
   - Performance tab > Record while scrolling
   - Look for frame drops (should be 60fps)

2. **Rendering panel:**
   - Enable "Paint flashing" to see repaints
   - Enable "Layer borders" to see composited layers

3. **Lighthouse:**
   - Run performance audit
   - Check for Cumulative Layout Shift (CLS)

## Quick Checklist

- [ ] Only animating `opacity` and `transform`
- [ ] Using `viewport={{ once: true }}`
- [ ] Durations under 0.6s
- [ ] Staggering simultaneous animations
- [ ] Not animating layout properties
- [ ] Tested on mobile
- [ ] Respects `prefers-reduced-motion`
