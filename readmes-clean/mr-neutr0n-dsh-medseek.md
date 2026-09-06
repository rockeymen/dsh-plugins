# MedSeek

Clinical documentation and reference tools for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), as an installable `dsh` plugin bundle.

Built for the daily work of **physicians, advanced practice providers, nurses, and residents**: rounding notes, handovers, admissions, discharges, patient instructions, and cited answers from FDA labeling, MedlinePlus, PubMed, and ClinicalTrials.gov.

MedSeek drafts; a named clinician reviews everything before it is used. It is not a medical device.

## GUI integration

The bundle does not just ship tools; it takes over its slice of the dsh web GUI through sanctioned plugin surfaces only:

### Surface · What you see
- **Surface**: Theme · **What you see**: Warm-paper light and espresso dark palettes across 85 platform tokens, including markdown citation chips, code banners, composer input, and scrollbars
- **Surface**: Polish layer · **What you see**: Solid-core keyboard focus rings (3:1+ on every surface), teal selection tint, themed scrollbars, and a global reduced-motion kill switch
- **Surface**: Brand badge · **What you see**: A small ring mark on the frame overlay layer; decorative, click-through safe
- **Surface**: Settings card · **What you see**: Guard mode (block / ask / off) and the screened-tool list editable in Settings > Plugins, with revision-fenced writes that apply live
- **Surface**: Tool results · **What you see**: Lookup tools render as native search cards with structured source lists; label lookups render as fetch summaries pointing at DailyMed

Accessibility posture: every text pair is asserted in CI against WCAG 2.x AA ratios and APCA Lc gates (75 body / 60 general) in both modes. APCA remains draft guidance, so compliance claims are WCAG 2.2 AA only.

## Why

Ambient scribes capture encounters. They do not structure a note against a checklist, insist on pending results at discharge, force explicit allergy statements on admission, score patient-instruction readability, or attach a citation and retrieval date to every fact they surface. That post-hoc, deterministic layer is what MedSeek adds, locally and without EHR access, on top of any dsh deployment.

Design rules, enforced in code:

- **Drafts, never directives.** Every drafting tool returns structure plus a gap list under a review banner. Nothing prescribes care.
- **Cited or silent.** Lookup results carry source, identifier, link, and retrieval date. An empty result says so instead of filling the gap.
- **Terms and codes only leave the building.** A PHI guard screens every network-tool call for identifiers before it runs; the destination allowlist has exactly nine hosts.
- **Accountable by construction.** Every tool execution appends a content-free receipt - tool name, timestamp, error flag, and SHA-256 digests of arguments and result, never the content itself - to an append-only, hash-chained file, so compliance can prove what ran without a second copy of the chart.
- **Structure, not judgment.** Documentation checklists check presence. No diagnosis ranking, no severity scoring, no billing-code-level suggestion, no interaction checking.

## Tools (19)

### Tool · Answers · Basis · Network
- **Tool**: `deidentify_text` · **Answers**: Strip HIPAA Safe Harbor identifiers, typed placeholders · **Basis**: 45 CFR 164.514(b)(2) categories · **Network**: no
- **Tool**: `sbar_handover_draft` · **Answers**: SBAR or I-PASS structure, then a gap list · **Basis**: IHI SBAR; Starmer, NEJM 2014 · **Network**: no
- **Tool**: `discharge_summary_draft` · **Answers**: Skeleton with pending results required · **Basis**: Joint Commission components; Kripalani, JAMA 2007 · **Network**: no
- **Tool**: `progress_note_draft` · **Answers**: SOAP or APSO daily/follow-up note, MDM-aware fields · **Basis**: Weed, NEJM 1968; AMA CPT E/M elements · **Network**: no
- **Tool**: `admission_history_physical_draft` · **Answers**: Admission H&P, allergies and reconciliation explicit · **Basis**: Joint Commission 24-hour H&P; AMA E/M hospital care · **Network**: no
- **Tool**: `patient_instructions_draft` · **Answers**: Plain-language scaffold plus readability grade · **Basis**: Flesch-Kincaid, SMOG; AHRQ target · **Network**: no
- **Tool**: `note_completeness_check` · **Answers**: Missing sections, error-prone abbreviations, PENDING markers · **Basis**: JC Do Not Use; ISMP lists · **Network**: no
- **Tool**: `drug_label_lookup` · **Answers**: Verbatim FDA label sections, DailyMed link · **Basis**: openFDA label, RxNorm · **Network**: yes
- **Tool**: `patient_education_lookup` · **Answers**: NLM-curated handouts in English or Spanish · **Basis**: MedlinePlus Connect, Clinical Tables · **Network**: yes
- **Tool**: `pubmed_evidence_search` · **Answers**: Citations with abstracts, reproducible query · **Basis**: NCBI E-utilities · **Network**: yes
- **Tool**: `trial_search` · **Answers**: Studies with NCT number, status, phase, sponsor · **Basis**: ClinicalTrials.gov v2 · **Network**: yes
- **Tool**: `pubmed_id_convert` · **Answers**: PMID/PMCID/DOI batch conversion · **Basis**: PMC ID Converter · **Network**: yes
- **Tool**: `pubmed_related_articles` · **Answers**: Related PMIDs via citation graph · **Basis**: NCBI ELink · **Network**: yes
- **Tool**: `europe_pmc_search` · **Answers**: Biomedical hits with OA status · **Basis**: Europe PMC (EMBL-EBI) · **Network**: yes
- **Tool**: `europe_pmc_fulltext` · **Answers**: OA section snippets via fullTextXML · **Basis**: Europe PMC fullTextXML · **Network**: yes
- **Tool**: `fda_adverse_event_search` · **Answers**: FAERS reports by product · **Basis**: openFDA FAERS · **Network**: yes
- **Tool**: `fda_recall_search` · **Answers**: Enforcement recalls by product · **Basis**: openFDA Enforcement · **Network**: yes
- **Tool**: `fda_application_lookup` · **Answers**: Drugs@FDA apps, counts, classes, generics · **Basis**: openFDA Drugs@FDA · **Network**: yes
- **Tool**: `clinical_trial_lookup` · **Answers**: Details, eligibility, investigators, endpoints · **Basis**: ClinicalTrials.gov v2 extended · **Network**: yes

