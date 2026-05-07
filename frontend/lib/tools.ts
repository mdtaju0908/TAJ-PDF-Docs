export type PdfToolId =
  | "merge"
  | "split"
  | "compress"
  | "pdf-to-word"
  | "pdf-to-ppt"
  | "pdf-to-excel"
  | "word-to-pdf"
  | "ppt-to-pdf"
  | "excel-to-pdf"
  | "edit"
  | "jpg-to-pdf"
  | "pdf-to-jpg"
  | "sign"
  | "repair"
  | "page-numbers"
  | "scan"
  | "ocr"
  | "compare"
  | "redact"
  | "crop"
  | "watermark"
  | "rotate"
  | "html-to-pdf"
  | "unlock"
  | "protect"
  | "organize"
  | "pdf-a"
  | "bg-remover";

export type ToolPanelType =
  | "merge"
  | "split"
  | "compress"
  | "edit"
  | "numbering"
  | "watermark"
  | "rotate"
  | "protect"
  | "unlock"
  | "ocr"
  | "bg-remover";

export interface ToolDefinition {
  id: PdfToolId;
  title: string;
  description: string;
  actionLabel: string;
  accentColor: string;
  icon: string;
  color: string;
  accept: Record<string, string[]>;
  buttonText: string;
  gradient: string;
  borderColor: string;
  bgLight: string;
  cardColor: string;
  panelType?: ToolPanelType;
  extensionLabel?: string;
  cardBg?: string;
  iconBg?: string;
  iconColor?: string;
  allowOrientation?: boolean;
  allowPageSize?: boolean;
  allowMargin?: boolean;
  allowMerge?: boolean;
  allowBackgroundColor?: boolean;
  outputType?: string;
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    id: "merge",
    title: "Merge PDF",
    description: "Combine multiple PDFs into a single, perfectly ordered document.",
    actionLabel: "Merge PDF",
    accentColor: "bg-orange-500",
    icon: "Combine",
    color: "bg-orange-100 text-orange-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Merge PDF",
    gradient: "from-orange-500 to-red-500",
    borderColor: "border-orange-300",
    bgLight: "bg-orange-50",
    cardColor: "bg-orange-50",
    panelType: "merge",
    cardBg: "bg-orange-50/50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    id: "split",
    title: "Split PDF",
    description: "Extract pages or split ranges into separate high-quality PDFs.",
    actionLabel: "Split PDF",
    accentColor: "bg-emerald-500",
    icon: "Scissors",
    color: "bg-emerald-100 text-emerald-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Split PDF",
    gradient: "from-emerald-500 to-green-500",
    borderColor: "border-emerald-300",
    bgLight: "bg-emerald-50",
    cardColor: "bg-emerald-50",
    panelType: "split",
    cardBg: "bg-emerald-50/50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600"
  },
  {
    id: "compress",
    title: "Compress PDF",
    description: "Shrink PDF size while preserving crystal-clear document quality.",
    actionLabel: "Compress PDF",
    accentColor: "bg-blue-500",
    icon: "Minimize2",
    color: "bg-blue-100 text-blue-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Compress PDF",
    gradient: "from-blue-500 to-teal-500",
    borderColor: "border-blue-300",
    bgLight: "bg-blue-50",
    cardColor: "bg-blue-50",
    panelType: "compress",
    cardBg: "bg-blue-50/50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    description: "Turn PDFs into fully editable DOCX files with preserved formatting.",
    actionLabel: "Convert to Word",
    accentColor: "bg-sky-500",
    icon: "FileText",
    color: "bg-sky-100 text-sky-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Convert to Word",
    gradient: "from-sky-500 to-blue-500",
    borderColor: "border-sky-300",
    bgLight: "bg-sky-50",
    cardColor: "bg-sky-50",
    extensionLabel: "DOCX",
    cardBg: "bg-sky-50/50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600"
  },
  {
    id: "pdf-to-ppt",
    title: "PDF to PowerPoint",
    description: "Convert PDFs into ready-to-present PPTX slide decks.",
    actionLabel: "Convert to PowerPoint",
    accentColor: "bg-red-500",
    icon: "FileText",
    color: "bg-red-100 text-red-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Convert to PowerPoint",
    gradient: "from-red-500 to-orange-500",
    borderColor: "border-red-300",
    bgLight: "bg-red-50",
    cardColor: "bg-red-50",
    extensionLabel: "PPTX",
    outputType: "pptx",
    cardBg: "bg-red-50/50",
    iconBg: "bg-red-100",
    iconColor: "text-red-600"
  },
  {
    id: "pdf-to-excel",
    title: "PDF to Excel",
    description: "Extract tables from PDFs into clean Excel spreadsheets.",
    actionLabel: "Convert to Excel",
    accentColor: "bg-green-600",
    icon: "FileSpreadsheet",
    color: "bg-green-100 text-green-700",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Convert to Excel",
    gradient: "from-green-600 to-emerald-500",
    borderColor: "border-green-300",
    bgLight: "bg-green-50",
    cardColor: "bg-green-50",
    extensionLabel: "XLSX",
    cardBg: "bg-green-50/50",
    iconBg: "bg-green-100",
    iconColor: "text-green-700"
  },
  {
    id: "word-to-pdf",
    title: "Word to PDF",
    description: "Convert DOC and DOCX files into polished, share-ready PDFs.",
    actionLabel: "Convert to PDF",
    accentColor: "bg-blue-600",
    icon: "FileText",
    color: "bg-blue-100 text-blue-700",
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"]
    },
    buttonText: "Convert to PDF",
    gradient: "from-blue-600 to-indigo-600",
    borderColor: "border-blue-300",
    bgLight: "bg-blue-50",
    cardColor: "bg-blue-50",
    cardBg: "bg-blue-50/50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700"
  },
  {
    id: "ppt-to-pdf",
    title: "PowerPoint to PDF",
    description: "Turn slide decks into secure, presentation-ready PDF files.",
    actionLabel: "Convert to PDF",
    accentColor: "bg-orange-600",
    icon: "FileText",
    color: "bg-orange-100 text-orange-700",
    accept: {
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "application/vnd.ms-powerpoint": [".ppt"]
    },
    buttonText: "Convert to PDF",
    gradient: "from-orange-600 to-red-600",
    borderColor: "border-orange-300",
    bgLight: "bg-orange-50",
    cardColor: "bg-orange-50",
    extensionLabel: "PPTX",
    cardBg: "bg-orange-50/50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-700"
  },
  {
    id: "excel-to-pdf",
    title: "Excel to PDF",
    description: "Export spreadsheets to perfectly formatted PDF documents.",
    actionLabel: "Convert to PDF",
    accentColor: "bg-emerald-600",
    icon: "FileSpreadsheet",
    color: "bg-emerald-100 text-emerald-700",
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
    },
    buttonText: "Convert to PDF",
    gradient: "from-emerald-600 to-green-600",
    borderColor: "border-emerald-300",
    bgLight: "bg-emerald-50",
    cardColor: "bg-emerald-50",
    extensionLabel: "XLSX",
    cardBg: "bg-emerald-50/50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700"
  },
  {
    id: "edit",
    title: "Edit PDF",
    description: "Add text, images and annotations directly inside your PDF.",
    actionLabel: "Edit PDF",
    accentColor: "bg-pink-500",
    icon: "FilePlus",
    color: "bg-pink-100 text-pink-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Edit PDF",
    gradient: "from-pink-500 to-rose-500",
    borderColor: "border-pink-300",
    bgLight: "bg-pink-50",
    cardColor: "bg-pink-50",
    panelType: "edit",
    cardBg: "bg-pink-50/50",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600"
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert JPG images into clean, high-resolution PDF pages.",
    actionLabel: "Convert to PDF",
    accentColor: "bg-amber-500",
    icon: "FileImage",
    color: "bg-amber-100 text-amber-600",
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"]
    },
    buttonText: "Convert to PDF",
    gradient: "from-amber-500 to-yellow-500",
    borderColor: "border-amber-300",
    bgLight: "bg-amber-50",
    cardColor: "bg-amber-50",
    extensionLabel: "JPG",
    cardBg: "bg-amber-50/50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    allowOrientation: true,
    allowPageSize: true,
    allowMargin: true,
    allowMerge: true,
    outputType: "pdf"
  },
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Export each PDF page as a sharp JPG image file.",
    actionLabel: "Convert to JPG",
    accentColor: "bg-yellow-500",
    icon: "FileImage",
    color: "bg-yellow-100 text-yellow-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Convert to JPG",
    gradient: "from-yellow-500 to-amber-500",
    borderColor: "border-yellow-300",
    bgLight: "bg-yellow-50",
    cardColor: "bg-yellow-50",
    cardBg: "bg-yellow-50/50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600"
  },
  {
    id: "sign",
    title: "Sign PDF",
    description: "Request and apply secure electronic signatures in minutes.",
    actionLabel: "Sign PDF",
    accentColor: "bg-indigo-500",
    icon: "FileSignature",
    color: "bg-indigo-100 text-indigo-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Sign PDF",
    gradient: "from-indigo-500 to-violet-500",
    borderColor: "border-indigo-300",
    bgLight: "bg-indigo-50",
    cardColor: "bg-indigo-50",
    cardBg: "bg-indigo-50/50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600"
  },
  {
    id: "repair",
    title: "Repair PDF",
    description: "Recover damaged or corrupted PDF files automatically.",
    actionLabel: "Repair PDF",
    accentColor: "bg-teal-500",
    icon: "Wrench",
    color: "bg-teal-100 text-teal-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Repair PDF",
    gradient: "from-teal-500 to-emerald-500",
    borderColor: "border-teal-300",
    bgLight: "bg-teal-50",
    cardColor: "bg-teal-50",
    cardBg: "bg-teal-50/50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600"
  },
  {
    id: "page-numbers",
    title: "Add Page Numbers",
    description: "Insert page numbering with custom position and styling.",
    actionLabel: "Add Page Numbers",
    accentColor: "bg-violet-500",
    icon: "Hash",
    color: "bg-violet-100 text-violet-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Add Page Numbers",
    gradient: "from-violet-500 to-purple-500",
    borderColor: "border-violet-300",
    bgLight: "bg-violet-50",
    cardColor: "bg-violet-50",
    panelType: "numbering",
    cardBg: "bg-violet-50/50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600"
  },
  {
    id: "scan",
    title: "Scan to PDF",
    description: "Turn camera captures into clean, shareable PDF scans.",
    actionLabel: "Create PDF",
    accentColor: "bg-rose-500",
    icon: "Camera",
    color: "bg-rose-100 text-rose-600",
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"]
    },
    buttonText: "Create PDF",
    gradient: "from-rose-500 to-pink-500",
    borderColor: "border-rose-300",
    bgLight: "bg-rose-50",
    cardColor: "bg-rose-50",
    cardBg: "bg-rose-50/50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600"
  },
  {
    id: "ocr",
    title: "OCR PDF",
    description: "Convert scans into searchable, selectable PDF documents.",
    actionLabel: "Start OCR",
    accentColor: "bg-cyan-500",
    icon: "Search",
    color: "bg-cyan-100 text-cyan-600",
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    buttonText: "Start OCR",
    gradient: "from-cyan-500 to-sky-500",
    borderColor: "border-cyan-300",
    bgLight: "bg-cyan-50",
    cardColor: "bg-cyan-50",
    panelType: "ocr",
    cardBg: "bg-cyan-50/50",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600"
  },
  {
    id: "compare",
    title: "Compare PDF",
    description: "Highlight differences between two PDF versions side by side.",
    actionLabel: "Compare PDFs",
    accentColor: "bg-slate-600",
    icon: "Eye",
    color: "bg-slate-100 text-slate-700",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Compare PDFs",
    gradient: "from-slate-600 to-gray-500",
    borderColor: "border-slate-300",
    bgLight: "bg-slate-50",
    cardColor: "bg-slate-50",
    cardBg: "bg-slate-50/50",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700"
  },
  {
    id: "redact",
    title: "Redact PDF",
    description: "Permanently remove sensitive text and graphics from PDFs.",
    actionLabel: "Redact PDF",
    accentColor: "bg-zinc-800",
    icon: "ShieldOff",
    color: "bg-zinc-100 text-zinc-900",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Redact PDF",
    gradient: "from-zinc-800 to-zinc-600",
    borderColor: "border-zinc-400",
    bgLight: "bg-zinc-50",
    cardColor: "bg-zinc-50",
    cardBg: "bg-zinc-50/50",
    iconBg: "bg-zinc-100",
    iconColor: "text-zinc-900"
  },
  {
    id: "crop",
    title: "Crop PDF",
    description: "Trim margins or focus on specific areas within each page.",
    actionLabel: "Crop PDF",
    accentColor: "bg-lime-500",
    icon: "Crop",
    color: "bg-lime-100 text-lime-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Crop PDF",
    gradient: "from-lime-500 to-yellow-500",
    borderColor: "border-lime-300",
    bgLight: "bg-lime-50",
    cardColor: "bg-lime-50",
    cardBg: "bg-lime-50/50",
    iconBg: "bg-lime-100",
    iconColor: "text-lime-600"
  },
  {
    id: "watermark",
    title: "Watermark PDF",
    description: "Apply text or image watermarks with full control over style.",
    actionLabel: "Add Watermark",
    accentColor: "bg-fuchsia-500",
    icon: "Layers",
    color: "bg-fuchsia-100 text-fuchsia-600",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Add Watermark",
    gradient: "from-fuchsia-500 to-purple-500",
    borderColor: "border-fuchsia-300",
    bgLight: "bg-fuchsia-50",
    cardColor: "bg-fuchsia-50",
    panelType: "watermark",
    cardBg: "bg-fuchsia-50/50",
    iconBg: "bg-fuchsia-100",
    iconColor: "text-fuchsia-600"
  },
  {
    id: "rotate",
    title: "Rotate PDF",
    description: "Fix sideways pages or rotate entire documents in a click.",
    actionLabel: "Rotate PDF",
    accentColor: "bg-purple-600",
    icon: "RotateCw",
    color: "bg-purple-100 text-purple-700",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Rotate PDF",
    gradient: "from-purple-600 to-violet-600",
    borderColor: "border-purple-300",
    bgLight: "bg-purple-50",
    cardColor: "bg-purple-50",
    panelType: "rotate",
    cardBg: "bg-purple-50/50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700"
  },
  {
    id: "html-to-pdf",
    title: "HTML to PDF",
    description: "Convert any webpage or HTML content into a clean PDF.",
    actionLabel: "Convert to PDF",
    accentColor: "bg-sky-600",
    icon: "FileText",
    color: "bg-sky-100 text-sky-700",
    accept: {
      "text/html": [".html", ".htm"]
    },
    buttonText: "Convert to PDF",
    gradient: "from-sky-600 to-blue-600",
    borderColor: "border-sky-300",
    bgLight: "bg-sky-50",
    cardColor: "bg-sky-50",
    cardBg: "bg-sky-50/50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700"
  },
  {
    id: "unlock",
    title: "Unlock PDF",
    description: "Remove password protection from PDFs you own.",
    actionLabel: "Unlock PDF",
    accentColor: "bg-slate-800",
    icon: "Unlock",
    color: "bg-slate-100 text-slate-900",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Unlock PDF",
    gradient: "from-slate-800 to-slate-600",
    borderColor: "border-slate-400",
    bgLight: "bg-slate-50",
    cardColor: "bg-slate-50",
    panelType: "unlock",
    cardBg: "bg-slate-50/50",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-900"
  },
  {
    id: "protect",
    title: "Protect PDF",
    description: "Encrypt PDFs with strong passwords and access control.",
    actionLabel: "Protect PDF",
    accentColor: "bg-slate-900",
    icon: "Lock",
    color: "bg-slate-100 text-slate-900",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Protect PDF",
    gradient: "from-slate-900 to-slate-700",
    borderColor: "border-slate-500",
    bgLight: "bg-slate-50",
    cardColor: "bg-slate-50",
    panelType: "protect",
    cardBg: "bg-slate-50/50",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-900"
  },
  {
    id: "organize",
    title: "Organize PDF",
    description: "Reorder, delete or duplicate pages in just a few clicks.",
    actionLabel: "Organize PDF",
    accentColor: "bg-orange-600",
    icon: "Layers",
    color: "bg-orange-100 text-orange-700",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Organize PDF",
    gradient: "from-orange-600 to-amber-600",
    borderColor: "border-orange-400",
    bgLight: "bg-orange-50",
    cardColor: "bg-orange-50",
    allowOrientation: false,
    allowPageSize: false,
    allowMargin: false,
    allowMerge: false,
    outputType: "pdf",
    cardBg: "bg-orange-50/50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-700"
  },
  {
    id: "pdf-a",
    title: "PDF to PDF/A",
    description: "Convert PDFs to long-term archivable PDF/A format.",
    actionLabel: "Convert to PDF/A",
    accentColor: "bg-blue-700",
    icon: "FileArchive",
    color: "bg-blue-100 text-blue-700",
    accept: {
      "application/pdf": [".pdf"]
    },
    buttonText: "Convert to PDF/A",
    gradient: "from-blue-700 to-sky-700",
    borderColor: "border-blue-400",
    bgLight: "bg-blue-50",
    cardColor: "bg-blue-50",
    cardBg: "bg-blue-50/50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700"
  },
  {
    id: "bg-remover",
    title: "Background Remover",
    description: "Remove image backgrounds instantly and replace with custom colors.",
    actionLabel: "Remove Background",
    accentColor: "bg-indigo-600",
    icon: "Eraser",
    color: "bg-indigo-100 text-indigo-700",
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    buttonText: "Remove Background",
    gradient: "from-indigo-600 to-purple-600",
    borderColor: "border-indigo-300",
    bgLight: "bg-indigo-50",
    cardColor: "bg-indigo-50",
    panelType: "bg-remover",
    cardBg: "bg-indigo-50/50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
    outputType: "png"
  }
];

export function getToolDefinition(id: PdfToolId): ToolDefinition {
  const tool = TOOL_DEFINITIONS.find((t) => t.id === id);
  if (!tool) {
    throw new Error(`Unknown tool: ${id}`);
  }
  return tool;
}

