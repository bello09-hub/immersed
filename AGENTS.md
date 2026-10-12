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
- Preserve browser-local save/load for the supplied offline single-player experience; access browser storage only in effects and event handlers to avoid hydration mismatches.
- Use semantic global color tokens and shared UI controls throughout the game so presentation stays consistent.
