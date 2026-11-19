'use client';

export default function ContactSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 px-4" role="dialog" aria-modal="true" aria-labelledby="contact-success-title">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 id="contact-success-title" className="text-center text-lg font-bold text-gray-900">Poruka je poslana</h3>
        <p className="mt-1 text-center text-sm text-gray-600">Hvala! Javit ćemo se uskoro.</p>
        <div className="mt-6 flex justify-center">
          <button type="button" autoFocus onClick={onClose} className="h-10 px-5 bg-[#19a1e5] text-white rounded-lg font-bold">Zatvori</button>
        </div>
      </div>
    </div>
  );
}
