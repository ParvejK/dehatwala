# Redesign planning and review checklist

## Implementation plan

Include these nine items before coding:

1. What the current page does, including primary flows and preserved behavior.
2. Problems found in usability, content, accessibility, responsiveness, consistency, and performance.
3. Proposed UX improvements and the user or business benefit of each.
4. Components to create and why they deserve extraction.
5. Components to modify and how their contracts remain compatible.
6. Files to add.
7. Files to update.
8. Risks, assumptions, edge cases, and mitigation.
9. Ordered implementation and verification steps.

For PDF, screenshot, or flattened-mockup references, also include a section translation map with: reference page and section, purpose, retained content, target component, visual treatment, responsive behavior, and asset strategy.

## Reference-artifact translation

- Every relevant PDF page was inspected visually and via text extraction.
- Every meaningful reference section is mapped to an implementation or an explicitly justified omission.
- Content, visual direction, and existing application behavior are distinguished.
- The design is rebuilt from semantic React/HTML, CSS, SVG, and isolated media assets.
- No PDF page, screenshot, hero, form, card group, or flattened section is embedded as the implemented interface.
- Text and controls visible in the reference remain real selectable text and operable controls.
- Hero imagery is decomposed into content, layout, decorative layers, and isolated media rather than copied as a single image.
- Desktop composition is deliberately translated for tablet and mobile instead of merely scaled down.
- Visual comparison checks design intent, hierarchy, rhythm, content coverage, and responsiveness rather than pixel identity.

## State and interaction coverage

Check applicable states: default, hover, focus, active, selected, disabled, loading, empty, error, success, offline, partial data, permission denied, long content, and destructive confirmation.

Check applicable input methods: keyboard, pointer, touch, screen reader, zoom, and reduced motion.

Check representative widths for mobile, tablet, laptop, desktop, and large displays. Verify layout behavior between breakpoints, not only at exact breakpoint values.

## Functional preservation

- Routes and deep links remain valid.
- API requests, payloads, response handling, caching, and error handling remain intact.
- Authentication, authorization, and permission boundaries remain intact.
- State transitions and persisted state remain intact.
- Forms preserve defaults, validation, submission, error mapping, and keyboard behavior.
- Analytics and tracking remain intact when present.
- Existing tests pass; changed tests reflect intentional UI behavior rather than hidden regressions.

## Code quality

- Components have clear responsibilities and stable interfaces.
- Shared logic is reused without premature abstraction.
- Types, constants, hooks, utilities, services, and configuration follow project conventions.
- Naming is consistent; no duplicated or dead code remains.
- New dependencies are avoided or explicitly justified.
- Images, rendering, and animations are appropriately optimized.

## Accessibility and visual quality

- Semantic structure and heading order are logical.
- Labels, accessible names, alt text, landmarks, and live announcements are correct where needed.
- Keyboard navigation, focus order, and visible focus states work.
- Color contrast and non-color cues are sufficient.
- Touch targets and responsive text remain usable under zoom.
- Typography, spacing, hierarchy, alignment, and density are consistent.
- Added copy and sections provide concrete value rather than filler.

## Final report

Report:

- the delivered experience and meaningful improvements;
- files and architectural changes;
- whether functionality changed;
- checks run and their results;
- viewport or visual checks actually performed;
- assumptions, unverified areas, remaining risks, and migration notes.
