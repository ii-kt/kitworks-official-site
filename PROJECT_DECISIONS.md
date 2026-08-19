# KiT Works Website — Fixed Project Decisions

This file is the durable source of truth for future changes to this site.

## Business and brand

- KiT Works is a Japan-focused sole proprietorship operated by the user.
- The site itself should demonstrate the user's design and implementation ability.
- The final logo has not been decided. Until then, use only a plain typographic `KiT Works` placeholder and do not invent a logo symbol.
- Do not invent email addresses, social accounts, client names, achievements, or other business facts.

## Entry architecture

- The CRT screen is **not the only entrance**.
- Every item in the upper navigation remains an active, independent shortcut to its corresponding content.
- Clicking the CRT opens a static `Welcome` document explaining the viewing pattern. It must not provide another destination menu.
- The entrance is the only router: close the current viewer before choosing another item.
- Desktop navigation should support an English-to-Japanese hover/focus reveal.
- Touch devices cannot depend on hover: show the Japanese meaning alongside or beneath the English label and open the destination on tap.

## Content architecture

- Upper navigation destinations: Portfolio, Capabilities, Process, About, Approach, FAQ, Start a Project, Availability, and System Info.
- Portfolio is a complete, self-contained document inside this site. Its facts are sourced from the user's published professional record at `https://ii-kt.github.io/kitworks-portfolio/`; keep that record as the factual source and do not invent or infer details that are not published there. Follow the current visible publication scope: do not reintroduce the removed contact/profile section or qualifications that the published page does not render.
- Project information panels should prioritize Japanese clarity for Japanese customers, while retaining small English labels as part of the visual system.
- The Project Brief should help visitors organize and copy an inquiry without requiring a fabricated contact address.

## Language direction

- Preserve English on the cinematic entrance where it strengthens the atmosphere.
- Use Japanese as the primary language for detailed business information, inquiry, FAQ, availability, and explanatory content.
- Upper navigation is part of the entrance experience and must remain useful: English labels reveal Japanese translations on desktop hover/focus, with a non-hover equivalent on mobile.
- Design principle: attract through English atmosphere, then provide understanding and reassurance in Japanese.

## Motion and experience

- Preserve the atmospheric sky, grassy hill, CRT, signal cycle, particles, grain, parallax, and responsive behavior.
- The signal belongs inside the photographed CRT glass. Its position is anchored to the source image at every breakpoint; the background image, glass, and signal move together. Preserve the source glass at the perimeter, and build the live picture as inset phosphor, edge vignette, reflection, and rim layers. Never resize only the signal for mobile, cover the glass with an opaque rectangle, or scale the clickable glass itself on press.
- Navigation translation motion should feel like text sliding upward through a mask without changing the link width or shifting the layout.
- Respect reduced-motion preferences and keyboard focus states.
- The fixed motion benchmark for all inner pages is Recent Design's **AI Image Generation Reveal** for page decoding, plus **Border Beam Effect / Uploading Button** for hover, focus, press, processing, and completion feedback. Reproduce their interaction mechanics and timing closely in KiT Works' own palette and content; never reuse published source code or proprietary assets.
- Opening a destination must feel like unresolved signal data becoming clear in place: grayscale tiles shimmer and disappear in a deterministic irregular order. Do not return to a generic fade-and-scale modal entrance.
- Every frequent interaction must be designed in separate states: idle, hover, focus-visible, pressed, processing, success/error, and leave. Hover/focus receives one border-beam traversal and a quiet afterglow; press visibly sinks for roughly 90ms; processing may loop the beam; completion resolves and becomes still.
- Do not apply one decorative template to every destination. Each panel must retain one content-specific visual object or spatial behavior: published career dossier and case ledger, capability channels, process pipeline, direct-practice map, calibration plates, FAQ frequencies, local brief compiler, schedule scanner, and system layers.
- Motion should become calm after the reveal. Avoid permanent border loops, continuous glitches, generic 3D tilt on every object, cursor hijacking, and effects that do not communicate state.
- Mobile replaces hover with explicit tap/pressed feedback, uses a one-column reading order, and keeps the close control reachable. Reduced-motion keeps the same information and focus results with immediate or short-opacity transitions.

## Approved after-click UI — production direction

