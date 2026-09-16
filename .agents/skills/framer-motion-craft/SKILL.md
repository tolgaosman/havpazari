---
name: framer-motion-craft
description: >-
  Use this skill whenever you are tasked with adding animations, transitions, or micro-interactions to a React/Next.js frontend. It enforces Emil Kowalski's level of animation craft and mastery of Framer Motion.
---

# Framer Motion Craft: The Emil Kowalski Approach

Animations should never feel like an afterthought or a generic easing curve. They must feel physical, interruptible, and crafted with extreme care, inspired by the work of Emil Kowalski.

## 1. Physics over Easing
Generic linear or bezier curve easings (like `ease-in` or `ease-out`) often feel artificial. You must prioritize spring physics.
- **Use Springs:** For most interactive UI animations (opening modals, expanding cards, hover states), use `type: 'spring'`.
- **Tuning Springs:** Focus on `stiffness`, `damping`, and `mass`. A good default for a snappy but natural feel is `{ type: 'spring', stiffness: 300, damping: 30 }`.
- **No Bouncy Slop:** Do not use overly bouncy springs unless specifically modeling a bouncy object. UI springs should feel responsive and settled, not cartoonish.

## 2. Interruptibility is Mandatory
Users click fast. If an animation blocks a user or breaks when interrupted, it is a bad animation.
- Framer Motion handles interruptibility natively for standard properties, but you must ensure layout changes (`layoutId` or `layout` props) transition smoothly if state changes mid-animation.
- Never use long `duration` values or arbitrary `delay`s that lock the user out of interacting.

## 3. Layout Animations & Shared Elements
Mastering the `layout` prop is key to high-end craft:
- Use `layoutId` to seamlessly morph an element from one component/list into another (e.g., clicking a list item to open a full-screen view).
- Ensure border-radius and box-shadows are also animated correctly during layout transitions.
- Wrap components dynamically removed from the DOM in `<AnimatePresence>` and provide clean `initial`, `animate`, and `exit` states.

## 4. Delightful Micro-Interactions
- **Scale on Click:** Add a subtle `whileTap={{ scale: 0.95 }}` to buttons and interactive cards to simulate physical depression.
- **Hover Lifts:** Add a slight `whileHover={{ y: -2 }}` combined with a shadow increase for clickable cards.
- **Staggered Children:** When a list or page loads, do not animate everything at once. Use `variants` with `staggerChildren` to create a cascading entrance.

## 5. Performance Matters
- Animate `transform` (scale, x, y) and `opacity` whenever possible. Avoid animating `width`, `height`, `margin`, or `top`/`left` unless using the `layout` prop, to prevent layout thrashing and keep animations at 60+ FPS on the GPU.
