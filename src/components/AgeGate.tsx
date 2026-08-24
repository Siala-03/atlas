import React, { useState } from "react";

export function AgeGate() {
  const [open, setOpen] = useState(true);
  const [denied, setDenied] = useState(false);

  const confirm = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center">
        {denied ?
        <>
            <h2 className="font-serif text-2xl font-semibold text-ink">Sorry</h2>
            <p className="mt-3 text-sm text-ink/60">
              You must be 18 or older to enter this site. Please come back once you meet the legal drinking age.
            </p>
          </> :

        <>
            <h2 className="font-serif text-2xl font-semibold text-ink">Are you 18 or older?</h2>
            <p className="mt-3 text-sm text-ink/60">
              You must be of legal drinking age to enter Atlas Supplies Ltd.
            </p>
            <div className="mt-6 flex gap-3">
              <button
              onClick={() => setDenied(true)}
              className="flex-1 rounded-full border border-burgundy-200 py-3 text-sm font-semibold text-ink/70 hover:bg-burgundy-50">

                No
              </button>
              <button
              onClick={confirm}
              className="flex-1 rounded-full bg-burgundy-800 py-3 text-sm font-semibold text-cream hover:bg-burgundy-900">

                Yes, I&apos;m 18+
              </button>
            </div>
          </>
        }
      </div>
    </div>);

}
