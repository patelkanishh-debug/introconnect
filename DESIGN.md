# Design Brief

## Purpose & Context
Anonymous social platform for introverts to meet and connect by name only with low-pressure, guided conversation starters.

## Tone & Differentiation
Warm, welcoming minimalism with playful emoji reactions and icebreaker prompts. Safe, intentional social discovery.

## Color Palette
| Token           | Light L   | Dark L   | Hue | Purpose |
|-----------------|-----------|----------|-----|---------|
| primary         | 0.52 177° | 0.72 177° | Teal/sage | CTAs, highlights |
| secondary       | 0.68 192° | 0.35 192° | Cool teal | Subtle accents |
| accent          | 0.68 25°  | 0.72 25° | Warm coral | Playful highlights, reactions |
| background      | 0.965 240° | 0.15 240° | Cool neutral | Page base |
| destructive     | 0.55 25°  | 0.65 25° | Red-orange | Alerts, remove actions |

## Typography
- **Display**: Lora (serif) — headlines, icebreaker prompts, visual emphasis
- **Body**: Plus Jakarta Sans (sans-serif) — all copy, chat text, UI labels
- **Mono**: monospace — fallback only
- **Scale**: 12px (xs), 14px (sm), 16px (base), 20px (lg), 24px (xl), 32px (2xl)

## Shape & Spacing
- Border-radius: 0.875rem (warm, approachable) for cards; 0.45rem for smaller components
- Spacing grid: 4px base; 8, 12, 16, 24, 32px increments
- Generous breathing room; 24px gutters minimum

## Structural Zones
| Zone | Treatment | Purpose |
|------|-----------|---------|
| Header | bg-card, border-b border-border, subtle elevation | Navigation bar with logo/title |
| Content | bg-background, card layers with shadow-sm | Chat messages, matched partner card, icebreaker prompt |
| Footer | bg-card, border-t border-border | Bottom navigation (Explore, Active Chats, Profile) |
| Message | bg-muted/30, rounded-lg, with emoji reactions | Chat bubbles with playful reaction buttons |
| Card | bg-card, shadow-sm, rounded-lg | Matched partner info, icebreaker, conversation starter |

## Component Patterns
- Message cards with floating emoji reaction buttons (😂, 😍, 🔥, etc.)
- Icebreaker prompt displayed as italic serif header
- Partner name-only display (no profile photos)
- Bottom navigation bar (3 items: Explore, Active Chats, Profile)
- Minimal form inputs for onboarding

## Motion & Interaction
- Smooth 0.3s transitions on hover states (buttons, reaction buttons)
- Subtle scale on emoji reaction hover (1 → 1.1)
- Fade-in for new messages
- No excessive animations; restrained, functional motion

## Constraints & Anti-Patterns
- No profile photos, real names, or email displays
- No aggressive gradients or neon accents
- No hover shadows on non-interactive elements
- Emoji reactions use accent color sparingly
- Typography hierarchy enforced via size & weight, not color alone

## Accessibility
- Minimum 4.5:1 contrast on all text (AA+)
- Color alone never conveys meaning (emoji reactions paired with tooltips)
- Focus states on all interactive elements
- Readable font sizes (min 14px body)

## Signature Detail
Emoji reaction buttons on messages — playful, warm interaction pattern unique to the platform's social-first nature.
