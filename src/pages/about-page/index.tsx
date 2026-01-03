import Container from "../../components/shared/container";
import Testimonials from "../../components/shared/testimonials";
import TextCard from "../../components/shared/text-card";

const AboutData = [
  {
    id: "1",
    icon: "/images/about/24x7-consultant.png",
    description: "24X7 Consultant",
  },
  {
    id: "2",
    icon: "/images/about/100- quality-assurance.png",
    description: "100% Quality Manpower",
  },
  {
    id: "3",
    icon: "/images/about/skilled-and-non-skilled-manpower.png",
    description: "Skilled and Non Skilled Manpower",
  },
  {
    id: "4",
    icon: "/images/about/easiest-way-to-get-service.png",
    description: "Easiest way to Get Service",
  },
  {
    id: "5",
    icon: "/images/about/india-best-manpower-service-provider.png",
    description: "India’s Best Manpower Service Provider",
  },
  {
    id: "6",
    icon: "/images/about/have-100000+-more-manpower.png",
    description: "Have 100000+ More Manpower",
  },
  {
    id: "7",
    icon: "/images/about/across-india-manpower-service-delivery.png",
    description: "Across India Manpower delivery",
  },
  {
    id: "8",
    icon: "/images/about/day-and-night-manpower.png",
    description: "Day & Night Shift Manpower",
  },
  {
    id: "9",
    icon: "/images/about/instant-manpower-service-at-your-doostep.png",
    description: "Instant Manpower Service at your Doorstep",
  },
];

const AboutPage = () => {
  return (
    <div>
      <Container className="mt-10 mb-[100px] space-y-6">
        <div className="space-y-10">
          {/* ABOUT */}
          <div className="relative">
            <div className="lg:float-right lg:w-1/2 lg:ml-6 mb-6">
              <img src="/images/road.jpg" alt="Construction site" className="rounded-lg shadow-lg" />
            </div>
            <div className="prose max-w-none space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Who We Are</h2>
              <p>
                We are India's First Online Construction Manpower Service provider at doorstep and construction sites.
              </p>
              <p>
                Dehatwala delivers direct labour to construction sites. Construction companies use our platform to book
                services such as shuttering Carpenter, Bar Bender, concrete casting worker, welder Fitter, Plumber,
                Brick Masonry work, Tile flooring Mason, Plaster Worker, Tile stones worker, Excavation and Earth work
                worker, and other Mason helper etc. These services are delivered to their doorstep and construction site
                at a time of their choosing.
              </p>
              <p>
                Dehatwala.com provides a platform that allows construction skilled workers, unskilled workers,
                semi-skilled workers, trainees, non-trainees, professionals, and experienced workers to connect with
                construction companies looking for specific construction work. We help increase income opportunities and
                provide the easiest way to get a job for construction workers. Dehatwala's vision is to help make this
                labour market trustworthy, transparent, and efficient, thereby helping construction companies find labor
                more easily and construction workers find jobs through our portal.
              </p>
              <p>
                Dear user, we are happy to tell you that we are one of the most trustworthy online construction manpower
                providers in India that connect the construction manpower directly to the construction sites and other
                doorsteps.
              </p>
            </div>
          </div>
          {/* Our vision */}
          <div className="relative">
            <div className="lg:float-left lg:w-1/2 lg:mr-6 mb-6">
              <img src="/images/road.jpg" alt="Construction site" className="rounded-lg shadow-lg" />
            </div>
            <div className="prose max-w-none space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold">Our vision &amp; mission</h2>
              <p>
                Our vision is to simplify,this hiring Process by Providing Single Platform that could minimize the Gap
                Between Construction company and construction labourers and empowering them with the right job as per
                their skills
              </p>
              <p>
                we have created our working System and Portal in such a way that where in the Construction company and
                Construction labourers do not to have to go Anywhere and Get Service with just single click.it is
                generally seen that construction company Face a lot of difficulties in Finding labourers and we have
                been working to solve this problem and reduce the gap between the Construction Industry and the
                Construction laborers
              </p>
              <p>
                Dehatwala.com Ultimate goal is to Provide the right job to the rural and urban labourer through our
                Portal and to Provide affordable and competent labor to the construction Industry with Ease and in less
                time.
              </p>
            </div>
          </div>
          {/* Why Dehatwala**/}
          <div className="relative">
            <div className="lg:float-right lg:w-1/2 lg:ml-6 mb-6">
              <img src="/images/road.jpg" alt="Construction site" className="rounded-lg shadow-lg" />
            </div>
            <div className="prose max-w-none space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold">Why We are the best choice</h2>
              <p>
                India has nearly 70 million construction workers, and more than 30% workers are migrant and nomadic.
              </p>
              <p>
                Our aim Is to connect these Labourers with direct Construction site through our Portal and to Provide
                right jobs to the Construction labourers and Protect their basic right and we are continuously
                succeeding is this mission.
              </p>
              <p>Dehatwala.com Provide affordable labor to the construction site at their chosen time and date..</p>
              <p>
                This service lasts for the duration of a fixed Contract Between dehatwala and the construction company.
                You Can avail this Service, with just a single click on our portal.
              </p>
              <p>
                Registration of any New construction worker. On our Portal is completely free of cost and we are very
                happy to inform you that millions of construction labourers have already Joined us. whom we deliver to
                the Construction site as per requirements of the construction companies.
              </p>
              <p>
                Dehatwala do not compromise at all on the Basic Right, Health, and safety Parameters of our construction
                Labourers. We consider construction companies to provide services only after obtaining acceptance and
                consent to our policies or Term and Conditions.. we Pride our Selves on Maintaining the highest standard
                of labour quality.
              </p>
            </div>
          </div>
        </div>

        {/* WHY US */}
        <div className="pb-16">
          <div className="mt-[100px]">
            <h2 className="text-2xl font-semibold my-5 text-center">Why Choose us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AboutData.map((data) => (
              <TextCard key={data.id} data={data} />
            ))}
          </div>
        </div>
        <div>
          <Testimonials />
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;
