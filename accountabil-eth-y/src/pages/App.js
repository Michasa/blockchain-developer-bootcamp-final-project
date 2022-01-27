// import logo from "./logo.svg";
import "../styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./_layout";
import Submit from "./Submit";
import Cashout from "./Cashout";
import Define from "./Define";
import Create from "./Create";
import Start from "./Start";
import Nominee from "./Nominee";

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
      <Layout>
        <Routes>
          <Route path="/" element={<Start />} />{" "}
          <Route path="/create" element={<Create />} />
          <Route path="/my-promise">
            <Route index element={<h1>404</h1>} />
            <Route path="nominee" element={<Nominee />} />
            <Route path="define" element={<Define />} />
            <Route path="submit" element={<Submit />} />
            <Route path="cashout" element={<Cashout />} />
          </Route>
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>404 not found</p>
              </main>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
    // </div>
  );
}

export default App;
