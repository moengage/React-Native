---
name: react-native-ts-implementation
description: >
  Implements the TypeScript layer for a React-Native MoEngage SDK feature.
  This is Step 2b of the React-Native feature pipeline — run AFTER
  react-native-android-bridge-implementation has completed (or is in review).
  Produces the TurboModule NativeSpec, model classes, enums, PayloadBuilder, PayloadParser,
  JsonToModelMapper, Handler, PublicApi, index, package.json, and podspec.
  Do NOT use before the Android bridge exists or for iOS-only features.
parameters:
  - name: "ticket_id"
    description: "JIRA ticket ID, e.g. 'MOEN-44072'. Extracted from command text if not supplied."
    optional: true
  - name: "feature_description"
    description: "Natural language description of the feature. E.g. 'JWT authentication parity'."
  - name: "contract_branch"
    description: "Branch in 'mobile-sdk-contracts' with the feature contract. E.g. 'MOEN-44072_jwt_contract'."
  - name: "android_bom_version"
    description: "Target MoEngage Android BOM version. E.g. '2.2.1'."
  - name: "plugin_base_pr_url"
    description: "URL of the android-plugin-base PR from plugin-base-feature-implementation."
  - name: "android_bridge_pr_url"
    description: "URL of the React-Native Android bridge PR from react-native-android-bridge-implementation."
---

## Overview

Implements the **TypeScript layer** inside the React-Native SDK repo (`React-Native`) for a
MoEngage feature whose Android bridge already exists (created by `react-native-android-bridge-implementation`).

**Prerequisite chain:**
1. `plugin-base-feature-implementation` — Android plugin-base module ✅
2. `react-native-android-bridge-implementation` — Android Kotlin bridge ✅
3. **`react-native-ts-implementation`** ← you are here

**Architecture standard:** Follow the **Cards module pattern** exactly for all TypeScript structure
and naming conventions.

**Example files:** Templates are in `examples/typescript/` adjacent to this SKILL.md. Read each
template before generating the corresponding file.

---

## Example Files Index

```
examples/
  NativeSpec.ts           ← src/NativeMoEngage<featureNameCamel>.ts (TurboModule spec)
  Constants.ts            ← src/internal/Constants.ts
  Model.ts                ← src/model/<ModelName>.ts (one per proto entity)
  Enum.ts                 ← src/model/enums/<EnumName>.ts (one per proto enum)
  PayloadBuilder.ts       ← src/internal/utils/PayloadBuilder.ts
  PayloadParser.ts        ← src/internal/utils/PayloadParser.ts
  JsonToModelMapper.ts    ← src/internal/utils/JsonToModelMapper.ts
  Handler.ts              ← src/internal/MoEngage<featureNameCamel>Handler.ts
  PublicApi.ts            ← src/<featureNameCamel>PublicApi.ts (or ReactMoEngage<featureNameCamel>.ts)
  index.ts                ← src/index.ts
```

---

## Phase 0 — Clarify Inputs

### 0.1 Extract ticket ID
Scan the user's full command for `MOEN-\d+` → **`ticketId`**.
If not found in the command or parameters, ask before proceeding.

---

## Phase 1 — Parse Inputs & Derive All Identifiers

### 1.1 Extract from `contract_branch`
Strip everything up to and including the first `/` or `_MOEN-XXXXX_` prefix:
- `feature/experience_contracts` → **`contractSuffix`** = `experience_contracts`
- `MOEN-44072_jwt_contract` → **`contractSuffix`** = `jwt_contract`

### 1.2 Identifiers table

| Identifier | Example | Rule |
|---|---|---|
| `ticketId` | `MOEN-44072` | `MOEN-\d+` from raw command or parameter |
| `contractSuffix` | `jwt_contract` | branch name after first `/` or `_MOEN-XXXXX_` |
| `featureName` | `jwt` | lowercase slug from feature_description |
| `featureNameCamel` | `Jwt` | PascalCase of featureName |
| `featureNameUpper` | `JWT` | UPPER_SNAKE of featureName |
| `contractDir` | `authentication` | subdirectory found in contracts `json/` after checkout |
| `rnSdkDir` | `sdk/jwt` | `sdk/<featureName>` in the React-Native repo |
| `rnPackage` | `com.moengage.react.jwt` | `com.moengage.react.<featureName>` |
| `branchName` | `feature/jwt_contract` | `feature/<contractSuffix>` |

---

## Phase 2 — Read Contracts

```bash
cd ../mobile-sdk-contracts
git fetch
git stash
git checkout <contract_branch>
```

1. List `json/hybridToNative/` to identify `contractDir`
   - If no matching directory → list available dirs and ask the user
