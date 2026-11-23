---
name: react-component-integrity
description: Strict engineering guardrails for developing, modifying, integrating, documenting, testing, and deploying existing React component libraries. Enforces API preservation, complete prop connectivity, design-system consistency, Storybook quality, Git safety, and centralized documentation.
---

# React Component Integrity
## Master Engineering Instructions for Claude

# 1. Core objective

You are working within an existing React component ecosystem. Your responsibility is to extend, integrate, maintain, and improve it without unnecessarily changing its architecture, public API, visual language, or functionality.

The repository is the source of truth.

**EXTEND, DON'T REPLACE. CONNECT, DON'T HARDCODE. PRESERVE, DON'T REMOVE. REUSE, DON'T REINVENT. DOCUMENT, DON'T ASSUME. VALIDATE, DON'T GUESS.**

Do not independently redesign or reinvent existing components.

# 2. Preserve all existing component properties

This is non-negotiable.

- Retain every existing component prop.
- Never remove, rename, override, or silently ignore existing properties.
- Preserve types, interfaces, required/optional status, defaults, supported values, variants, callback signatures, and behavior.
- Maintain backward compatibility.
- Never replace an existing prop with an invented equivalent.
- Never hardcode values that are already exposed through props.
- Never simplify an API by removing properties.
- Investigate apparently unused properties before changing them.

Before modifying a component, inspect its complete API and implementation. If a requested change requires a breaking change, explain the impact and obtain authorization first.

# 3. Reuse; do not invent unnecessarily

Inspect the repository before writing code.

- Reuse existing components, tokens, variables, utilities, hooks, icons, assets, and styles.
- Follow established naming conventions, folder structure, exports, imports, and composition patterns.
- Do not create duplicate components or replace an existing component with a custom implementation merely because it is easier.
- Do not introduce a new styling approach, dependency, abstraction, or visual treatment without a clear need.
- If a required component or capability does not exist, identify the gap before creating it.

# 4. Connect every property and value

Every declared property must have a clear path to its actual implementation. This applies to:

- Component props and TypeScript interfaces
- Default values and internal state
- Event handlers and callback functions
- Conditional rendering and variant logic
- CSS variables and design tokens
- Nested component properties
- Parent-to-child data flow
- Storybook args and controls

Requirements:

1. Every declared prop must be accounted for.
2. Every configurable value must influence the intended behavior or appearance.
3. Every event handler must be connected to the correct interaction.
4. Every callback must pass the expected arguments.
5. Every supported variant must render correctly.
6. State-dependent properties must update correctly.
7. Parent values must propagate correctly to children.
8. Dynamic values must not be replaced with static or hardcoded values.
9. Storybook controls must connect to real component props.
10. Do not expose unimplemented properties as if they work.

Avoid dead props, disconnected values, fake functionality, hardcoded substitutes, and unnecessary duplicate state. If a property is intentionally unsupported, document that accurately.

# 5. Preserve architecture and behavior

- Make the smallest targeted change that solves the task.
- Preserve public exports and import paths wherever possible.
- Avoid unnecessary restructuring, duplicated logic, and abstractions.
- Maintain modularity and the repository's separation of logic, styles, and documentation.
- Follow existing React patterns and hooks.
- Avoid unnecessary re-renders.
- Handle loading, disabled, error, empty, and edge states where relevant.
- Do not rewrite an entire component when a focused change is sufficient.

# 6. Design-system consistency

The existing design system takes precedence over personal design preferences.

Preserve typography, font weights, color tokens, spacing scales, radii, shadows, elevation, dimensions, icon sizing, alignment, layout behavior, responsive breakpoints, interaction states, animation conventions, and themes.

- Use existing tokens instead of hardcoded colors or arbitrary spacing.
- Do not replace established CSS variables.
- Do not create duplicate tokens or conflicting styles.
- Do not override global styles unnecessarily.
- Do not change visual appearance unless requested.
- Integrate new styling into the existing styling architecture.

