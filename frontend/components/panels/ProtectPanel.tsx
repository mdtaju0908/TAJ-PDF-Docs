"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";

export function ProtectPanel() {
  const setToolOption = useAppStore(s => s.setToolOption);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [allowPrint, setAllowPrint] = useState(true);
  const [allowCopy, setAllowCopy] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Protect PDF</h2>
      <p className="mt-1 text-xs text-slate-500">Set password and permissions for this document.</p>
      <div className="mt-4 space-y-3 text-xs">
        <div>
          <label className="mb-1 block text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => {
              const value = e.target.value;
              setPassword(value);
              setToolOption("protect", "user_password", value);
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-slate-700">Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-slate-700">Permissions</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowPrint}
              onChange={e => setAllowPrint(e.target.checked)}
            />
            <span>Allow printing</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowCopy}
              onChange={e => setAllowCopy(e.target.checked)}
            />
            <span>Allow copying text</span>
          </label>
        </div>
      </div>
    </div>
  );
}

