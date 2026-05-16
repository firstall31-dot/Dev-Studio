import type { CVPersonalInfo } from "@/types/cv";
import { Input } from "@/components/tools/shared";

interface CVPersonalProps {
  data: CVPersonalInfo;
  onChange: (data: CVPersonalInfo) => void;
}

export function CVPersonal({ data, onChange }: CVPersonalProps) {
  const update = (key: keyof CVPersonalInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [key]: e.target.value });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" required>
          <Input type="text" value={data.name || ""} onChange={update("name")} placeholder="John Doe" />
        </Field>
        <Field label="Professional Title">
          <Input type="text" value={data.title || ""} onChange={update("title")} placeholder="Senior Frontend Engineer" />
        </Field>
        <Field label="Email" required>
          <Input type="email" value={data.email || ""} onChange={update("email")} placeholder="john@example.com" />
        </Field>
        <Field label="Phone">
          <Input type="text" value={data.phone || ""} onChange={update("phone")} placeholder="+1 (555) 000-0000" />
        </Field>
        <Field label="Location">
          <Input type="text" value={data.location || ""} onChange={update("location")} placeholder="San Francisco, CA" />
        </Field>
        <Field label="LinkedIn">
          <Input type="text" value={data.linkedin || ""} onChange={update("linkedin")} placeholder="linkedin.com/in/johndoe" />
        </Field>
        <Field label="GitHub">
          <Input type="text" value={data.github || ""} onChange={update("github")} placeholder="github.com/johndoe" />
        </Field>
        <Field label="Website / Portfolio">
          <Input type="text" value={data.website || ""} onChange={update("website")} placeholder="johndoe.dev" />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
