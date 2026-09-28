import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-6xl font-bold text-brand-600 dark:text-brand-400">404</h1>
      <p className="mt-4 text-xl font-semibold">Page not found</p>
      <p className="mt-2 text-ink-muted dark:text-slate-400">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Go to home
      </Link>
    </div>
  );
};

export default NotFound;