2. For each `.json` in `json/hybridToNative/<contractDir>/`:
   - Filename (without `.json`) = **method name** (camelCase)
   - File content = **input payload shape**
3. For each `.json` in `json/nativeToHybrid/<contractDir>/`:
   - File content = **event/response payload shape**
4. Read all `.proto` files in `protos/<contractDir>/` for model field names and types

### Method classification

| Condition | TypeScript return | NativeSpec type | Notes |
|---|---|---|---|
| `hybridToNative` only | `void` | `(payload: string) => void` | Calls native method directly |
| both directions, JS-initiated | `Promise<ModelType>` | `(payload: string) => Promise<Object>` | PayloadParser converts response |
| `nativeToHybrid` only, SDK-initiated | callback/listener | event listener in Handler | Uses `addListener` / `removeListeners` |

**Build a complete method table before writing any code.**

---

## Phase 3 — TypeScript Implementation

### 3.1 Check out the branch created by react-native-android-bridge-implementation
```bash
cd React-Native
git fetch
git checkout feature/<contractSuffix>
```
If the branch does not exist, create it:
```bash
git checkout -b feature/<contractSuffix>
```

### 3.2 Check if TypeScript files already exist
```bash
ls <rnSdkDir>/src/ 2>/dev/null
```
- Not found → scaffold full TS layer (Steps 3.3–3.12)
- Found → read existing files first, add only the missing methods/models

### 3.3 Constants.ts
→ See `examples/typescript/Constants.ts`
Generate at: `<rnSdkDir>/src/internal/Constants.ts`

Contains:
- One string constant per method name (must exactly match the Android bridge constants)
- One string constant per event name (for nativeToHybrid events)

### 3.4 Model files
→ See `examples/typescript/Model.ts`
Generate one file per logical proto entity at: `<rnSdkDir>/src/model/<ModelName>.ts`

Rules:
- Use TypeScript `interface` for data shapes (not `class`)
- Field names must match the contract JSON keys exactly
- Optional fields (nullable in proto) → `field?: Type`
- Nested objects → reference other model interfaces

### 3.5 Enum files
→ See `examples/typescript/Enum.ts`
Generate one file per proto enum at: `<rnSdkDir>/src/model/enums/<EnumName>.ts`

Rules:
- Use `const enum` or `enum` following the Cards module pattern
- Enum values must exactly match the proto enum value names (e.g. `TIME_CONSTRAINT_FAILURE`)

### 3.6 NativeSpec (TurboModule spec)
→ See `examples/typescript/NativeSpec.ts`
Generate at: `<rnSdkDir>/src/NativeMoEngage<featureNameCamel>.ts`

Rules:
- Extends `TurboModule` from `react-native/Libraries/TurboModule/RCTExport`
- Every fire-and-forget method: `methodName(payload: string): void`
- Every promise method: `methodName(payload: string): Promise<Object>`
- Every event source: `addListener(eventName: string): void` + `removeListeners(count: number): void`
- The spec name must match `codegenConfig.name` in `package.json`

### 3.7 PayloadBuilder.ts
→ See `examples/typescript/PayloadBuilder.ts`
Generate at: `<rnSdkDir>/src/internal/utils/PayloadBuilder.ts`

One builder function per hybridToNative method:
- Accepts typed model parameters
- Returns a JSON string (using `JSON.stringify`)
- Includes `accountMeta: { appId }` wrapper matching the contract shape

### 3.8 PayloadParser.ts
→ See `examples/typescript/PayloadParser.ts`
Generate at: `<rnSdkDir>/src/internal/utils/PayloadParser.ts`

One parser function per nativeToHybrid response payload (promise methods):
- Accepts the raw JSON object returned by the native promise
- Returns a typed model instance

### 3.9 JsonToModelMapper.ts
→ See `examples/typescript/JsonToModelMapper.ts`
Generate at: `<rnSdkDir>/src/internal/utils/JsonToModelMapper.ts`

One mapper function per nativeToHybrid event payload:
- Accepts the raw event data object
- Returns a typed model instance
- Used in the Handler's event listener callbacks

### 3.10 Handler.ts
→ See `examples/typescript/Handler.ts`
Generate at: `<rnSdkDir>/src/internal/MoEngage<featureNameCamel>Handler.ts`

Rules:
- Fire-and-forget methods: call `NativeModule.methodName(PayloadBuilder.buildXxx(...))`
- Promise methods: call native, then `PayloadParser.parseXxx(result)`, return typed model
- Event methods: use `NativeEventEmitter` + `addListener` / `removeListeners`; call `JsonToModelMapper.mapXxx(data)` in the listener body
- Always null-check `NativeModule` before calling; throw descriptive error if null

