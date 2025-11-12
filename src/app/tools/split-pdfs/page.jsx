"use client";
import theme from "@/styles/theme";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import { Box, Button, Stack, Tooltip } from "@mui/material";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";

const PDFSplitTool = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageThumbnails, setPageThumbnails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [splitMode, setSplitMode] = useState("range");
  const [rangeType, setRangeType] = useState("custom");
  const [selectAll, setSelectAll] = useState("Select All");
  const [customRanges, setCustomRanges] = useState([{ start: "1", end: "" }]);
  const [fixedRange, setFixedRange] = useState("2");
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [mergeExtracted, setMergeExtracted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const [pageRotations, setPageRotations] = useState({});
  const [isSplitButtonBlinking, setIsSplitButtonBlinking] = useState(false); // New state for split button blinking
  const [blinkingDownloadButtonId, setBlinkingDownloadButtonId] =
    useState(null); // New state for individual download buttons blinking

  const canvasRef = useRef(null);
  const previewContainerRef = useRef(null);
  const renderTaskRef = useRef(null);

  // Helper function to initiate PDF download
  const downloadPdf = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  // Load JSZip library
  const loadJsZip = async () => {
    if (window.JSZip) return;
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.async = true;
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const generatePageThumbnail = async (pdfDoc, pageNum) => {
    try {
      const page = await pdfDoc.getPage(pageNum);
      const vp = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = vp.height;
      canvas.width = vp.width;
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      return canvas.toDataURL();
    } catch {
      return null;
    }
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }
    setLoading(true);
    setError(null);
    setFile(null);
    setPages([]);
    setPageThumbnails({});
    setSelectedPages(new Set());
    setCustomRanges([{ start: "1", end: "" }]);
    setDownloadUrls([]);
    setPageRotations({});
    try {
      await loadPdfJs();
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;
      const pageCount = pdfDoc.numPages;
      const pagesArray = Array.from({ length: pageCount }, (_, i) => i + 1);
      const thumbs = {};
      for (let i = 1; i <= pageCount; i++) {
        thumbs[i] = await generatePageThumbnail(pdfDoc, i);
      }
      setFile({
        file: selectedFile,
        name: selectedFile.name,
        pageCount,
        pdfDoc,
      });
      setPages(pagesArray);
      setPageThumbnails(thumbs);
      setCustomRanges([{ start: "1", end: pageCount.toString() }]);
    } catch (err) {
      console.error(err);
      setError("Failed to load PDF file");
    } finally {
      setLoading(false);
    }
  };

  const rotatePage = (pageNum, direction) => {
    const current = pageRotations[pageNum] || 0;
    const delta = direction === "left" ? -90 : 90;
    const newRot = (current + delta + 360) % 360;
    setPageRotations((prev) => ({ ...prev, [pageNum]: newRot }));
  };

  const rotateAllPages = (direction) => {
    const delta = direction === "left" ? -90 : 90;
    const newRotations = {};
    pages.forEach((pageNum) => {
      const current = pageRotations[pageNum] || 0;
      newRotations[pageNum] = (current + delta + 360) % 360;
    });
    setPageRotations(newRotations);
  };

  const resetAllRotations = () => {
    setPageRotations({});
  };

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
    if (!previewOpen || !file || pages.length === 0) return;
    const pageNum = pages[previewPageIndex];
    const canvas = canvasRef.current;
    const container = previewContainerRef.current;
    if (!canvas || !container) return;
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }
    try {
      const page = await file.pdfDoc.getPage(pageNum);
      const rot = pageRotations[pageNum] || 0;
      let vp = page.getViewport({ scale: 1 });
      if (rot) {
        vp = page.getViewport({ scale: 1, rotation: rot });
      }
      const containerW = container.clientWidth - 64;
      const containerH = container.clientHeight - 64;
      const scale = Math.min(containerW / vp.width, containerH / vp.height, 2);
      const scaledVp = page.getViewport({ scale, rotation: rot });
      canvas.width = scaledVp.width;
      canvas.height = scaledVp.height;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const renderTask = page.render({
        canvasContext: ctx,
        viewport: scaledVp,
      });
      renderTaskRef.current = renderTask;
      await renderTask.promise;
      renderTaskRef.current = null;
    } catch (err) {
      if (err.name !== "RenderingCancelledException") console.error(err);
    }
  }, [previewOpen, previewPageIndex, pages, file, pageRotations]);

  useEffect(() => {
    if (previewOpen) renderPdfPage();
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [previewOpen, renderPdfPage]);

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

  const addRange = () => {
    setCustomRanges([...customRanges, { start: "", end: "" }]);
  };

  const removeRange = (index) => {
    if (customRanges.length === 1) return;
    setCustomRanges(customRanges.filter((_, i) => i !== index));
  };

  const updateRange = (index, field, value) => {
    const newRanges = [...customRanges];
    newRanges[index][field] = value;
    setCustomRanges(newRanges);
  };

  const togglePageSelection = (pageNum) => {
    const newSet = new Set(selectedPages);
    if (newSet.has(pageNum)) {
      newSet.delete(pageNum);
    } else {
      newSet.add(pageNum);
    }
    setSelectedPages(newSet);
  };

  const selectAllPages = () => {
    setSelectedPages(new Set(pages));
  };

  const deselectAllPages = () => {
    setSelectedPages(new Set());
  };

  const handleSplit = async () => {
    if (!file) return;
    setProcessing(true);
    setIsSplitButtonBlinking(true); // Start blinking
    setTimeout(() => setIsSplitButtonBlinking(false), 3000); // Stop blinking after 3 seconds

    setError(null);
    setDownloadUrls([]);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib"); // Added degrees here
      const arrayBuffer = await file.file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const results = [];
      if (splitMode === "range") {
        if (rangeType === "custom") {
          const validRanges = customRanges.filter((r) => r.start && r.end);
          if (validRanges.length === 0) {
            setError("Please specify at least one valid range");
            setProcessing(false);
            return;
          }
          for (const range of validRanges) {
            const start = parseInt(range.start);
            const end = parseInt(range.end);
            if (
              isNaN(start) ||
              isNaN(end) ||
              start < 1 ||
              end > file.pageCount ||
              start > end
            ) {
              setError(`Invalid range: ${range.start}-${range.end}`);
              setProcessing(false);
              return;
            }
            const newPdf = await PDFDocument.create();
            const pageIndices = Array.from(
              { length: end - start + 1 },
              (_, i) => start - 1 + i
            );
            for (const idx of pageIndices) {
              const [copiedPage] = await newPdf.copyPages(sourcePdf, [idx]);
              const rot = pageRotations[idx + 1] || 0;
              if (rot) {
                copiedPage.setRotation(degrees(rot));
              }
              newPdf.addPage(copiedPage);
            }
            const bytes = await newPdf.save();
            const blob = new Blob([bytes], { type: "application/pdf" });
            results.push({
              blob,
              name: `${file.name.replace(
                ".pdf",
                ""
              )}_pages_${start}-${end}.pdf`,
            });
          }
        } else {
          const rangeSize = parseInt(fixedRange);
          if (isNaN(rangeSize) || rangeSize < 1) {
            setError("Invalid fixed range value");
            setProcessing(false);
            return;
          }
          for (let i = 0; i < file.pageCount; i += rangeSize) {
            const start = i;
            const end = Math.min(i + rangeSize - 1, file.pageCount - 1);
            const newPdf = await PDFDocument.create();
            const pageIndices = Array.from(
              { length: end - start + 1 },
              (_, idx) => start + idx
            );
            for (const idx of pageIndices) {
              const [copiedPage] = await newPdf.copyPages(sourcePdf, [idx]);
              const rot = pageRotations[idx + 1] || 0;
              if (rot) {
                copiedPage.setRotation(degrees(rot));
              }
              newPdf.addPage(copiedPage);
            }
            const bytes = await newPdf.save();
            const blob = new Blob([bytes], { type: "application/pdf" });
            results.push({
              blob,
              name: `${file.name.replace(".pdf", "")}_pages_${start + 1}-${
                end + 1
              }.pdf`,
            });
          }
        }
      } else {
        if (selectedPages.size === 0) {
          setError("Please select at least one page to extract");
          setProcessing(false);
          return;
        }
        if (mergeExtracted) {
          const newPdf = await PDFDocument.create();
          const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
          for (const pageNum of sortedPages) {
            const [copiedPage] = await newPdf.copyPages(sourcePdf, [
              pageNum - 1,
            ]);
            const rot = pageRotations[pageNum] || 0;
            if (rot) {
              copiedPage.setRotation(degrees(rot));
            }
            newPdf.addPage(copiedPage);
          }
          const bytes = await newPdf.save();
          const blob = new Blob([bytes], { type: "application/pdf" });
          results.push({
            blob,
            name: `${file.name.replace(".pdf", "")}_extracted_pages.pdf`,
          });
        } else {
          for (const pageNum of selectedPages) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(sourcePdf, [
              pageNum - 1,
            ]);
            const rot = pageRotations[pageNum] || 0;
            if (rot) {
              copiedPage.setRotation(degrees(rot));
            }
            newPdf.addPage(copiedPage);
            const bytes = await newPdf.save();
            const blob = new Blob([bytes], { type: "application/pdf" });
            results.push({
              blob,
              name: `${file.name.replace(".pdf", "")}_page_${pageNum}.pdf`,
            });
          }
        }
      }
      const urls = results.map((r) => ({
        url: URL.createObjectURL(r.blob),
        name: r.name,
      }));
      setDownloadUrls(urls);
    } catch (err) {
      console.error(err);
      setError("Failed to split PDF");
    } finally {
      setProcessing(false);
    }
  };

  // Function to handle downloading a single split range
  const handleSplitAndDownloadSingle = async (card) => {
    if (!file) return;
    setProcessing(true);
    setBlinkingDownloadButtonId(card.id); // Start blinking for this button
    setTimeout(() => setBlinkingDownloadButtonId(null), 3000); // Stop blinking after 3 seconds

    setError(null);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const arrayBuffer = await file.file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      const pageIndices = Array.from(
        { length: card.end - card.start + 1 },
        (_, i) => card.start - 1 + i
      );
      for (const idx of pageIndices) {
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [idx]);
        const rot = pageRotations[idx + 1] || 0;
        if (rot) {
          copiedPage.setRotation(degrees(rot));
        }
        newPdf.addPage(copiedPage);
      }
      const bytes = await newPdf.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const filename = `${file.name.replace(".pdf", "")}_pages_${card.start}-${
        card.end
      }.pdf`;
      downloadPdf(blob, filename);
    } catch (err) {
      console.error(err);
      setError("Failed to download PDF range");
    } finally {
      setProcessing(false);
    }
  };

  // Function to handle downloading a single extracted page
  const handleExtractAndDownloadSingle = async (pageNum) => {
    if (!file) return;
    setProcessing(true);
    setBlinkingDownloadButtonId(`page-${pageNum}`); // Start blinking for this button
    setTimeout(() => setBlinkingDownloadButtonId(null), 3000); // Stop blinking after 3 seconds

    setError(null);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const arrayBuffer = await file.file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageNum - 1]);
      const rot = pageRotations[pageNum] || 0;
      if (rot) {
        copiedPage.setRotation(degrees(rot));
      }
      newPdf.addPage(copiedPage);
      const bytes = await newPdf.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const filename = `${file.name.replace(".pdf", "")}_page_${pageNum}.pdf`;
      downloadPdf(blob, filename);
    } catch (err) {
      console.error(err);
      setError("Failed to download extracted page");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadAllZip = async () => {
    if (!file) return; // Ensure a file is loaded
    setProcessing(true);
    setBlinkingDownloadButtonId("download-all-zip"); // Start blinking for this button
    setTimeout(() => setBlinkingDownloadButtonId(null), 3000); // Stop blinking after 3 seconds
    setError(null);

    try {
      await loadJsZip(); // Ensure JSZip is loaded
      const { PDFDocument, degrees } = await import("pdf-lib");

      let filesToZip = downloadUrls; // Use already processed files if available

      if (filesToZip.length === 0) {
        // If no files are processed yet, perform the split
        const arrayBuffer = await file.file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer);
        const results = [];

        if (splitMode === "range") {
          if (rangeType === "custom") {
            const validRanges = customRanges.filter((r) => r.start && r.end);
            if (validRanges.length === 0) {
              setError("Please specify at least one valid range");
              setProcessing(false);
              return;
            }
            for (const range of validRanges) {
              const start = parseInt(range.start);
              const end = parseInt(range.end);
              if (
                isNaN(start) ||
                isNaN(end) ||
                start < 1 ||
                end > file.pageCount ||
                start > end
              ) {
                setError(`Invalid range: ${range.start}-${range.end}`);
                setProcessing(false);
                return;
              }
              const newPdf = await PDFDocument.create();
              const pageIndices = Array.from(
                { length: end - start + 1 },
                (_, i) => start - 1 + i
              );
              for (const idx of pageIndices) {
                const [copiedPage] = await newPdf.copyPages(sourcePdf, [idx]);
                const rot = pageRotations[idx + 1] || 0;
                if (rot) {
                  copiedPage.setRotation(degrees(rot));
                }
                newPdf.addPage(copiedPage);
              }
              const bytes = await newPdf.save();
              const blob = new Blob([bytes], { type: "application/pdf" });
              results.push({
                blob,
                name: `${file.name.replace(
                  ".pdf",
                  ""
                )}_pages_${start}-${end}.pdf`,
              });
            }
          } else {
            // fixed range
            const rangeSize = parseInt(fixedRange);
            if (isNaN(rangeSize) || rangeSize < 1) {
              setError("Invalid fixed range value");
              setProcessing(false);
              return;
            }
            for (let i = 0; i < file.pageCount; i += rangeSize) {
              const start = i;
              const end = Math.min(i + rangeSize - 1, file.pageCount - 1);
              const newPdf = await PDFDocument.create();
              const pageIndices = Array.from(
                { length: end - start + 1 },
                (_, idx) => start + idx
              );
              for (const idx of pageIndices) {
                const [copiedPage] = await newPdf.copyPages(sourcePdf, [idx]);
                const rot = pageRotations[idx + 1] || 0;
                if (rot) {
                  copiedPage.setRotation(degrees(rot));
                }
                newPdf.addPage(copiedPage);
              }
              const bytes = await newPdf.save();
              const blob = new Blob([bytes], { type: "application/pdf" });
              results.push({
                blob,
                name: `${file.name.replace(".pdf", "")}_pages_${start + 1}-${
                  end + 1
                }.pdf`,
              });
            }
          }
        } else {
          // extract mode
          if (selectedPages.size === 0) {
            setError("Please select at least one page to extract");
            setProcessing(false);
            return;
          }
          if (mergeExtracted) {
            const newPdf = await PDFDocument.create();
            const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
            for (const pageNum of sortedPages) {
              const [copiedPage] = await newPdf.copyPages(sourcePdf, [
                pageNum - 1,
              ]);
              const rot = pageRotations[pageNum] || 0;
              if (rot) {
                copiedPage.setRotation(degrees(rot));
              }
              newPdf.addPage(copiedPage);
            }
            const bytes = await newPdf.save();
            const blob = new Blob([bytes], { type: "application/pdf" });
            results.push({
              blob,
              name: `${file.name.replace(".pdf", "")}_extracted_pages.pdf`,
            });
          } else {
            for (const pageNum of selectedPages) {
              const newPdf = await PDFDocument.create();
              const [copiedPage] = await newPdf.copyPages(sourcePdf, [
                pageNum - 1,
              ]);
              const rot = pageRotations[pageNum] || 0;
              if (rot) {
                copiedPage.setRotation(degrees(rot));
              }
              newPdf.addPage(copiedPage);
              const bytes = await newPdf.save();
              const blob = new Blob([bytes], { type: "application/pdf" });
              results.push({
                blob,
                name: `${file.name.replace(".pdf", "")}_page_${pageNum}.pdf`,
              });
            }
          }
        }
        filesToZip = results.map((r) => ({
          url: URL.createObjectURL(r.blob),
          name: r.name,
          blob: r.blob, // Store blob for direct zipping without refetching
        }));
        // Optionally update downloadUrls state if you want these to appear in the top notification as well
        // setDownloadUrls(filesToZip.map(f => ({ url: f.url, name: f.name })));
      }

      if (filesToZip.length === 0) {
        setError("No files to download.");
        setProcessing(false);
        return;
      }

      const zip = new window.JSZip();
      const folder = zip.folder(file.name.replace(".pdf", "_split_files"));

      for (const item of filesToZip) {
        if (item.blob) {
          // Use already available blob if present
          folder.file(item.name, item.blob);
        } else {
          // Otherwise, fetch from URL (for existing downloadUrls)
          const response = await fetch(item.url);
          const blob = await response.blob();
          folder.file(item.name, blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipFileName = `${file.name.replace(".pdf", "")}_split.zip`;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up the zip URL

      // Clean up individual object URLs *if they were just generated for zipping*
      if (downloadUrls.length === 0 && filesToZip.length > 0) {
        filesToZip.forEach((item) => URL.revokeObjectURL(item.url));
      } else {
        // For existing downloadUrls, they are managed by the main download UI
        downloadUrls.forEach((item) => URL.revokeObjectURL(item.url));
        setDownloadUrls([]); // Clear download UI if the original list was zipped
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create ZIP file");
    } finally {
      setProcessing(false);
    }
  };

  const getSplitPreview = () => {
    if (!file) return null;
    if (splitMode === "range") {
      if (rangeType === "custom") {
        const validRanges = customRanges.filter((r) => r.start && r.end);
        return `${validRanges.length} PDF file(s) will be created`;
      } else {
        const rangeSize = parseInt(fixedRange) || 2;
        const fileCount = Math.ceil(file.pageCount / rangeSize);
        return `${fileCount} PDF file(s) will be created`;
      }
    } else {
      if (mergeExtracted) {
        return `1 PDF file with ${selectedPages.size} page(s) will be created`;
      } else {
        return `${selectedPages.size} PDF file(s) will be created`;
      }
    }
  };

  const potentialFileCount = useMemo(() => {
    if (!file) return 0;
    if (splitMode === "range") {
      if (rangeType === "custom") {
        const validRanges = customRanges.filter((r) => r.start && r.end);
        return validRanges.length;
      } else {
        // fixed range
        const rangeSize = parseInt(fixedRange);
        if (isNaN(rangeSize) || rangeSize < 1) return 0;
        return Math.ceil(file.pageCount / rangeSize);
      }
    } else {
      // extract mode
      if (mergeExtracted) {
        return selectedPages.size > 0 ? 1 : 0;
      } else {
        return selectedPages.size;
      }
    }
  }, [
    file,
    splitMode,
    rangeType,
    customRanges,
    fixedRange,
    selectedPages,
    mergeExtracted,
  ]);

  const getRangeCards = useMemo(() => {
    if (!file || splitMode !== "range") return [];
    if (rangeType === "custom") {
      return customRanges
        .map((range, idx) => {
          const start = parseInt(range.start);
          const end = parseInt(range.end);
          if (
            isNaN(start) ||
            isNaN(end) ||
            start < 1 ||
            end > file.pageCount ||
            start > end
          ) {
            return null;
          }
          return {
            id: `range-${idx}`,
            start,
            end,
            rangeIndex: idx,
          };
        })
        .filter(Boolean);
    } else {
      const rangeSize = parseInt(fixedRange) || 2;
      const cards = [];
      for (let i = 0; i < file.pageCount; i += rangeSize) {
        const start = i + 1;
        const end = Math.min(i + rangeSize, file.pageCount);
        cards.push({
          id: `fixed-${i}`,
          start,
          end,
        });
      }
      return cards;
    }
  }, [file, splitMode, rangeType, customRanges, fixedRange]);

  return (
    <div
      style={{
        background: theme.palette.ui.pageBackground,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-4 fixed z-[1000]">
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", gap: "20px" }}
        >
          <div className="flex items-center gap-4">
            <div
              style={{
                color: theme.palette.primary.main,
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              ToolsHub
            </div>
            <h1
              className="text-2xl font-semibold"
              style={{ minWidth: "180px" }}
            >
              PDF Split Tool
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
              {/* Mode Buttons */}
              <Stack direction="row" sx={{ alignItems: "center", gap: "20px" }}>
                <div className="flex gap-4 justify-self-center">
                  {(() => {
                    const splitModeButtonsData = [
                      {
                        title: "Split by Range",
                        tooltipText: "Split PDF using custom or fixed ranges",
                        handler: () => {
                          setSplitMode("range");
                          setSelectedPages(new Set());
                        },
                      },
                      {
                        title: "Extract Pages",
                        tooltipText: "Extract selected pages into new PDF(s)",
                        handler: () => {
                          setSplitMode("extract");
                          setCustomRanges([
                            { start: "1", end: file.pageCount.toString() },
                          ]);
                        },
                      },
                    ];
                    return (
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        sx={{
                          flexWrap: "wrap",
                          gap: "10px",
                          width: { xs: "100%", sm: "auto" },
                          borderWidth: "4px",
                          borderColor: theme.palette.primary.main,
                          p: "4px",
                          borderRadius: "30px",
                        }}
                      >
                        {splitModeButtonsData.map((buttonData, index) => {
                          const isActiveButton =
                            (buttonData.title === "Split by Range" &&
                              splitMode === "range") ||
                            (buttonData.title === "Extract Pages" &&
                              splitMode === "extract");
                          return (
                            <Tooltip
                              key={index}
                              title={buttonData.tooltipText}
                              placement="top"
                              arrow
                              slotProps={{
                                popper: {
                                  modifiers: [
                                    {
                                      name: "zIndex",
                                      enabled: true,
                                      phase: "write",
                                      fn: ({ state }) => {
                                        state.styles.popper.zIndex = 9999;
                                      },
                                    },
                                  ],
                                },
                                tooltip: {
                                  sx: {
                                    bgcolor: "#333",
                                    color: "#fff",
                                    fontSize: "14px",
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "8px",
                                  },
                                },
                                arrow: { sx: { color: "#333" } },
                              }}
                            >
                              <Button
                                variant="outlined"
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "3px",
                                  borderRadius: "30px",
                                  transition: "all 0.3s ease",
                                  textTransform: "none",
                                  fontSize: "16px",
                                  py: "4px",
                                  px: "0px",
                                  minWidth: { xs: "100%", sm: "135px" },
                                  flex: { xs: "none", sm: "1" },
                                  minHeight: "48px",
                                  bgcolor: isActiveButton
                                    ? theme.palette.primary.main
                                    : "transparent",
                                  color: isActiveButton
                                    ? "#ffffff"
                                    : theme.palette.primary.secondMain,
                                  border: "none",
                                  "& .MuiButton-startIcon": {
                                    marginRight: "2px",
                                  },
                                  boxShadow: "none",
                                }}
                                onClick={buttonData.handler}
                              >
                                {buttonData.title}
                              </Button>
                            </Tooltip>
                          );
                        })}
                      </Stack>
                    );
                  })()}
                </div>
                {/* Rotation Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => rotateAllPages("left")}
                    style={{
                      background: theme.palette.primary.main,
                      color: "#fff",
                    }}
                    className="px-5 py-3 rounded-lg cursor-pointer hover:opacity-90"
                    title="Rotate all left"
                  >
                    <RotateLeftIcon />
                  </button>
                  <button
                    onClick={() => rotateAllPages("right")}
                    style={{
                      background: theme.palette.primary.main,
                      color: "#fff",
                    }}
                    className="px-5 py-3 rounded-lg cursor-pointer hover:opacity-90"
                    title="Rotate all right"
                  >
                    <RotateRightIcon />
                  </button>
                  <button
                    onClick={resetAllRotations}
                    style={{
                      background: theme.palette.ui.delete,
                      color: "#fff",
                    }}
                    className="px-6 py-4 rounded-lg cursor-pointer hover:opacity-90"
                    title="Reset rotations"
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
                </div>
              </Stack>
              {/* Split button */}
              <button
                onClick={handleSplit}
                disabled={processing}
                style={{
                  background: theme.palette.primary.main,
                  color: "#fff",
                }}
                className="px-8 py-3 rounded-xl text-lg font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                sx={{
                  animation: isSplitButtonBlinking
                    ? "blink 1s linear 3"
                    : "none",
                  "@keyframes blink": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                    "100%": { opacity: 1 },
                  },
                }}
              >
                {processing ? "Processing..." : "Split PDF"}
              </button>
            </Stack>
          )}
        </Stack>
        {/* Download Notification - Refactored */}
        {downloadUrls.length > 0 && (
          <div
            style={{
              background: "#ecfdf5",
              borderColor: theme.palette.primary.main,
            }}
            className="mt-4 border px-4 py-3 rounded flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <h3
                style={{ color: theme.palette.primary.main }}
                className="text-lg font-semibold"
              >
                Your split PDF files are ready! ({downloadUrls.length} file(s))
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadAllZip}
                  style={{
                    background: theme.palette.primary.main,
                    color: "#fff",
                  }}
                  className="px-4.5 py-3 rounded-[8px] flex items-center gap-2 hover:opacity-90 cursor-pointer"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download All (ZIP)
                </button>
                <button
                  onClick={() => setDownloadUrls([])}
                  style={{ color: theme.palette.primary.main }}
                  className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div
              className="flex flex-wrap gap-3 max-h-48 overflow-y-auto"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                "&::WebkitScrollbar": {
                  display: "none",
                },
              }}
            >
              {downloadUrls.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  download={item.name}
                  style={{
                    background: theme.palette.primary.main,
                    color: "#fff",
                  }}
                  className="px-4 py-2 rounded flex items-center gap-2 hover:opacity-90"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  File {idx + 1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* === MAIN CONTENT AREA === */}
      <div
        style={{
          height: `calc(100vh - ${
            downloadUrls.length > 0 ? "180px" : "120px"
          })`,
          overflow: "hidden",
          margin: "110px 16px",
        }}
      >
        {!file ? (
          <div
            style={{ background: "#fff" }}
            className="border-2 border-dashed rounded-3xl min-h-[80vh] flex flex-col items-center justify-center p-12"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <svg
                  className="animate-spin h-16 w-16 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ color: theme.palette.primary.main }}
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
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            ) : (
              <>
                <svg
                  className="w-24 h-24 mb-6"
                  fill="none"
                  stroke={theme.palette.primary.main}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <label
                  style={{
                    background: theme.palette.primary.main,
                    color: "#fff",
                  }}
                  className="px-10 py-4 rounded-xl cursor-pointer text-xl font-semibold mb-6 hover:opacity-90"
                >
                  Select PDF file
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="text-gray-600 text-lg mb-4">
                  Upload your PDF to split into multiple files
                </p>
                <div className="flex gap-3 flex-wrap justify-center">
                  <span
                    style={{ background: "#fee2e2", color: "#991b1b" }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    PDF Only
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: "100%",
              display: "flex",
              height: "100%",
            }}
          >
            {/* LEFT PANEL */}
            <Box
              sx={{ minWidth: "25%", display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  background: "#fff",
                  height: "100%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  borderRadius: "16px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                  "&::WebkitScrollbar": {
                    display: "none",
                  },
                }}
                className="shadow-sm scrollbar-hide"
              >
                <h2
                  style={{ color: theme.palette.primary.main }}
                  className="text-[22px] font-bold"
                >
                  {splitMode === "range" ? " Range Mode" : "Extract Mode"}
                </h2>
                <div className="mb-3"></div>
                {splitMode === "range" ? (
                  <>
                    <div className="mb-3">
                      <div
                        style={{
                          background: theme.palette.secondary.main,
                          borderWidth: "4px",
                          borderColor: theme.palette.primary.main,
                          borderRadius: "50px",
                        }}
                        className="flex gap-1 mb-4 p-1"
                      >
                        <button
                          onClick={() => setRangeType("custom")}
                          style={{
                            background:
                              rangeType === "custom"
                                ? theme.palette.primary.main
                                : theme.palette.secondary.main,
                            color:
                              rangeType === "custom"
                                ? "#fff"
                                : theme.palette.primary.main,
                            borderRadius: "50px",
                          }}
                          className="flex-1 py-4 rounded-lg font-medium cursor-pointer text-sm hover:opacity-90"
                        >
                          Custom Ranges
                        </button>
                        <button
                          onClick={() => setRangeType("fixed")}
                          style={{
                            background:
                              rangeType === "fixed"
                                ? theme.palette.primary.main
                                : theme.palette.secondary.main,
                            color:
                              rangeType === "fixed"
                                ? "#fff"
                                : theme.palette.primary.main,
                            borderRadius: "50px",
                          }}
                          className="flex-1 py-4 rounded-lg font-medium cursor-pointer text-sm hover:opacity-90"
                        >
                          Fixed Range
                        </button>
                      </div>
                    </div>
                    {rangeType === "custom" ? (
                      <>
                        <p
                          style={{ color: theme.palette.primary.main }}
                          className="text-[16px] mb-4"
                        >
                          Define page ranges to split
                        </p>
                        <div className="space-y-4 mb-4">
                          {customRanges.map((range, idx) => (
                            <div
                              key={idx}
                              style={{
                                borderColor: theme.palette.primary.main,
                              }}
                              className="border-2 rounded-xl p-4 relative"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h4
                                  className="font-semibold text-sm"
                                  style={{
                                    color: theme.palette.primary.main,
                                  }}
                                >
                                  Split Range {idx + 1}
                                </h4>
                                {customRanges.length > 1 && (
                                  <button
                                    onClick={() => removeRange(idx)}
                                    style={{
                                      background: theme.palette.ui.delete,
                                      color: "#fff",
                                    }}
                                    className="p-1.5 rounded hover:opacity-90 cursor-pointer absolute top-[-12px] right-[-12px]"
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
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="number"
                                  placeholder="From"
                                  value={range.start}
                                  onChange={(e) =>
                                    updateRange(idx, "start", e.target.value)
                                  }
                                  min="1"
                                  max={file.pageCount}
                                  style={{
                                    borderColor: theme.palette.primary.main,
                                  }}
                                  className="px-3 py-2 border rounded-lg text-sm"
                                />
                                <input
                                  type="number"
                                  placeholder="To"
                                  value={range.end}
                                  onChange={(e) =>
                                    updateRange(idx, "end", e.target.value)
                                  }
                                  min="1"
                                  max={file.pageCount}
                                  style={{
                                    borderColor: theme.palette.primary.main,
                                  }}
                                  className="px-3 py-2 border rounded-lg text-sm"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={addRange}
                          style={{
                            color: theme.palette.primary.main,
                            borderColor: theme.palette.primary.main,
                          }}
                          className="w-full py-2 border rounded-lg font-medium cursor-pointer hover:opacity-90 flex items-center justify-center gap-2"
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
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Add Another Range
                        </button>
                      </>
                    ) : (
                      <>
                        <p
                          style={{ color: theme.palette.primary.main }}
                          className="text-[16px] mb-4"
                        >
                          Split every N pages into separate files
                        </p>
                        <input
                          type="number"
                          value={fixedRange}
                          onChange={(e) => setFixedRange(e.target.value)}
                          min="1"
                          max={file.pageCount}
                          style={{ borderColor: theme.palette.primary.main }}
                          className="w-full px-4 py-3 border rounded-lg text-lg"
                          placeholder="Pages per file"
                        />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <p
                      style={{ color: theme.palette.primary.main }}
                      className="text-sm mb-2"
                    >
                      Select pages to extract from the PDF
                    </p>
                    <div
                      style={{
                        background: theme.palette.secondary.main,
                        borderWidth: "4px",
                        borderColor: theme.palette.primary.main,
                        borderRadius: "50px",
                      }}
                      className="flex gap-1 mb-4 p-1"
                    >
                      <button
                        onClick={() => {
                          selectAllPages();
                          setSelectAll("Select All");
                        }}
                        style={{
                          background:
                            selectAll === "Select All"
                              ? theme.palette.primary.main
                              : theme.palette.secondary.main,
                          color:
                            selectAll === "Select All"
                              ? "#fff"
                              : theme.palette.primary.main,
                          borderRadius: "50px",
                        }}
                        className="flex-1 py-4 rounded rounded-lg font-medium cursor-pointer text-[14px] hover:opacity-90"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => {
                          deselectAllPages();
                          setSelectAll("De Select All");
                        }}
                        style={{
                          background:
                            selectAll === "De Select All"
                              ? theme.palette.primary.main
                              : theme.palette.secondary.main,
                          color:
                            selectAll === "De Select All"
                              ? "#fff"
                              : theme.palette.primary.main,
                          borderRadius: "50px",
                        }}
                        className="flex-1 py-4 rounded-lg font-medium cursor-pointer text-[14px] hover:opacity-90"
                      >
                        Deselect All
                      </button>
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center gap-2 cursor-pointer relative">
                        <input
                          type="checkbox"
                          checked={mergeExtracted}
                          onChange={(e) => setMergeExtracted(e.target.checked)}
                          className="appearance-none h-6 w-6 border-2 rounded-md checked:bg-blue-600 checked:border-none focus:outline-none cursor-pointer"
                          style={{
                            borderColor: theme.palette.primary.main,
                            backgroundColor: theme.palette.secondary.main,
                          }}
                        />
                        <span
                          className="absolute left-0 top-0 h-6 w-6 flex items-center justify-center pointer-events-none rounded-md"
                          style={{
                            backgroundColor: mergeExtracted
                              ? theme.palette.secondary.secondMain
                              : "transparent",
                            color: theme.palette.primary.main,
                          }}
                        >
                          {mergeExtracted && (
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              stroke={theme.palette.primary.main}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="text-[16px] text-gray-700 ml-2">
                          Merge extracted pages into one PDF
                        </span>
                      </label>
                    </div>
                    <div
                      style={{ background: theme.palette.secondary.main }}
                      className="p-4 rounded-lg"
                    >
                      <p
                        style={{ color: theme.palette.primary.main }}
                        className="text-[16px]"
                      >
                        <strong>{selectedPages.size}</strong> page(s) selected
                      </p>
                    </div>
                  </>
                )}
                <div
                  style={{ background: theme.palette.secondary.main }}
                  className="mt-2 p-4 rounded-lg"
                >
                  <p
                    className="text-[16px] font-medium"
                    style={{ color: theme.palette.primary.main }}
                  >
                    {getSplitPreview()}
                  </p>
                </div>
                <div
                  className="mt-6 p-4 border rounded-lg"
                  style={{ borderColor: theme.palette.primary.main }}
                >
                  <p
                    className="text-sm font-semibold mb-2"
                    style={{ color: theme.palette.primary.main }}
                  >
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {file.pageCount} pages
                  </p>
                </div>
              </div>
            </Box>

            {/* RIGHT PANEL */}
            <Box
              sx={{
                width: "100%",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  height: "100%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",

                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                  "&::WebkitScrollbar": {
                    display: "none",
                  },
                }}
                className="shadow-sm"
              >
                <div className="flex justify-between items-center mb-6 relative">
                  <h2
                    style={{ color: theme.palette.primary.main }}
                    className="text-xl font-bold"
                  >
                    {splitMode === "range"
                      ? "Range Preview"
                      : `Pages (${file.pageCount})`}
                  </h2>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center" }}
                  >
                    {splitMode === "extract" && selectedPages.size > 0 && (
                      <button
                        onClick={() => {
                          deselectAllPages();
                          setSelectAll("De Select All");
                        }}
                        style={{
                          background: theme.palette.ui.delete,
                          color: "#fff",
                        }}
                        className="px-4 py-3 rounded-lg cursor-pointer hover:opacity-90"
                      >
                        Clear Selection ({selectedPages.size})
                      </button>
                    )}
                    {file &&
                      potentialFileCount > 1 && ( // Condition updated here
                        <Button
                          onClick={handleDownloadAllZip}
                          style={{
                            background: theme.palette.primary.main,
                            color: "#fff",
                          }}
                          className="flex items-center gap-2 hover:opacity-90"
                          disabled={processing}
                          sx={{
                            animation:
                              blinkingDownloadButtonId === "download-all-zip"
                                ? "blink 1s linear 3"
                                : "none",
                            "@keyframes blink": {
                              "0%": { opacity: 1 },
                              "50%": { opacity: 0.5 },
                              "100%": { opacity: 1 },
                            },
                            py: "12px",
                            px: "20px",
                            borderRadius: "6px",
                          }}
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
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download All (ZIP)
                        </Button>
                      )}
                  </Stack>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <svg
                      className="animate-spin h-16 w-16 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      style={{ color: theme.palette.primary.main }}
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
                    <p className="text-gray-600">Loading PDF...</p>
                  </div>
                ) : splitMode === "range" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {getRangeCards.map((card, idx) => (
                      <div
                        key={card.id}
                        style={{ background: theme.palette.secondary.main }}
                        className={`rounded-lg transition-all hover:-translate-y-1 hover:shadow-lg ${
                          getRangeCards.length % 2 !== 0 &&
                          idx === getRangeCards.length - 1
                            ? "sm:col-span-2"
                            : ""
                        }`}
                      >
                        <div className="relative">
                          <div className="grid grid-cols-2 gap-5 p-4">
                            <div
                              className="bg-white rounded-lg p-2 pt-4"
                              style={{
                                height: "226px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {pageThumbnails[card.start] ? (
                                <img
                                  src={pageThumbnails[card.start]}
                                  alt={`Page ${card.start}`}
                                  className="w-full h-32 object-contain"
                                  style={{
                                    transform: `rotate(${
                                      pageRotations[card.start] || 0
                                    }deg)`,
                                  }}
                                />
                              ) : (
                                <div className="flex items-center justify-center text-gray-400 text-xs">
                                  Loading...
                                </div>
                              )}
                              <p className="text-center text-xs my-4 font-medium">
                                Page {card.start}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-2 pt-4">
                              {pageThumbnails[card.end] ? (
                                <img
                                  src={pageThumbnails[card.end]}
                                  alt={`Page ${card.end}`}
                                  className="w-full h-32 object-contain"
                                  style={{
                                    transform: `rotate(${
                                      pageRotations[card.end] || 0
                                    }deg)`,
                                  }}
                                />
                              ) : (
                                <div className="h-32 flex items-center justify-center text-gray-400 text-xs">
                                  Loading...
                                </div>
                              )}
                            </div>
                            <p className="text-center text-xs my-4 font-medium">
                              Page {card.end}
                            </p>
                          </div>
                          {rangeType === "custom" && (
                            <button
                              onClick={() => removeRange(card.rangeIndex)}
                              style={{
                                background: theme.palette.ui.delete,
                                color: "#fff",
                              }}
                              className="absolute top-[-6px] right-[-6px] py-1.5 px-2 rounded-[4px] shadow cursor-pointer"
                              title="Remove range"
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                        <div
                          className="p-3 border-t text-center"
                          style={{
                            borderColor: theme.palette.secondary.fourthMain,
                          }}
                        >
                          <p
                            className="text-sm font-medium p-2 rounded"
                            style={{
                              background: theme.palette.primary.main,
                              color: "#ffffff",
                            }}
                          >
                            Pages ( {card.start} - {card.end} )
                          </p>
                          <Button
                            onClick={() => {
                              handleSplitAndDownloadSingle(card);
                            }}
                            style={{
                              background: theme.palette.primary.main,
                              color: "#fff",
                            }}
                            className="mt-2 px-4 py-2 rounded flex items-center gap-2 hover:opacity-90 w-full justify-center"
                            disabled={processing}
                            sx={{
                              // animation:
                              //   blinkingDownloadButtonId === card.id
                              //     ? "blink 1s linear 3"
                              //     : "none",
                              // "@keyframes blink": {
                              //   "0%": { opacity: 1 },
                              //   "50%": { opacity: 0.5 },
                              //   "100%": { opacity: 1 },
                              // },
                              mt: "6px",
                            }}
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            Download Range
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                    {pages.map((pageNum, idx) => {
                      const isSelected = selectedPages.has(pageNum);
                      const rotation = pageRotations[pageNum] || 0;
                      return (
                        <div
                          key={pageNum}
                          onClick={() => togglePageSelection(pageNum)}
                          style={{
                            background: theme.palette.secondary.main,
                            borderColor: isSelected
                              ? theme.palette.primary.main
                              : "transparent",
                            borderWidth: isSelected ? "3px" : "1px",
                          }}
                          className={`w-60 rounded-lg relative overflow-visible cursor-pointer ${
                            isSelected
                              ? "ring-6 ring-[#1fd5e947] border-none"
                              : "border-none"
                          }`}
                        >
                          <div className="relative cursor-pointer">
                            <div
                              style={{
                                background: theme.palette.secondary.main,
                              }}
                              className="h-62 flex items-center justify-center relative rounded-lg"
                            >
                              {pageThumbnails[pageNum] ? (
                                <img
                                  src={pageThumbnails[pageNum]}
                                  alt={`Page ${pageNum}`}
                                  className="max-w-full max-h-full object-contain"
                                  style={{
                                    transform: `rotate(${rotation}deg)`,
                                  }}
                                />
                              ) : (
                                <span className="text-5xl text-gray-400">
                                  PDF
                                </span>
                              )}
                              <div className="absolute top-[-10px] right-[-10px] flex gap-2 z-10">
                                <Tooltip title="Rotate left">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      rotatePage(pageNum, "left");
                                    }}
                                    style={{
                                      background: theme.palette.primary.main,
                                      color: "#fff",
                                    }}
                                    className="w-7 h-7 rounded shadow cursor-pointer"
                                  >
                                    <RotateLeftIcon />
                                  </button>
                                </Tooltip>
                                <Tooltip title="Rotate right">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      rotatePage(pageNum, "right");
                                    }}
                                    style={{
                                      background: theme.palette.primary.main,
                                      color: "#fff",
                                    }}
                                    className="w-7 h-7 rounded shadow cursor-pointer"
                                  >
                                    <RotateRightIcon />
                                  </button>
                                </Tooltip>
                                <button
                                  style={{
                                    background:
                                      theme.palette.secondary.secondMain,
                                  }}
                                  className="p-1.5 rounded shadow cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openPreview(idx);
                                  }}
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
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                    />
                                  </svg>
                                </button>
                              </div>
                              {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                  <div
                                    style={{
                                      background:
                                        theme.palette.secondary.secondMain,
                                      color: theme.palette.primary.main,
                                    }}
                                    className="rounded-full p-2"
                                  >
                                    <svg
                                      className="w-10 h-10"
                                      fill="none"
                                      stroke={theme.palette.primary.main}
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
                            </div>
                            <div
                              style={{
                                background: theme.palette.secondary.main,
                                borderColor: theme.palette.secondary.fourthMain,
                              }}
                              className="p-2 border-t"
                            >
                              <p
                                className="text-xs truncate font-medium p-2 rounded my-1 mb-1.5 py-2.5"
                                style={{
                                  background: theme.palette.primary.main,
                                  color: "#ffffff",
                                  textAlign: "center",
                                }}
                              >
                                Page {pageNum}
                              </p>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent toggling page selection
                                  handleExtractAndDownloadSingle(pageNum);
                                }}
                                style={{
                                  background: theme.palette.primary.main,
                                  color: "#fff",
                                }}
                                className="mt-2 px-4 py-2 rounded flex items-center gap-2 hover:opacity-90 w-full justify-center"
                                disabled={processing}
                                sx={{
                                  animation:
                                    blinkingDownloadButtonId ===
                                    `page-${pageNum}`
                                      ? "blink 1s linear 3"
                                      : "none",
                                  "@keyframes blink": {
                                    "0%": { opacity: 1 },
                                    "50%": { opacity: 0.5 },
                                    "100%": { opacity: 1 },
                                  },
                                }}
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
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                                Download Page
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Box>
          </Stack>
        )}
        {error && (
          <div
            style={{ background: "#fee2e2", borderColor: "#ef4444" }}
            className="mt-4 border px-4 py-3 rounded-lg"
          >
            <p style={{ color: "#991b1b" }}>{error}</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closePreview}
        >
          <div
            className="bg-gray-800 rounded-lg overflow-hidden flex flex-col w-full h-full max-w-7xl max-h-[85vh] m-4 mt-28"
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
                className="font-medium text-lg"
              >
                {file.name} - Page {pages[previewPageIndex]}
              </h3>
              <button
                onClick={closePreview}
                style={{ background: theme.palette.primary.main }}
                className="text-white p-2 rounded cursor-pointer hover:opacity-90"
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
              className="flex items-center justify-center gap-4 p-4 border-t"
            >
              <button
                onClick={handlePrevPage}
                style={{
                  background: theme.palette.primary.main,
                  color: "#fff",
                }}
                className="p-3 rounded cursor-pointer hover:opacity-90"
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
                  background: theme.palette.primary.main,
                  color: "#fff",
                }}
                className="p-3 rounded cursor-pointer hover:opacity-90"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFSplitTool;
