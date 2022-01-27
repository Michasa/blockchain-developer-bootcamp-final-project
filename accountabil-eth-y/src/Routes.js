import { Route, Routes } from "react-router-dom";
import { Layout, Start, Define } from "./pages";
import { MetaMaskInterfaceProvider } from "./contexts/MetaMaskInterface.js";
import "./styles/index.scss";

function App() {
  return (
    <MetaMaskInterfaceProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="start" element={<Start />} />
          <Route path="my-promise">
            <Route path="define" element={<Define />} />
          </Route>
        </Route>
      </Routes>
    </MetaMaskInterfaceProvider>
  );
}

export default App;
