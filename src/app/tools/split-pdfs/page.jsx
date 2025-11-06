// "use client";
// import theme from "@/styles/theme";
// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
//   useMemo,
// } from "react";

// const PDFSplitTool = () => {
//   const [file, setFile] = useState(null);
//   const [pages, setPages] = useState([]);
//   const [pageThumbnails, setPageThumbnails] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [splitMode, setSplitMode] = useState("range"); // 'range' or 'extract'
//   const [rangeType, setRangeType] = useState("custom"); // 'custom' or 'fixed'
//   const [customRanges, setCustomRanges] = useState([{ start: "", end: "" }]);
//   const [fixedRange, setFixedRange] = useState("2");
//   const [selectedPages, setSelectedPages] = useState(new Set());
//   const [mergeExtracted, setMergeExtracted] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [downloadUrls, setDownloadUrls] = useState([]);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewPageIndex, setPreviewPageIndex] = useState(0);
//   const [pageRotations, setPageRotations] = useState({});
//   const canvasRef = useRef(null);
//   const previewContainerRef = useRef(null);
//   const renderTaskRef = useRef(null);

//   // Load PDF.js
//   const loadPdfJs = async () => {
//     if (window.pdfjsLib) return;
//     const script = document.createElement("script");
//     script.src =
//       "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
//     script.async = true;
//     await new Promise((resolve, reject) => {
//       script.onload = () => {
//         window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//           "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//         resolve();
//       };
//       script.onerror = reject;
//       document.head.appendChild(script);
//     });
//   };

//   // Generate thumbnail for a page
//   const generatePageThumbnail = async (pdfDoc, pageNum) => {
//     try {
//       const page = await pdfDoc.getPage(pageNum);
//       const vp = page.getViewport({ scale: 0.5 });
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       canvas.height = vp.height;
//       canvas.width = vp.width;
//       await page.render({ canvasContext: ctx, viewport: vp }).promise;
//       return canvas.toDataURL();
//     } catch {
//       return null;
//     }
//   };

//   // Handle file upload
//   const handleFileSelect = async (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     if (selectedFile.type !== "application/pdf") {
//       setError("Please select a PDF file");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setFile(null);
//     setPages([]);
//     setPageThumbnails({});
//     setSelectedPages(new Set());
//     setCustomRanges([{ start: "", end: "" }]);
//     setDownloadUrls([]);
//     setPageRotations({});

//     try {
//       await loadPdfJs();
//       const arrayBuffer = await selectedFile.arrayBuffer();
//       const pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer })
//         .promise;

//       const pageCount = pdfDoc.numPages;
//       const pagesArray = Array.from({ length: pageCount }, (_, i) => i + 1);

//       // Generate thumbnails
//       const thumbs = {};
//       for (let i = 1; i <= pageCount; i++) {
//         thumbs[i] = await generatePageThumbnail(pdfDoc, i);
//       }

//       setFile({
//         file: selectedFile,
//         name: selectedFile.name,
//         pageCount,
//         pdfDoc,
//       });
//       setPages(pagesArray);
//       setPageThumbnails(thumbs);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load PDF file");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Rotation functions
//   const rotatePage = (pageNum, direction) => {
//     const current = pageRotations[pageNum] || 0;
//     const delta = direction === "left" ? -90 : 90;
//     const newRot = (current + delta + 360) % 360;
//     setPageRotations((prev) => ({ ...prev, [pageNum]: newRot }));
//   };

//   const rotateAllPages = (direction) => {
//     const delta = direction === "left" ? -90 : 90;
//     const newRotations = {};
//     pages.forEach((pageNum) => {
//       const current = pageRotations[pageNum] || 0;
//       newRotations[pageNum] = (current + delta + 360) % 360;
//     });
//     setPageRotations(newRotations);
//   };

//   const resetAllRotations = () => {
//     setPageRotations({});
//   };

//   // Preview functions
//   const openPreview = (pageIndex) => {
//     setPreviewPageIndex(pageIndex);
//     setPreviewOpen(true);
//   };

//   const closePreview = () => setPreviewOpen(false);

//   const handlePrevPage = useCallback(() => {
//     setPreviewPageIndex((p) => (p > 0 ? p - 1 : pages.length - 1));
//   }, [pages.length]);

//   const handleNextPage = useCallback(() => {
//     setPreviewPageIndex((p) => (p < pages.length - 1 ? p + 1 : 0));
//   }, [pages.length]);

//   const renderPdfPage = useCallback(async () => {
//     if (!previewOpen || !file || pages.length === 0) return;
//     const pageNum = pages[previewPageIndex];
//     const canvas = canvasRef.current;
//     const container = previewContainerRef.current;
//     if (!canvas || !container) return;

//     if (renderTaskRef.current) {
//       renderTaskRef.current.cancel();
//       renderTaskRef.current = null;
//     }

//     try {
//       const page = await file.pdfDoc.getPage(pageNum);
//       const rot = pageRotations[pageNum] || 0;
//       let vp = page.getViewport({ scale: 1 });
//       if (rot) {
//         vp = page.getViewport({ scale: 1, rotation: rot });
//       }

//       const containerW = container.clientWidth - 64;
//       const containerH = container.clientHeight - 64;
//       const scale = Math.min(containerW / vp.width, containerH / vp.height, 2);
//       const scaledVp = page.getViewport({ scale, rotation: rot });

