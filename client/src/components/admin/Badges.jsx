export default function StatusBadge({ enabled }) {
  return enabled ? (
    <span className="badge badge-success badge-sm">Enabled</span>
  ) : (
    <span className="badge badge-neutral badge-sm">Disabled</span>
  );
}

export function PublishedBadge({ published }) {
  return published ? (
    <span className="badge badge-info badge-sm">Published</span>
  ) : (
    <span className="badge badge-neutral badge-sm">Draft</span>
  );
}

export function FeaturedBadge({ featured }) {
  return featured ? (
    <span className="badge badge-warning badge-sm">★ Featured</span>
  ) : null;
}
