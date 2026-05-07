"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";

export function UnlockPanel() {
  const setToolOption = useAppStore(s => s.setToolOption);
  const [password, setPassword] = useState("");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Unlock PDF</h2>
      <p className="mt-1 text-xs text-slate-500">Enter the password to remove protection.</p>
      <div className="mt-4 text-xs">
        <label className="mb-1 block text-slate-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => {
            const value = e.target.value;
            setPassword(value);
            setToolOption("unlock", "password", value);
          }}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
        />
      </div>
    </div>
  );
}