//       canvas.width = scaledVp.width;
//       canvas.height = scaledVp.height;
//       const ctx = canvas.getContext("2d");
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const renderTask = page.render({
//         canvasContext: ctx,
//         viewport: scaledVp,
//       });
//       renderTaskRef.current = renderTask;
//       await renderTask.promise;
//       renderTaskRef.current = null;
//     } catch (err) {
//       if (err.name !== "RenderingCancelledException") console.error(err);
//     }
//   }, [previewOpen, previewPageIndex, pages, file, pageRotations]);

//   useEffect(() => {
//     if (previewOpen) renderPdfPage();
//     return () => {
//       if (renderTaskRef.current) {
//         renderTaskRef.current.cancel();
//         renderTaskRef.current = null;
//       }
//     };
//   }, [previewOpen, renderPdfPage]);

//   // Keyboard navigation
//   useEffect(() => {
//     const onKey = (e) => {
//       if (!previewOpen) return;
//       if (e.key === "ArrowLeft") {
//         e.preventDefault();
//         handlePrevPage();
//       }
//       if (e.key === "ArrowRight") {
//         e.preventDefault();
//         handleNextPage();
//       }
//       if (e.key === "Escape") closePreview();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [previewOpen, handlePrevPage, handleNextPage]);

//   // Range management
//   const addRange = () => {
//     setCustomRanges([...customRanges, { start: "", end: "" }]);
//   };

//   const removeRange = (index) => {
//     if (customRanges.length === 1) return;
//     setCustomRanges(customRanges.filter((_, i) => i !== index));
//   };

//   const updateRange = (index, field, value) => {
//     const newRanges = [...customRanges];
//     newRanges[index][field] = value;
//     setCustomRanges(newRanges);
//   };

//   // Toggle page selection
//   const togglePageSelection = (pageNum) => {
//     const newSet = new Set(selectedPages);
//     if (newSet.has(pageNum)) {
//       newSet.delete(pageNum);
//     } else {
//       newSet.add(pageNum);
//     }
//     setSelectedPages(newSet);
//   };

//   const selectAllPages = () => {
//     setSelectedPages(new Set(pages));
//   };

//   const deselectAllPages = () => {
//     setSelectedPages(new Set());
//   };

//   // Process split
//   const handleSplit = async () => {
//     if (!file) return;

//     setProcessing(true);
//     setError(null);
//     setDownloadUrls([]);

//     try {
//       const { PDFDocument } = await import("pdf-lib");
//       const arrayBuffer = await file.file.arrayBuffer();
//       const sourcePdf = await PDFDocument.load(arrayBuffer);

//       const results = [];

//       if (splitMode === "range") {
//         if (rangeType === "custom") {
//           // Custom ranges
//           const validRanges = customRanges.filter((r) => r.start && r.end);

//           if (validRanges.length === 0) {
//             setError("Please specify at least one valid range");
//             setProcessing(false);
//             return;
//           }

//           for (const range of validRanges) {
//             const start = parseInt(range.start);
//             const end = parseInt(range.end);

//             if (
//               isNaN(start) ||
//               isNaN(end) ||
//               start < 1 ||
//               end > file.pageCount ||
//               start > end
//             ) {
//               setError(`Invalid range: ${range.start}-${range.end}`);
//               setProcessing(false);
//               return;
//             }

//             const newPdf = await PDFDocument.create();
//             const pageIndices = Array.from(
//               { length: end - start + 1 },
//               (_, i) => start - 1 + i
//             );

//             for (const idx of pageIndices) {
//               const [copiedPage] = await newPdf.copyPages(sourcePdf, [idx]);
//               const rot = pageRotations[idx + 1] || 0;
//               if (rot) {
//                 const { degrees } = await import("pdf-lib");
//                 copiedPage.setRotation(degrees(rot));
//               }
//               newPdf.addPage(copiedPage);
//             }

//             const bytes = await newPdf.save();
//             const blob = new Blob([bytes], { type: "application/pdf" });
//             results.push({
//               blob,
//               name: `${file.name.replace(
//                 ".pdf",
//                 ""
//               )}_pages_${start}-${end}.pdf`,
//             });
//           }
//         } else {
//           // Fixed range
//           const rangeSize = parseInt(fixedRange);
//           if (isNaN(rangeSize) || rangeSize < 1) {
//             setError("Invalid fixed range value");
//             setProcessing(false);
//             return;
//           }

//           for (let i = 0; i < file.pageCount; i += rangeSize) {
//             const start = i;
//             const end = Math.min(i + rangeSize - 1, file.pageCount - 1);

//             const newPdf = await PDFDocument.create();
//             const pageIndices = Array.from(
//               { length: end - start + 1 },
//               (_, idx) => start + idx
//             );

//             for (const idx of pageIndices) {
//               const [copiedPage] = await newPdf.copyPages(sourcePdf, [idx]);
//               const rot = pageRotations[idx + 1] || 0;
//               if (rot) {
//                 const { degrees } = await import("pdf-lib");
//                 copiedPage.setRotation(degrees(rot));
//               }
//               newPdf.addPage(copiedPage);
//             }

//             const bytes = await newPdf.save();
//             const blob = new Blob([bytes], { type: "application/pdf" });
//             results.push({
//               blob,
//               name: `${file.name.replace(".pdf", "")}_pages_${start + 1}-${
//                 end + 1
//               }.pdf`,
//             });
//           }
//         }
//       } else {
//         // Extract pages mode
//         if (selectedPages.size === 0) {
//           setError("Please select at least one page to extract");
//           setProcessing(false);
//           return;
//         }

//         if (mergeExtracted) {
//           // Merge all selected pages into one PDF
//           const newPdf = await PDFDocument.create();
//           const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);

//           for (const pageNum of sortedPages) {
//             const [copiedPage] = await newPdf.copyPages(sourcePdf, [
//               pageNum - 1,
//             ]);
//             const rot = pageRotations[pageNum] || 0;
//             if (rot) {
//               const { degrees } = await import("pdf-lib");
//               copiedPage.setRotation(degrees(rot));
//             }
//             newPdf.addPage(copiedPage);
//           }

//           const bytes = await newPdf.save();
//           const blob = new Blob([bytes], { type: "application/pdf" });
//           results.push({
//             blob,
//             name: `${file.name.replace(".pdf", "")}_extracted_pages.pdf`,
//           });
//         } else {
//           // Create separate PDF for each selected page
//           for (const pageNum of selectedPages) {
//             const newPdf = await PDFDocument.create();
//             const [copiedPage] = await newPdf.copyPages(sourcePdf, [
//               pageNum - 1,
//             ]);
//             const rot = pageRotations[pageNum] || 0;
//             if (rot) {
//               const { degrees } = await import("pdf-lib");
//               copiedPage.setRotation(degrees(rot));
//             }
//             newPdf.addPage(copiedPage);

//             const bytes = await newPdf.save();
//             const blob = new Blob([bytes], { type: "application/pdf" });
//             results.push({
//               blob,
//               name: `${file.name.replace(".pdf", "")}_page_${pageNum}.pdf`,
//             });
//           }
//         }
//       }

//       // Create download URLs
//       const urls = results.map((r) => ({
//         url: URL.createObjectURL(r.blob),
//         name: r.name,
//       }));

//       setDownloadUrls(urls);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to split PDF");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Calculate preview info for split
//   const getSplitPreview = () => {
//     if (!file) return null;

//     if (splitMode === "range") {
//       if (rangeType === "custom") {
//         const validRanges = customRanges.filter((r) => r.start && r.end);
//         return `${validRanges.length} PDF file(s) will be created`;
//       } else {
//         const rangeSize = parseInt(fixedRange) || 2;
//         const fileCount = Math.ceil(file.pageCount / rangeSize);
//         return `${fileCount} PDF file(s) will be created`;
//       }
//     } else {
//       if (mergeExtracted) {
//         return `1 PDF file with ${selectedPages.size} page(s) will be created`;
//       } else {
//         return `${selectedPages.size} PDF file(s) will be created`;
//       }
//     }
//   };

//   return (
//     <div
//       style={{
//         background: theme.palette.ui.pageBackground,
//         minHeight: "100vh",
//       }}
//     >
//       {/* Header */}
//       <div className="w-full bg-white border-b border-gray-200 px-6 py-4 fixed z-[1000]">
//         <div className="flex justify-between items-center gap-4">
//           <div className="flex items-center gap-4">
//             <div
//               style={{
//                 color: theme.palette.primary.main,
//                 fontSize: "24px",
//                 fontWeight: "bold",
//               }}
//             >
//               ToolsHub
//             </div>
//             <h1
//               className="text-2xl font-semibold"
//               style={{ color: theme.palette.primary.main }}
//             >
//               PDF Split Tool
//             </h1>
//           </div>

//           {file && (
//             <div className="flex items-center gap-4">
//               {/* Rotation Controls */}
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => rotateAllPages("left")}
//                   style={{
//                     background: theme.palette.primary.main,
//                     color: "#fff",
//                   }}
//                   className="px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
//                   title="Rotate all left"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 19l-7-7 7-7m5 14v-7h-7"
//                     />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={() => rotateAllPages("right")}
//                   style={{
//                     background: theme.palette.primary.main,
//                     color: "#fff",
//                   }}
//                   className="px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
//                   title="Rotate all right"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 5l7 7-7 7m-5-14v7h7"
//                     />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={resetAllRotations}
//                   style={{ background: theme.palette.ui.delete, color: "#fff" }}
//                   className="px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
//                   title="Reset rotations"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               <button
//                 onClick={handleSplit}
//                 disabled={processing}
//                 style={{
//                   background: theme.palette.primary.main,
//                   color: "#fff",
//                 }}
//                 className="px-8 py-3 rounded-xl text-lg font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
//               >
//                 {processing ? "Processing..." : "Split PDF →"}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Download notification */}
//         {downloadUrls.length > 0 && (
//           <div
//             style={{
//               background: "#ecfdf5",
//               borderColor: theme.palette.primary.main,
//             }}
//             className="mt-4 border px-4 py-3 rounded flex items-center justify-between"
//           >
//             <span style={{ color: theme.palette.primary.main }}>
//               Your split PDF files are ready! ({downloadUrls.length} file(s))
//             </span>
//             <div className="flex items-center gap-3">
//               {downloadUrls.map((item, idx) => (
//                 <a
//                   key={idx}
//                   href={item.url}
//                   download={item.name}
//                   style={{
//                     background: theme.palette.primary.main,
//                     color: "#fff",
//                   }}
//                   className="px-4 py-2 rounded flex items-center gap-2 hover:opacity-90"
//                 >
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                     />
//                   </svg>
//                   File {idx + 1}
//                 </a>
//               ))}
//               <button
//                 onClick={() => setDownloadUrls([])}
//                 style={{ color: theme.palette.primary.main }}
//                 className="p-1 rounded-full hover:bg-gray-200"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Main Content */}
//       <div
//         className={`max-w-7xl mx-auto p-6 ${
//           downloadUrls.length > 0 ? "mt-32" : "mt-24"
//         }`}
//       >
//         {!file ? (
//           /* Upload Section */
//           <div
//             style={{ background: "#fff" }}
//             className="border-2 border-dashed rounded-3xl min-h-[80vh] flex flex-col items-center justify-center p-12"
//           >
//             <svg
//               className="w-24 h-24 mb-6"
//               fill="none"
//               stroke={theme.palette.primary.main}
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
//               />
//             </svg>
//             <label
//               style={{ background: theme.palette.primary.main, color: "#fff" }}
//               className="px-10 py-4 rounded-xl cursor-pointer text-xl font-semibold mb-6 hover:opacity-90"
//             >
//               Select PDF file
//               <input
//                 type="file"
//                 className="hidden"
//                 accept=".pdf"
//                 onChange={handleFileSelect}
//               />
//             </label>
//             <p className="text-gray-600 text-lg mb-4">
//               Upload your PDF to split into multiple files
//             </p>
//             <div className="flex gap-3 flex-wrap justify-center">
//               <span
//                 style={{ background: "#fee2e2", color: "#991b1b" }}
//                 className="px-4 py-2 rounded-lg text-sm font-semibold"
//               >
//                 PDF Only
//               </span>
//             </div>
//           </div>
//         ) : (
//           /* Split Interface */
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Panel - Options */}
//             <div className="lg:col-span-1">
//               <div
//                 style={{ background: "#fff" }}
//                 className="rounded-2xl p-6 shadow-sm"
//               >
//                 <h2
//                   style={{ color: theme.palette.primary.main }}
//                   className="text-xl font-bold mb-6"
//                 >
//                   Split Options
//                 </h2>

