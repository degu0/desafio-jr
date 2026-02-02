import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import { AuthProvider } from "./context/AuthContext";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
