import React from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

// Card Components
export const Card = ({ className = "", color = "", children, ...props }) => (
  <motion.div
    className={`card ${color} ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.02 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const CardHeader = ({ className = "", children, ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = "", children, ...props }) => (
  <h3 className={`card-title ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className = "", children, ...props }) => (
  <p className={`card-description ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className = "", children, ...props }) => (
  <div className={`card-content ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = "", children, ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

// Button Component
export const Button = ({
  className = "",
  variant = "default",
  size = "default",
  children,
  ...props
}) => {
  const variantClass = `button-${variant}`;
  const sizeClass = `button-${size}`;

  return (
    <motion.button
      className={`button ${variantClass} ${sizeClass} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Badge Component
export const Badge = ({ className = "", variant = "default", color = "", children, ...props }) => (
  <motion.span
    className={`badge badge-${variant} ${color} ${className}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
    {...props}
  >
    {children}
  </motion.span>
);

// Input Component
export const Input = ({ className = "", type = "text", ...props }) => (
  <motion.input
    type={type}
    className={`input ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    {...props}
  />
);

// Label Component
export const Label = ({ className = "", children, ...props }) => (
  <label className={`label ${className}`} {...props}>
    {children}
  </label>
);

// Textarea Component
export const Textarea = ({ className = "", ...props }) => (
  <motion.textarea
    className={`textarea ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    {...props}
  />
);

// Progress Component
export const Progress = ({ value, className = "", ...props }) => (
  <div className={`progress ${className}`} {...props}>
    <motion.div
      className="progress-bar"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      initial={{ transform: "translateX(-100%)" }}
      animate={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      transition={{ duration: 0.5 }}
    />
  </div>
);

// Avatar Components
export const Avatar = ({ className = "", children, ...props }) => (
  <div className={`avatar ${className}`} {...props}>
    {children}
  </div>
);

export const AvatarImage = ({ className = "", ...props }) => (
  <img className={`avatar-image ${className}`} {...props} />
);

export const AvatarFallback = ({ className = "", children, ...props }) => (
  <div className={`avatar-fallback ${className}`} {...props}>
    {children}
  </div>
);

// Dialog Components
export const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <div>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { open, onOpenChange }) : child
      )}
    </div>
  );
};

export const DialogTrigger = ({ asChild, children, onOpenChange, ...props }) => {
  const handleClick = () => onOpenChange && onOpenChange(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick, ...props });
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export const DialogContent = ({ className = "", children, open, onOpenChange, ...props }) => {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onOpenChange && onOpenChange(false);
  };

  // Create portal to render dialog at document body level
  return ReactDOM.createPortal(
    <motion.div
      className="dialog-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
    >
      <motion.div
        className={`dialog-content ${className}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        <button
          className="dialog-close"
          onClick={() => onOpenChange && onOpenChange(false)}
          aria-label="Close dialog"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div>{children}</div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export const DialogHeader = ({ className = "", children, ...props }) => (
  <div className={`dialog-header ${className}`} {...props}>
    {children}
  </div>
);

export const DialogTitle = ({ className = "", children, ...props }) => (
  <h2 className={`dialog-title ${className}`} role="heading" aria-level="2" {...props}>
    {children}
  </h2>
);

export const DialogDescription = ({ className = "", children, ...props }) => (
  <p className={`dialog-description ${className}`} {...props}>
    {children}
  </p>
);

// Select Components
export const Select = ({ children, value, onValueChange }) => (
  <motion.select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="select"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.select>
);

export const SelectTrigger = ({ children, className = "" }) => (
  <div className={`select ${className}`}>
    {children}
  </div>
);

export const SelectContent = ({ children }) => children;

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

export const SelectValue = ({ placeholder }) => (
  <span className="text-secondary">{placeholder}</span>
);

// Table Components
export const Table = ({ className = "", children, ...props }) => (
  <div className="table-container">
    <table className={`table ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ className = "", children, ...props }) => (
  <thead className={`table-header ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ className = "", children, ...props }) => (
  <tbody className={`table-body ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ className = "", children, ...props }) => (
  <motion.tr
    className={`table-row ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.tr>
);

export const TableHead = ({ className = "", children, ...props }) => (
  <th className={`table-head ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell = ({ className = "", children, ...props }) => (
  <td className={`table-cell ${className}`} {...props}>
    {children}
  </td>
);

// Dropdown Menu Components
export const DropdownMenu = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="dropdown-menu">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
  );
};

export const DropdownMenuTrigger = ({ children, open, setOpen }) => (
  <div onClick={() => setOpen(!open)}>{children}</div>
);

export const DropdownMenuContent = ({ children, open, setOpen, align = "left", className = "" }) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <motion.div
        className={`dropdown-content ${align === "end" ? "right-0" : "left-0"} ${className}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export const DropdownMenuItem = ({ className = "", children, onClick, ...props }) => (
  <motion.div
    className={`dropdown-item ${className}`}
    onClick={onClick}
    whileHover={{ backgroundColor: "var(--color-card-bg-hover)" }}
    {...props}
  >
    {children}
  </motion.div>
);

// Switch Component
export const Switch = ({ checked, onCheckedChange, className = "", ...props }) => (
  <motion.button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`switch ${checked ? "switch-checked" : ""} ${className}`}
    whileTap={{ scale: 0.95 }}
    {...props}
  >
    <span className="switch-knob" />
  </motion.button>
);

// ScrollArea Component
export const ScrollArea = ({ className = "", children, ...props }) => (
  <div className={`scroll-area ${className}`} {...props}>
    {children}
  </div>
);

// Tabs root wrapper component
export const Tabs = ({ children, value, onValueChange, defaultValue, className = "", ...props }) => {
  const [internalTab, setInternalTab] = React.useState(defaultValue || value);
  const activeTab = value !== undefined ? value : internalTab;

  const handleValueChange = (newValue) => {
    if (onValueChange) onValueChange(newValue);
    if (value === undefined) setInternalTab(newValue); // Uncontrolled mode
  };

  return (
    <div className={`tabs ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        const type = child.type;

        if (type === TabsList) {
          return React.cloneElement(child, {
            activeTab,
            onValueChange: handleValueChange,
          });
        }

        if (type === TabsContent) {
          return React.cloneElement(child, {
            activeTab,
          });
        }

        return child;
      })}
    </div>
  );
};

// TabsList groups triggers
export const TabsList = ({ children, className = "", activeTab, onValueChange, ...props }) => (
  <div className={`tabs-list ${className}`} {...props}>
    {React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      if (child.type === TabsTrigger) {
        return React.cloneElement(child, {
          activeTab,
          onValueChange,
        });
      }

      return child;
    })}
  </div>
);

// Tab trigger (individual tab button)
export const TabsTrigger = ({ children, value, className = "", activeTab, onValueChange, ...props }) => (
  <motion.button
    type="button"
    className={`tabs-trigger ${activeTab === value ? "tabs-trigger-active" : ""} ${className}`}
    onClick={() => onValueChange?.(value)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    {...props}
  >
    {children}
  </motion.button>
);

// Tab content (only shown when active)
export const TabsContent = ({ children, value, className = "", activeTab, ...props }) => {
  if (activeTab !== value) return null;

  return (
    <motion.div
      className={`tabs-content ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};