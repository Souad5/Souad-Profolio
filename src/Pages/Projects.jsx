import { useState } from "react";
import { motion } from "framer-motion";
import projects from "../Data/Projects";
import ProjectDetails from "./ProjectDetails";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section className="card  px-4 py-12 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center pb-2">Projects</h2>

        {!selectedProject ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between  gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <figure><img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                /></figure>
                
                <div className="p-5 text-center">
                  <h3 className="text-xl font-semibold mb-3">{project.name}</h3>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="btn btn-primary"
                  >
                    View More / Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <ProjectDetails project={selectedProject} onBack={() => setSelectedProject(null)} />
        )}
      </div>
    </section>
  );
}
