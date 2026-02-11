type WrapperProps = {
  children: React.ReactNode;
  height: number | string;
};

export function Wrapper({ children, height }: WrapperProps) {
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      style={{ height: resolvedHeight }}
      className="w-full overflow-hidden flex flex-col"
    >
      <div className="flex-1 min-h-0 w-full h-full">{children}</div>
    </div>
  );
}
