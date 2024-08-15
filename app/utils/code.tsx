export function code({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }): JSX.Element {
    return <code className={className}>{children}</code>;
  }