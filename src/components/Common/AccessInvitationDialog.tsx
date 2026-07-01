import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface AccessInvitationDialogProps {
  open: boolean
  onClose: () => void
}

const companyUrl = 'https://stspetsmontag.com.ua'

function gfMultiply(left: number, right: number) {
  let value = 0
  for (let i = 0; i < 8; i += 1) {
    if ((right & 1) !== 0) value ^= left
    const high = (left & 0x80) !== 0
    left = (left << 1) & 0xff
    if (high) left ^= 0x1d
    right >>= 1
  }
  return value
}

function reedSolomonGenerator(degree: number) {
  let root = 1
  let coefficients = [1]
  for (let i = 0; i < degree; i += 1) {
    const next = new Array(coefficients.length + 1).fill(0)
    coefficients.forEach((coefficient, index) => {
      next[index] ^= gfMultiply(coefficient, root)
      next[index + 1] ^= coefficient
    })
    coefficients = next
    root = gfMultiply(root, 0x02)
  }
  return coefficients.slice(1)
}

function reedSolomonRemainder(data: number[], degree: number) {
  const generator = reedSolomonGenerator(degree)
  const result = new Array(degree).fill(0)
  data.forEach((value) => {
    const first = result.shift() ?? 0
    const factor = value ^ first
    result.push(0)
    generator.forEach((coefficient, index) => {
      result[index] ^= gfMultiply(coefficient, factor)
    })
  })
  return result
}

function appendBits(bits: number[], value: number, length: number) {
  for (let i = length - 1; i >= 0; i -= 1) bits.push((value >>> i) & 1)
}

function makeQrCode(text: string) {
  const version = 3
  const size = 17 + version * 4
  const dataCodewords = 55
  const errorCodewords = 15
  const bytes = Array.from(new TextEncoder().encode(text))
  const bits: number[] = []
  appendBits(bits, 0b0100, 4)
  appendBits(bits, bytes.length, 8)
  bytes.forEach((byte) => appendBits(bits, byte, 8))
  appendBits(bits, 0, Math.min(4, dataCodewords * 8 - bits.length))
  while (bits.length % 8 !== 0) bits.push(0)
  const data: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    data.push(bits.slice(i, i + 8).reduce((sum, bit) => (sum << 1) | bit, 0))
  }
  for (let pad = 0xec; data.length < dataCodewords; pad ^= 0xec ^ 0x11) data.push(pad)
  const codewords = [...data, ...reedSolomonRemainder(data, errorCodewords)]
  const modules = Array.from({ length: size }, () => new Array<boolean | null>(size).fill(null))
  const reserved = Array.from({ length: size }, () => new Array(size).fill(false)) as boolean[][]

  const setFunction = (x: number, y: number, dark: boolean) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return
    modules[y][x] = dark
    reserved[y][x] = true
  }

  const drawFinder = (x: number, y: number) => {
    for (let dy = -1; dy <= 7; dy += 1) {
      for (let dx = -1; dx <= 7; dx += 1) {
        const xx = x + dx
        const yy = y + dy
        const dark = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4))
        setFunction(xx, yy, dark)
      }
    }
  }

  const drawAlignment = (cx: number, cy: number) => {
    for (let dy = -2; dy <= 2; dy += 1) {
      for (let dx = -2; dx <= 2; dx += 1) {
        setFunction(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
      }
    }
  }

  drawFinder(0, 0)
  drawFinder(size - 7, 0)
  drawFinder(0, size - 7)
  for (let i = 8; i < size - 8; i += 1) {
    setFunction(i, 6, i % 2 === 0)
    setFunction(6, i, i % 2 === 0)
  }
  drawAlignment(22, 22)
  setFunction(8, 21, true)

  for (let i = 0; i < 9; i += 1) {
    if (i !== 6) {
      reserved[8][i] = true
      reserved[i][8] = true
    }
  }
  for (let i = 0; i < 8; i += 1) {
    reserved[8][size - 1 - i] = true
    reserved[size - 1 - i][8] = true
  }

  const dataBits = codewords.flatMap((codeword) => Array.from({ length: 8 }, (_, index) => (codeword >>> (7 - index)) & 1))
  let bitIndex = 0
  let upward = true
  for (let x = size - 1; x >= 1; x -= 2) {
    if (x === 6) x -= 1
    for (let vertical = 0; vertical < size; vertical += 1) {
      const y = upward ? size - 1 - vertical : vertical
      for (let dx = 0; dx < 2; dx += 1) {
        const xx = x - dx
        if (!reserved[y][xx]) {
          const bit = bitIndex < dataBits.length ? dataBits[bitIndex] === 1 : false
          modules[y][xx] = bit !== ((xx + y) % 2 === 0)
          bitIndex += 1
        }
      }
    }
    upward = !upward
  }

  const format = 0b111011111000100
  const getFormat = (index: number) => ((format >>> index) & 1) === 1
  for (let i = 0; i <= 5; i += 1) setFunction(8, i, getFormat(i))
  setFunction(8, 7, getFormat(6))
  setFunction(8, 8, getFormat(7))
  setFunction(7, 8, getFormat(8))
  for (let i = 9; i < 15; i += 1) setFunction(14 - i, 8, getFormat(i))
  for (let i = 0; i < 8; i += 1) setFunction(size - 1 - i, 8, getFormat(i))
  for (let i = 8; i < 15; i += 1) setFunction(8, size - 15 + i, getFormat(i))

  return modules.map((row) => row.map(Boolean))
}

