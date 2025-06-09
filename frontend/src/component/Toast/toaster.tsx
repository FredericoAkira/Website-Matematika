import { cn } from "../utils";
import { useToast } from "./hooks";
import { Toast } from "./index";


export function Toaster() {
  const { toasts } = useToast();

  return (
    <Toast.Provider>
      {toasts.map(function ({ id, title, description, icon, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
          >
            {icon && (
              <div className={cn(title && description && "self-stretch text-red-400")}>
                {icon}
              </div>
            )}
            <div className={cn("grid gap-0 flex-1", !icon && "ml-2")}>
              {title && <Toast.Title>{title}</Toast.Title>}
              {description && (
                <Toast.Description>{description}</Toast.Description>
              )}
            </div>
            <Toast.Close />
          </Toast>
        );
      })}
      <Toast.Viewport />
    </Toast.Provider>
  );
}
