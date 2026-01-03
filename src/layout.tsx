import { Outlet } from "react-router-dom";
import Header from "./components/shared/header";
import Footer from "./components/shared/footer";
import SmallHeader from "./components/shared/small-header";

const Layout = () => {
  return (
    <>
      <SmallHeader />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
