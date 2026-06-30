# Component Rules

## Buttons
- Primary: orange fill, white text, used for main action only.
- Secondary: neutral surface with orange/graphite text.
- Dangerous: red text or border; avoid large red filled buttons unless destructive action is confirmed.
- Icon buttons should use recognizable icons and accessible labels.

## Panels
- Use a single panel border and subtle surface.
- Do not put cards inside cards unless the inner items are repeated data records.
- Keep panel headers compact.

## Atlas Tiles
- Product images should be visible as full objects using `object-fit: contain`.
- Coming-soon products remain visible, not hidden behind heavy overlays.
- Active products clearly show action availability.

## Calculator Fields
- User mode labels use geometry symbols and plain names.
- CAMduct keys are internal and only shown in service/admin mode.
- Input groups should be compact and aligned.

## Specification Rows
- Edit/delete controls must respect role permissions.
- Locked actions should show a clear access message.
- Dimensions displayed to users should use display-layer symbols, not internal CAMduct keys.

## Debug Panels
- Debug/service panels are visible only to service/admin roles.
- They can expose payloads, traces, and formula references.
- They must not visually dominate the normal calculator result.
