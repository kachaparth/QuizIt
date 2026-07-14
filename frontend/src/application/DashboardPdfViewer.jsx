import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, FileBarChart2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import dashboardPdf from "../assets/QuizIt-Dashboard.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function DashboardPdfViewer() {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(850); // Slightly smaller default base
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width - 16; 
        if (width > 0) setContainerWidth(width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-600 to-cyan-700 px-4 py-8 font-sans selection:bg-orange-200">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-row justify-between items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-white/20 rounded-md backdrop-blur-md text-white">
                <FileBarChart2 size={20} />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Quiz<span className="text-orange-300">It</span> Analytics
              </h1>
            </div>
          </div>

          <Link to="/">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 backdrop-blur-sm transition-all text-xs font-medium">
              <ArrowLeft size={14} /> Back
            </button>
          </Link>
        </header>

        {/* Content Card */}
        <div className="bg-white rounded-xl p-4 shadow-xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-400" />

          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 bg-cyan-50 text-cyan-600 border border-cyan-100 rounded">
              LIVE VISUALIZATION
            </span>
          </div>

          {/* Wrapper for the PDF Canvas */}
          <div ref={containerRef} className="bg-gray-50 rounded-lg border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
            <Document
              file={dashboardPdf}
              onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPageNumber(1); }}
              loading={<div className="text-center py-12 text-cyan-700 text-sm font-medium">Loading Report...</div>}
            >
              <Page
                pageNumber={pageNumber}
                width={containerWidth}
                className="shadow-sm rounded overflow-hidden max-w-full"
              />
            </Document>
          </div>

          {/* Controls Footer */}
          <div className="flex flex-row items-center justify-between pt-3 mt-3 border-t border-gray-100 gap-2">
            <button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((prev) => prev - 1)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-cyan-600 text-cyan-600 text-xs font-bold rounded-lg hover:bg-cyan-50 disabled:opacity-40 transition-all select-none"
            >
              <ChevronLeft size={14} /> Prev
            </button>

            <div className="text-xs font-bold text-gray-500">
              Page <span className="text-cyan-600">{pageNumber}</span> of {numPages || "—"}
            </div>

            <button
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber((prev) => prev + 1)}
              className="flex items-center gap-1 px-4 py-1.5 bg-cyan-600 text-white text-xs font-bold rounded-lg hover:bg-cyan-700 disabled:opacity-40 transition-all select-none"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}