# 7. React and TypeScript standards

- Follow the project's existing React and TypeScript conventions.
- Maintain strict typing; avoid `any` unless justified.
- Preserve existing interfaces and exported types.
- Handle nullable and optional properties correctly.
- Use correct event types and stable keys.
- Do not mutate props or state.
- Clean up effects and subscriptions.
- Maintain correct hook dependencies.
- Preserve controlled and uncontrolled input behavior.
- Maintain accessibility attributes and semantic HTML.
- Do not introduce or suppress TypeScript errors to bypass implementation problems.

# 8. Storybook requirements

Every component change must be reflected in Storybook. Inspect the existing Storybook configuration and conventions first.

For each affected component:

- Preserve existing stories, names, args, and argTypes wherever possible.
- Represent all supported properties and variants.
- Connect controls to actual component props.
- Use appropriate control types and accurate default args.
- Include relevant interaction states and, where applicable, disabled, loading, error, empty, and responsive states.
- Document required and optional properties.
- Include practical usage examples where appropriate.
- Never create fake variants or controls that only change the Storybook UI.
- Never remove existing stories merely to simplify configuration.

Validate the affected stories, run the Storybook development server when practical, verify controls and variants, and run the production Storybook build using the repository's existing scripts. Resolve build errors; report anything that could not be tested.

# 9. Mandatory centralized documentation

Every repository must maintain two Markdown files. Create them during initial setup if they do not exist. Inspect and consolidate useful existing documentation; do not blindly overwrite it or create generic placeholders.

## 9.1 `docs/MASTER.md`

Purpose: the complete technical reference and centralized knowledge base for the component ecosystem.

Include:

### Project overview
- Project purpose, architecture, technology stack, folder structure, coding conventions, and design-system principles.

### Complete component inventory
For every exported component, record its name, category, source location, export name, dependencies, and related components.

### Complete component API reference
For every component, document:
- Description and complete TypeScript interface
- Every existing property, its type, and whether it is required or optional
- Default values and supported values
- Variants and callback signatures
- State and interaction behavior
- Styling properties, CSS variables, and design tokens
- Nested components and accessibility attributes

Do not omit rarely used properties.

### Architecture and dependencies
Document component relationships, parent-child relationships, composition patterns, shared utilities, hooks, context providers, internal dependencies, external packages, and third-party integrations.

### Design-system reference
Document actual implemented color tokens, typography, spacing, sizing, radii, shadows, breakpoints, icons, animation conventions, and theme configurations.

### Storybook reference
Document configuration, story locations, available stories, args, argTypes, controls, component states, how to create stories, how to run and build Storybook, and deployment configuration.

### Development guidelines
Document component creation and modification workflows, naming conventions, TypeScript and styling standards, testing requirements, and Git conventions.

### Change log
Record new and modified components, added or modified props, deprecated properties, breaking changes, bug fixes, and Storybook updates. Include dates and Git commit references when available.

### Known issues
Record unsupported functionality, limitations, outstanding bugs, technical debt, and incomplete implementations. Distinguish verified information from assumptions.

## 9.2 `docs/COMPONENT_USE_CASES.md`

Purpose: a practical implementation guide explaining how and when to use each component.

For every component, document:

1. Name and purpose.
2. When to use it.
3. When not to use it.
4. Available properties.
5. Required and optional properties.
6. Default values.
7. Supported variants.
8. Input, output, and interaction behavior.
9. Dependencies on other components.
10. Composition patterns.
11. Responsive behavior.
12. Accessibility considerations.
13. Practical implementation examples.
14. Common mistakes and anti-patterns.
15. Edge cases and limitations.

Use examples that match the actual implementation. Do not invent APIs, props, variants, or functionality. Explain how components should be combined and when existing components should be reused instead of creating new ones.

# 10. Documentation synchronization and accuracy

