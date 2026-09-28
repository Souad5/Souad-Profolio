import useCanvasCursor from "../../hooks/useCanvasCursor.js";

export default function CanvasCursor() {
  useCanvasCursor();

  return (
    <canvas
      id="canvas"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
