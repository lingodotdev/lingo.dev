import { cn } from "./ui/utils";

function Page({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-screen overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function PageHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b",
        className,
      )}
      {...props}
    />
  );
}

function PageContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto p-4", className)}
      {...props}
    />
  );
}

export { Page, PageHeader, PageContent };
