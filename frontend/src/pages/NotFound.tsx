import { useMemo } from "react";
import { useRouteError } from "react-router-dom";

interface BaseError {
  message?: string;
  status: number;
  statusText: string;
}

interface RouterError extends BaseError {
  data: unknown;
  error: Record<string, string>;
  internal: boolean;
}

export const NotFound = () => {
  const routerError = useRouteError() as RouterError;

  const error = useMemo<BaseError>(() => {
    switch (routerError.status) {
      case 403:
        // Comes from throw new AppError with this specific code.
        return routerError;
      case 404:
        // Comes from not found bubbling.
        return {
          status: routerError.status,
          statusText: routerError.statusText,
          message: "The page you are looking for could not be found.",
        };
      default:
        // Comes from application throwing error or internal error.
        return {
          status: routerError.status,
          statusText: routerError.statusText,
          message: routerError.message,
        };
    }
  }, [routerError]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <p className="text-neutral-tertiary">{error.status}</p>
        <h1 className="text-2xl font-bold">{error.statusText}</h1>
      </div>
      <p>{error.message}</p>
    </div>
  );
};
