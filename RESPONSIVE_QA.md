# Responsive workflow review — 2026-09-23

Tested the local Vite preview with ECC Chrome DevTools in the isolated
`populated-qa-sept23` browser context. No existing campaign storage was modified.
Fixtures included four named characters (one with a long name), four monsters,
conditions, a quest, session history, a setup encounter, and a generated courtyard map.

## Changes

- Combat actions wrap, initiative scrolls separately, and details occupy a full
  column on smaller screens. Damage/healing fields adapt to available space.
- Map and fullscreen toolbars wrap; movement controls no longer overlap the
  movement summary. Turn order scrolls horizontally. Pan/zoom buttons are 44px.
- Condition and add-combatant dialogs receive initial focus, contain Tab navigation,
  close on Escape, and restore focus. Close controls have accessible names.
- Character and dashboard field labels are connected to their inputs. Session
  and planning fields reflow, and populated party rows wrap.
- Initiative preview and editing are keyboard operable. The skip link focuses
  content without changing the hash-router route.
- Saving a character at 0 HP now preserves 0 rather than restoring maximum HP.

## Browser checks

At 390, 820, and 1440px: populated dashboard, session form, character editor,
encounter setup, active combat, condition dialog, add-combatant dialog, battle map,
drawing toolbar, bestiary, spells, and origins were checked for horizontal page
overflow and controls extending beyond the viewport. None occurred in those states.
Combat was visually inspected at all three sizes. Fullscreen map was additionally
checked at 390 and 820px; the phone toolbar overflow found there was fixed.

Interactions exercised:

- Damage 5 then heal 3: sample character HP changed from 29 to 27.
- Apply Blinded alongside Poisoned; advance the turn from index 0 to 1.
- Condition dialog: Shift+Tab/Tab wrap, Escape closes, focus returns to opener.
- Search and add a monster: roster increased from 8 to 9.
- Edit/save a character name; save current HP as 0 and confirm persisted 0.
- Add the remaining three party members, edit initiative, start a five-combatant encounter.
- Select library entries and reach their matching detail panels on a phone.
- Map zoom to 125%, reset to 100%, pan/center controls, rotation to 90 degrees,
  fullscreen entry/exit, and Escape exit.
- Skip link preserves the route and focuses main content.

Observed data requests returned 200/304; no browser console errors were reported
in the checked session. TypeScript and production build passed. Vite still warns
about the application's large JavaScript bundle.

## Limits

No committed screenshot baseline exists: visual regression comparison is
inconclusive. These are Chromium emulation checks, not physical-device testing.
AI requests, all condition-duration variants, every editor state, closed drawing
effects, and physical touch-device gestures were not fully exercised. No complete automated accessibility audit,
screen-reader certification, or Core Web Vitals benchmark is claimed.

## Continuation: uploads, nested dialogs, and map interactions

Additional fixes:

- Custom creature forms and avatar croppers now participate in dialog focus
  handling. Closing a nested form returns focus to its launch control.
- Custom creature field labels are connected to inputs.
- The crop canvas fits narrow screens, preserves crop proportions on resize,
  supports pointer dragging and arrow-key positioning, and has a labelled zoom
  slider. The dialog scrolls on short screens.
- Cancelling a map pointer gesture no longer commits the hovered token position
  or spends movement. A reproduced cancellation previously moved one square and
  spent 5 feet; after the fix, both values stayed unchanged.
- Avatar preview styles use separate image/color properties to avoid React's
  background shorthand conflict warnings when applying a crop.

Additional checks in the same isolated context:

- Crop and nested-form sizing at 390, 820, and 1440px. Crop keyboard positioning,
  browser-driven drag, Save avatar, nested Escape, and opener-focus restoration.
- PNG fixture selection through the real input change handlers: avatar crop/save
  and an 800x600 map upload. This tests processing/storage, not the native OS picker.
- Create and persist `QA Courtyard Sentinel` through the nested custom form.
- Synthetic pointer sequences for completed/cancelled token drags and an open
  four-point drawing stroke. These are handler-level browser checks, not claims
  of physical touchscreen coverage.
- A second `/projector` tab in the same isolated context received tokens, drawing
  geometry, and map changes. Projector-originated movement reached the DM store
  and updated movement spent. Switching to the uploaded map displayed 800x600
  image dimensions in the projector.
- TypeScript and production build pass; the bundle-size warning remains.

## Command-board redesign — 2026-09-23

Continued from the preceding responsive work, using the requested ECC design
direction, interface refinement, frontend accessibility, and browser QA skills.
Tests used only `dm-command-board` and `dm-command-board-empty` isolated Chromium
contexts against the local Vite app. Existing user campaign storage was not used
or modified. No dependency, backend, authentication, or data-schema changes.

### Design and implementation

- Charcoal navigation and encounter header, warm parchment content, restrained
  brass reference/selection accents, and crimson active-turn/primary combat states.
  Serif encounter headings contrast with readable sans-serif text and tabular numbers.
