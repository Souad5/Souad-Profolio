import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

export default function Contact() {
  const formRef = useRef();
  const [success, setSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "souad97",     // replace
        "template_qj9mjd7",    // replace
        formRef.current,
        "J0TRHxf-yyTfkDs8W"      // replace
      )
      .then(
        (result) => {
          console.log(result.text);
          setSuccess(true);
          formRef.current.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <section className="min-h-screen px-4 py-12 bg-gray-50 text-gray-800 flex items-center justify-center">
      <motion.div
        className="w-full max-w-xl bg-white shadow-md p-6 rounded-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 border-b-2 border-blue-600 inline-block pb-2">
          Contact Me
        </h2>

        <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
          <input
            type="text"
            name="user_name"
            placeholder="Your Name"
            required
            className="w-full border p-3 rounded"
          />
          <input
            type="email"
            name="user_email"
            placeholder="Your Email"
            required
            className="w-full border p-3 rounded"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            required
            className="w-full border p-3 rounded"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>

        {success && (
          <p className="text-green-600 text-center mt-4">
            ✅ Message sent successfully!
          </p>
        )}
      </motion.div>
    </section>
  );
}
