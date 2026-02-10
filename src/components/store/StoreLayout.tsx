import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import CartDrawer from "./CartDrawer";
import Footer from "./Footer";

const StoreLayout = () => {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <CartDrawer />
    </div>
  );
};

export default StoreLayout;
