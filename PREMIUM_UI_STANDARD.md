# LawChai Premium UI Standard v1

## Objective

Make every public LawChai workflow feel deliberate, credible and product-specific without hiding evidence, weakening accessibility or turning the portfolio into a uniform template library.

Premium means:

- strong information hierarchy;
- restrained surfaces and motion;
- precise spacing and typography;
- a distinct identity for each product family;
- visible states and evidence boundaries;
- reliable mobile, keyboard, zoom and reduced-motion behaviour.

Premium does **not** mean:

- more glow, gradients or animation by default;
- decorative glass on every container;
- low-contrast text;
- hiding formulas, caveats, synthetic-data labels or unknowns;
- replacing workflow clarity with a marketing landing page;
- applying the signature cat inside serious recruitment, evidence or calculation workflows.

## Portfolio-level hierarchy

1. **lawchai.com** — editorial portfolio presentation. High visual polish, strong narrative hierarchy, restrained atmosphere.
2. **Featured products** — deepest product-specific systems and most rigorous browser verification.
3. **Secondary commercial product** — premium analytical workbench, optimized for numerical trust and export.
4. **Archive experiments** — coherent baseline quality, but lighter custom art direction and maintenance.

Homepage prominence remains limited to Interview Scheduler, Tech Recruiter Fluency, Boolean Search Trainer and the smaller Cost of Inaction placement.

## Shared foundation

### Typography

- Body: `Inter`, `SF Pro Text`, `Segoe UI`, system sans-serif fallback.
- Display: `SF Pro Display`, `Segoe UI Variable Display`, then body fallback.
- Data/code: `SFMono-Regular`, `Consolas`, `Liberation Mono`, monospace.
- Use negative tracking only for display headings.
- Use tabular numerals for calculations, scores, dates, counts and comparison tables.
- Body copy target line-height: 1.55–1.70.

### Spacing

- Base grid: 4px.
- Core rhythm: 8, 12, 16, 24, 32, 48, 64px.
- Controls: minimum 44×44 CSS pixels.
- Page content: 16px mobile gutters; 24px tablet; 32px desktop where space allows.
- Avoid repeated equal-weight cards. Use spacing and grouping before adding borders.

### Surfaces

- Canvas: near-black or low-chroma neutral, not pure black.
- Primary surface: 82–96% opacity over a plain canvas. When intentional background art/video is part of the design, use localized scrims and lower surface alpha as needed so the background remains recognizable rather than being washed into anonymous colour blobs.
- Backdrop blur is not a default readability tool. Over intentional background media, prefer no blur or a light 0–8px blur; avoid large-area/full-screen blur above 8px unless loss of background detail is explicitly intended.
- Verify background-media treatments at normal desktop and mobile viewing size. If the underlying scene/art can no longer be identified, reduce overlay opacity and/or blur before adding more decoration.
- Borders: subtle neutral lines; stronger accent border only for focus, active state or a primary result.
- One elevated hero/workspace surface per screen is normally enough.
- Shadows should separate depth, not create neon halos.
- Hover elevation: 1–3px maximum, disabled under reduced motion.

### Controls

- Primary action: filled product accent with visible text contrast.
- Secondary action: neutral surface and border.
- Destructive action: explicit red semantics, never recoloured to the product accent.
- Focus: 3px visible outline with at least 3px offset.
- Do not rely on colour alone for selected, success, warning or error states.

### Motion

- Default transition duration: 120–180ms.
- Prefer opacity, border and small translation changes.
- No decorative animation in serious workflow screens unless it communicates state.
- `prefers-reduced-motion: reduce` must remove translations, smooth scroll and looping animation.

## Product identities

| Product | Identity | Accent direction | Avoid |
|---|---|---|---|
| Interview Scheduler | coordination workspace | blue → cyan | playful scheduling graphics, token-security theatre |
| Tech Recruiter Fluency | editorial learning workbench | amber → orange | generic gamification, excessive badges |
| Boolean Search Trainer | technical sourcing lab | cyan → blue | terminal cosplay, unreadable code styling |
| Cost of Inaction | financial decision workbench | teal → platinum/blue | sales-dashboard gloss, hidden assumptions |
| Technical Intake Simulator | live conversation console | violet → blue | fake AI mystique, transcript clutter |
| Candidate Evidence Mapper | evidence review desk | indigo → cyan | match percentages, unsupported confidence visuals |
| BriefOps | controlled validation console | steel → violet | green-by-default validation, dense form walls |
| Contract Desk | operating command centre | cobalt → amber | equal-weight panels, premature flagship branding |
| RolePrep SG | role intelligence notebook | emerald → blue | certification-marketing styling |
| Decision Boundary Mapper | decision canvas | violet → magenta | decorative diagrams that obscure rules |
| Pipeline Doctor | diagnostic console | red/amber for problems, blue for actions | recolouring warnings to brand accent |
| Talent Market Feasibility | market evidence workbench | green → cyan | unsupported market certainty |
| Contract Continuity Engine | continuity planning desk | navy → teal | insurance-product styling |
| Meeting Prep | briefing room | graphite → blue | generic meeting-app cards |
| Mobility Due Diligence | risk and evidence dossier | burgundy → gold | luxury-travel aesthetics |
| Proof-of-Value Orchestrator | evaluation command centre | indigo → emerald | enterprise theatre, fabricated outcomes |
| Deal Structure Validator | commercial review desk | graphite → amber | sales-celebration visuals |

## Required screen hierarchy

Every public application should expose, in this order:

1. product name and one-line purpose;
2. synthetic-data or evidence boundary where applicable;
3. current workflow state or next recommended action;
4. the primary working surface;
5. supporting explanation, history, export and reset controls;
6. portfolio return link in a non-obstructive position.

Do not lead with implementation details, architecture labels or disclaimers unless the user must see them before entering data.

## Semantic-state protection

Visual overrides must not flatten or recolour:

- errors;
- warnings;
- success confirmations;
- destructive controls;
- unknown or unsupported evidence;
- disabled states;
- status badges whose colour carries meaning.

When using broad CSS selectors, explicitly exclude semantic background classes or restore their state-specific styling afterwards.

## Accessibility acceptance criteria

Each changed journey must be checked for:

- keyboard-only completion;
- visible focus;
- reduced motion;
- 200% zoom;
- 320px and 390px widths;
- no horizontal overflow;
- controls at least 44×44 CSS pixels;
- unique IDs;
- truthful alt text;
- text and non-text contrast;
- state communication beyond colour.

## Verification packet for every design PR

The PR must state:

- authorised visual files;
- affected journeys and themes;
- screenshots or written browser evidence for desktop, 390px and 320px;
- 200% zoom and keyboard result;
- reduced-motion result;
- build/test status;
- confirmation that semantic colours and synthetic/evidence boundaries remain intact;
- semantic-contract declaration;
- out-of-scope defects reported only.

A visual PR is not ready solely because the stylesheet compiles.

## Promotion rule

Archive experiments receive the shared foundation and one product accent. Featured products receive custom layout hierarchy, component-level refinement, richer empty/loading/error states and deeper browser verification.

Do not spend flagship-level design effort on every experiment. Consistent baseline quality across the archive is useful; identical visual treatment is not.