- The approved production experience is a **single-purpose KiT Works viewer** whose visual language is inspired by the Windows 95 era: square gray bevels, a navy title bar, a read-only filename strip, a document pane, and a status bar. Do not use Microsoft logos, official icons, sounds, wallpapers, copied source code, or other proprietary assets.
- Only the appearance is retro. Motion remains contemporary: **Stamp Folder Animation** informs the spring window opening, **AI Image Generation Reveal** informs grayscale tile decoding, and **Border Beam UI** informs the one-pass lime hover/focus signal. The window should settle cleanly after these state-communicating animations.
- The actual natural entrance scene and actual upper navigation remain visibly ghosted behind an opened viewer. They communicate that a modern external IT system has interrupted the nature-and-CRT world; do not replace them with duplicated mock content, classify them as accidental residue, or remove them.
- The entrance is the only place where destinations can be chosen. Each of the nine upper-navigation items opens its corresponding destination directly. The CRT opens only the static `Welcome` document.
- Once a destination opens, the window must display **only that selected content**. The sole window-level operation is Close. Remove internal routing and any controls or affordances that imply Back, Home, Play, Refresh, history, address navigation, folders, a tree, Start menu, taskbar, minimize, maximize, dragging, help, or switching to another destination.
- Cross-destination calls to action are also prohibited inside the viewer. Content-specific operations that belong to the selected document remain valid: FAQ disclosure and the local Project Brief form/copy action.
- Implement the viewer as one shared React component integrated with production state and content. Do not use an iframe, embed the standalone prototype HTML, or maintain a second JavaScript navigation system. Removed operations must be deleted from markup, state, handlers, and CSS rather than merely hidden.
- Preserve all nine destination documents and their content-specific information, interactions, and visual objects: Portfolio, Capabilities, Process, About, Approach, FAQ, Start a Project, Availability, and System Info. The Windows frame is common, while each document retains its own composition and motion object.
- After a destination is selected, the production Windows viewer fills the entire usable viewport edge to edge. Its document pane owns scrolling, while the title bar, Close control, file band, and status bar remain continuously reachable; mobile keeps the same full-screen contract with safe-area-aware chrome and a one-column reading order.
- Preserve keyboard operation, visible focus states, logical focus trapping and return, Escape-to-close behavior, meaningful dialog and navigation semantics, reduced-motion support, and touch/keyboard equivalents for every essential interaction.
- `prototypes/system-index-windows.html` is now a read-only visual and motion reference archive. It is not production code and must not be embedded, served as the live inner-page implementation, or become a competing source of content or state.

## Inner-document design system

- Keep the authentic old-Windows chrome constant across every destination. Inside that frame, treat each document as a contemporary Japanese editorial or technical sheet—not as a generic website card pasted into a retro window.
- Each destination must have its own composition and one dominant, content-specific motion. Preserve the shared Close-only viewer contract: no internal navigation, destination switching, or controls that imply either.
- Decorative rows and cards are not controls. Do not make noninteractive content focusable or give it button-like border-beam states; reserve hover, focus, press, processing, and completion feedback for genuine interactions.
- The opening origin remains the clicked CRT or navigation item. Synchronize the shared window launch and irregular decode sequence to a deliberate **1200ms** opening timeline, then let the selected document settle into its own calm motion language.
- Prioritize Japanese readability over decorative density: use a real Japanese display/body hierarchy, comfortable line length and line height, and legible metadata rather than tiny HUD copy. Preserve Tahoma/MS UI Gothic-style typography for the Windows chrome only.
- On mobile, use content-driven height and a single-column reading order, avoid fixed blank regions and compressed multi-column diagrams, keep form text large enough to prevent input zoom, expose information that desktop hover may enhance, and keep Close continuously reachable.
- The contemporary document typography is an actual, bundled web-font pair: Shippori Mincho for large editorial statements and Zen Kaku Gothic New for body/UI copy. Tahoma/MS UI Gothic remains exclusive to the old-Windows shell and technical micro-labels. Do not fall back to Noto merely because it is common; the document typography must contribute visible character.
- Current design research is applied through oversized editorial type, sparse grids, short purposeful motion, and a limited palette. Do not flatten every destination into rounded Bento cards, glass panels, or generic SaaS components; the page-specific compositions and retro-tech contrast are the differentiators.

## Business-document layout benchmark

- The 2026-08-10 layout pass is grounded in a direct review of 32 official business sites recorded in `WEB_LAYOUT_RESEARCH.md`; implementation must not begin from gallery thumbnails alone.
- Inside each destination, the reading order is proposition, explanation, page-specific evidence or concrete facts, then the destination's own next action or status. Abstract decoration cannot replace evidence.
- Desktop uses an asymmetric editorial grid (normally seven columns for the main proposition and five for supporting facts). Japanese body copy stays near 28–40 characters per line and no wider than 600–660 px.
- Uniform card dashboards are not the default. Use scale, whitespace, hairlines, and factual rows. Each page keeps a distinct composition without adding cross-destination navigation.
- Welcome and About must show services and operating facts rather than generic diagrams. Portfolio must reproduce only facts from the published professional record and must not fabricate cases, clients, metrics, testimonials, qualifications, or outcomes.
