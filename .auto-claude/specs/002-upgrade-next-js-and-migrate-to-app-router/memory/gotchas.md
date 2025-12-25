# Gotchas & Pitfalls

Things to watch out for in this codebase.

## [2025-12-25 20:51]
react-spring package has peer dependency conflicts wanting React 19, but these are warnings only and don't block the build when staying on React 18.2.0

_Context: Next.js 15 upgrade with React 18 compatibility_

## [2025-12-25 21:37]
react-spring 9.x has bundling compatibility issues with Next.js 15 App Router that cause "Super expression must either be null or a function" error. Replace with CSS transitions using Tailwind classes instead.

_Context: Next.js 15 App Router migration - Navigation component animation replacement_
