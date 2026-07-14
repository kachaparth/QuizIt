export default function SubmissionOverlay({ open }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex flex-col items-center justify-center">
      <div className="h-16 w-16 rounded-full border-4 border-white/20 border-t-white animate-spin" />

      <h2 className="mt-8 text-2xl text-white font-bold">
        Submitting Test...
      </h2>

      <p className="mt-3 text-gray-300 text-center max-w-sm">
        Please don't close this page or switch tabs.
      </p>
    </div>
  );
}