import type {
  ButtonHTMLAttributes, InputHTMLAttributes, Ref, SelectHTMLAttributes, TextareaHTMLAttributes,
} from 'react';

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ');

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cx(
        'rounded-md border border-border bg-panel px-2.5 py-1 text-[13px] leading-5 transition-colors',
        'hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        'disabled:pointer-events-none disabled:opacity-40',
        className
      )}
      {...props}
    />
  );
}

export function IconButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cx(
        'grid h-7 w-7 place-items-center rounded-md text-[15px] leading-none transition-colors',
        'hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        className
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ref,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  return (
    <input
      ref={ref}
      className={cx(
        'rounded-md border border-border bg-bg px-2 py-1 text-[13px]',
        'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, onKeyDown, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const next = el.value.slice(0, start) + '  ' + el.value.slice(el.selectionEnd);
      // React overrides the value setter on controlled elements; use the native
      // prototype setter + an input event so React's onChange sees the edit.
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!;
      setter.call(el, next);
      el.setSelectionRange(start + 2, start + 2);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };
  return (
    <textarea
      className={cx(
        'rounded-md border border-border bg-bg px-2 py-1 font-mono text-xs',
        'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y',
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cx(
        'rounded-md border border-border bg-bg px-2 py-1 text-[13px]',
        'focus:outline-none focus:ring-2 focus:ring-accent/50',
        className
      )}
      {...props}
    />
  );
}
