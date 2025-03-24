import Banner from "./Banner/Banner";
import BestSellingProducts from "./BestSellingProducts/BestSellingProducts";
import Faq from "./FAQ/FAQ";
import PopularCompany from "./PopularCompany/PopularCompany";

import ProductSlider from "./ProductCarousel/ProductCarousel";
import SubscriptionForm from "./SubscriptionForm/SubscriptionForm";
import Testimonials from "./Testimonials/Testimonials";
import TrendSection from "./TrendSection/TrendSection";

const Home = () => {
  return (
    <div>
      <Banner />
      <ProductSlider />
      <BestSellingProducts />
      <TrendSection />
      <PopularCompany />
      <Testimonials />
      <Faq />
      <SubscriptionForm />
    </div>
  );
};

export default Home;