### 3.11 PublicApi.ts
→ See `examples/typescript/PublicApi.ts`
Generate at: `<rnSdkDir>/src/<featureNameCamel>PublicApi.ts` (or `ReactMoEngage<featureNameCamel>.ts` if that matches the Cards pattern)

Thin wrapper over the Handler. Re-exports every public method with JSDoc comments derived
from the contract descriptions. This is what consumers of the npm package import.

### 3.12 index.ts
→ See `examples/typescript/index.ts`
Generate at: `<rnSdkDir>/src/index.ts`

Re-exports everything the package exposes:
- The PublicApi object / functions
- All model interfaces
- All enums

### 3.13 package.json
Copy `sdk/cards/package.json`, then update:
- `"name"` → `"react-native-moengage-<featureName>"`
- `"version"` → `"1.0.0"`
- `"description"` → appropriate description
- `"codegenConfig"."name"` → `"NativeMoEngage<featureNameCamel>Spec"`
- `"codegenConfig"."android"."javaPackageName"` → `"<rnPackage>"`

### 3.14 Podspec *(iOS shell — do not implement iOS logic)*
Copy `sdk/cards/ReactNativeMoEngageCards.podspec`, rename to
`ReactNativeMoEngage<featureNameCamel>.podspec`, update:
- `s.name` → `"ReactNativeMoEngage<featureNameCamel>"`
- `s.description`, `s.summary` — update feature name
- `s.dependency "MoEngage-iOS-SDK/...` — keep as-is or add `// TODO: verify iOS SDK dependency`

### 3.15 Commit
```bash
git add <rnSdkDir>/src/ <rnSdkDir>/package.json <rnSdkDir>/*.podspec
git commit -m "<ticketId>: Add React-Native TypeScript layer for <featureName>"
```

---

## Phase 4 — Create Pull Request

If a PR already exists on `feature/<contractSuffix>` (from the Android bridge step), push
to the same branch and add a comment explaining what was added. Otherwise create a new PR.

```bash
git push -u origin feature/<contractSuffix>

# Check if PR already exists:
gh pr list --head feature/<contractSuffix> --json number,url

# If no existing PR:
gh pr create \
  --title "<ticketId>: Add React-Native TypeScript layer for <featureName>" \
  --base development \
  --body "$(cat <<'EOF'
## Summary
- Adds TypeScript TurboModule spec, models, enums, and Handler layer for <featureName>
- PayloadBuilder serializes TS models → JSON strings for native calls
- PayloadParser / JsonToModelMapper deserialize native responses / events → typed TS models
- PublicApi exports the consumer-facing API

## Related PRs
- android-plugin-base: <plugin_base_pr_url>
- React-Native Android bridge: <android_bridge_pr_url>

## Contract
Branch: `<contract_branch>` in mobile-sdk-contracts

## Methods
| Method | Type | TS return |
|---|---|---|
<table rows from method table>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Phase 5 — Report

Print:
1. PR URL (new, or the updated existing PR URL)
2. Full method table (name, type, TS return type, models involved)
3. All `// TODO` items left for manual verification (e.g. iOS SDK dependency)
4. List of all files created or modified

---

## Codebase Reference Files

Read these before generating the corresponding output — copy copyright headers, naming
conventions, and structural patterns exactly.

| What | Codebase path |
|---|---|
| NativeSpec reference | `React-Native/sdk/cards/src/NativeMoEngageCards.ts` |
| Handler reference | `React-Native/sdk/cards/src/internal/MoEngageCardHandler.ts` |
| PayloadBuilder reference | `React-Native/sdk/cards/src/internal/utils/PayloadBuilder.ts` |
| PayloadParser reference | `React-Native/sdk/cards/src/internal/utils/PayloadParser.ts` |
| JsonToModelMapper reference | `React-Native/sdk/cards/src/internal/utils/JsonToModelMapper.ts` |
| PublicApi reference | `React-Native/sdk/cards/src/ReactMoEngageCards.ts` |
| index reference | `React-Native/sdk/cards/src/index.ts` |
| package.json reference | `React-Native/sdk/cards/package.json` |
| Model reference | `React-Native/sdk/cards/src/model/` |
| plugin-base module | `../android-plugin-base/<androidModuleName>/` |
| Android bridge Constants | `React-Native/<rnSdkDir>/android/src/main/java/<rnPackage>/Constants.kt` (just written) |

---

## Error Handling Rules

- `contract_branch` not found → stop and tell the user
- `contractDir` not found → list available dirs and ask
- Android bridge Constants.kt not found → warn and derive constants from contract file names directly
- `rnSdkDir/src/` already exists → read existing files, add only missing items
- iOS SDK dependency name unknown → add `// TODO: verify iOS SDK dependency` in podspec and continue
- Push fails → report error and local branch name
