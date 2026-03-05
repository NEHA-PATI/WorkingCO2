import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

function composeEventHandlers(original, next) {
  return (event) => {
    original?.(event);
    if (!event.defaultPrevented) {
      next?.(event);
    }
  };
}

function useControllableState({ prop, defaultProp, onChange }) {
  const [uncontrolled, setUncontrolled] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolled;

  const setValue = useCallback(
    (nextValue) => {
      const resolvedValue =
        typeof nextValue === "function" ? nextValue(value) : nextValue;

      if (!isControlled) {
        setUncontrolled(resolvedValue);
      }

      if (resolvedValue !== value) {
        onChange?.(resolvedValue);
      }
    },
    [isControlled, onChange, value],
  );

  return [value, setValue];
}

function nodeToText(node) {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(nodeToText).join(" ").replace(/\s+/g, " ").trim();
  }
  if (React.isValidElement(node)) {
    return nodeToText(node.props.children);
  }
  return "";
}

const ChevronDownIcon = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    className={className}
    aria-hidden="true"
  >
    <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 10.5L8 14.5L16 6.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    className={className}
    aria-hidden="true"
  >
    <path d="M5 5L15 15M15 5L5 15" strokeLinecap="round" />
  </svg>
);

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-card hover:from-brand-700 hover:to-brand-600",
        outline:
          "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        destructive: "bg-rose-600 text-white hover:bg-rose-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export const Button = React.forwardRef(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-100 text-brand-800",
        secondary: "border-slate-200 bg-slate-100 text-slate-700",
        outline: "border-slate-300 bg-transparent text-slate-700",
        destructive: "border-transparent bg-rose-100 text-rose-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white/95 shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 border-b border-slate-100 p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("font-display text-lg font-semibold leading-tight text-slate-900", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6", className)} {...props} />;
}

export const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
      "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[96px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
      "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({ className, ...props }) {
  return (
    <label
      className={cn("text-sm font-medium leading-none text-slate-700", className)}
      {...props}
    />
  );
}

const SwitchBase = cva(
  "inline-flex h-6 w-11 items-center rounded-full border border-transparent transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      checked: {
        true: "bg-brand-600",
        false: "bg-slate-300",
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

export const Switch = React.forwardRef(
  (
    { className, checked, defaultChecked = false, onCheckedChange, disabled, ...props },
    ref,
  ) => {
    const [isChecked, setIsChecked] = useControllableState({
      prop: checked,
      defaultProp: defaultChecked,
      onChange: onCheckedChange,
    });

    const toggle = () => {
      if (!disabled) {
        setIsChecked((previous) => !previous);
      }
    };

    return (
      <button
        ref={ref}
        role="switch"
        type="button"
        aria-checked={Boolean(isChecked)}
        data-state={isChecked ? "checked" : "unchecked"}
        disabled={disabled}
        className={cn(SwitchBase({ checked: Boolean(isChecked) }), className)}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            toggle();
          }
        }}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            isChecked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    );
  },
);
Switch.displayName = "Switch";

const TabsContext = createContext(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within <Tabs>");
  }
  return context;
}

export function Tabs({ value, defaultValue, onValueChange, className, ...props }) {
  const [currentValue, setCurrentValue] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const contextValue = useMemo(
    () => ({
      value: currentValue,
      onValueChange: setCurrentValue,
    }),
    [currentValue, setCurrentValue],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className} {...props} />
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, value, ...props }) {
  const { value: currentValue, onValueChange } = useTabsContext();
  const active = currentValue === value;

  return (
    <button
      role="tab"
      type="button"
      data-state={active ? "active" : "inactive"}
      aria-selected={active}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors",
        "hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2",
        "data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm",
        className,
      )}
      onClick={() => onValueChange?.(value)}
      {...props}
    />
  );
}

export function TabsContent({ className, value, ...props }) {
  const { value: currentValue } = useTabsContext();

  if (currentValue !== value) {
    return null;
  }

  return <div role="tabpanel" className={cn("outline-none", className)} {...props} />;
}

