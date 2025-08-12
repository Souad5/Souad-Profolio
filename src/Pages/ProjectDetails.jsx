export default function ProjectDetails({ project, onBack }) {

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <button
        onClick={onBack}
        className="btn btn-success"
      >
        ← Back to Projects
      </button>

      <h2 className="text-3xl font-bold mb-4">{project.name}</h2>
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-64 object-cover rounded mb-6"
      />

      <p><strong>Main Tech Stack:</strong> {project.techStack}</p>
      <p className="my-4"><strong>Description:</strong> {project.description}</p>

      <p><strong>Challenges Faced:</strong> {project.challenges}</p>
      <p className="my-4"><strong>Potential Improvements & Future Plans:</strong> {project.improvements}</p>

      <div className="flex gap-4 mt-6">
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Live Project
        </a>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-black text-white"
        >
          GitHub Repo
        </a>
      </div>
    </div>
  );
}