//                 {/* Mode Selection */}
//                 <div className="mb-6">
//                   <div className="flex gap-2 mb-4">
//                     <button
//                       onClick={() => {
//                         setSplitMode("range");
//                         setSelectedPages(new Set());
//                       }}
//                       style={{
//                         background:
//                           splitMode === "range"
//                             ? theme.palette.primary.main
//                             : theme.palette.secondary.main,
//                         color:
//                           splitMode === "range"
//                             ? "#fff"
//                             : theme.palette.primary.main,
//                       }}
//                       className="flex-1 py-3 rounded-lg font-semibold cursor-pointer hover:opacity-90"
//                     >
//                       Split by Range
//                     </button>
//                     <button
//                       onClick={() => {
//                         setSplitMode("extract");
//                         setCustomRanges([{ start: "", end: "" }]);
//                       }}
//                       style={{
//                         background:
//                           splitMode === "extract"
//                             ? theme.palette.primary.main
//                             : theme.palette.secondary.main,
//                         color:
//                           splitMode === "extract"
//                             ? "#fff"
//                             : theme.palette.primary.main,
//                       }}
//                       className="flex-1 py-3 rounded-lg font-semibold cursor-pointer hover:opacity-90"
//                     >
//                       Extract Pages
//                     </button>
//                   </div>
//                 </div>

