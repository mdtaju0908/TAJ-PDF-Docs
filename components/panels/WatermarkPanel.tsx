"use client";

import { useState } from "react";

export function WatermarkPanel() {
  const [text, setText] = useState("");
  const [opacity, setOpacity] = useState(40);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState("center");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Watermark</h2>
      <p className="mt-1 text-xs text-slate-500">Configure text, opacity and placement.</p>
      <div className="mt-4 space-y-3 text-xs">
        <div>
          <label className="mb-1 block text-slate-700">Text</label>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Confidential"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-slate-700">Opacity ({opacity}%)</label>
          <input
            type="range"
            min={10}
            max={100}
            value={opacity}
            onChange={e => setOpacity(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-slate-700">Rotation ({rotation}°)</label>
          <input
            type="range"
            min={-45}
            max={45}
            value={rotation}
            onChange={e => setRotation(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-slate-700">Position</label>
          <div className="grid grid-cols-3 gap-1">
            {["top-left", "top-center", "top-right", "center-left", "center", "center-right", "bottom-left", "bottom-center", "bottom-right"].map(
              key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPosition(key)}
                  className={`rounded-md border px-1 py-1 text-[10px] ${
                    position === key
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-slate-200 text-slate-500"
                  }`}
                >
                  {key.replace("-", " ")}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

