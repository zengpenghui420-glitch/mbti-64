import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function AccessDialog({
  open,
  busy,
  error,
  initialCode,
  onClose,
  onSubmit,
}: {
  open: boolean;
  busy: boolean;
  error: string;
  initialCode: string;
  onClose: () => void;
  onSubmit: (code: string) => void;
}) {
  const [code, setCode] = useState(initialCode);

  if (!open) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit(code);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#f6f1ea]/80 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="access-title"
        className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-xl ring-1 ring-foreground/10"
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="access-title" className="text-xl font-semibold">
            输入验证码
          </h2>
          <button type="button" className="text-sm text-muted-foreground" onClick={onClose}>
            关闭
          </button>
        </div>
        <label className="mt-4 grid gap-2 text-sm" htmlFor="access-code">
          <span className="text-muted-foreground">验证码</span>
          <input
            id="access-code"
            value={code}
            autoFocus
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            maxLength={16}
            onChange={(event) => setCode(event.target.value)}
            className="h-12 rounded-full border bg-white px-4 text-base tracking-widest outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            placeholder="MB····"
          />
        </label>
        {error ? (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" variant="gold" size="xl" className="mt-4 w-full" disabled={busy}>
          {busy ? "验证中…" : "确认"}
        </Button>
      </form>
    </div>
  );
}

export function AccessToast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-foreground/10">
      {message}
    </div>
  );
}
