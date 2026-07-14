import { Send } from "lucide-react";

export default function SubmitConfirmationModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  if (!open) return null;

  return (
    <>
      {/* Mobile */}
      <div className="fixed inset-0 z-[9998] md:hidden">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => !isSubmitting && onClose()}
        />

        <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-6">
          <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-gray-300" />

          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Send className="text-red-600" />
            </div>
          </div>

          <h2 className="mt-4 text-center text-xl font-bold">
            Submit Test?
          </h2>

          <p className="mt-3 text-center text-gray-500">
            Once submitted you cannot modify your answers.
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-red-600 py-4 text-white font-semibold"
            >
              Submit Test
            </button>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full rounded-2xl border py-4 font-semibold"
            >
              Continue Exam
            </button>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex fixed inset-0 z-[9998] items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-6 w-[420px]">
          <h2 className="text-xl font-bold mb-3">
            Submit Test?
          </h2>

          <p className="text-gray-500 mb-6">
            Once submitted you cannot change your answers.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="border rounded-lg px-5 py-2"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-red-600 text-white rounded-lg px-5 py-2"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}