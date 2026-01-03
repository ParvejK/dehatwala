import Container from "../../components/shared/container";
import SmallBanner from "../../components/shared/small-banner";
import { useFetchFaqs } from "../../react-query/hooks";
import DOMPurify from "dompurify";

const FaqsPage = () => {
  const { data, isLoading, isError } = useFetchFaqs();

  if (isError) {
    return <p>OOps Something went wrong!</p>;
  }

  if (isError) {
    return <p>OOps Something went wrong!</p>;
  }

  console.log(data);

  return (
    <div>
      <SmallBanner
        bgImage="/images/road.jpg"
        title="FAQs"
        content="Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order."
      />
      <Container className="my-[50px]">
        <div className="max-w-[800px] px-6 mx-auto">
          <h2 className="text-xl md:text-3xl font-semibold mb-5 text-center">Have any Questions ?</h2>
          <p className="text-sm md:text-base font-normal md:leading-8 text-center">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa error dicta provident explicabo, similique
            voluptatibus officia! Eligendi ducimus vitae deserunt delectus aperiam dolor, dolorem doloribus ad quo
            perferendis illo ea?
          </p>
        </div>
        {isLoading ? (
          <div className="max-w-[800px] mx-auto md:my-[100px]">
            <div className="join join-vertical w-full">
              <div className="collapse collapse-arrow join-item border-base-300 border">
                <input type="radio" name="my-accordion-4" defaultChecked />
                <div className="collapse-title text-xl font-medium">
                  <div className="skeleton h-[42px] w-full" />
                </div>
                <div className="collapse-content">
                  <div className="skeleton h-32 w-full" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[800px] mx-auto my-10 md:my-[100px]">
            <div className="join join-vertical w-full">
              {data.faqs.map((faq) => (
                <div key={faq.id} className="collapse collapse-arrow join-item border-base-300 border">
                  <input type="radio" name="my-accordion-4" defaultChecked />
                  <div className="collapse-title text-base md:text-xl font-medium">{faq.question}</div>
                  <div className="collapse-content">
                    <div
                      className="text-sm md:text-base"
                      dangerouslySetInnerHTML={{
                        __html: faq.answer ? DOMPurify.sanitize(faq.answer) : "<p>No content available</p>",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default FaqsPage;
