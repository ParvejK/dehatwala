import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Container from "../../components/shared/container";

const JoinUsSuccessPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center">
      <Container className="py-16">
        <div className="max-w-xl mx-auto text-center bg-white border border-base-300 rounded-lg p-8 md:p-12 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">Thank you for joining Dehatwala!</h1>
          <p className="text-sm md:text-base text-gray-600 mb-2">
            Your application has been submitted successfully.
          </p>
          <p className="text-sm md:text-base text-gray-600 mb-8">
            Our team will review your details and get in touch with you shortly on the mobile number you provided.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="inline-flex min-h-11 min-w-[160px] items-center justify-center rounded-xl bg-[#0b3fc4] px-6 text-[13px] font-bold text-white transition hover:bg-[#0932a0]">
              Back to Home
            </Link>
            <Link to="/careers/open-positions" className="inline-flex min-h-11 min-w-[160px] items-center justify-center rounded-xl border border-[#cfe0fb] bg-white px-6 text-[13px] font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff]">
              View Open Positions
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default JoinUsSuccessPage;
