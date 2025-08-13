import { useState } from "react";
import { motion } from "framer-motion";
import projects from "../Data/Projects";
import ProjectDetails from "./ProjectDetails";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section className=" p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center text-white">
          My Projects
        </h2>

        {!selectedProject ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Gradient border wrapper */}
                <div className="rounded-xl p-[2px]  bg-linear-to-r/decreasing from-indigo-500 to-teal-400 animate-gradient-border">
                  {/* Card content */}
                  <div className="bg-gray-900 rounded-xl p-5 flex flex-col h-full justify-between transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg transition-transform duration-500 group-hover:scale-110"
                    />
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {project.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {project.description.length > 80
                        ? project.description.slice(0, 80) + "..."
                        : project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.techStack.split(",").map((tech, i) => (
                        <span
                          key={i}
                          className="px-4 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500 text-sm font-semibold shadow"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="card-actions justify-baseline">
                      <button className="btn btn-primary bg-linear-to-r/decreasing from-indigo-500 to-teal-400 rounded-xl transition-all duration-300 ">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <ProjectDetails
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
          />
        )}
      </div>

      {/* Gradient Border Animation */}
      <style>
        {`
          @keyframes gradientBorder {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-border {
            background-size: 300% 300%;
            animation: gradientBorder 2s ease infinite;
          }
        `}
      </style>
    </section>
  );
}