//                 {splitMode === "range" ? (
//                   <>
//                     {/* Range Type */}
//                     <div className="mb-6">
//                       <div className="flex gap-2 mb-4">
//                         <button
//                           onClick={() => setRangeType("custom")}
//                           style={{
//                             background:
//                               rangeType === "custom"
//                                 ? theme.palette.primary.main
//                                 : theme.palette.secondary.main,
//                             color:
//                               rangeType === "custom"
//                                 ? "#fff"
//                                 : theme.palette.primary.main,
//                           }}
//                           className="flex-1 py-2 rounded-lg font-medium cursor-pointer text-sm hover:opacity-90"
//                         >
//                           Custom Ranges
//                         </button>
//                         <button
//                           onClick={() => setRangeType("fixed")}
//                           style={{
//                             background:
//                               rangeType === "fixed"
//                                 ? theme.palette.primary.main
//                                 : theme.palette.secondary.main,
//                             color:
//                               rangeType === "fixed"
//                                 ? "#fff"
//                                 : theme.palette.primary.main,
//                           }}
//                           className="flex-1 py-2 rounded-lg font-medium cursor-pointer text-sm hover:opacity-90"
//                         >
//                           Fixed Range
//                         </button>
//                       </div>
//                     </div>

//                     {rangeType === "custom" ? (
//                       <>
//                         <p className="text-sm text-gray-600 mb-4">
//                           Enter page ranges to split (e.g., 1-3, 5-7)
//                         </p>
//                         {customRanges.map((range, idx) => (
//                           <div
//                             key={idx}
//                             className="flex items-center gap-2 mb-3"
//                           >
//                             <input
//                               type="number"
//                               placeholder="Start"
//                               value={range.start}
//                               onChange={(e) =>
//                                 updateRange(idx, "start", e.target.value)
//                               }
//                               min="1"
//                               max={file.pageCount}
//                               style={{
//                                 borderColor: theme.palette.primary.main,
//                               }}
//                               className="flex-1 px-3 py-2 border rounded-lg"
//                             />
//                             <span className="text-gray-500">-</span>
//                             <input
//                               type="number"
//                               placeholder="End"
//                               value={range.end}
//                               onChange={(e) =>
//                                 updateRange(idx, "end", e.target.value)
//                               }
//                               min="1"
//                               max={file.pageCount}
//                               style={{
//                                 borderColor: theme.palette.primary.main,
//                               }}
//                               className="flex-1 px-3 py-2 border rounded-lg"
//                             />
//                             {customRanges.length > 1 && (
//                               <button
//                                 onClick={() => removeRange(idx)}
//                                 style={{
//                                   background: theme.palette.ui.delete,
//                                   color: "#fff",
//                                 }}
//                                 className="p-2 rounded-lg cursor-pointer hover:opacity-90"
//                               >
//                                 <svg
//                                   className="w-4 h-4"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M6 18L18 6M6 6l12 12"
//                                   />
//                                 </svg>
//                               </button>
//                             )}
//                           </div>
//                         ))}
//                         <button
//                           onClick={addRange}
//                           style={{
//                             background: theme.palette.secondary.main,
//                             color: theme.palette.primary.main,
//                             borderColor: theme.palette.primary.main,
//                           }}
//                           className="w-full py-2 border rounded-lg font-medium cursor-pointer hover:opacity-90"
//                         >
//                           + Add Range
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <p className="text-sm text-gray-600 mb-4">
//                           Split every N pages into separate files
//                         </p>
//                         <input
//                           type="number"
//                           value={fixedRange}
//                           onChange={(e) => setFixedRange(e.target.value)}
//                           min="1"
//                           max={file.pageCount}
//                           style={{ borderColor: theme.palette.primary.main }}
//                           className="w-full px-4 py-3 border rounded-lg text-lg"
//                           placeholder="Pages per file"
//                         />
//                       </>
//                     )}
//                   </>
//                 ) : (
//                   <>
//                     <p className="text-sm text-gray-600 mb-4">
//                       Select pages to extract from the PDF
//                     </p>
//                     <div className="flex gap-2 mb-4">
//                       <button
//                         onClick={selectAllPages}
//                         style={{
//                           background: theme.palette.secondary.main,
//                           color: theme.palette.primary.main,
//                           borderColor: theme.palette.primary.main,
//                         }}
//                         className="flex-1 py-2 border rounded-lg font-medium cursor-pointer hover:opacity-90"
//                       >
//                         Select All
//                       </button>
//                       <button
//                         onClick={deselectAllPages}
//                         style={{
//                           background: theme.palette.secondary.main,
//                           color: theme.palette.primary.main,
//                           borderColor: theme.palette.primary.main,
//                         }}
//                         className="flex-1 py-2 border rounded-lg font-medium cursor-pointer hover:opacity-90"
//                       >
//                         Deselect All
//                       </button>
//                     </div>

