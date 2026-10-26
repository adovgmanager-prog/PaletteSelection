# Palette Selection Lab

An independent, shareable teaching example using **HTML, CSS and plain JavaScript**. It was written as a small sample, not extracted from the production extension. No production source, real group names, variable values, credentials or Azure DevOps SDKs are included. No files elsewhere in the extension project are imported or required.

## Independent Git repository

This folder has its own Git repository and history, separate from the parent VG Diff project. Run Git commands from this folder, not the parent workspace. Before committing or pushing, `git rev-parse --show-toplevel` must point to `standalone-palette-demo`.

Once you have created a separate empty remote repository, configure and push it from this folder:

```sh
git remote add origin <YOUR-SEPARATE-REPOSITORY-URL>
git push -u origin main
```

Replace the placeholder with your actual remote URL. No remote is configured automatically, and creating this local repository does not publish it. Prefer an empty remote without a generated README or initial commit to avoid unrelated histories. Never force-push an existing repository to work around a history conflict.

Because this folder is physically nested under another repository, do not stage it from the parent repository: that can accidentally add an embedded repository/gitlink. For complete filesystem separation, copy the entire folder **including its hidden `.git` directory** outside the parent workspace before pushing; inspect the destination repository root again. Do not publish the parent project.

The existing Git author identity is used for the initial commit and may appear publicly if you later publish the repository. Review it before pushing if you prefer a Git-provider no-reply address. No open-source licence has been selected; choose an appropriate licence separately if you intend to grant public reuse rights.

## Run locally

Double-click `index.html`, or drag it into a modern browser. All scripts and styles are local. No server, Node.js, package installation, framework or build step is required to use the page. Copy this entire folder to another location or machine and it still works; do not share the parent repository.

The browser must allow local JavaScript files. If corporate policy prevents that, ask your team to serve this folder through an approved static-file server rather than weakening browser security.

## What to demonstrate

1. Select **Blue**, then Store / Development and Store / Test.
2. Select **Purple**, then Billing / Development and Billing / Test.
3. Choose **Show selected sets** to see two independent summaries.
4. With Purple active, click Store / Development: it moves from Blue to Purple. Blue now has only one group and is skipped when generating summaries.
5. Click that same group again: it is deselected.
6. Add colors until there are five; the add button is then disabled. Only empty extra colors can be removed; the first two stay.
7. Watch the live JSON update. Clear selections keeps the added colors; Reset demo returns to the initial two colors. Reloading also resets everything because nothing is persisted.

This page demonstrates **selection and grouping only**. It does not fetch variable values, compare configuration or update any real system.

## Languages and files

| File | Responsibility |
|---|---|
| `index.html` | Page structure and script loading order. |
| `styles.css` | Layout, swatches, selected cards, responsive styling and keyboard focus. |
| `sample-data.js` | Nine fictional group records with IDs/names, no values. |
| `palette-state.js` | Plain JavaScript rules: create state, select/add/remove colors, assign/move/deselect groups, clear and collect ready sets. No DOM access. |
| `app.js` | Button event handlers and DOM rendering; calls the state module and redraws the UI. |
| `test.cjs` | Optional Node.js tests for the state rules; not loaded by the browser. |

Only **three JavaScript files** are loaded by the page. Classic deferred scripts intentionally allow direct `file://` opening without module-server requirements. Browser globals connect the small example: `sample-data.js` supplies `window.paletteDemoGroups`; `palette-state.js` supplies `window.PaletteSelection`; `app.js` consumes both.

For a larger application, consider TypeScript for typed models and ES modules for imports. React/Vue/Angular are optional UI choices, not required for palette selection. If using ES modules, serve the files through an approved local server. This sample uses no libraries or packages.

## Data model

The `colors` array stores color identifiers, display names and fixed CSS colors. `activeColor` identifies the currently selected color. `assignments` maps each color to group IDs:

```js
{
  activeColor: 'blue',
  colors: [
    { id: 'blue', label: 'Blue', hex: '#2563eb' },
    { id: 'purple', label: 'Purple', hex: '#7c3aed' }
  ],
  assignments: {
    blue: ['store-dev', 'store-test'],
    purple: ['billing-dev', 'billing-test']
  }
}
```

Names/hex codes are demonstration choices, not environment classifications or permissions. A group can belong to **at most one set**. A ready set contains **at least two groups**. There can be **two to five colors**.

## Selection algorithm

```text
User clicks a group
  → Find its previous color
  → Remove its ID from every set
  → If previous color differs from active color, add ID to active set
  → Otherwise leave it unassigned (toggle off)
  → Clear stale summaries and render the new state
```

Selecting a swatch only changes `activeColor`; it does not recolor existing groups. Adding a color creates an empty set and activates it. `readySets()` returns copies of sets with two or more IDs; a real application could pass those IDs to a separate comparison service.

## Short explanation for the team

“The palette is just a grouping mechanism in the browser. Each color has an ID, and we keep a map from that color ID to selected group IDs. Clicking a group updates that map, then the UI redraws its border, label and count. Selecting the same group under another color moves it; selecting it under its current color removes it. A separate action processes sets containing at least two groups. The color itself does not change any source data.”

## Optional tests

If Node.js is installed, open a terminal in this folder and run:

```sh
node test.cjs
```

The tests cover minimum/maximum colors, assignment/deselection/movement, uniqueness, incomplete sets, removing only empty extra colors, clearing and independent state. These are state-unit tests, not proof of browser rendering or Azure DevOps behavior.

## Isolation and security boundaries

- No dependencies, telemetry, local storage, cookies, Azure DevOps integration or network requests.
- Only synthetic data; state lives in memory and resets on reload.
- The page inserts labels using DOM `textContent`, not HTML interpolation. CSS colors come from a fixed local palette.
- A restrictive page policy disables network connections. This is a teaching example, not a security certification.
- Root manifests, extension builds, production modules, VSIX files and publication documents are not changed by this demo. No root configuration or installation is needed.
