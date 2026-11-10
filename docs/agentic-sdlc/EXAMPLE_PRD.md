# Example PRD (paste into the GitHub Issue form)

## Problem / opportunity
People visiting my professional portfolio should discover certifications without manually scanning the entire page.

## Scope and functionality
1. Add a visible navigation item leading to the existing certifications section or page.
2. Preserve the website's current brand, typography and visual hierarchy.
3. Make the interaction keyboard-accessible and support narrow/mobile viewports.
4. If the section does not exist, add a lightweight section without inventing certifications or credential IDs.

## Acceptance criteria
- Given the home page, when a user clicks "Certificações", then the relevant existing section/page opens.
- Given a viewport of 390x844, when the navigation is opened, the item is visible and clickable without horizontal scrolling.
- Given keyboard navigation, when focus reaches the new link, then a visible focus indicator is shown.
- Given the site build, when CI runs, then tests and preview screenshots succeed.

## Design and accessibility
Maintain existing style; WCAG AA contrast targets, semantic links and focus visibility.

## Out of scope
Do not migrate framework, change domain settings, add tracking or third-party services, or modify release configuration.

## Evidence
- Screenshot desktop and mobile
- Passing CI
- Review of PRD criteria by human maintainer
