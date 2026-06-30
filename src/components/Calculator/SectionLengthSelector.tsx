interface SectionLengthSelectorProps {
  value: number
  onChange: (value: 6000 | 5000 | 4000 | 3000 | 2000) => void
}

const options = [6000, 5000, 4000, 3000, 2000] as const

export function SectionLengthSelector({ value, onChange }: SectionLengthSelectorProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(Number(event.target.value) as 6000 | 5000 | 4000 | 3000 | 2000)}
      className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
