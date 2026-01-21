// src/app/tools/delete-pdfs/_components/DeletePdfClient.jsx
"use client";
import ToolsHubsIcon from "@/icons/ToolsHubsIcon";
import theme from "@/styles/theme";
import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import Link from "next/link";
import { degrees, PDFDocument } from "pdf-lib"; // Import PDFDocument from pdf-lib
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import PreviewIcon from "@mui/icons-material/Preview"; // Import Preview icon
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";

export default function DeletePdfClient() {
  const [file, setFile] = useState(null); // Only one file allowed
  const [pages, setPages] = useState([]); // Array of { pageNum, globalId, originalIndex }
  const [pageRotations, setPageRotations] = useState({}); // { globalId: degrees }
  const [globalRotation, setGlobalRotation] = useState(0); // Global rotation for the file
  const [selectedPages, setSelectedPages] = useState(new Set()); // For pages to delete
  const [loadingFile, setLoadingFile] = useState(false); // Loading state for file upload
  const [loadingProgress, setLoadingProgress] = useState(0); // Loading progress percentage
  const [processingPdf, setProcessingPdf] = useState(false); // Loading state for download/processing
  const [error, setError] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPageIndex, setPreviewPageIndex] = useState(0); // 0-based index in 'pages'
  const canvasRef = useRef(null);
  const previewContainerRef = useRef(null);
  const renderTaskRef = useRef(null);

  // --------------------------- PDF.JS ---------------------------
  const loadPdfJs = async () => {
    if (window.pdfjsLib) return;
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    await new Promise((resolve, reject) => {
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const generatePageThumbnail = async (pdfjsDoc, pageNum, rotation = 0) => {
    try {
      const page = await pdfjsDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.5, rotation });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;
      return canvas.toDataURL();
    } catch {
      return null;
    }
  };

  // --------------------------- FILE HANDLING ---------------------------
  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    setLoadingFile(true); // Start loading for file upload
    setLoadingProgress(0);
    setLoadingFile(true); // Start loading for file upload
    setLoadingProgress(0);
    setError(null);
    setFile(null); // Clear previous file state
    setPages([]);
    setPageRotations({});
    setGlobalRotation(0);
    setSelectedPages(new Set());

    try {
      // Load PDF.js library
      setLoadingProgress(10);
      await loadPdfJs();
      
      // Read file as ArrayBuffer
      setLoadingProgress(30);
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      // Load PDF document
      setLoadingProgress(50);
      const pdfjsDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;

      const newPages = Array.from({ length: pdfjsDoc.numPages }, (_, i) => ({
        pageNum: i + 1,
        originalIndex: i, // Store original index for consistent referencing
        globalId: `${selectedFile.name}-${i + 1}`,
      }));

      // Generate thumbnails for all pages (initially unrotated)
      setLoadingProgress(70);
      const initialThumbnails = {};
      for (let i = 0; i < newPages.length; i++) {
        const page = newPages[i];
        initialThumbnails[page.globalId] = await generatePageThumbnail(
          pdfjsDoc,
          page.pageNum,
          0 // Generate unrotated thumbnail
        );
        
        // Update progress incrementally (70% to 95%)
        const pageProgress = 70 + Math.floor(((i + 1) / newPages.length) * 25);
        setLoadingProgress(pageProgress);
      }
      
      // Final update
      setLoadingProgress(100);

      setFile({
        rawFile: selectedFile,
        pdfjsDoc, // Store pdfjsLib document
        name: selectedFile.name,
        initialThumbnails, // Store all initial thumbnails
      });
      setPages(newPages);
    } catch (err) {
      console.error("Failed to load PDF:", err);
      setError("Failed to load PDF. Please try again.");
    } finally {
      setLoadingFile(false); // End loading for file upload
      setLoadingProgress(0);
    }
  };

  const deleteFile = () => {
    setFile(null);
    setPages([]);
    setPageRotations({});
    setGlobalRotation(0);
    setSelectedPages(new Set());
    setLoadingFile(false);
    setProcessingPdf(false);
    setError(null);
    closePreview();
  };

  // --------------------------- ROTATION LOGIC ---------------------------
  const rotateClockwise = (current) => (current + 90) % 360;
  const rotateCounterClockwise = (current) => (current - 90 + 360) % 360;

  const applyGlobalRotation = (direction) => {
    setGlobalRotation((prev) =>
      direction === "left"
        ? rotateCounterClockwise(prev)
        : rotateClockwise(prev)
    );
    // Reset individual page rotations when global rotation is applied
    setPageRotations({});
  };

  const rotatePage = (globalId, direction) => {
    setPageRotations((prev) => {
      const current = prev[globalId] || 0;
      return {
        ...prev,
        [globalId]:
          direction === "left"
            ? rotateCounterClockwise(current)
            : rotateClockwise(current),
      };
    });
  };

  const resetAllRotations = () => {
    setGlobalRotation(0);
    setPageRotations({});
  };

  // --------------------------- PAGE SELECTION / DELETION ---------------------------
  const togglePageSelection = (globalId) => {
    setSelectedPages((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(globalId)) {
        newSelection.delete(globalId);
      } else {
        newSelection.add(globalId);
      }
      return newSelection;
    });
  };

  const deleteSelectedPages = () => {
    if (selectedPages.size === 0) {
      setError("No pages selected for deletion.");
      return;
    }
    if (pages.length - selectedPages.size <= 0) {
      setError("Cannot delete all pages. At least one page must remain.");
      return;
    }
    setPages((prev) =>
      prev.filter((page) => !selectedPages.has(page.globalId))
    );
    // Also remove rotations for deleted pages
    setPageRotations((prev) => {
      const newRotations = { ...prev };
      selectedPages.forEach((globalId) => delete newRotations[globalId]);
      return newRotations;
    });
    setSelectedPages(new Set());
    setError(null);
    closePreview(); // Close preview if the current page is deleted
    setPreviewPageIndex(0); // Reset preview to first page
  };

  const deleteSinglePage = (globalId) => {
    if (pages.length <= 1) {
      setError("Cannot delete all pages. At least one page must remain.");
      return;
    }
    setPages((prev) => prev.filter((page) => page.globalId !== globalId));
    setPageRotations((prev) => {
      const newRotations = { ...prev };
      delete newRotations[globalId];
      return newRotations;
    });
    setSelectedPages((prev) => {
      const newSelection = new Set(prev);
      newSelection.delete(globalId);
      return newSelection;
    });
    setError(null);
    closePreview(); // Close preview if the current page is deleted
    setPreviewPageIndex(0); // Reset preview to first page
  };

  const deselectAllPages = () => setSelectedPages(new Set());

  // --------------------------- PREVIEW LOGIC ---------------------------
  const openPreview = (pageIndex) => {
    setPreviewPageIndex(pageIndex);
    setPreviewOpen(true);
  };
  const closePreview = () => setPreviewOpen(false);

  const handlePrevPage = useCallback(() => {
    setPreviewPageIndex((p) => (p > 0 ? p - 1 : pages.length - 1));
  }, [pages.length]);

  const handleNextPage = useCallback(() => {
    setPreviewPageIndex((p) => (p < pages.length - 1 ? p + 1 : 0));
  }, [pages.length]);

  const renderPdfPage = useCallback(async () => {
    if (!previewOpen || pages.length === 0 || !file || !file.pdfjsDoc) return;

    const pageRef = pages[previewPageIndex];
    if (!pageRef) return;

    const canvas = canvasRef.current;
    const container = previewContainerRef.current;
    if (!canvas || !container) return;

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    try {
      // Use pdfjsDoc for rendering
      const page = await file.pdfjsDoc.getPage(pageRef.pageNum);
      const effectiveRotation =
        (pageRotations[pageRef.globalId] || 0) + globalRotation; // Add global rotation

      let viewport = page.getViewport({ scale: 1 });
      if (effectiveRotation) {
        viewport = page.getViewport({ scale: 1, rotation: effectiveRotation });
      }

      const containerW = container.clientWidth - 64;
      const containerH = container.clientHeight - 64;
      const scale = Math.min(
        containerW / viewport.width,
        containerH / viewport.height,
        2
      );
      const scaledViewport = page.getViewport({
        scale,
        rotation: effectiveRotation,
      });

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const renderTask = page.render({
        canvasContext: ctx,
        viewport: scaledViewport,
      });
      renderTaskRef.current = renderTask;
      await renderTask.promise;
      renderTaskRef.current = null;
    } catch (err) {
      if (err.name !== "RenderingCancelledException") console.error(err);
    }
  }, [
    previewOpen,
    previewPageIndex,
    pages,
    file,
    pageRotations,
    globalRotation,
  ]);

  useEffect(() => {
    if (previewOpen) renderPdfPage();
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [previewOpen, renderPdfPage]);

  // Keyboard navigation for preview
  useEffect(() => {
    const onKey = (e) => {
      if (!previewOpen) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevPage();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextPage();
      }
      if (e.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewOpen, handlePrevPage, handleNextPage]);

  // --------------------------- DOWNLOAD ---------------------------
  const handleDownload = async () => {
    if (!file || pages.length === 0) {
      setError("No file or pages to download.");
      return;
    }
    setProcessingPdf(true); // Start loading for processing/download
    setError(null);
    try {
      await loadPdfJs(); // Ensure pdf.js is loaded (should be already for previews)

      // Load the PDF using pdf-lib for manipulation
      const originalPdfLibDoc = await PDFDocument.load(
        await file.rawFile.arrayBuffer()
      );

      const newPdfDoc = await PDFDocument.create();

      for (const pageRef of pages) {
        // Here, pageRef.pageNum refers to the original page number from the source PDF
        // copyPages uses 0-based index
        const [copiedPage] = await newPdfDoc.copyPages(originalPdfLibDoc, [
          pageRef.pageNum - 1,
        ]);
        const effectiveRotation =
          (pageRotations[pageRef.globalId] || 0) + globalRotation;
        if (effectiveRotation) {
          copiedPage.setRotation(degrees(effectiveRotation));
        }
        newPdfDoc.addPage(copiedPage);
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const filename = `modified_${file.name}`;
      
      // Auto-download the file
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error during PDF processing:", e);
      setError("Failed to process and download PDF. Please try again.");
    } finally {
      setProcessingPdf(false); // End loading
    }
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return "PDF";
    return "FILE";
  };

  // Conditional rendering for the main content area
  const renderMainContent = () => {
    if (loadingFile) {
      // Use loadingFile for initial file load
      return (
        <div className="w-full flex flex-col items-center justify-center py-16">
          <div className="relative mb-4">
            <svg
              className="animate-spin h-20 w-20"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: theme.palette.primary.main }}
              ></circle>
              <circle
                className="opacity-75"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="63"
                strokeDashoffset="47"
                strokeLinecap="round"
                style={{ color: theme.palette.primary.main }}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-[16px] font-bold"
                style={{ color: theme.palette.primary.main }}
              >
                {loadingProgress || 0}%
              </span>
            </div>
          </div>
          <p
            style={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
            }}
            className="text-[18px] font-medium mb-3"
          >
            Uploading
          </p>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${loadingProgress || 0}%`,
                backgroundColor: theme.palette.primary.main,
              }}
            ></div>
          </div>
        </div>
      );
    }

    if (!file) {
      return (
        <div className="w-full flex flex-col items-center justify-center py-16">
          <svg
            className="w-20 h-20 text-blue-600 mb-4"
            fill="none"
            stroke={theme.palette.primary.main}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <label
            style={{
              background: theme.palette.primary.main,
              color: theme.palette.secondary.secondMain,
            }}
            className="px-8 py-3 rounded cursor-pointer text-lg mb-4 flex items-center gap-2"
          >
            Select a PDF file
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileSelect}
            />
          </label>
          <p className="text-[#4a5565] mb-[20px] text-2xl mt-[20px]">
            Delete & Rotate Your PDF Document
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {["Only PDF Files"].map((f) => (
              <span
                key={f}
                className={`px-3 py-1 rounded text-lg font-semiboldbg-red-50 text-red-800`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-4">
        {pages.map((pg, i) => {
          const effectiveRotation =
            (pageRotations[pg.globalId] || 0) + globalRotation;
          const isSelected = selectedPages.has(pg.globalId);
          return (
            <div
              key={pg.globalId}
              className={`flex-grow flex-shrink-0 bg-white rounded-lg border-2 transition-all hover:shadow-lg relative ${
                isSelected ? "ring-4 ring-blue-300 border-none" : "border-none"
              }`}
              style={{
                flexBasis: "11rem",
                maxWidth: "15rem",
                minWidth: "11rem",
              }}
            >
              <div
                className="relative cursor-pointer"
                onClick={() => togglePageSelection(pg.globalId)}
              >
                <div
                  style={{ background: theme.palette.secondary.main }}
                  className="h-52 flex items-center justify-center relative"
                >
                  <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                    {file.initialThumbnails[pg.globalId] ? (
                      <img
                        src={file.initialThumbnails[pg.globalId]}
                        alt={`Page ${pg.pageNum}`}
                        className="max-w-full max-h-full object-contain"
                        style={{ transform: `rotate(${effectiveRotation}deg)` }}
                      />
                    ) : (
                      <span className="text-5xl">{getFileIcon("pdf")}</span>
                    )}
                  </div>
                  <div
                    style={{
                      background: theme.palette.secondary.secondMain,
                      color: theme.palette.primary.main,
                    }}
                    className="absolute top-0 right-[0] px-2 py-1 rounded text-xs font-semibold"
                  >
                    {i + 1}
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        style={{
                          background: theme.palette.secondary.secondMain,
                          color: theme.palette.primary.main,
                        }}
                        className="rounded-full p-2"
                      >
                        <svg
                          className="w-10 h-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSinglePage(pg.globalId);
                    }}
                    style={{
                      background: theme.palette.ui.delete,
                    }}
                    className="absolute left-[-10px] top-[-10px] text-white p-2 rounded shadow-lg cursor-pointer"
                    title="Delete"
                    disabled={pages.length <= 1 || processingPdf}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  {/* Page-level rotation and preview buttons */}
                  <div className="absolute top-[-10px] left-[28px] flex gap-1">
                    <Tooltip title="Rotate left">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          rotatePage(pg.globalId, "left");
                        }}
                        style={{
                          background: theme.palette.primary.main,
                          color: "#fff",
                        }}
                        className="w-8 h-8 rounded shadow cursor-pointer"
                        disabled={processingPdf}
                      >
                        <RotateLeftIcon />
                      </button>
                    </Tooltip>
                    <Tooltip title="Rotate right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          rotatePage(pg.globalId, "right");
                        }}
                        style={{
                          background: theme.palette.primary.main,
                          color: "#fff",
                        }}
                        className="w-8 h-8 rounded shadow cursor-pointer"
                        disabled={processingPdf}
                      >
                        <RotateRightIcon />
                      </button>
                    </Tooltip>
                    <Tooltip title="Preview Page">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview(i);
                        }}
                        style={{
                          background: theme.palette.secondary.secondMain,
                          color: theme.palette.primary.main,
                        }}
                        className="px-[9px] rounded shadow cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke={theme.palette.primary.main}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div
                  style={{ background: theme.palette.secondary.main }}
                  className="p-2 border-t border-gray-200"
                >
                  <p
                    className="text-xs truncate font-medium p-2 rounded-[8px] mb-2"
                    style={{
                      background: theme.palette.primary.main,
                      color: "#ffffff",
                    }}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    Page {pg.pageNum}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="" style={{ background: theme.palette.ui.pageBackground }}>
      {/* Header */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-2 flex flex-col fixed z-[1000]">
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", gap: "20px" }}
        >
          <div className="flex items-center gap-4">
            <Box component={Link} href="/" sx={{ cursor: "pointer" }}>
              <ToolsHubsIcon width="147" />
            </Box>
            <h1
              className="text-2xl font-semibold"
              style={{ minWidth: "180px" }}
            >
              Delete PDF Tool
            </h1>
          </div>
          {file && (
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: "20px" }}>
                <div className="flex gap-4 flex-wrap justify-self-center">
                  {/* Global Rotation Buttons */}
                  <div className="flex items-center gap-2">
                    <Tooltip title="Rotate all pages left" placement="top">
                      <button
                        onClick={() => applyGlobalRotation("left")}
                        style={{
                          background: theme.palette.primary.main,
                          color: "#fff",
                        }}
                        className="px-5 py-3 rounded-[6px] cursor-pointer"
                        disabled={processingPdf}
                      >
                        <RotateLeftIcon />
                      </button>
                    </Tooltip>
                    <Tooltip title="Rotate all pages right" placement="top">
                      <button
                        onClick={() => applyGlobalRotation("right")}
                        style={{
                          background: theme.palette.primary.main,
                          color: "#fff",
                        }}
                        className="px-5 py-3 rounded-[6px] cursor-pointer"
                        disabled={processingPdf}
                      >
                        <RotateRightIcon />
                      </button>
                    </Tooltip>
                    <Tooltip title="Reset all rotations" placement="top">
                      <button
                        onClick={resetAllRotations}
                        style={{
                          background: theme.palette.ui.delete,
                          color: "#fff",
                        }}
                        className="px-5 py-3 rounded-[6px] cursor-pointer"
                        disabled={processingPdf}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                    <Tooltip title="Add New PDF File">
                      <label className="cursor-pointer flex items-center gap-2 bg-transparent">
                        <IconButton
                          component="span"
                          sx={{
                            color: theme.palette.secondary.secondMain,
                            bgcolor: theme.palette.primary.main,
                            p: "8px",
                            px: "18px",
                            borderRadius: "6px",
                            "&:hover": { bgcolor: theme.palette.primary.main },
                          }}
                          disabled={loadingFile || processingPdf}
                        >
                          <CloudUploadIcon sx={{ fontSize: "32px" }} />
                        </IconButton>
                        <input
                          type="file"
                          className="hidden"
                          accept="application/pdf"
                          onChange={handleFileSelect}
                          disabled={loadingFile || processingPdf}
                        />
                      </label>
                    </Tooltip>
                  </div>

                  {selectedPages.size > 0 && (
                    <>
                      <button
                        onClick={deleteSelectedPages}
                        style={{ background: theme.palette.ui.delete }}
                        className="text-white px-6 py-2 rounded flex items-center gap-2 cursor-pointer"
                        disabled={
                          pages.length - selectedPages.size <= 0 ||
                          processingPdf
                        }
                      >
                        Delete Selected ({selectedPages.size})
                      </button>
                      <button
                        onClick={deselectAllPages}
                        style={{
                          background: theme.palette.primary.main,
                          color: "#fff",
                        }}
                        className="px-4 py-2 rounded cursor-pointer text-sm"
                        disabled={processingPdf}
                      >
                        Deselect All
                      </button>
                    </>
                  )}
                </div>
              </Stack>

              {/* Download button */}
              <button
                onClick={handleDownload}
                disabled={processingPdf || loadingFile || pages.length === 0}
                style={{ background: theme.palette.primary.main }}
                className="text-white px-12 py-3 rounded-[12px] text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[20px] cursor-pointer"
              >
                {processingPdf ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Download Modified PDF →</>
                )}
              </button>
            </Stack>
          )}
        </Stack>


      </div>

      <div
        className={`max-w-8xl mx-auto p-2 mt-[80px]`}
      >
        <div className="border-2 border-dashed border-[#1fd5e9] rounded-[22px] min-h-[100vh] bg-white p-6 flex flex-wrap gap-8 items-start">
          {renderMainContent()}
        </div>

        {/* Errors */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>

      {/* ------------------- PREVIEW MODAL ------------------- */}
      {previewOpen && file && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closePreview}
        >
          <div
            className="bg-gray-800 rounded-lg overflow-hidden flex flex-col w-full h-full max-w-7xl max-h-[85vh] m-4 mt-[110px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: theme.palette.secondary.secondMain,
                borderColor: theme.palette.primary.main,
              }}
              className="flex justify-between items-center p-4 border-b"
            >
              <h3
                style={{ color: theme.palette.primary.main }}
                className="font-medium"
              >
                {file.name} - Page {previewPageIndex + 1} / {pages.length}
              </h3>

              <button
                onClick={closePreview}
                style={{ background: theme.palette.primary.main }}
                className="text-white p-2 rounded cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              ref={previewContainerRef}
              style={{ background: theme.palette.secondary.main }}
              className="flex-1 flex items-center justify-center p-4 overflow-hidden"
            >
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full shadow-2xl"
              />
            </div>

            <div
              style={{
                background: theme.palette.secondary.secondMain,
                borderColor: theme.palette.primary.main,
              }}
              className="flex items-center justify-center gap-4 p-4 border-y"
            >
              <button
                onClick={handlePrevPage}
                style={{
                  color: theme.palette.secondary.secondMain,
                  background: theme.palette.primary.main,
                }}
                className="p-3 rounded cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span
                style={{ color: theme.palette.primary.main }}
                className="min-w-32 text-center font-semibold"
              >
                {previewPageIndex + 1} / {pages.length}
              </span>
              <button
                onClick={handleNextPage}
                style={{
                  color: theme.palette.secondary.secondMain,
                  background: theme.palette.primary.main,
                }}
                className="p-3 rounded cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={closePreview}
                style={{
                  color: theme.palette.secondary.secondMain,
                  background: theme.palette.primary.main,
                }}
                className="p-3 rounded cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (pages[previewPageIndex]) {
                    deleteSinglePage(pages[previewPageIndex].globalId);
                  }
                }}
                disabled={pages.length <= 1 || processingPdf}
                style={{
                  background: theme.palette.ui.delete,
                  color: theme.palette.primary.fourthMain,
                }}
                className="p-3 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