- Initiative entries identify player characters, allies, enemies, current turn,
  selected previews, damaged creatures, and zero-HP enemies with text. Non-player
  HP and AC are visible together; existing player-stat privacy is preserved.
- Combatant details precede the roster on small screens and in keyboard order.
  Selecting a preview focuses and scrolls to its details on small screens. Preview
  headings no longer incorrectly announce an active turn. Per-target input drafts
  reset when switching combatants.
- Combatant/map management and lengthy actions/reference sections can collapse.
  End turn remains prominent. Dashboard active encounters get a direct Continue
  combat action, while campaign search/connections can collapse.
- Encounter cards wrap, setup has a compact readiness summary, and combat,
  setup, and map-header controls have 44px minimum targets. Touch dashboard and
  character-editor buttons also receive minimum target sizing.
- Added accessible names to character/monster ability and movement inputs,
  monster saving-throw overrides, spell filters, setup searches, condition removal,
  and initiative/health controls. Movement toggle labels no longer wrap two inputs.
- Initiative editing uses a native button in the detail panel. Condition selection
  exposes pressed state and a checkmark; condition descriptions support tap/keyboard
  disclosure and Escape dismissal as well as hover. Turn changes have a polite
  announcement, and the bestiary loading message is a status region.

### Browser coverage for this pass

Layout, content fit, and scrolling checks at **390, 820, and 1440px** covered:

- Active combat with 18 combatants, long names, an ally, damaged and defeated
  enemies, and an explicit Unconscious condition.
- Populated and empty dashboards, encounter setup, character editing, custom
  monster dialogs, bestiary list/detail layout, and battle-map controls.
- No horizontal page/main-content overflow was observed in these checked states.
  Desktop combat columns scroll independently; phone reference expansion also fits.

Interactions exercised (not every interaction repeated at every width):

- Phone: damage 7 and heal 3 changed sample monster HP from 66 to 62; apply Poisoned;
  advance a turn; open/close condition descriptions; expand combat reference;
  select long-name ally/enemy previews and confirm focus/scroll destination.
- Condition dialog: initial focus, Shift+Tab/Tab boundary wrapping, apply and opener
  focus restoration on phone; Escape and restoration also checked on desktop.
- Tablet: edit initiative through the detail control. Desktop: primary-action
  hover changes to the intended darker crimson.
- Dashboard campaign-search expansion and Continue combat navigation.
- Setup: empty/disabled start state, add four characters and a monster, then start
  a five-combatant encounter. Setup button dimensions checked at all three widths.
- Character editor: save changed notes and confirm persisted content and unchanged
  0 HP. Accessible-name probes returned no unnamed visible inputs/selects after fixes.
- Monster dialog: fits all three widths with internal scrolling; Escape restores
  focus to + Custom. Visible-field name probe is clear after fixes.
- Phone bestiary selection updates the matching detail heading.
- Map rotation by button and keyboard changed 0→90→0 degrees. Map-header controls
  measure at least 44×44 after the final fix; keyboard focus has a visible 2px outline.
- A simulated isolated SRD-loading state displays “Loading SRD data…” distinctly;
  resetting it and loading the real local data succeeds. This is a presentation
  check, not a slow-network/end-to-end loading benchmark.

Palette contrast calculations: main text 16.41:1; muted text on parchment 5.14:1;
sidebar secondary text 9.19:1; primary combat action 8.42:1; active-state text
11.71:1. These are sampled design-token pairs, not an exhaustive contrast audit.
Reduced-motion CSS disables/slows transitions globally; the media rule was
inspected in-browser, not exercised through an OS reduced-motion setting.

Observed local data requests returned 200/304. The checked browser session had
no reported console errors/warnings. Final `npm run build:typecheck` passed both
TypeScript and Vite production build (106 modules). Vite's >500kB chunk warning
remains; the main bundle is approximately 994kB, 252kB gzip.

### Limits and remaining behavior

- Before/after screens were inspected, but screenshot capture was intermittent:
  desktop and phone combat and a tablet encounter list were captured; a later
  tablet combat capture timed out. There is no committed screenshot baseline.
  Automated visual-regression comparison is **INCONCLUSIVE**.
- No complete axe audit, screen-reader pass, physical touch-device test, or Core
  Web Vitals benchmark. Not every nested editor, condition-duration variant,
  loading/error path, or AI/projector workflow was retested in this design pass.
- Concentration has no dedicated combatant tracker in the current data model;
  existing spell concentration metadata remains unchanged. Combat Notes remains
  the existing placeholder; character notes and campaign material are preserved.
## Paste stat-block importer — 2026-09-23

### Scope and strategy

- Added **Paste stat block** to Bestiary and Allies & Summons without replacing
  the existing custom editor. The importer reuses its feature-section editor and
  each library's existing stat-block renderer. It uses existing store actions;
  no persistent schema, backend, authentication or dependency changes.
