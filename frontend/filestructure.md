```bash
Directory structure:
└── mdtaju0908-taj-pdf-docs/
    ├── README.md
    ├── SECURITY.md
    ├── backend/
    │   ├── docker-compose.yml
    │   ├── Dockerfile
    │   ├── Procfile
    │   ├── requirements.txt
    │   └── app/
    │       ├── main.py
    │       ├── api/
    │       │   ├── deps.py
    │       │   └── routes/
    │       │       ├── bg_remover.py
    │       │       ├── compress.py
    │       │       ├── convert.py
    │       │       ├── edit.py
    │       │       ├── merge.py
    │       │       ├── ocr.py
    │       │       ├── report_issue.py
    │       │       ├── split.py
    │       │       └── tools.py
    │       ├── core/
    │       │   ├── config.py
    │       │   └── security.py
    │       ├── models/
    │       │   └── schemas.py
    │       ├── services/
    │       │   ├── compress_service.py
    │       │   ├── convert_service.py
    │       │   ├── crop_pdf_service.py
    │       │   ├── edit_service.py
    │       │   ├── excel_to_pdf_service.py
    │       │   ├── html_to_pdf_service.py
    │       │   ├── merge_service.py
    │       │   ├── ocr_service.py
    │       │   ├── organize_pdf_service.py
    │       │   ├── pdf_to_excel_service.py
    │       │   ├── pdf_to_ppt_service.py
    │       │   ├── redact_pdf_service.py
    │       │   ├── repair_pdf_service.py
    │       │   ├── scan_to_pdf_service.py
    │       │   ├── sign_pdf_service.py
    │       │   ├── split_service.py
    │       │   └── word_to_pdf_service.py
    │       └── utils/
    │           ├── file_handler.py
    │           ├── response.py
    │           ├── s3.py
    │           └── s3_client.py
    └── frontend/
        ├── next-env.d.ts
        ├── next.config.mjs
        ├── package.json
        ├── postcss.config.js
        ├── tailwind.config.js
        ├── tsconfig-next14.json
        ├── tsconfig.json
        ├── app/
        │   ├── error.tsx
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── loading.tsx
        │   ├── page.tsx
        │   ├── robots.ts
        │   ├── sitemap.ts
        │   ├── about/
        │   │   └── page.tsx
        │   ├── api/
        │   │   ├── [tool]/
        │   │   │   └── route.ts
        │   │   ├── download/
        │   │   │   └── [fileId]/
        │   │   │       └── route.ts
        │   │   └── report-issue/
        │   │       └── route.ts
        │   ├── disclaimer/
        │   │   └── page.tsx
        │   ├── features/
        │   │   └── page.tsx
        │   ├── help/
        │   │   └── page.tsx
        │   ├── legal/
        │   │   └── page.tsx
        │   ├── privacy/
        │   │   └── page.tsx
        │   ├── report-issue/
        │   │   └── page.tsx
        │   ├── security/
        │   │   └── page.tsx
        │   ├── terms/
        │   │   └── page.tsx
        │   └── tools/
        │       └── [tool]/
        │           └── page.tsx
        ├── components/
        │   ├── FeatureGrid.tsx
        │   ├── FilePreview.tsx
        │   ├── Footer.tsx
        │   ├── IssueReportModal.tsx
        │   ├── Navbar.tsx
        │   ├── PdfToolTemplate.tsx
        │   ├── PremiumPreview.tsx
        │   ├── ProcessingOverlay.tsx
        │   ├── theme-provider.tsx
        │   ├── ThemeToggle.tsx
        │   ├── ToolCard.tsx
        │   ├── UploadBox.tsx
        │   ├── panels/
        │   │   ├── CompressPanel.tsx
        │   │   ├── EditPanel.tsx
        │   │   ├── MergePanel.tsx
        │   │   ├── NumberingPanel.tsx
        │   │   ├── OCRPanel.tsx
        │   │   ├── ProtectPanel.tsx
        │   │   ├── RotatePanel.tsx
        │   │   ├── SplitPanel.tsx
        │   │   ├── UnlockPanel.tsx
        │   │   └── WatermarkPanel.tsx
        │   └── ui/
        │       ├── button.tsx
        │       ├── card.tsx
        │       ├── ErrorMessage.tsx
        │       └── Loader.tsx
        └── lib/
            ├── api-config.ts
            ├── api.ts
            ├── store.ts
            ├── tools.ts
            └── utils.ts
```