//                     <div className="mb-4">
//                       <label className="flex items-center gap-2 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={mergeExtracted}
//                           onChange={(e) => setMergeExtracted(e.target.checked)}
//                           className="w-4 h-4"
//                         />
//                         <span className="text-sm text-gray-700">
//                           Merge extracted pages into one PDF
//                         </span>
//                       </label>
//                     </div>

//                     <div
//                       style={{ background: theme.palette.secondary.main }}
//                       className="p-4 rounded-lg"
//                     >
//                       <p className="text-sm text-gray-600">
//                         <strong>{selectedPages.size}</strong> page(s) selected
//                       </p>
//                     </div>
//                   </>
//                 )}

//                 {/* Preview Info */}
//                 <div
//                   style={{ background: theme.palette.secondary.main }}
//                   className="mt-6 p-4 rounded-lg"
//                 >
//                   <p
//                     className="text-sm font-medium"
//                     style={{ color: theme.palette.primary.main }}
//                   >
//                     {getSplitPreview()}
//                   </p>
//                 </div>

//                 {/* File Info */}
//                 <div
//                   className="mt-6 p-4 border rounded-lg"
//                   style={{ borderColor: theme.palette.primary.main }}
//                 >
//                   <p
//                     className="text-sm font-semibold mb-2"
//                     style={{ color: theme.palette.primary.main }}
//                   >
//                     {file.name}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     {file.pageCount} pages
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Right Panel - Pages Grid */}
//             <div className="lg:col-span-2">
//               <div
//                 style={{ background: "#fff" }}
//                 className="rounded-2xl p-6 shadow-sm min-h-[80vh]"
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <h2
//                     style={{ color: theme.palette.primary.main }}
//                     className="text-xl font-bold"
//                   >
//                     Pages ({file.pageCount})
//                   </h2>
//                   {splitMode === "extract" && selectedPages.size > 0 && (
//                     <button
//                       onClick={deselectAllPages}
//                       style={{
//                         background: theme.palette.ui.delete,
//                         color: "#fff",
//                       }}
//                       className="px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
//                     >
//                       Clear Selection ({selectedPages.size})
//                     </button>
//                   )}
//                 </div>

