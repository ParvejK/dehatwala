---
name: design-pages
description: Analyze, redesign, and implement modern production-quality application pages while preserving existing business logic and behavior. Use when modernizing or extending UI/UX from PDFs, HTML, Figma designs, screenshots, source code, written requirements, or mixed design documentation; when a PDF or screenshot is a visual reference that must be re-created as responsive React components rather than embedded as an image; when improving responsive layouts, accessibility, content, navigation, states, or frontend architecture; or when translating page requirements into maintainable components without breaking APIs, routing, authentication, permissions, validation, state management, or backend integrations.
---

# Design Pages

Modernize existing product experiences as a senior product designer and frontend engineer. Treat supplied artifacts as the primary source of truth, but improve weak or incomplete UX instead of copying blindly.

## Reference-artifact rule

Treat PDFs, screenshots, and flattened mockups as design briefs, not production assets. Read their content and infer their visual system, then rebuild the experience with semantic, responsive components.

- Do not export, screenshot, crop, trace, or place a page or section from the reference artifact into the application.
- Do not use a flattened hero image to reproduce headings, buttons, cards, forms, backgrounds, or other interface elements that should be real HTML and CSS.
- Re-create the design language: composition, hierarchy, proportions, color relationships, typography character, image role, shape language, layering, and density. Do not blindly copy fixed coordinates.
- Keep text as text, controls as controls, and repeated content as data-driven components.
- Use project assets when they fit the intended subject and quality. If the reference contains illustrative or photographic subject matter that cannot reasonably be built with CSS and no suitable asset exists, create or source only that isolated visual asset when authorized; never generate text or controls inside it.
- A request to “make the hero similar to the PDF” means build a new responsive hero component with a comparable visual idea and composition, not reuse the PDF artwork.

## Non-negotiable constraints

- Preserve business logic, APIs, routes, state, validation, permissions, authentication, analytics, and backend contracts.
- Reuse the project's stack, components, tokens, typography, icons, conventions, and dependency choices.
- Do not add dependencies unless they are necessary and their benefit outweighs their cost.
- Do not remove or silently alter behavior. If a visual change requires behavioral change, identify it as a risk and obtain direction first.
- Keep additions purposeful. Do not add generic marketing sections, copy, motion, or decoration without a user or business benefit.
- Protect user-authored work and unrelated changes in a dirty worktree.

## Workflow

### 1. Establish the source of truth

Inspect every supplied artifact and the relevant application code. Use the appropriate document, PDF, image, browser, or Figma capability when available. Resolve conflicts using this priority unless the user specifies otherwise:

1. Explicit written requirements
2. Existing functional behavior and tests
3. Supplied design artifacts
4. Existing visual conventions

Record uncertainties and make only low-risk, reversible assumptions. Ask before making a choice that materially changes product behavior.

When a PDF is supplied:

1. Inspect every relevant page both visually and through text extraction. Rendering is required because text extraction alone loses layout, imagery, layering, and hierarchy.
2. Create a page-and-section inventory in reading order. For each section capture its purpose, exact visible content, layout pattern, imagery role, calls to action, reusable motifs, and responsive implications.
3. Separate three kinds of evidence: content to retain, visual direction to reinterpret, and behavior that must come from the existing application.
4. Identify whether the PDF represents one long page, several routes, or alternate states. Do not assume each PDF page is an application route.
5. Compare the inventory with the existing implementation and explicitly account for every meaningful section. Do not silently omit sections because they are difficult to reproduce.

### 2. Understand the product before coding

Trace the page's routes, data sources, user actions, validation, state transitions, loading/error/empty states, permissions, and responsive behavior. Identify:

- user and business goals;
- current information architecture and visual hierarchy;
- missing content, states, sections, and feedback;
- usability, accessibility, performance, and consistency problems;
- existing reusable components and design tokens;
- invariants that must not change.

Do not edit implementation files during this phase.

### 3. Produce the implementation plan

Before coding, present a concrete plan containing all nine items in `references/redesign-checklist.md`. Include exact files when known, distinguish confirmed requirements from proposed enhancements, and explain risks to preserved behavior.

Complete the plan before implementation. If the user requested planning or review only, stop after delivering it. Otherwise continue unless a material decision requires user input.

For reference-led work, add a section translation map to the plan. Map each PDF section to the React component to create or modify, the content source, the implementation technique, the responsive transformation, and whether any isolated image asset is required. State explicitly that reference pages will not be embedded or exported into the UI.

### 4. Design the improved experience

Aim for a clean, premium, content-led interface through strong hierarchy, typography, whitespace, spacing, balance, accessible contrast, and restrained interaction design. Use products such as Stripe, Linear, Vercel, Notion, Airbnb, and Framer only as quality references; do not imitate their branding.

Improve copy, navigation, calls to action, trust signals, onboarding, help text, feature explanation, and system states only where they advance the identified goals. Design mobile-first behavior for mobile, tablet, laptop, desktop, and large displays. Specify interaction and responsive rules rather than relying on a single static composition.

### 4a. Translate each reference section into components

Work section by section rather than applying a superficial global reskin:

1. Preserve the section's communication goal and required content.
2. Extract its design grammar: grid, alignment, spacing rhythm, type scale, contrast, background treatment, media placement, decorative geometry, and interaction emphasis.
3. Design a fresh component that expresses the same visual intent within the application's content, stack, and design system.
4. Convert desktop composition into deliberate tablet and mobile arrangements. Reorder only when reading order and task priority remain correct.
5. Implement decorative layers with CSS, SVG, or isolated media assets while keeping meaningful content accessible and selectable.
6. Check the section against both the reference and adjacent sections before moving on, so the completed page has a coherent look and feel rather than disconnected approximations.

For hero sections, explicitly define the content column, primary and secondary actions, media or illustration composition, trust or proof elements, background layers, focal point, overlap behavior, and small-screen stacking. Build these as separate responsive elements. Never substitute a full-width reference image for the hero implementation.

### 5. Implement safely

- Make small, reviewable changes and preserve existing component interfaces where practical.
- Extract reusable components when reuse, testing, or readability justifies it; avoid premature abstraction.
- Keep types, constants, hooks, utilities, services, and configuration separate when the project architecture supports that separation.
- Prefer composition, semantic HTML, native controls, visible focus, keyboard access, and ARIA only when semantics alone are insufficient.
- Include intentional loading, error, empty, disabled, success, and permission-denied states where applicable.
- Optimize images and rendering; respect reduced-motion preferences and avoid expensive decorative animation.
- Do not rewrite stable logic merely to make the UI code look cleaner.

For each major implementation group, briefly state the UX benefit, maintainability rationale, functionality impact (normally none), and any migration consideration. Keep updates concise and continue working.

### 6. Verify proportionally to risk

Read `references/redesign-checklist.md` and execute its final review. Run the project's relevant lint, typecheck, tests, and build commands. Inspect changed behavior and visual output at representative viewport widths when tooling permits. Compare critical flows before and after the redesign.

Do not claim responsive, visual, API, or accessibility verification that was not performed. Report unverified items and explain why.

For reference-led redesigns, visually compare the implementation with the artifact section by section. Verify design intent and content coverage rather than pixel identity. Confirm that no PDF page, screenshot, or flattened section was shipped as a shortcut and that reference text remains selectable HTML.

### 7. Deliver the result

Lead with the completed outcome. Summarize key UX improvements, changed files, preservation of existing behavior, and verification results. Call out assumptions, remaining risks, and useful next steps without burying the result in process detail.

## Detailed checklist

Read [references/redesign-checklist.md](references/redesign-checklist.md) while preparing the plan and again before final delivery.
