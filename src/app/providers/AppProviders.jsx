import { AuthProvider } from "./AuthProvider";
import { HabitsProvider } from "./HabitsProvider";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <HabitsProvider>{children}</HabitsProvider>
    </AuthProvider>
  );
}
