import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormMessageProps {
  type?: "error" | "success";
  children?: React.ReactNode;
}

/** Server action'dan dönen hata/başarı mesajı — `children` boşsa hiçbir şey render etmez. */
export function FormMessage({ type = "error", children }: FormMessageProps) {
  if (!children) return null;

  const isError = type === "error";
  const Icon = isError ? CircleAlert : CircleCheck;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-md border px-4 py-3 text-sm",
        isError ? "border-stock-out/40 bg-stock-out/10 text-stock-out" : "border-stock-in/40 bg-stock-in/10 text-stock-in",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
