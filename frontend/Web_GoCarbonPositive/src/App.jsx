import { ModalProvider } from "@contexts/ModalContext";
import AppRoutes from "@routes/AppRoutes";

function App() {
  return (
    <ModalProvider>
      <AppRoutes />
    </ModalProvider>
  );
}

export default App;