function QrSvg({ value }: { value: string }) {
  const modules = useMemo(() => makeQrCode(value), [value])
  const quiet = 4
  const size = modules.length + quiet * 2
  const cells = modules.flatMap((row, y) => row.map((dark, x) => (dark ? `${x + quiet},${y + quiet}` : null))).filter(Boolean)

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={value} className="invitation-qr-svg">
      <rect width={size} height={size} fill="#f8fafc" />
      {cells.map((cell) => {
        const [x, y] = String(cell).split(',').map(Number)
        return <rect key={cell} x={x} y={y} width="1" height="1" fill="#334155" />
      })}
    </svg>
  )
}

export function AccessInvitationDialog({ open, onClose }: AccessInvitationDialogProps) {
  const { t } = useTranslation()

  if (!open) return null

  return (
    <div className="access-dialog-backdrop" role="presentation" onClick={onClose}>
      <div className="access-dialog invitation-dialog" role="dialog" aria-modal="true" aria-labelledby="access-dialog-title" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="invitation-close" aria-label={t('action.closeDialog')} onClick={onClose}>
          ×
        </button>
        <div className="invitation-copy">
          <p className="invitation-eyebrow">ST Spetsmontazh</p>
          <h4 id="access-dialog-title">{t('access.invitationTitle')}</h4>
          <strong>{t('access.invitationSubtitle')}</strong>
          <p>{t('access.invitationDescription')}</p>
          <div className="invitation-contacts">
            <a href="tel:+380445022592">+38 (044) 502-25-92</a>
            <a href="tel:+380674685551">+38 (067) 468-55-51</a>
            <span>{t('access.invitationHours')}</span>
            <a href="mailto:office@stspetsmontag.com.ua">office@stspetsmontag.com.ua</a>
            <a href={companyUrl} target="_blank" rel="noreferrer">stspetsmontag.com.ua</a>
          </div>
        </div>
        <a className="invitation-qr" href={companyUrl} target="_blank" rel="noreferrer" aria-label={t('access.companySite')}>
          <QrSvg value={companyUrl} />
        </a>
        <div className="invitation-actions">
          <button type="button" className="invitation-secondary" onClick={onClose} aria-disabled="true">
            {t('access.openAccount')}
          </button>
          <a className="brand-action-button px-4 py-2 text-sm" href={companyUrl} target="_blank" rel="noreferrer">
            {t('access.companySite')}
          </a>
          <button type="button" className="invitation-later" onClick={onClose}>
            {t('access.later')}
          </button>
        </div>
      </div>
    </div>
  )
}

