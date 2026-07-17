import { AuthProvider } from "./AuthProvider";
import { HabitsProvider } from "./HabitsProvider";
import { ToastProvider } from "./ToastProvider";

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <HabitsProvider>{children}</HabitsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
