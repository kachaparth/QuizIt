import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Link } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  FileBarChart2,
  Layout,
  ArrowLeft,
} from "lucide-react";
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
  const [pageWidth, setPageWidth] = useState(900);

  // Dynamic width calculation helper to prevent layout breakages at 110% zoom
  useEffect(() => {
    const handleResize = () => {
      // Safely containerizes the PDF width relative to viewports
      const targetWidth = Math.min(window.innerWidth - 64, 900);
      setPageWidth(targetWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-600 to-cyan-700 px-6 py-10 font-sans selection:bg-orange-200">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Navigation / Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                <FileBarChart2 className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Quiz<span className="text-orange-300">It</span> Analytics
              </h1>
            </div>
            <p className="text-cyan-100 flex items-center gap-2 text-sm md:text-base">
              Power BI Embedded Analytics & System Reports
            </p>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <Link to="/">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 backdrop-blur-sm transition-all active:scale-95 text-sm font-medium">
                <ArrowLeft size={16} />
                Back to Dashboard
              </button>
            </Link>
          </motion.div>
        </header>

        {/* Main Document Content Area */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/10 border border-white/20 relative overflow-hidden"
        >
          {/* Top Decorative Mode Strip */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-orange-400" />

          {/* Subtitle / Header info within card container */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 bg-cyan-50 text-cyan-600 border border-cyan-100 rounded-md">
                LIVE VISUALIZATION
              </span>
            </div>
          </div>

          {/* PDF Canvas Component Layout */}
          <Document
            file={dashboardPdf}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="text-center py-40 text-cyan-700 font-medium text-lg">
                Loading Interactive Report...
              </div>
            }
          >
            <div className="flex justify-center items-center bg-gray-50 rounded-xl border border-gray-100 p-2 overflow-auto max-h-[75vh] custom-scrollbar">
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                className="shadow-md rounded-lg overflow-hidden max-w-full"
              />
            </div>
          </Document>

          {/* Bottom Footer Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 mt-6 border-t border-gray-100">
            
            <button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((prev) => prev - 1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-cyan-600 text-cyan-600 text-sm font-bold rounded-xl hover:bg-cyan-50 disabled:opacity-40 disabled:hover:bg-white transition-all active:scale-95 select-none"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="text-sm font-bold text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
              Page <span className="text-cyan-600">{pageNumber}</span> of <span className="text-gray-800">{numPages || "—"}</span>
            </div>

            <button
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber((prev) => prev + 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 text-white text-sm font-bold rounded-xl hover:bg-cyan-700 shadow-lg shadow-cyan-100 hover:shadow-cyan-200 disabled:opacity-40 transition-all active:scale-95 select-none"
            >
              Next
              <ChevronRight size={16} />
            </button>

          </div>
        </motion.div>

      </div>
    </div>
  );
}