import Container from "../../components/shared/container";
import SmallBanner from "../../components/shared/small-banner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../react-query/constants";
import toast from "react-hot-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
  message: z.string().min(1, "Message is required"),
});

const ContactUsPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  });

  const mutation = useMutation<unknown, unknown, z.infer<typeof contactSchema>>({
    mutationFn: (data) => axios.post(`${API_URL}/contact-us`, data),
    onSuccess: () => {
      toast.success("Message sent successfully!");
      reset();
    },
    onError: () => {
      toast.error("Failed to send message. Please try again.");
    },
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <SmallBanner
        bgImage="/images/road.jpg"
        title="Contact Us"
        content="Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order."
      />
      <Container className="my-10">
        <div className="flex flex-col md:flex-row gap-10 max-w-[1000px] mx-auto mb-[100px]">
          <div className="w-full md:w-[60%]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black">Drop us a line</h2>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block font-medium mb-1 text-sm" htmlFor="name">
                  Name
                </label>
                <input {...register("name")} type="text" className="input input-bordered w-full input-md" />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm" htmlFor="email">
                  Email
                </label>
                <input {...register("email")} type="text" className="input input-bordered w-full input-md" />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm" htmlFor="phone">
                  Phone
                </label>
                <input {...register("phone")} type="text" className="input input-bordered w-full input-md" />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm" htmlFor="message">
                  Message
                </label>
                <textarea {...register("message")} className="textarea textarea-bordered w-full"></textarea>
                {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
              </div>
              <button type="submit" className="btn btn-primary w-full md:w-auto">
                Submit
              </button>
            </form>
          </div>

          <div className="w-full md:w-[40%]">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 md:p-8 text-white shadow-xl">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-white/5 blur-3xl" />

              <div className="relative">
                <h2 className="text-2xl font-bold mb-1">Find our offices</h2>
                <p className="text-sm text-white/80 mb-6">
                  We'd love to hear from you. Reach out anytime.
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-3 transition hover:bg-white/15">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-white/70">Address</p>
                      <p className="text-sm font-medium leading-snug">
                        161/56 Joga Bai, Okhla Gafoor Nagar Road, Jamia Nagar, New Delhi-110025.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-3 transition hover:bg-white/15">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-white/70">Contact</p>
                      <a href="tel:+919000878099" className="text-sm font-medium hover:underline">
                        +91-90008780999
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-3 transition hover:bg-white/15">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-white/70">Email</p>
                      <a href="mailto:info@dehatwala.com" className="text-sm font-medium hover:underline break-all">
                        info@dehatwala.com
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-3 transition hover:bg-white/15">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-white/70">Working Hours</p>
                      <p className="text-sm font-medium">Mon - Sat: 9:00 AM - 7:00 PM</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactUsPage;

// -------- OLD CODE --------
// import Container from "../../components/shared/container";
// import SmallBanner from "../../components/shared/small-banner";

// const ContactUsPage = () => {
//   return (
//     <div>
//       <SmallBanner
//         bgImage="/images/road.jpg"
//         title="Contact Us"
//         content="Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order."
//       />
//       <Container className="my-10">
//         <div className="flex flex-col md:flex-row gap-10 max-w-[800px] mx-auto mb-[100px]">
//           <div className="w-full md:w-[70%]">
//             <div className="mb-6">
//               <h2 className="text-2xl font-semibold">Drop us a line</h2>
//             </div>
//             <form className="space-y-4">
//               <div>
//                 <label className="block font-medium mb-1 text-sm" htmlFor="name">
//                   Name
//                 </label>
//                 <input type="text" className="input input-bordered w-full input-md" />
//               </div>
//               <div>
//                 <label className="block font-medium mb-1 text-sm" htmlFor="name">
//                   Email
//                 </label>
//                 <input type="text" className="input input-bordered w-full input-md" />
//               </div>
//               <div>
//                 <label className="block font-medium mb-1 text-sm" htmlFor="name">
//                   Phone
//                 </label>
//                 <input type="text" className="input input-bordered w-full input-md" />
//               </div>
//               <div>
//                 <label className="block font-medium mb-1 text-sm" htmlFor="name">
//                   Message
//                 </label>
//                 <textarea className="textarea textarea-bordered w-full"></textarea>
//               </div>
//               <button className="btn btn-primary w-full md:w-auto">Submit</button>
//             </form>
//           </div>
//           <div className="w-full md:w-[30%]">
//             <div className="mb-6">
//               <h2 className="text-lg md:text-2xl font-semibold">Find our offices</h2>
//               <address className="space-y-5 text-sm md:font-base">
//                 <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
//                 <ul className="text-sm md:font-base space-y-4">
//                   <li>
//                     <b>Line 1:</b> Your address
//                   </li>
//                   <li>
//                     <b>Line 2:</b> Your address
//                   </li>
//                   <li>
//                     <b>Contact:</b> +91-90008780999
//                   </li>
//                   <li>
//                     <b>Email:</b> email@mail.com
//                   </li>
//                 </ul>
//               </address>
//             </div>
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default ContactUsPage;
