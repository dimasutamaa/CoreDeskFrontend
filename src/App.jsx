import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import SessionExpiredHandler from "./handler/SessionExpiredHandler";

function App() {
  return (
    <BrowserRouter>
      <SessionExpiredHandler /> 
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App