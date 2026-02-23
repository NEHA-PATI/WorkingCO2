import { ModalProvider } from "@contexts/ModalContext";
import AppRoutes from "@routes/AppRoutes";
import ScrollToTop from "@shared/components/ScrollToTop";

function App() {
  return (
    <ModalProvider>
      <ScrollToTop />
      <AppRoutes />
    </ModalProvider>
  );
}

export default App;
