---
name: react-native-feature-implementation
description: >
  Orchestrator skill for React-Native feature implementation. Runs the Android bridge step
  followed by the TypeScript step. Use this when you want to do both in one command.
  If you only need one layer, invoke the focused skills directly:
  - Android Kotlin bridge only: react-native-android-bridge-implementation
  - TypeScript layer only: react-native-ts-implementation
  Requires: a ticket ID (MOEN-XXXXX), a contract branch in 'mobile-sdk-contracts', a target
  Android BOM version, and the plugin-base PR URL. Run AFTER plugin-base-feature-implementation.
  Do NOT use for iOS-only features, JS-only changes, or before plugin-base changes exist.
parameters:
  - name: "ticket_id"
    description: "JIRA ticket ID, e.g. 'MOEN-44072'. Extracted from command text if not supplied."
    optional: true
  - name: "feature_description"
    description: "Natural language description of the feature. E.g. 'JWT authentication parity'."
  - name: "contract_branch"
    description: "Branch in 'mobile-sdk-contracts' with the feature contract."
  - name: "android_bom_version"
    description: "Target MoEngage Android BOM version. E.g. '2.2.1'."
  - name: "plugin_base_pr_url"
    description: "URL of the android-plugin-base PR from plugin-base-feature-implementation."
---

## Overview

This skill is a **two-step orchestrator**. It runs:

1. **`react-native-android-bridge-implementation`** — Android Kotlin bridge (BridgeHandler, arch
   bridges, Package, EventEmitterImpl, PayloadGenerator, Constants, build.gradle)
2. **`react-native-ts-implementation`** — TypeScript layer (NativeSpec, models, enums,
   PayloadBuilder, PayloadParser, JsonToModelMapper, Handler, PublicApi, index, package.json,
   podspec)

Both skills operate on the same `feature/<contractSuffix>` branch in `React-Native` and
produce a single PR covering both layers.

**Full pipeline:**
```
plugin-base-feature-implementation
    ↓
react-native-android-bridge-implementation  (Step 2a)
    ↓ (asks user before proceeding)
react-native-ts-implementation              (Step 2b)
```

---

## Execution

### Step 1 — Run Android bridge

Follow every phase of **`react-native-android-bridge-implementation`** in full:
- Phase 0: Clarify inputs / extract ticketId
- Phase 1: Derive all identifiers
- Phase 2: Read contracts and build method table
- Phase 3: Scaffold Android bridge files and commit
- Phase 4: Push and create PR → capture `androidBridgePrUrl`
- Phase 5: Report (abbreviated — full report comes at the end)

Do **not** ask the user whether to continue — this orchestrator always proceeds to Step 2.

### Step 2 — Run TypeScript layer

Follow every phase of **`react-native-ts-implementation`** in full:
- Phase 0: Clarify inputs (reuse all identifiers already derived in Step 1)
- Phase 1: Identifiers are already known — skip re-derivation
- Phase 2: Contracts are already read — reuse the method table from Step 1
- Phase 3: Scaffold TypeScript files and commit to the same branch
- Phase 4: Push additional commit to the existing branch; update the existing PR (do **not**
  create a second PR — add a new commit and update the PR body to mention TypeScript was added)
- Phase 5: Full report combining both steps

### Combined PR body

When updating the PR body after Step 2, replace it with:

```
## Summary
- Android: BridgeHandler + new/old arch bridges + EventEmitterImpl + PayloadGenerator
- TypeScript: TurboModule spec, models, enums, PayloadBuilder, PayloadParser, Handler, PublicApi
- Android BOM version: <android_bom_version>

## Related PRs
- android-plugin-base: <plugin_base_pr_url>

## Contract
Branch: `<contract_branch>` in mobile-sdk-contracts

## Methods
| Method | Type | Android | TypeScript |
|---|---|---|---|
<combined table rows>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## Final Report

Print:
1. PR URL
2. Combined method table (name, type, Android delegate, TS return)
3. All `// TODO` items from both steps
4. Complete list of all files created or modified (Android + TypeScript)

---

## Focused Skills (use these when you only need one layer)

| When | Use |
|---|---|
| Android bridge only | `react-native-android-bridge-implementation` |
| TypeScript only (bridge already done) | `react-native-ts-implementation` |
| Both layers at once | `react-native-feature-implementation` (this skill) |

---

## Error Handling Rules

Apply the error handling rules from both focused skills. If the Android bridge step fails,
stop and do not proceed to the TypeScript step — report the error and the local branch state.
