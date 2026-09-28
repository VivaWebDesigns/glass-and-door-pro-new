import { FormControl, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

/** Bordered label/description row with a switch, for use inside a react-hook-form `FormItem`. */
export function SwitchFieldRow({
  label,
  description,
  checked,
  onCheckedChange,
  testId,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  testId?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
      <div>
        <FormLabel className="text-sm font-medium cursor-pointer">{label}</FormLabel>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <FormControl>
        <Switch checked={checked} onCheckedChange={onCheckedChange} data-testid={testId} />
      </FormControl>
    </div>
  );
}
