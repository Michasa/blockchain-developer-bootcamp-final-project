import { Route, Routes } from "react-router-dom";
import {
  Layout,
  Start,
  DefinePromise,
  Nominate,
  CreateContract,
  CheckIn,
  Cashout,
  NotFound,
} from "./pages";
import { MetaMaskInterfaceProvider } from "./contexts/MetaMaskInterface.js";
import "./styles/index.scss";

function App() {
  return (
    <MetaMaskInterfaceProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Start />} />
          <Route path="create-contract" element={<CreateContract />} />
          <Route path="my-promise">
            <Route exact path="create" element={<DefinePromise />} />
            <Route exact path="nominate" element={<Nominate />} />
            <Route exact path="check-in" element={<CheckIn />} />
            <Route exact path="cashout" element={<Cashout />} />
            <Route index element={<NotFound />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MetaMaskInterfaceProvider>
  );
}

export default App;