const SelectContext = createContext(null);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within <Select>");
  }
  return context;
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  disabled,
}) {
  const [currentValue, setCurrentValue] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState({});
  const rootRef = useRef(null);

  const registerOption = useCallback((optionValue, label) => {
    if (!optionValue) {
      return;
    }

    setLabels((previous) => {
      if (previous[optionValue] === label) {
        return previous;
      }
      return { ...previous, [optionValue]: label };
    });
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current) {
        return;
      }
      if (!rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const contextValue = useMemo(
    () => ({
      value: currentValue,
      setValue: setCurrentValue,
      open,
      setOpen,
      labels,
      registerOption,
      disabled: Boolean(disabled),
    }),
    [currentValue, setCurrentValue, open, labels, registerOption, disabled],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={rootRef} className={cn("relative", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = React.forwardRef(
  ({ className, children, onClick, disabled, ...props }, ref) => {
    const selectContext = useSelectContext();
    const isDisabled = selectContext.disabled || disabled;

    return (
      <button
        ref={ref}
        type="button"
        data-state={selectContext.open ? "open" : "closed"}
        aria-expanded={selectContext.open}
        aria-haspopup="listbox"
        disabled={isDisabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
          "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        onClick={composeEventHandlers(onClick, () => {
          if (!isDisabled) {
            selectContext.setOpen(!selectContext.open);
          }
        })}
        {...props}
      >
        <span className="flex min-w-0 flex-1 items-center">{children}</span>
        <ChevronDownIcon
          className={cn(
            "ml-2 h-4 w-4 shrink-0 text-slate-500 transition-transform",
            selectContext.open && "rotate-180",
          )}
        />
      </button>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

export function SelectValue({ placeholder = "Select option", className }) {
  const { value, labels } = useSelectContext();
  const label = value !== undefined && value !== null ? labels[value] : undefined;

  return (
    <span className={cn("truncate text-left", !label && "text-slate-400", className)}>
      {label || placeholder}
    </span>
  );
}

export function SelectContent({ className, children, ...props }) {
  const { open } = useSelectContext();

  return (
    <div
      className={cn(
        "absolute left-0 top-[calc(100%+0.5rem)] z-50 max-h-64 min-w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-soft",
        !open && "hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({ className, value, children, ...props }) {
  const { value: selectedValue, setValue, setOpen, registerOption } = useSelectContext();
  const label = nodeToText(children);

  useEffect(() => {
    registerOption(value, label);
  }, [label, registerOption, value]);

  const selected = selectedValue === value;

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors",
        "hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
        selected && "bg-brand-100 text-brand-900",
        className,
      )}
      onClick={() => {
        setValue(value);
        setOpen(false);
      }}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {selected && <CheckIcon className="ml-2 h-4 w-4 shrink-0" />}
    </button>
  );
}

const DialogContext = createContext(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within <Dialog>");
  }
  return context;
}

export function Dialog({ open, defaultOpen = false, onOpenChange, children }) {
  const [isOpen, setIsOpen] = useControllableState({
    prop: open,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const contextValue = useMemo(
    () => ({
      open: Boolean(isOpen),
      setOpen: setIsOpen,
    }),
    [isOpen, setIsOpen],
  );

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ asChild = false, children, onClick, ...props }) {
  const { setOpen } = useDialogContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: composeEventHandlers(children.props.onClick, (event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(true);
        }
      }),
    });
  }

  return (
    <button
      type="button"
      onClick={composeEventHandlers(onClick, () => setOpen(true))}
      {...props}
    >
      {children}
    </button>
  );
}

export function DialogContent({ className, children, ...props }) {
  const { open, setOpen } = useDialogContext();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, setOpen]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog overlay"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-soft",
          className,
        )}
        {...props}
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          onClick={() => setOpen(false)}
        >
          <XIcon className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("mb-4 flex flex-col space-y-1.5 pr-8 text-left", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn("font-display text-lg font-semibold text-slate-900", className)}
      {...props}
    />
  );
}

export function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        "border-b border-slate-200/80 transition-colors hover:bg-slate-50/80",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        "h-11 px-3 text-left align-middle text-xs font-semibold uppercase tracking-[0.08em] text-slate-600",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return <td className={cn("p-3 align-middle text-sm", className)} {...props} />;
}

export function Avatar({ className, ...props }) {
  return (
    <div
      className={cn(
        "relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100",
        className,
      )}
      {...props}
    />
  );
}

export const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("h-full w-full object-cover", className)}
    alt={props.alt ?? ""}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

export function AvatarFallback({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-slate-200 text-xs font-semibold text-slate-700",
        className,
      )}
      {...props}
    />
  );
}
