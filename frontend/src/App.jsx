import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./app/providers/AppProviders";
import AppRoutes from "./app/routes/AppRoutes";

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
