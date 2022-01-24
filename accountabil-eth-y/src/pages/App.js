// import logo from "./logo.svg";
import "../styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Submit from "./Submit";
import Cashout from "./Cashout";
import Create from "./Create";

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     {/* <img src={logo} className="App-logo" alt="logo" /> */}
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="create" element={<Create />} />
          <Route path="submit" element={<Submit />} />
          <Route path="cashout" element={<Cashout />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
    // </div>
  );
}

export default App;
