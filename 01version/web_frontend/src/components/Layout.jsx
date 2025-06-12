import { Outlet } from "react-router-dom";
import Header from "./Header"; // You'll need to create this
import Footer from "./Footer"; // You'll need to create this

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* This is where your page content will be rendered */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;