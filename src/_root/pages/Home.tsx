import LeftSidebar from '@/components/shared/LeftSidebar';
import Topbar from '@/components/shared/Topbar';

const Home = () => {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full"></section>
    </div>
  );
};

export default Home;
