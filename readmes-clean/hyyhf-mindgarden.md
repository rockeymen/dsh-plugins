![Mind Garden Today after a real user saved an open question](assets/mind-garden-real-today.png)

# Mind Garden

  A warm, private place to reflect inside DeepSeek Harness.
  Real companion dialogue, user-governed memory, cinematic photo particles, and a living 3D constellation—without giving the model ownership of your story.

Mind Garden is an installable companion and private-reflection workspace for the DeepSeek Harness Web profile. Ordinary conversation remains a Harness Session while the garden adds encrypted personal records, governed memory, original Fun Garden migration, nine connected reflection spaces, and expressive 3D and photo-particle scenes.

It reuses Harness providers, credentials, storage, attachments, Remotes, and plugin lifecycle. It does not fork or copy the DeepSeek Harness application.

### Enter the garden in three commands

```sh
dsh plugin --profile web add git+https://github.com/hyyhf/mindgarden.git
dsh plugin --profile web why @deepseek-ai/dsh-mind-garden
dsh web
```

Requires DeepSeek Harness `0.1.1-rc.1` or newer, `pnpm` on `PATH`, and a configured model provider. Photo observation uses the official DeepSeek route and requires a Harness-managed `DEEPSEEK_API_KEY`. See [Install](#install) for profile requirements, updates, and local development.

## A real journey, not a mockup

The sequence below comes from one fresh Harness Web session. A user enters Mind Garden, sends a reflective message to `deepseek-v4-flash`, saves an open question, completes the constellation ritual, switches to the compact layout, admits a photograph, and asks `deepseek-v4-flash-vision-exp` to observe it. The tests assert the provider and model recorded in the durable events before saving these screenshots.


    ![A real DeepSeek V4 Flash companion reply](assets/mind-garden-real-companion.png)1 · A real companion turnThe response passes through the shipped dialogue and safety plugins, then appears in the ordinary Harness conversation.
    ![The real saved question shown on Today](assets/mind-garden-real-today.png)2 · The result becomes usefulThe user saves a question through the UI and sees it become a truthful station in the morning courtyard.


    ![The completed constellation ritual](assets/mind-garden-real-constellation.png)3 · A constellation with provenanceSelf-authored traits and the open question become distinguishable nodes around the current self.
    ![A real DeepSeek V4 Flash Vision Exp observation](assets/mind-garden-real-photo-story.png)4 · A grounded photo observationThe vision model describes visible details and returns an explicitly unconfirmed observation beside the live particle scene.


  ![The same real user question in the compact Harness shell](assets/mind-garden-real-mobile.png)
  <sub>The same session in a 390 px viewport; the main actions and the Harness composer remain reachable.</sub>

## Conversation posture, at the point of use

At rest, Mind Garden adds only one compact control to the Harness composer toolbar: its icon and the current posture. Opening it reveals the two dialogue postures and five support intents in a focused, non-modal panel—without placing a full-width control strip above the conversation.


    ![Mind Garden dialogue posture popover opened from the desktop Harness composer toolbar](assets/mind-garden-demo-dialogue-posture.png)Precise when openedThe panel stays anchored to the compact composer control and leaves the active conversation readable.
    ![Mind Garden dialogue posture popover in a real 390 pixel Harness viewport](assets/mind-garden-demo-mobile-dialogue-posture.png)Reachable at 390 pxThe same controls fit the viewport and preserve the send path.


Posture and support intent apply only to the current Session. A successful change closes the panel; a failed change keeps it open with a localized status. Outside click and <kbd>Esc</kbd> dismiss it, keyboard focus returns to the trigger, and backup, restore, migration, and key rotation remain in Garden settings. Both frames above were captured from the installed plugin after a real Harness conversation turn.

## A garden that leaves conclusions with you

Mind Garden is for conversations that benefit from patience, continuity, and user authority rather than another task dashboard. Its design follows four rules:

- **Companion, not clinician** — the agent can listen, reflect, and ask one useful question, but does not diagnose or impersonate professional care.
- **The user owns every conclusion** — extracted memories, inferred traits, Star Observer cards, principle revisions, and relationship conflicts stay provisional until the user decides.
- **Private records stay structurally private** — memories, reflections, star data, and story metadata are authenticated ciphertext at rest; model calls receive only the bounded material authorized for that exact action.
- **A real Harness plugin** — the bundle is a manifest-declared Web-profile add-on. It reuses Harness agents, Sessions, providers, credentials, attachments, Remotes, loader rows, and the official client shell.

Compared with the original Fun Garden implementation, this edition adds evidence-bound memory governance, crash-recoverable key rotation, authenticated non-overwriting restore, deterministic safety gates, accessible WebGL fallbacks, and package-level extension boundaries. It keeps the expressive constellation and photo-particle identity while adopting the restrained spacing, icon language, and interaction grammar of DeepSeek Harness.

## Nine spaces, one garden

The persistent garden rail exposes nine spaces:

### Space · What it is for
- **Space**: **Today** · **What it is for**: A quiet daily threshold, immutable mood and energy check-ins, encrypted journals, and an orbit of current reflections.
- **Space**: **Concerns** · **What it is for**: A private concern basket with optional dates, completion, editing, and explicit conversion into a journal or conversation draft.
- **Space**: **Calendar** · **What it is for**: A projection of verified check-ins, journals, concerns, principles, experiments, and open questions; it creates no hidden analysis.
- **Space**: **Photo Stories** · **What it is for**: Verified image admission, encrypted story copy, configurable GPU particles, explicit visual observation, and story-owned follow-up dialogue.
- **Space**: **Memory** · **What it is for**: Manual and model-assisted proposals, evidence review, sensitivity and recall controls, conflict resolution, revision history, and deletion.
- **Space**: **Growth** · **What it is for**: Reality experiments and append-only observations without success scores or silent model judgment.
- **Space**: **My Constellation** · **What it is for**: A resumable first-observation ritual, private profile, self-reported stars, evidence-scoped Star Observer cards, calibration, and a live 3D field.
- **Space**: **Life Review** · **What it is for**: Week, month, and year material snapshots plus saved reviews whose original sources remain inspectable even after later changes.
- **Space**: **My Philosophy** · **What it is for**: Contemplation notes, accepted notes, versioned principles, and open questions that can remain unresolved.

## The complete live gallery

Every desktop image below comes from the real DeepSeek Harness Web composition. The deterministic gallery scenario writes fictional, repository-owned records through the installed Host services, admits the generated demo photograph through Harness attachments, opens the working Client space, and captures the rendered result. No personal material or static UI mockup is used.

### Entry and disclosure

![Mind Garden entry disclosure running inside the DeepSeek Harness session gateway](assets/mind-garden-demo-entry.png)

The entry keeps model disclosure, profile storage, emergency limits, and the user's confirmation authority visible before either companion posture can activate.

### Today

![Mind Garden Today space with the warm orrery and live reflection records](assets/mind-garden-demo-today.png)

Today combines the tactile orrery, current question, saved review, daily check-in, and journal path without turning the opening into a generic dashboard.

![The real Today workbench after a mood and energy check-in](assets/mind-garden-demo-today-practice.png)

The second frame shows the result of opening the daily workbench: a complete check-in, journal editor, retrieval consent, and the records already created for the day.

### Concerns

![Mind Garden Concerns space after a private concern was scheduled](assets/mind-garden-demo-concerns-detail.png)

Concerns keeps each item private and inert until the user edits it, completes it, converts it into a journal, or deliberately places it in the Harness composer.

### Calendar

![Mind Garden Calendar projecting verified records for August 2026](assets/mind-garden-demo-calendar.png)

Calendar projects the verified check-in, journal, concern, principle, experiment, and open question into one month and one selected-day ledger; visual density does not create synthetic activity.

### Photo Stories

![Mind Garden Photo Story library after a photograph was admitted](assets/mind-garden-demo-photo-library.png)

The light archive preserves the verified original, title, story note, and collection state before the scene opens.

![Mind Garden Photo Story running the warm generated photograph through the particle editor](assets/mind-garden-demo-photo-story.png)

The fictional rain-night still life is a repository-owned ImageGen fixture with committed prompt provenance. Harness attachment admission, verified image reads, bounded WebGL particles, presets, re-composition, original-image viewing, story editing, and observation disclosure remain live product controls.

### Memory

![Mind Garden Memory showing one user-confirmed support preference](assets/mind-garden-demo-memory-detail.png)

The record shows its confirmed state, source count, scope, sensitivity, recall policy, history, edit path, composer handoff, and deletion control instead of presenting model familiarity as an irreversible profile.

### Growth

![Mind Garden Growth showing a reality experiment and its append-only observation](assets/mind-garden-demo-growth-detail.png)

Growth records a hypothesis, one concrete action, and what happened. It preserves the observation without a score, streak, or model-assigned success verdict.

### My Constellation

![Mind Garden Constellation rendering user-authored stars, questions, and reviews in WebGL](assets/mind-garden-demo-star-map.png)

The constellation is not a decorative personality score. Its center is the current self; self-reported traits, questions, and review material remain distinguishable. Star Observer calls are explicit and permission-bounded, while the adjacent node list preserves the same information without relying on canvas pixels.

### Life Review

![Mind Garden Life Review with one saved, source-bound weekly review](assets/mind-garden-demo-life-review.png)

Life Review places the verified period, source count, lifecycle state, and user-authored interpretation on one chronological plane. Later source changes cannot silently rewrite the preserved review.

### My Philosophy

![Mind Garden Philosophy showing a confirmed contemplation and adopted principle](assets/mind-garden-demo-philosophy-detail.png)

Philosophy keeps confirmed contemplation, inert proposal, and adopted principle states structurally separate. Formation context, direct quote, counterexample, scope, status, and complete versions stay user-governed.

### Garden settings

![Mind Garden profile settings opened over the real DeepSeek Harness composition](assets/mind-garden-demo-settings.png)

Settings provide a second path to the same Session posture and support intent while keeping encrypted profile backup, authenticated restore, original Fun Garden migration, and crash-recoverable key rotation in one focused sheet. The everyday posture control remains in the composer toolbar; Harness still owns providers, models, Sessions, and attachments.

### Mobile composition

  ![Mind Garden Today in the compact Harness shell](assets/mind-garden-demo-mobile-today.png)
  ![Mind Garden photo particles in the compact Harness shell](assets/mind-garden-demo-mobile-photo-story.png)
  ![Mind Garden constellation in the compact Harness shell](assets/mind-garden-demo-mobile-star-map.png)

The same plugin participates in the compact Harness shell. Navigation collapses, dense controls simplify, canvas work is bounded, and the fixed Harness composer remains available. The posture panel measures the viewport and flips above or below its trigger instead of creating a wide mobile bar. Reduced-motion and non-WebGL paths keep records usable without the visual scene. The integration gallery also captures compact entry, check-in, concerns, calendar, memory, growth, review, philosophy, and settings states under `assets/mind-garden-demo-mobile-*.png`.

## Install

Prerequisites:

- DeepSeek Harness `0.1.1-rc.1` or newer with a working `web` profile;
- `pnpm` on `PATH` for profile-forwarded plugin commands;
- at least one configured Harness model provider;
- a DeepSeek credential available to Harness as `DEEPSEEK_API_KEY` for Photo Story observation, which is pinned to `deepseek-official` / `deepseek-v4-flash-vision-exp`;
- a durable credentials and storage composition, which the standard Web profile already supplies.

Install the bundle directly from GitHub, confirm that the profile resolved the package, then start Web:

```sh
dsh plugin --profile web add git+https://github.com/hyyhf/mindgarden.git
dsh plugin --profile web why @deepseek-ai/dsh-mind-garden
dsh web
```

The repository includes the compiled Host modules and browser bundle, so installation does not build or copy the DeepSeek Harness source tree. To update to the latest commit later:

```sh
dsh plugin --profile web update @deepseek-ai/dsh-mind-garden
```

For local development, clone this repository and install the checkout from its root. DeepSeek Harness anchors `add .` to the invoking directory:

```sh
git clone https://github.com/hyyhf/mindgarden.git
cd mindgarden
npm test
dsh plugin --profile web add .
```

The bundle's [`cordis.patch.yml`](cordis.patch.yml) inserts every Host and Web row through the normal profile layer mechanism.

## First session

1. Configure the desired provider and model for ordinary companion dialogue in Harness Models. Provider credentials remain owned by Harness; Mind Garden has no API-key field. Explicit Photo Story observation uses the bundle's `deepseek-official` / `deepseek-v4-flash-vision-exp` route.
2. Create a blank Session and select the shipped **Mind Garden** preset when it is available from the active roster.
3. Choose **Enter Mind Garden** before the first message.
4. Read the storage, provider, and confirmation boundaries, then select **Serenity** for gentle presence or **Clarity** for more structured reflection.
5. After entry, use the compact posture control in the composer toolbar whenever the current Session needs a different posture or support intent.
6. Use the conversation normally. The **Mind Garden** tab opens the nine-space workspace, and garden settings holds backup, restore, and key rotation.

The bundle can be activated with another preset, but that preset's persona and tools still participate. Only the Mind Garden preset supplies the intended tool-free companion persona. External preset discovery is a Harness roster boundary; a separately installed npm bundle does not mutate another installation's roster.

## Architecture

One installable package composes eleven independently testable plugins:

### Loader row · Package · Responsibility
- **Loader row**: `mind-garden-vault` · **Package**: [`mind-garden-vault`](packages/mind-garden/mind-garden-vault) · **Responsibility**: AES-256-GCM private-record storage and journaled key rotation.
- **Loader row**: `mind-garden-core` · **Package**: [`mind-garden-core`](packages/mind-garden/mind-garden-core) · **Responsibility**: Event-sourced activation, dialogue posture, support intent, and disclosure acceptance.
- **Loader row**: `mind-garden-skills` · **Package**: [`mind-garden-skills`](packages/mind-garden/mind-garden-skills) · **Responsibility**: Fifteen Harness-native companion, continuity, memory-governance, practice, philosophy, and Observer skills with explicit invocation and disclosure.
- **Loader row**: `mind-garden-memory` · **Package**: [`mind-garden-memory`](packages/mind-garden/mind-garden-memory) · **Responsibility**: Governed long-term memory lifecycle, extraction, bounded recall, and encrypted audit.
- **Loader row**: `mind-garden-media` · **Package**: [`mind-garden-media`](packages/mind-garden/mind-garden-media) · **Responsibility**: Verified photo stories, particle configuration, explicit visual observation, and story dialogue.
- **Loader row**: `mind-garden-reflection` · **Package**: [`mind-garden-reflection`](packages/mind-garden/mind-garden-reflection) · **Responsibility**: Check-ins, journals, concerns, experiments, principles, questions, reviews, and projections.
- **Loader row**: `mind-garden-star-map` · **Package**: [`mind-garden-star-map`](packages/mind-garden/mind-garden-star-map) · **Responsibility**: Ritual, private profile, traits, evidence-bound Observer cards, and calibration.
- **Loader row**: `mind-garden-dialogue` · **Package**: [`mind-garden-dialogue`](packages/mind-garden/mind-garden-dialogue) · **Responsibility**: Stable model-visible companion policy and authorized context injection.
- **Loader row**: `mind-garden-safety` · **Package**: [`mind-garden-safety`](packages/mind-garden/mind-garden-safety) · **Responsibility**: Deterministic input triage, local support responses, output buffering, and publication checks.
- **Loader row**: `mind-garden-portability` · **Package**: [`mind-garden-portability`](packages/mind-garden/mind-garden-portability) · **Responsibility**: Encrypted backup, restor