Documentation must not become outdated relative to the code.

Whenever a component is created, modified, or removed:

1. Update `docs/MASTER.md`.
2. Update `docs/COMPONENT_USE_CASES.md`.
3. Update the component inventory and API reference.
4. Update relevant usage examples and component relationships.
5. Update Storybook documentation.
6. Update the change log.

Both files must describe the same current component API.

Use this source-of-truth hierarchy when resolving discrepancies:

1. Actual component implementation — behavioral truth.
2. TypeScript interfaces — API and type truth.
3. Design tokens and styles — visual truth.
4. Storybook — interactive example truth.
5. Markdown documentation — consolidated reference.

If documentation conflicts with code, investigate and correct the discrepancy. Do not blindly copy outdated documentation. Never fabricate missing information or describe unimplemented functionality as working. Mark uncertain or incomplete details clearly.

# 11. Testing and quality assurance

Before declaring work complete, run the relevant available checks:

- Existing test suite and relevant component tests
- TypeScript checks
- Linting and formatting checks, if configured
- Production build
- Storybook build

Test default rendering, supported props, variants, interactions, callback execution, controlled values, responsive behavior, accessibility, and relevant edge cases.

Do not delete or weaken tests to make a build pass. Do not suppress errors without understanding their cause. Report checks that could not be executed and never claim a check passed unless it was actually run.

# 12. Git workflow and repository safety

## Before modifying files
1. Inspect the current branch.
2. Check working-tree status.
3. Identify existing uncommitted changes.
4. Inspect relevant files and recent changes where necessary.

Never overwrite unrelated user modifications.

## During development
- Keep changes scoped to the task.
- Avoid unrelated file modifications and unjustified deletions.
- Avoid unnecessary generated files.
- Never commit secrets, credentials, or environment files.
- Review diffs regularly.
- Preserve repository conventions.

## Before committing
- Run relevant tests, lint, type checks, production build, and Storybook build where available.
- Inspect `git diff` and `git status`.
- Check for accidental deletions, unrelated changes, and exposed secrets.

## Git restrictions
- Never force-push.
- Never reset or discard user changes.
- Never amend existing commits without permission.
- Never commit automatically unless requested.
- Never push, merge, or rebase without explicit authorization.
- Never overwrite protected branches.
- Never change repository configuration unnecessarily.

When asked to commit, use a descriptive message following the repository's existing convention.

# 13. Deployment and release readiness

Before preparing a release, verify:

- Production and Storybook builds
- Environment variable requirements
- Asset paths and imports
- Package dependencies, exports, and entry points
- Public component imports
- Console errors and warnings
- Missing styles and assets
- Documentation links
- Absence of required local-only paths
- Absence of exposed secrets
- Package consumption through intended entry points

If Storybook is deployed independently, also verify its deployment configuration, static output, asset loading, routing, base paths, documentation, component previews, and that it represents the intended component version.

Do not invent deployment infrastructure. Do not deploy, publish packages, or change deployment configuration without explicit authorization.

# 14. Dependency management

- Prefer existing dependencies.
- Do not install packages for functionality already available.
- Avoid unnecessary dependency upgrades.
- Do not upgrade React, TypeScript, Storybook, or build tooling without authorization.
- Check compatibility before introducing a dependency.
- Preserve the existing package manager and lockfile.
- Never switch package managers arbitrarily.

# 15. Mandatory development workflow

Follow this sequence for every task.

## Phase 1 — Audit
- Inspect repository structure and Git status.
- Identify target components.
- Inspect implementations, props, types, styles, dependencies, exports, and related components.
- Inspect Storybook stories and configuration.
- Inspect existing documentation and project conventions.

Do not begin implementation before understanding the system.

## Phase 2 — Plan
- Identify exact changes and files.
- Identify component dependencies and properties that must remain untouched.
- Identify testing and documentation requirements.
- Prefer minimal, targeted modifications.

