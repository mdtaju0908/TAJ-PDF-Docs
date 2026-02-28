import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        <p className="text-[11px] md:text-xs">
          © {new Date().getFullYear()} TAJ PDF Docs. Free PDF tools — no login required.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/about" className="hover:text-slate-700">
            About
          </Link>
          <Link href="/security" className="hover:text-slate-700">
            Security
          </Link>
          <Link href="/help" className="hover:text-slate-700">
            Help center
          </Link>
        </div>
      </div>
    </footer>
  );
}
