"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";

export default function DashboardSecurityPage() {
  const settings = useAppStore(s => s.securitySettings);
  const update = useAppStore(s => s.updateSecuritySettings);
  const [retentionDays, setRetentionDays] = useState<number>(settings.retentionDays);
  const [restrictedAccess, setRestrictedAccess] = useState<boolean>(settings.restrictedAccess);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Security controls
        </h1>
        <p className="text-sm text-slate-600">
          Review workspace-level settings for retention and access.
        </p>
      </div>
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800">Retention window (days)</label>
          <select
            className="w-full rounded-xl border border-slate-200 p-2 text-sm"
            value={retentionDays}
            onChange={e => setRetentionDays(Number(e.target.value))}
          >
            {[0, 7, 30, 60, 90].map(d => (
              <option key={d} value={d}>
                {d === 0 ? "No retention" : `${d} days`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">Restricted access</p>
            <p className="text-xs text-slate-500">Limit document access to authenticated users</p>
          </div>
          <button
            type="button"
            onClick={() => setRestrictedAccess(v => !v)}
            className={`inline-flex h-6 w-10 items-center rounded-full transition ${
              restrictedAccess ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`m-1 h-4 w-4 rounded-full bg-white transition ${
                restrictedAccess ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => update(retentionDays, restrictedAccess)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
          >
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}
