import { Button } from '@/components/ui/button';

export type TextSize = 'small' | 'medium' | 'large';
export function TextSizeControl({ value, onChange }: { value: TextSize; onChange: (value: TextSize) => void }) {
  return <fieldset className="text-size-setting"><legend>Text size</legend><div role="group" aria-label="Text size">{(['small', 'medium', 'large'] as const).map(size => <Button key={size} variant={value === size ? 'secondary' : 'ghost'} aria-pressed={value === size} onClick={() => onChange(size)}>{size[0]?.toUpperCase()}{size.slice(1)}</Button>)}</div></fieldset>;
}