- Deterministic local parsing: bounded normalization, section/header recognition,
  extraction into an unsaved string-valued draft, validation, then pure conversion
  to the existing Monster model. No LLM, network lookup, spell matching or inferred
  attack automation. Named ECC parsing/testing/frontend/accessibility/security/QA
  skills informed this implementation.
- Limits: 50,000 characters, 2,000 normalized nonempty lines, 4,000 characters per
  normalized line. Oversized paste is rejected rather than silently truncated.
  Edited drafts are limited to 150,000 serialized characters.
- Unknown required stats remain blank. Initiative and passive Perception must be
  entered when missing, to prevent the existing ally normalizer supplying defaults.
  Ability modifiers are explicitly derived from reviewed scores, not confused with
  saving-throw bonuses. Unsupported text requires confirmation to retain as an
  **Import notes** trait (the existing model has no generic notes field).

### Tests actually performed

`npm run test:statblock` (Node 24.15.0 native TypeScript stripping): **15 tests pass**.
Fixtures are original synthetic creatures, not copied commercial stat blocks.
Tests cover 2014 horizontal/vertical ability layouts; labelled 2024 MOD/SAVE rows;
long names; wrapped actions; spellcasting; bonus/reaction/legendary sections;
hover/burrow movement; Markdown/bullets/Unicode minus signs; missing fields;
duplicate/conditional/alternative numbers; unsupported lair actions and combined
immunities; empty/oversized/long-line input; multiple recognizable creatures;
HTML-like content; prototype-property names; invalid edits; pure conversion and
feature-copy isolation. Regression tests were observed failing before their fixes.
The command requires a Node version supporting native TypeScript stripping;
older Node versions were not tested. No Vitest/RTL dependency was introduced.

ECC Chrome DevTools used only isolated context `stat-block-import-qa` with synthetic
records. User browser contexts and saved campaigns were not modified.

| Width | Monsters | Allies & Summons | Layout checks |
| --- | --- | --- | --- |
| 390px | Parse → edit HP/name → preview → save | Same workflow | No page/dialog horizontal overflow; stacked review; footer reachable by internal scrolling |
| 820px | Same workflow | Same workflow, plus complex spellcaster review | No overflow; two-column fields and stacked preview |
| 1440px | Same workflow | Same workflow | No overflow; side-by-side editor/preview |

The workflow matrix used DOM-driven inputs/clicks in the real React app with touch
emulation enabled across widths to preserve draft state. A separate 1440px
non-mobile/non-touch dialog-open check passed. This is not a physical-device test.
Each matrix run checked no storage writes before save, exactly one new record after
two immediate save clicks, edited HP persisted, and all existing library records
remained byte-for-byte equal. A same-name monster save required duplicate consent
and created a distinct ID. Duplicate warnings were also checked in Allies.

Additional browser checks:

- Back to paste → decline reparse → return retains edited HP.
- Empty input announces an alert. Incomplete creature shows 12 invalid fields and
  disables save. Cancel closes the draft and leaves localStorage unchanged.
- Initial dialog focus, real Tab/Shift+Tab boundary wrapping, Escape on an empty
  dialog, and restoration to the launch button passed. Review heading receives
  focus. Labels and error associations are present; no unnamed visible form inputs
  were found in the checked review. `summary` is included in the dialog focus trap.
- Importer buttons measured at least 44×44 after fixing remove/close widths.
  Checkbox labels provide at least 44px-high clickable rows. Screenshots inspected:
  phone preview/footer, tablet review header/fields, desktop long-name preview.
- Pasted `<img ... onerror=...>` remained literal preview text: no image element,
  handler execution or request to the embedded URL. Parser contains no fetch/eval,
  raw-HTML rendering or persistence calls. Security regression rejects inherited
  object-property names as section keys; regex work is bounded by input limits.
- No browser console errors observed; two existing React Router future-flag
  warnings remain. Production build retains Vite's existing large-chunk warning.

### Verification and limits

- `npm run build:typecheck`: TypeScript and Vite production build passed (108
  modules, approximately 1,014kB main bundle / 259kB gzip).
- Common English line-oriented layouts only, not arbitrary-format accuracy.
  Scrambled PDF columns, unlabeled number grids, non-English text and obscure
  homebrew headings may need manual corrections. Recognizable multiple headers
  are blocked; detecting every possible concatenated format is not guaranteed.
- Combined 2024 Immunities, lair/mythic/regional material, armor/initiative
  qualifiers and other unparsed content remain visible for review/notes retention.
  Spellcasting is descriptive only. Original source is available while reviewing;
  after saving, extracted fields and confirmed notes persist, not a new raw-source
  database field. Formatting markers are normalized; rules are not paraphrased.
- No screen-reader/axe audit, exhaustive contrast audit, physical touch test,
  storage-quota failure simulation, Electron packaging run or full campaign/combat
  regression. Library record preservation was tested; populated campaign workflows
  were not exercised during this importer pass. No new motion was introduced.
- Screenshots were inspected manually; no committed visual baseline or automated
  visual regression comparison exists. Visual regression remains **INCONCLUSIVE**.
