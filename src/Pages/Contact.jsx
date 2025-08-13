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
    <section className="relative px-4 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black  h-screen flex items-center justify-center">

      <motion.div
        className="relative w-full rounded-3xl shadow-2xl overflow-hidden max-w-7xl mx-auto "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        
        {/* Animated Gradient Border */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl animate-spin-slow opacity-60 "></div>

        {/* Inner Card */}
        <div className="relative bg-gray-900 rounded-3xl p-8 flex flex-col md:flex-row gap-10 shadow-xl">
          {/* Contact Info */}
          <motion.div
            className="flex flex-col gap-5 w-full md:w-1/3 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
            <p className="text-gray-300 mb-4">
              I’m excited to collaborate! Drop a message and let’s create something amazing together.
            </p>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-lg hover:text-blue-400 transition-colors">
                <FaEnvelope /> 
                <a href="mailto:souadalkabir@gmail.com">souadalkabir@gmail.com</a>
              </p>
              <p className="flex items-center gap-2 text-lg hover:text-blue-400 transition-colors">
                <FaPhoneAlt /> 
                <a href="tel:+8801830807523">+8801830807523</a>
              </p>
              <p className="flex items-center gap-2 text-lg hover:text-green-400 transition-colors">
                <FaWhatsapp /> 
                <a href="https://wa.me/8801830807523" target="_blank" rel="noreferrer">
                  +8801830807523
                </a>
              </p>
            </div>

            <div className="flex gap-5 mt-6 text-3xl">
              <a href="https://github.com/souad5" target="_blank" rel="noreferrer"><FaGithub className="hover:text-blue-400 transition-colors" /></a>
              <a href="https://www.linkedin.com/in/souadalkabir/" target="_blank" rel="noreferrer"><FaLinkedin className="hover:text-blue-400 transition-colors" /></a>
              <a href="https://www.facebook.com/souadalkabirmaruf" target="_blank" rel="noreferrer"><FaFacebook className="hover:text-blue-400 transition-colors" /></a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            ref={formRef}
            onSubmit={sendEmail}
            className="flex-1 flex flex-col gap-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <input
              type="text"
              name="user_name"
              placeholder="Your Name"
              required
              className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            <input
              type="email"
              name="user_email"
              placeholder="Your Email"
              required
              className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              required
              className="textarea textarea-bordered w-full bg-gray-800 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 resize-none"
            ></textarea>
            <button
              type="submit"
              className="mt-2 py-3 rounded-xl bg-linear-to-r/decreasing from-indigo-500 to-teal-400 hover:scale-105 transition-transform duration-300 font-bold text-white shadow-lg"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </motion.div>

      {/* Spin Animation */}
      <style>
        {`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 6s linear infinite;
          }
        `}
      </style>
    </section>
  );
}
