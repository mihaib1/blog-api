import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;