Draft tools never invent clinical facts: called once they return the template, called again with `filled_fields` they validate and assemble the draft. Lookup tools display source material verbatim where the source is text.

## Architecture

```mermaid
flowchart LR
    subgraph dsh["DeepSeek Harness (host)"]
        WEB[Web GUI]
        TOOLS[Tool registry]
    end
    subgraph BUNDLE["dsh-medseek bundle"]
        PATCH[cordis.patch.ymlpersona + rows]
        HOST[medseek-tools19 tool definitions]
        GUARD[medseek-guardPHI egress screen]
        BRAND[medseek-brandtitle, favicon, tokens]
        AUDIT[medseek-audithash-chained receipts]
        CLIENT[client themeOwly-derived palette]
    end
    subgraph LOCAL["Local, deterministic"]
        T1[TemplatesSBAR I-PASS SOAP APSO H&P]
        T2[Safe Harbor engine]
        T3[Readability scorer]
    end
    subgraph API["Allowlisted reference APIs"]
        A1[eutils.ncbi.nlm.nih.gov / pmc.ncbi.nlm.nih.gov]
        A2[api.fda.gov / rxnav / dailymed]
        A3[medlineplus / clinicaltables]
        A4[clinicaltrials.gov]
        A5[www.ebi.ac.uk (Europe PMC)]
    end
    WEB --> PATCH --> HOST --> TOOLS
    HOST --> T1 & T2 & T3
    HOST -- arguments screened by --> GUARD
    HOST -- receipts on --> AUDIT
    HOST --> A1 & A2 & A3 & A4
    CLIENT --> WEB
```

One package, four host plugins (`medseek-tools`, `medseek-guard`, `medseek-brand`, `medseek-audit`) and one client plugin for theming, polish, the badge, and the settings card, composed by `cordis.patch.yml`. Install pins the whole bundle.

## Install

```sh
dsh plugin --profile web add dsh-medseek@0.1.3
```

Restart the web GUI or hard-refresh the tab, then confirm the layer:

```sh
dsh --profile web --dump-config   # expect "# == dsh-medseek"
```

If `dsh` is not on PATH:

```sh
npx -y --package @deepseek-ai/dsh@0.1.1-rc.2 dsh plugin --profile web add dsh-medseek@0.1.3
```

Uninstall with `dsh plugin --profile web remove dsh-medseek`. From a local checkout: clone, `pnpm install && pnpm verify`, then `dsh plugin --profile web add ./`.

## Quick start

Use synthetic text first. Never paste a real chart into a model provider that is not covered by your BAA.

**Round a patient.** Paste overnight events and vitals, then: "Draft today's SOAP note." The agent scaffolds with `progress_note_draft`, drafts each field from context, validates, and hands back a banner-marked draft plus its gap list.

**Hand over a shift.** "Turn these into an SBAR" (or "an I-PASS"). Same two-call pattern against `sbar_handover_draft`.

**Discharge a patient.** `discharge_summary_draft` refuses to pass while pending results are unowned. Pair it with `patient_instructions_draft` until readability hits the 6th-to-8th grade target.

**Answer with receipts.** "Boxed warning and contraindications for metformin" returns verbatim label sections, SPL set id, DailyMed link, retrieval date. Absence of an interactions section is reported as absence, never spun as safety.

**De-identify before sharing.** "Scrub this teaching snippet" replaces identifiers with typed placeholders and lists low-confidence spans for your review. It assists Safe Harbor de-identification; it does not certify it.

## Safety model