//                 {loading ? (
//                   <div className="flex flex-col items-center justify-center py-20">
//                     <svg
//                       className="animate-spin h-16 w-16 mb-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       style={{ color: theme.palette.primary.main }}
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     <p className="text-gray-600">Loading PDF...</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                     {pages.map((pageNum, idx) => {
//                       const isSelected = selectedPages.has(pageNum);
//                       const rotation = pageRotations[pageNum] || 0;

//                       return (
//                         <div
//                           key={pageNum}
//                           onClick={() =>
//                             splitMode === "extract" &&
//                             togglePageSelection(pageNum)
//                           }
//                           style={{
//                             background: theme.palette.secondary.main,
//                             borderColor: isSelected
//                               ? theme.palette.primary.main
//                               : "transparent",
//                             borderWidth: isSelected ? "3px" : "1px",
//                           }}
//                           className={`rounded-lg overflow-hidden transition-all hover:shadow-lg relative ${
//                             splitMode === "extract" ? "cursor-pointer" : ""
//                           }`}
//                         >
//                           <div className="relative">
//                             <div
//                               style={{
//                                 background: theme.palette.secondary.main,
//                               }}
//                               className="h-48 flex items-center justify-center relative"
//                             >
//                               {pageThumbnails[pageNum] ? (
//                                 <img
//                                   src={pageThumbnails[pageNum]}
//                                   alt={`Page ${pageNum}`}
//                                   className="w-full h-full object-contain"
//                                   style={{
//                                     transform: `rotate(${rotation}deg)`,
//                                   }}
//                                 />
//                               ) : (
//                                 <span className="text-4xl text-gray-400">
//                                   PDF
//                                 </span>
//                               )}

//                               {/* Page Number Badge */}
//                               <div
//                                 style={{
//                                   background: theme.palette.primary.main,
//                                   color: "#fff",
//                                 }}
//                                 className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold"
//                               >
//                                 {pageNum}
//                               </div>

//                               {/* Rotation Controls */}
//                               <div className="absolute top-2 left-2 flex gap-1">
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     rotatePage(pageNum, "left");
//                                   }}
//                                   style={{
//                                     background: theme.palette.primary.main,
//                                     color: "#fff",
//                                   }}
//                                   className="p-1.5 rounded shadow cursor-pointer hover:opacity-90"
//                                   title="Rotate left"
//                                 >
//                                   <svg
//                                     className="w-3 h-3"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M12 19l-7-7 7-7m5 14v-7h-7"
//                                     />
//                                   </svg>
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     rotatePage(pageNum, "right");
//                                   }}
//                                   style={{
//                                     background: theme.palette.primary.main,
//                                     color: "#fff",
//                                   }}
//                                   className="p-1.5 rounded shadow cursor-pointer hover:opacity-90"
//                                   title="Rotate right"
//                                 >
//                                   <svg
//                                     className="w-3 h-3"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M12 5l7 7-7 7m-5-14v7h7"
//                                     />
//                                   </svg>
//                                 </button>
//                               </div>

//                               {/* Preview Button */}
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   openPreview(idx);
//                                 }}
//                                 style={{
//                                   background: "rgba(255, 255, 255, 0.9)",
//                                 }}
//                                 className="absolute bottom-2 right-2 p-2 rounded-full shadow cursor-pointer hover:opacity-90"
//                                 title="Preview"
//                               >
//                                 <svg
//                                   className="w-4 h-4"
//                                   fill="none"
//                                   stroke={theme.palette.primary.main}
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                   />
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                   />
//                                 </svg>
//                               </button>

//                               {/* Selection Checkmark */}
//                               {isSelected && (
//                                 <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
//                                   <div
//                                     style={{
//                                       background: theme.palette.primary.main,
//                                     }}
//                                     className="rounded-full p-2"
//                                   >
//                                     <svg
//                                       className="w-8 h-8 text-white"
//                                       fill="none"
//                                       stroke="currentColor"
//                                       viewBox="0 0 24 24"
//                                     >
//                                       <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={3}
//                                         d="M5 13l4 4L19 7"
//                                       />
//                                     </svg>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>

//                           <div
//                             style={{ background: theme.palette.secondary.main }}
//                             className="p-2 text-center"
//                           >
//                             <p className="text-xs text-gray-600 font-medium">
//                               Page {pageNum}
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Display */}
//         {error && (
//           <div
//             style={{ background: "#fee2e2", borderColor: "#ef4444" }}
//             className="mt-4 border px-4 py-3 rounded-lg"
//           >
//             <p style={{ color: "#991b1b" }}>{error}</p>
//           </div>
//         )}
//       </div>

//       {/* Preview Modal */}
//       {previewOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
//           onClick={closePreview}
//         >
//           <div
//             className="bg-gray-800 rounded-lg overflow-hidden flex flex-col w-full h-full max-w-7xl max-h-[85vh] m-4 mt-28"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div
//               style={{
//                 background: theme.palette.secondary.secondMain,
//                 borderColor: theme.palette.primary.main,
//               }}
//               className="flex justify-between items-center p-4 border-b"
//             >
//               <h3
//                 style={{ color: theme.palette.primary.main }}
//                 className="font-medium text-lg"
//               >
//                 {file.name} - Page {pages[previewPageIndex]}
//               </h3>
//               <button
//                 onClick={closePreview}
//                 style={{ background: theme.palette.primary.main }}
//                 className="text-white p-2 rounded cursor-pointer hover:opacity-90"
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <div
//               ref={previewContainerRef}
//               style={{ background: theme.palette.secondary.main }}
//               className="flex-1 flex items-center justify-center p-4 overflow-hidden"
//             >
//               <canvas
//                 ref={canvasRef}
//                 className="max-w-full max-h-full shadow-2xl"
//               />
//             </div>

//             <div
//               style={{
//                 background: theme.palette.secondary.secondMain,
//                 borderColor: theme.palette.primary.main,
//               }}
//               className="flex items-center justify-center gap-4 p-4 border-t"
//             >
//               <button
//                 onClick={handlePrevPage}
//                 style={{
//                   background: theme.palette.primary.main,
//                   color: "#fff",
//                 }}
//                 className="p-3 rounded cursor-pointer hover:opacity-90"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//               </button>
//               <span
//                 style={{ color: theme.palette.primary.main }}
//                 className="min-w-32 text-center font-semibold"
//               >
//                 {previewPageIndex + 1} / {pages.length}
//               </span>
//               <button
//                 onClick={handleNextPage}
//                 style={{
//                   background: theme.palette.primary.main,
//                   color: "#fff",
//                 }}
//                 className="p-3 rounded cursor-pointer hover:opacity-90"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PDFSplitTool;

"use client";
import theme from "@/styles/theme";
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
  const [splitMode, setSplitMode] = useState("range"); // 'range' or 'extract'
  const [rangeType, setRangeType] = useState("custom"); // 'custom' or 'fixed'
  const [customRanges, setCustomRanges] = useState([{ start: "", end: "" }]);
  const [fixedRange, setFixedRange] = useState("2");
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [mergeExtracted, setMergeExtracted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const [pageRotations, setPageRotations] = useState({});
  const canvasRef = useRef(null);
  const previewContainerRef = useRef(null);
  const renderTaskRef = useRef(null);

  // Load PDF.js
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

  // Generate thumbnail for a page
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

  // Handle file upload
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
    setCustomRanges([{ start: "", end: "" }]);
    setDownloadUrls([]);
    setPageRotations({});
    try {
      await loadPdfJs();
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;
      const pageCount = pdfDoc.numPages;
      const pagesArray = Array.from({ length: pageCount }, (_, i) => i + 1);

      // Generate thumbnails
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
    } catch (err) {
      console.error(err);
      setError("Failed to load PDF file");
    } finally {
      setLoading(false);
    }
  };

  // Rotation functions
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

  // Preview functions
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

  // Keyboard navigation
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

  // Range management
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

  // Toggle page selection
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

  // Process split
  const handleSplit = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setDownloadUrls([]);
    try {
      const { PDFDocument } = await import("pdf-lib");
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
                const { degrees } = await import("pdf-lib");
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
                const { degrees } = await import("pdf-lib");
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
              const { degrees } = await import("pdf-lib");
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
              const { degrees } = await import("pdf-lib");
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

  // Calculate preview info for split
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

  return (
    <div
      style={{
        background: theme.palette.ui.pageBackground,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-4 fixed z-[1000]">
        <div className="flex justify-between items-center gap-4">
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
              style={{ color: theme.palette.primary.main }}
            >
              PDF Split Tool
            </h1>
          </div>
          {file && (
            <div className="flex items-center gap-4">
              {/* Rotation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => rotateAllPages("left")}
                  style={{
                    background: theme.palette.primary.main,
                    color: "#fff",
                  }}
                  className="px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
                  title="Rotate all left"
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
                      d="M12 19l-7-7 7-7m5 14v-7h-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => rotateAllPages("right")}
                  style={{
                    background: theme.palette.primary.main,
                    color: "#fff",
                  }}
                  className="px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
                  title="Rotate all right"
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
                      d="M12 5l7 7-7 7m-5-14v7h7"
                    />
                  </svg>
                </button>
                <button
                  onClick={resetAllRotations}
                  style={{ background: theme.palette.ui.delete, color: "#fff" }}
                  className="px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
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
              <button
                onClick={handleSplit}
                disabled={processing}
                style={{
                  background: theme.palette.primary.main,
                  color: "#fff",
                }}
                className="px-8 py-3 rounded-xl text-lg font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              >
                {processing ? "Processing..." : "Split PDF"}
              </button>
            </div>
          )}
        </div>

        {/* Download notification */}
        {downloadUrls.length > 0 && (
          <div
            style={{
              background: "#ecfdf5",
              borderColor: theme.palette.primary.main,
            }}
            className="mt-4 border px-4 py-3 rounded flex items-center justify-between"
          >
            <span style={{ color: theme.palette.primary.main }}>
              Your split PDF files are ready! ({downloadUrls.length} file(s))
            </span>
            <div className="flex items-center gap-3">
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
              <button
                onClick={() => setDownloadUrls([])}
                style={{ color: theme.palette.primary.main }}
                className="p-1 rounded-full hover:bg-gray-200"
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
        )}
      </div>

      {/* Main Content */}
      <div
        className={`max-w-7xl mx-auto p-6 ${
          downloadUrls.length > 0 ? "mt-32" : "mt-24"
        }`}
      >
        {!file ? (
          /* Upload Section */
          <div
            style={{ background: "#fff" }}
            className="border-2 border-dashed rounded-3xl min-h-[80vh] flex flex-col items-center justify-center p-12"
          >
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
              style={{ background: theme.palette.primary.main, color: "#fff" }}
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
          </div>
        ) : (
          /* Split Interface */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Options */}
            <div className="lg:col-span-1">
              <div
                style={{ background: "#fff" }}
                className="rounded-2xl p-6 shadow-sm"
              >
                <h2
                  style={{ color: theme.palette.primary.main }}
                  className="text-xl font-bold mb-6"
                >
                  Split Options
                </h2>

                {/* Mode Selection */}
                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => {
                        setSplitMode("range");
                        setSelectedPages(new Set());
                      }}
                      style={{
                        background:
                          splitMode === "range"
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                        color:
                          splitMode === "range"
                            ? "#fff"
                            : theme.palette.primary.main,
                      }}
                      className="flex-1 py-3 rounded-lg font-semibold cursor-pointer hover:opacity-90"
                    >
                      Split by Range
                    </button>
                    <button
                      onClick={() => {
                        setSplitMode("extract");
                        setCustomRanges([{ start: "", end: "" }]);
                      }}
                      style={{
                        background:
                          splitMode === "extract"
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                        color:
                          splitMode === "extract"
                            ? "#fff"
                            : theme.palette.primary.main,
                      }}
                      className="flex-1 py-3 rounded-lg font-semibold cursor-pointer hover:opacity-90"
                    >
                      Extract Pages
                    </button>
                  </div>
                </div>

                {splitMode === "range" ? (
                  <>
                    {/* Range Type */}
                    <div className="mb-6">
                      <div className="flex gap-2 mb-4">
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
                          }}
                          className="flex-1 py-2 rounded-lg font-medium cursor-pointer text-sm hover:opacity-90"
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
                          }}
                          className="flex-1 py-2 rounded-lg font-medium cursor-pointer text-sm hover:opacity-90"
                        >
                          Fixed Range
                        </button>
                      </div>
                    </div>

                    {rangeType === "custom" ? (
                      <>
                        <p className="text-sm text-gray-600 mb-4">
                          Define page ranges to split
                        </p>

                        {/* iLovePDF-style Range Cards */}
                        <div className="space-y-6 mb-4">
                          {customRanges.map((range, idx) => {
                            const start = parseInt(range.start) || 0;
                            const end = parseInt(range.end) || 0;
                            const validStart =
                              start >= 1 && start <= file.pageCount;
                            const validEnd =
                              end >= 1 && end <= file.pageCount && end >= start;

                            return (
                              <div
                                key={idx}
                                style={{
                                  background: theme.palette.secondary.main,
                                  borderColor:
                                    validStart && validEnd
                                      ? theme.palette.primary.main
                                      : "#ccc",
                                }}
                                className="border-2 rounded-xl p-4"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h4
                                    className="font-semibold text-sm"
                                    style={{
                                      color: theme.palette.primary.main,
                                    }}
                                  >
                                    Split {idx + 1}
                                  </h4>
                                  {customRanges.length > 1 && (
                                    <button
                                      onClick={() => removeRange(idx)}
                                      style={{
                                        background: theme.palette.ui.delete,
                                        color: "#fff",
                                      }}
                                      className="p-1.5 rounded hover:opacity-90"
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

                                <div className="grid grid-cols-2 gap-3 mb-3">
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

                                {/* Thumbnails */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-white rounded-lg p-2 border">
                                    {validStart && pageThumbnails[start] ? (
                                      <img
                                        src={pageThumbnails[start]}
                                        alt={`Page ${start}`}
                                        className="w-full h-32 object-contain"
                                        style={{
                                          transform: `rotate(${
                                            pageRotations[start] || 0
                                          }deg)`,
                                        }}
                                      />
                                    ) : (
                                      <div className="h-32 flex items-center justify-center text-gray-400 text-xs">
                                        {validStart ? "Loading..." : "Page"}
                                      </div>
                                    )}
                                    <p className="text-center text-xs mt-1 font-medium">
                                      Page {start || "?"}
                                    </p>
                                  </div>
                                  <div className="bg-white rounded-lg p-2 border">
                                    {validEnd && pageThumbnails[end] ? (
                                      <img
                                        src={pageThumbnails[end]}
                                        alt={`Page ${end}`}
                                        className="w-full h-32 object-contain"
                                        style={{
                                          transform: `rotate(${
                                            pageRotations[end] || 0
                                          }deg)`,
                                        }}
                                      />
                                    ) : (
                                      <div className="h-32 flex items-center justify-center text-gray-400 text-xs">
                                        {validEnd ? "Loading..." : "Page"}
                                      </div>
                                    )}
                                    <p className="text-center text-xs mt-1 font-medium">
                                      Page {end || "?"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          onClick={addRange}
                          style={{
                            background: theme.palette.secondary.main,
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
                        <p className="text-sm text-gray-600 mb-4">
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
                    <p className="text-sm text-gray-600 mb-4">
                      Select pages to extract from the PDF
                    </p>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={selectAllPages}
                        style={{
                          background: theme.palette.secondary.main,
                          color: theme.palette.primary.main,
                          borderColor: theme.palette.primary.main,
                        }}
                        className="flex-1 py-2 border rounded-lg font-medium cursor-pointer hover:opacity-90"
                      >
                        Select All
                      </button>
                      <button
                        onClick={deselectAllPages}
                        style={{
                          background: theme.palette.secondary.main,
                          color: theme.palette.primary.main,
                          borderColor: theme.palette.primary.main,
                        }}
                        className="flex-1 py-2 border rounded-lg font-medium cursor-pointer hover:opacity-90"
                      >
                        Deselect All
                      </button>
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mergeExtracted}
                          onChange={(e) => setMergeExtracted(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">
                          Merge extracted pages into one PDF
                        </span>
                      </label>
                    </div>
                    <div
                      style={{ background: theme.palette.secondary.main }}
                      className="p-4 rounded-lg"
                    >
                      <p className="text-sm text-gray-600">
                        <strong>{selectedPages.size}</strong> page(s) selected
                      </p>
                    </div>
                  </>
                )}

                {/* Preview Info */}
                <div
                  style={{ background: theme.palette.secondary.main }}
                  className="mt-6 p-4 rounded-lg"
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.palette.primary.main }}
                  >
                    {getSplitPreview()}
                  </p>
                </div>

                {/* File Info */}
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
            </div>

            {/* Right Panel - Pages Grid */}
            <div className="lg:col-span-2">
              <div
                style={{ background: "#fff" }}
                className="rounded-2xl p-6 shadow-sm min-h-[80vh]"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    style={{ color: theme.palette.primary.main }}
                    className="text-xl font-bold"
                  >
                    Pages ({file.pageCount})
                  </h2>
                  {splitMode === "extract" && selectedPages.size > 0 && (
                    <button
                      onClick={deselectAllPages}
                      style={{
                        background: theme.palette.ui.delete,
                        color: "#fff",
                      }}
                      className="px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
                    >
                      Clear Selection ({selectedPages.size})
                    </button>
                  )}
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
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {pages.map((pageNum, idx) => {
                      const isSelected = selectedPages.has(pageNum);
                      const rotation = pageRotations[pageNum] || 0;
                      return (
                        <div
                          key={pageNum}
                          onClick={() =>
                            splitMode === "extract" &&
                            togglePageSelection(pageNum)
                          }
                          style={{
                            background: theme.palette.secondary.main,
                            borderColor: isSelected
                              ? theme.palette.primary.main
                              : "transparent",
                            borderWidth: isSelected ? "3px" : "1px",
                          }}
                          className={`rounded-lg overflow-hidden transition-all hover:shadow-lg relative ${
                            splitMode === "extract" ? "cursor-pointer" : ""
                          }`}
                        >
                          <div className="relative">
                            <div
                              style={{
                                background: theme.palette.secondary.main,
                              }}
                              className="h-48 flex items-center justify-center relative"
                            >
                              {pageThumbnails[pageNum] ? (
                                <img
                                  src={pageThumbnails[pageNum]}
                                  alt={`Page ${pageNum}`}
                                  className="w-full h-full object-contain"
                                  style={{
                                    transform: `rotate(${rotation}deg)`,
                                  }}
                                />
                              ) : (
                                <span className="text-4xl text-gray-400">
                                  PDF
                                </span>
                              )}
                              {/* Page Number Badge */}
                              <div
                                style={{
                                  background: theme.palette.primary.main,
                                  color: "#fff",
                                }}
                                className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold"
                              >
                                {pageNum}
                              </div>
                              {/* Rotation Controls */}
                              <div className="absolute top-2 left-2 flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    rotatePage(pageNum, "left");
                                  }}
                                  style={{
                                    background: theme.palette.primary.main,
                                    color: "#fff",
                                  }}
                                  className="p-1.5 rounded shadow cursor-pointer hover:opacity-90"
                                  title="Rotate left"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 19l-7-7 7-7m5 14v-7h-7"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    rotatePage(pageNum, "right");
                                  }}
                                  style={{
                                    background: theme.palette.primary.main,
                                    color: "#fff",
                                  }}
                                  className="p-1.5 rounded shadow cursor-pointer hover:opacity-90"
                                  title="Rotate right"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 5l7 7-7 7m-5-14v7h7"
                                    />
                                  </svg>
                                </button>
                              </div>
                              {/* Preview Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPreview(idx);
                                }}
                                style={{
                                  background: "rgba(255, 255, 255, 0.9)",
                                }}
                                className="absolute bottom-2 right-2 p-2 rounded-full shadow cursor-pointer hover:opacity-90"
                                title="Preview"
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
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>
                              {/* Selection Checkmark */}
                              {isSelected && (
                                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                  <div
                                    style={{
                                      background: theme.palette.primary.main,
                                    }}
                                    className="rounded-full p-2"
                                  >
                                    <svg
                                      className="w-8 h-8 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            style={{ background: theme.palette.secondary.main }}
                            className="p-2 text-center"
                          >
                            <p className="text-xs text-gray-600 font-medium">
                              Page {pageNum}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
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
