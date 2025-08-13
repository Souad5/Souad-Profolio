export default function ProjectDetails({ project, onBack }) {
  return (
    <section className="px-4 py-12 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto relative rounded-2xl shadow-2xl border-2 border-gradient p-6 bg-gray-800">
        <button
          onClick={onBack}
          className="btn btn-success mb-6"
        >
          ← Back to Projects
        </button>

        <h2 className="text-3xl font-bold mb-4 text-white">{project.name}</h2>

        <img
          src={project.image}
          alt={project.name}
          className="w-full h-64 object-cover rounded-lg mb-6 shadow-lg"
        />

        <p className="text-gray-300 mb-2">
          <strong>Main Tech Stack:</strong>{" "}
          {project.techStack.split(",").map((tech, i) => (
            <span
              key={i}
              className="px-4 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500 text-sm  font-semibold shadow"
            >
              {tech.trim()}
            </span>
          ))}
        </p>

        <p className="text-gray-300 mb-4">
          <strong>Description:</strong> {project.description}
        </p>

        <p className="text-gray-300 mb-2">
          <strong>Challenges Faced:</strong> {project.challenges}
        </p>

        <p className="text-gray-300 mb-4">
          <strong>Potential Improvements & Future Plans:</strong>{" "}
          {project.improvements}
        </p>

        <div className="flex gap-4 mt-6">
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary bg-linear-to-r/decreasing from-indigo-500 to-teal-400 rounded-xl"
          >
            Live Project
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-black text-white hover:bg-gray-800 transition-all"
          >
            GitHub Repo
          </a>
        </div>
      </div>
    </section>
  );
}
