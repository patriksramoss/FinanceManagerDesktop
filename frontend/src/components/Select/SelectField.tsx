type Props = {
  label: string;
  children: React.ReactNode;
};

export function SelectField({ label, children }: Props) {
  return (
    <div className="flex w-full rounded-md border overflow-hidden">
      <div className="flex items-center px-3 bg-muted text-muted-foreground text-xs border-r">
        {label}
      </div>

      <select className="flex-1 px-3 width-[8rem] truncate bg-background focus:outline-none focus:ring-2 text-xs focus:ring-primary">
        {children}
      </select>
    </div>
  );
}
