import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import InfoBar from "../components/InfoBar";

const Layout = () => (
  <>
    <header>
      <InfoBar />
    </header>
    <div className="content">
      <Outlet />
    </div>
    <footer>
      <Footer />
    </footer>
  </>
);

export default Layout;
