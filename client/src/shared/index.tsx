import { Loader2 } from "lucide-react";
type NotificationVariant = "success" | "error" | "warning" | "info";

interface NotificationOptions {
  variant?: NotificationVariant;
  duration?: number;
}

interface DataInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  error?: string;
}
interface TextAreaInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  title?: string;
  error?: string;
}
interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  title?: string;
  error?: string;
}

type LoaderProps = {
  size?: number;
  color?: string;
  className?: string;
};

export const Loader: React.FC<LoaderProps> = ({
  size = 48,
  color = "text-blue-500",
  className = "",
}) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className={`animate-spin ${color} ${className}`} size={size} />
    </div>
  );
};

export const DateInput = ({ title, error, ...props }: DataInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {title && (
        <label className="font-medium" htmlFor={title}>
          {title}
        </label>
      )}
      <input
        type="date"
        id={title}
        name={title}
        {...props}
        className={`w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none ${
          props.className
        }`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const TextInput = ({ title, error, ...props }: DataInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {title && (
        <label className="font-medium" htmlFor={title}>
          {title}
        </label>
      )}
      <input
        type="text"
        id={title}
        name={title}
        {...props}
        className={`w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none ${
          props.className
        }`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const TextAreaInput = ({
  title,
  error,
  ...props
}: TextAreaInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {title && (
        <label className="font-medium" htmlFor={title}>
          {title}
        </label>
      )}
      <textarea
        rows={4}
        cols={50}
        id={title}
        name={title}
        {...props}
        className={`w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none ${
          props.className
        }`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const SelectInput = ({ title, error, ...props }: SelectInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {title && (
        <label className="font-medium" htmlFor={title}>
          {title}
        </label>
      )}
      <select
        id={title}
        name={title}
        {...props}
        className={`w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none ${
          props.className
        }`}
      >
        {props.children}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Notifications

export const showNotification = (
  message: string,
  options: NotificationOptions = {},
) => {
  const { variant = "success", duration = 3000 } = options;

  // You'll need to import and use enqueueSnackbar from wherever you're calling this
  return {
    message,
    options: {
      variant,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
      autoHideDuration: duration,
    },
  };
};

// Helper function to directly show notification if enqueueSnackbar is available
export const notify = (
  enqueueSnackbar: (message: string, options?: any) => void,
  message: string,
  options: NotificationOptions = {},
) => {
  const notification = showNotification(message, options);
  enqueueSnackbar(notification.message, notification.options);
};