### Layer · Mechanism
- **Layer**: Output discipline · **Mechanism**: Draft banners on every artifact; next-step guidance in every result
- **Layer**: PHI egress · **Mechanism**: Guard denies (or escalates, per config) network calls whose arguments match high-confidence identifier patterns
- **Layer**: Audit trail · **Mechanism**: Every tool execution appends a content-free receipt (digests only, never text) to an append-only, hash-chained `medseek-audit.jsonl` in the dsh home; cross-process writer lock, tail verified before every append - a damaged file fails closed instead of restarting the chain
- **Layer**: Destination allowlist · **Mechanism**: Nine hosts, enforced in code before `fetch`; anything else throws
- **Layer**: Request hygiene · **Mechanism**: Lookups send terms, codes, and status filters only
- **Layer**: Regulatory posture · **Mechanism**: Self-mapped against the four non-device CDS criteria per tool in [docs/regulatory-checklist.md](docs/regulatory-checklist.md); informational and non-directive by construction

Known platform limits, documented rather than hidden: dsh persists tool arguments in local session logs with no deletion API, so treat `$DSH_HOME/sessions` as PHI storage; keep telemetry off. The sidebar and hero brand marks are MedSeek-owned (the official brand row is disabled by the bundle); details in Persona and presets above. Details on data flow: [docs/permissions-and-data.md](docs/permissions-and-data.md).

## Configuration

Optional NCBI and openFDA keys, timeouts, result caps, and the guard (`block`, `ask`, `off`) and audit (`on`, `off`) modes are documented in [docs/configuration.md](docs/configuration.md).

## Compatibility

###  · 
- dsh · tested against `@deepseek-ai/dsh` 0.1.1-rc.2
- Node · >= 22.19
- pnpm · >= 10

The `latest` dist-tag on several `@deepseek-ai/*` packages (`dsh-tools`,
`dsh-settings`, …) still points at an old `0.0.1-rc.1`; the bundle pins the
rc line deliberately.

## Persona and presets

MedSeek replaces the coding-agent persona in two places, because dsh applies
personas at two layers:

- **Deployment persona** (cordis.patch.yml): covers surfaces that mount no
  agent presets - headless runs and the TUI.
- **`medseek-clinical` agent preset**: every default web session joins an
  agent preset, and a preset persona shadows the deployment persona by
  design. MedSeek ships its own preset (the upstream `standard` composition
  with only the persona text replaced) and provisions it into
  `$DSH_HOME/.agent-presets/` on boot, so the clinical stance reaches web
  sessions while all standard tools remain mounted. The preset is
  deployment-owned: a locally edited copy is restored on the next boot.
  Sibling presets you author are never touched.

## Development

```sh
pnpm install
pnpm verify       # typecheck, tests (synthetic data only), bundle, declarations
pnpm test:mount   # pack the tarball into a scratch dsh profile and assert the layer mounts
pnpm test:persona # real-session check: default web session gets the clinical persona + full roster
pnpm eval         # regenerate eval/REPORT.md from the synthetic annotated corpus
```

CI mirrors this on every push: the unit suite on a Node matrix, the mount E2E against the pinned upstream, and the persona E2E against a stubbed model API. The deterministic claims (de-identification recall and precision, completeness detection) are measured over the fully synthetic annotated corpus in `eval/corpus` and reported in [eval/REPORT.md](eval/REPORT.md); CI gates the floors in `tests/eval.spec.ts`. See [CONTRIBUTING.md](https://github.com/Mr-Neutr0n/dsh-medseek/blob/main/CONTRIBUTING.md); issues and tests carry synthetic data only.

## Security

Private reports only via [GitHub private vulnerability reporting](https://github.com/Mr-Neutr0n/dsh-medseek/security/advisories/new). See [SECURITY.md](SECURITY.md).

## FAQ

**Is this a medical device?**
No. MedSeek displays and reorganizes information the clinician supplies, cites public reference sources, and produces drafts that require human approval. The four-criteria mapping per tool is maintained in [docs/regulatory-checklist.md](docs/regulatory-checklist.md).

**Can it replace our ambient scribe?**
No, and it does not try. Scribes capture audio in the room; MedSeek structures what already exists as text and looks things up with citations. They compose.

**Does it connect to Epic?**
No. There is no EHR read or write anywhere in the bundle. Everything arrives as pasted text the operator chose.

**Why no drug-interaction checker?**
NLM retired the free RxNav interaction API in January 2024. MedSeek quotes label sections verbatim and declines to pretend a replacement exists.

**Where does my data go?**
Nowhere automatically. Local tools make zero network calls. Lookup tools send terms and codes to the nine allowlisted hosts after the guard screens them. Model traffic goes wherever the operator pointed dsh, which is why the BAA warning sits at the top of this file.

**What clinicians is it for?**
Physicians, advanced practice providers, nurses, pharmacists, and residents who already run dsh. The operator installs it; the clinician reviews everything.