## Phase 3 — Implement
- Preserve all existing props and behavior.
- Connect every value.
- Reuse existing components and tokens.
- Follow the design system.
- Avoid unnecessary restructuring.
- Maintain backward compatibility.

## Phase 4 — Document
- Update `MASTER.md` and `COMPONENT_USE_CASES.md`.
- Update Storybook stories and controls.
- Document supported props and examples.
- Preserve useful existing documentation.

## Phase 5 — Validate
- Run relevant tests, linting, type checks, production build, and Storybook build.
- Inspect rendered components and Git diff.
- Cross-check documentation against implementation.

## Phase 6 — Report
Provide a concise completion report containing:
1. Components modified.
2. Properties preserved and connected.
3. New properties introduced and their justification.
4. Storybook changes.
5. Documentation changes.
6. Tests and build results.
7. Git changes.
8. Known issues and outstanding work.

Never claim something passed if it was not executed.

# 16. Initial project setup

On the first execution of this skill:

1. Inspect the repository structure.
2. Identify all exported React components.
3. Inspect component implementations and TypeScript interfaces.
4. Identify all existing props, defaults, and variants.
5. Inspect styles and design tokens.
6. Identify internal and external dependencies.
7. Inspect Storybook configuration and stories.
8. Map component relationships.
9. Inspect existing documentation.
10. Create or consolidate `docs/MASTER.md`.
11. Create or consolidate `docs/COMPONENT_USE_CASES.md`.
12. Populate both files using verified implementation details.
13. Cross-check every documented component and property.
14. Identify undocumented or incomplete functionality.
15. Report audit findings.

Do not create new components during the documentation audit unless explicitly requested. Do not overwrite useful existing documentation blindly.

# 17. Required project structure

Use this structure where it fits the existing repository. Adapt to established conventions rather than moving files unnecessarily.

```text
project/
├── .claude/
│   └── skills/
│       └── react-component-integrity/
│           └── SKILL.md
├── docs/
│   ├── MASTER.md
│   └── COMPONENT_USE_CASES.md
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── styles/
├── .storybook/
├── package.json
└── ...
```

# 18. Absolute restrictions

Never:

1. Remove existing component properties.
2. Silently change existing property behavior.
3. Invent alternative components unnecessarily.
4. Hardcode values that should be dynamic.
5. Leave declared properties disconnected.
6. Create non-functional Storybook controls.
7. Break existing imports or exports unnecessarily.
8. Redesign components without instruction.
9. Modify unrelated files.
10. Sacrifice backward compatibility for convenience.
11. Hide errors by removing tests or suppressing warnings.
12. Fabricate documentation.
13. Allow the two documentation files to become outdated.
14. Commit, push, merge, publish, or deploy without authorization.
15. Overwrite user changes.

# 19. Conflict resolution

If a requested implementation conflicts with an existing API, design-system convention, component behavior, repository configuration, dependency, or backward compatibility:

1. Identify the conflict.
2. Explain the potential impact.
3. Suggest the least disruptive solution.
4. Preserve the existing implementation by default.
5. Obtain authorization before introducing a breaking change.

If a requirement cannot be implemented without changing existing behavior, explain why before proceeding.

# 20. Final engineering principle

Your job is not to reinvent the component library. Your job is to understand it, preserve it, extend it, connect it, document it, test it, and make it production-ready.

Every component must remain consistent with the existing ecosystem.
Every property must remain accounted for.
Every value must be properly connected.
Every component must be documented.
Every Storybook control must work.
Every change must be validated.
The repository must remain maintainable by developers and future AI agents.

**EXTEND, DON'T REPLACE.**
**CONNECT, DON'T HARDCODE.**
**PRESERVE, DON'T REMOVE.**
**REUSE, DON'T REINVENT.**
**DOCUMENT, DON'T ASSUME.**
**VALIDATE, DON'T GUESS.**
