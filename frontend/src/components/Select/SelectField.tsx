import { useState, useRef, useEffect } from "react";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: Option[];
};

export function SelectField({ label, value, onChange, options }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  return (
    <div ref={ref} className="relative flex w-full rounded-md border">
      <div className="flex items-center px-3 bg-muted text-muted-foreground text-xs border-r">
        {label}
      </div>
      <div
        className="flex-1 px-3 bg-white/50 backdrop-blur-md cursor-pointer text-left text-xs flex items-center w-[20rem] truncate"
        onClick={() => setOpen((o) => !o)}
      >
        {selectedLabel}
      </div>

      {open && (
        <ul className="absolute left-0 right-0 mt-1 bg-white/50 backdrop-blur-md rounded-md shadow-lg border border-white/30 z-10 max-h-60 overflow-auto text-xs">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-3 py-2 cursor-pointer hover:bg-red-500/30 ${
                opt.value === value ? "font-semibold" : ""
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
