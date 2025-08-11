import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import swal from "sweetalert";

export default function Contact() {
  const formRef = useRef();
  const [success, setSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_m6bjubn",
        "template_qj9mjd7",
        formRef.current,
        "J0TRHxf-yyTfkDs8W"
      )
      .then(
        (result) => {
          console.log(result.text);
          setSuccess(true);
          formRef.current.reset();

          swal({
            icon: "success",
            title: "Message Sent!",
            text: "Thank you for reaching out. I'll get back to you soon.",
          });
        },
        (error) => {
          console.log(error.text);
          swal({
            icon: "error",
            title: "Oops!",
            text: "Something went wrong. Please try again later.",
          });
        }
      );
  };

  return (
    <section className="px-4 py-12 bg-gray-50 text-gray-800 flex items-center justify-center">
      <motion.div
        className="w-full bg-white shadow-md p-6 rounded-lg md:max-w-7xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl font-bold text-center mb-5">Contact Me</h2>

        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Contact Info */}
          <div className="flex flex-col gap-5 w-full md:w-1/3">
            <p className="text-2xl">Contact me for collaboration</p>
            <p>Reach out today to discuss your projects needs and start collaborating on something amazing.</p>
            <p className="flex items-center text-xl gap-2">
              <FaEnvelope className="text-blue-600" />
              <a
                href="mailto:souadalkabir@gmail.com"
                className="hover:underline break-all"
              >
                souadalkabir@gmail.com
              </a>
            </p>
            <p className="flex items-center text-xl gap-2">
              <FaPhoneAlt className="text-blue-600" />
              <a href="tel:+8801830807523" className="hover:underline">
                +8801830807523
              </a>
            </p>
            <p className="flex items-center text-xl gap-2">
              <FaWhatsapp className="text-green-500" />
              <a
                href="https://wa.me/8801830807523"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                +8801830807523
              </a>
            </p>
            {/* Social Links */}
            <div className="flex gap-6 text-2xl mt-4 text-gray-700">
              <a
                href="https://github.com/souad5"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/souadalkabir/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.facebook.com/souadalkabirmaruf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
            </div>
          </div>

          {/* Email Form */}
          <form ref={formRef} onSubmit={sendEmail} className="flex-1 space-y-4">
            <input
              type="text"
              name="user_name"
              placeholder="Your Name"
              required
              className="input input-neutral w-full"
            />
            <br />
            <input
              type="email"
              name="user_email"
              placeholder="Your Email"
              required
              className="input input-neutral w-full"
            />
            <br />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              required
              className="textarea textarea-neutral w-full resize-none"
            ></textarea>
            <button
              type="submit"
              className="w-full btn btn-primary ">
              Send Message
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
