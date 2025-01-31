import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FormControl } from '../ui/form';

type TProps = {
  trigger: React.ReactNode | string | number
  options: Array<{ label: string; value: string }>
  onValueChange: (value: typeof SelectValue) => void | Promise<void> // eslint-disable-line @typescript-eslint/no-explicit-any
  value?: string | number,
  disabled?: boolean,
  className?: string,
  style?: React.CSSProperties,
  placeholder?: string,
  error?: string,
  defaultValue?: string | number
}

const SelectComponent = (props: TProps) => {
  const { trigger = '', options = [], onValueChange, value = '', defaultValue = '' } = props ?? {}

  return (
    <Select
      value={typeof value === 'number' ? String(value) : value}
      disabled={Boolean(props.disabled)}
      defaultValue={typeof defaultValue === 'number' ? String(defaultValue) : defaultValue}
      onValueChange={(value: string) => onValueChange(value as unknown as typeof SelectValue)}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={trigger} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map(select => (
          <SelectItem key={select.value} value={String(select.value)}>
            {select.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectComponent
