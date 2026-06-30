# Round duct formula alignment

Aligned to current v1 source-of-truth logic from `modules/common/panel-module.js`.

Confirmed v1 behavior for `roundDuct(v)`:
- `T = v.thickness || roundAutoThickness(A)`
- `c1 = roundConnectorAllowance(v.conn1)`
- `c2 = roundConnectorAllowance(v.conn2)`
- `Bcalc = B + c1 + c2`
- `welded = B <= 449`
- `add = welded ? 8 : (T >= 0.9 ? 28 : 25)`
- `area = (π × A + add) × Bcalc × Q / 1_000_000`

Connector allowances in v1:
- flange = +10 mm
- bandage = +7 mm
- none = +0 mm

Auto thickness in v1:
- A >= 1000 -> 0.9
- A >= 500 -> 0.7
- else -> 0.5

This alignment matches control values:
- A=250, B=1000 -> 0.810 m²
- A=250, B=3200 -> 2.593 m²
