import Blogs from "../../components/home/blogs";
import Category from "../../components/home/category";
import Hero from "../../components/home/hero";
import HomeServices from "../../components/home/home-services";
import RecentJobs from "../../components/home/recents-jobs";
import SearchServices from "../../components/search-services";
import Container from "../../components/shared/container";
import Partners from "../../components/shared/partners";
// import SearchBox from "../../components/shared/search-box";
import Testimonials from "../../components/shared/testimonials";
import TawkMessenger from '../../components/shared/TawkMessenger'; // Adjust path if needed

const HomePage = () => {
  return (
    <section>
      <Hero />
      {/* <SearchBox setSearchQuery={() => {}} /> */}
      <SearchServices />
      <Container>
        <HomeServices />
      </Container>
      <div>
        <Category />
      </div>
      <div>
        <RecentJobs />
      </div>
      <div>
        <Partners />
      </div>
      <div>
        <Blogs />
      </div>
      <div>
        <Testimonials />
      </div>
      <div>
        <TawkMessenger />
      </div>
    </section>
  );
};

export default HomePage;
