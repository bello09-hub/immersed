<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Keep pure life-simulation rules and serializable state in `src/lib/life-engine.ts` so outcomes can be tested independently of the presentation.
- Present the game at the index route with local navigation for in-game panels, because these panels are views of one active life rather than separate website pages.
- The index hosts the supplied standalone v6 game in a same-origin frame under public/game to preserve its expanded gameplay and browser saves; retain legacy source separately rather than replacing v6 with the earlier engine.
- Keep live appearance editing and age-dependent portrait presentation in public/game/appearance.js and appearance.css; validate saved appearance fields in the supplied game so older lives retain their stories.
- Keep opening, menu, creation, and settings in a dedicated opening-screen module controlled by the index screen state; only an explicitly started or loaded life may autosave so visiting the menu cannot overwrite a save.
- Preserve browser-local save/load for the supplied offline single-player experience; access browser storage only in effects and event handlers to avoid hydration mismatches.
- Use semantic global color tokens and shared UI controls throughout the game so presentation stays consistent.
- Keep resumable age-tagged childhood dilemmas and athletics reward resolution in the pure life engine; normalize legacy saves on load so new stats never erase existing stories.
- Present secondary life panels as dedicated local hub screens with a return header; keep the hidden narrative mounted to preserve reading position.
- Keep race timing and input in a dedicated athletics overlay using monotonic deadlines; commit each completed result once immediately so leaving the results screen cannot lose records.
- Share text-size controls and CSS reading-size variables across opening screens, hubs, and portaled dialogs so saved preferences apply consistently.
- Store shared annual training usage, per-sport progress, and per-sport completion bests in the serializable life state; keep training separate from the general activity budget and reset usage only when age advances.
- Keep school, family budgets, chores, discipline and kid inventory in the pure life engine; normalize missing childhood state when loading older saves so existing stories survive.
- Render childhood hubs through a shared presentation module; enrollment is an age-six engine choice, not a page-load side effect.
- Use deterministic country-aware school and classmate names so reloading a save cannot rename its school.
- Keep relationships, birthdays, peers, prefects and home tiers as pure rules in src/lib/social-engine.ts; social state derives deterministically until first changed so old saves need no migration.
- Store lives in four browser save slots under one key; migrate the legacy single save into Slot 1 on load.
