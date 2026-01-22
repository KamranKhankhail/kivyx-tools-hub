// "use client";
// import ToolsHubsIcon from "@/icons/ToolsHubsIcon";
// import theme from "@/styles/theme";
// import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
// import Link from "next/link";/
// import { degrees } from "pdf-lib";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import RotateLeftIcon from "@mui/icons-material/RotateLeft";
// import RotateRightIcon from "@mui/icons-material/RotateRight";
// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
//   useMemo,
// } from "react";
// // Removed imports for wordToPdf, excelToPdf, pptToPdf as only PDF files are accepted now.

// export default function MergePdfClient() {
//   const [files, setFiles] = useState([]);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [editPagesOpen, setEditPagesOpen] = useState(false);
//   const [editingFileIndex, setEditingFileIndex] = useState(null);
//   const [globalPageIndex, setGlobalPageIndex] = useState(0); // 0-based index in globalPageOrder
//   const [draggedIndex, setDraggedIndex] = useState(null);
//   const [draggedGlobalPageIndex, setDraggedGlobalPageIndex] = useState(null);
//   const [merging, setMerging] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [error, setError] = useState(null);
//   const [pagesView, setPagesView] = useState(false);
//   const [selectedGlobalPages, setSelectedGlobalPages] = useState(new Set());
//   const [globalPageOrder, setGlobalPageOrder] = useState([]);
//   const [editingPages, setEditingPages] = useState([]);
//   const [pageThumbnails, setPageThumbnails] = useState({});
//   const canvasRef = useRef(null);
//   const previewContainerRef = useRef(null);
//   const renderTaskRef = useRef(null);
//   const [draggedEditPageIndex, setDraggedEditPageIndex] = useState(null);

//   // --------------------------- ROTATION STATE ---------------------------
//   const [globalRotation, setGlobalRotation] = useState(0);
//   const [fileRotations, setFileRotations] = useState({});
//   const [pageRotations, setPageRotations] = useState({});

//   // --------------------------- PDF.JS ---------------------------
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

//   // Modified: generatePageThumbnail now always generates an unrotated thumbnail
//   const generatePageThumbnail = async (pdfDoc, pageNum) => {
//     try {
//       const page = await pdfDoc.getPage(pageNum);
//       const vp = page.getViewport({ scale: 0.5 }); // No rotation applied here
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

//   // Modified: generatePdfThumbnail now always generates an unrotated thumbnail
//   const generatePdfThumbnail = async (file) => {
//     await loadPdfJs();
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
//       .promise;
//     const page = await pdf.getPage(1);
//     const vp = page.getViewport({ scale: 1.5 }); // No rotation applied here
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     canvas.height = vp.height;
//     canvas.width = vp.width;
//     await page.render({ canvasContext: ctx, viewport: vp }).promise;
//     return {
//       thumbnail: canvas.toDataURL(),
//       pageCount: pdf.numPages,
//       pdfDoc: pdf,
//     };
//   };

//   // --------------------------- ROTATION HELPERS ---------------------------
//   const rotateClockwise = (current) => (current + 90) % 360;
//   const rotateCounterClockwise = (current) => (current - 90 + 360) % 360;

//   // Modified: Removed calls to regenerate thumbnails
//   const applyGlobalRotation = (direction) => {
//     const delta = direction === "left" ? -90 : 90;
//     const newGlobalRotationValue = (globalRotation + delta + 360) % 360;
//     setGlobalRotation(newGlobalRotationValue);

//     const newFileRots = {};
//     const newPageRots = {};

//     files.forEach((f) => {
//       newFileRots[f.id] = newGlobalRotationValue;
//     });
//     globalPageOrder.forEach((pg) => {
//       newPageRots[pg.globalId] = newGlobalRotationValue;
//     });

//     setFileRotations(newFileRots);
//     setPageRotations(newPageRots);
//   };

//   // Modified: Removed calls to regenerate thumbnails
//   const rotateFile = (fileId, direction) => {
//     const current = fileRotations[fileId] || 0;
//     const newRot =
//       direction === "left"
//         ? rotateCounterClockwise(current)
//         : rotateClockwise(current);
//     const newFileRots = { ...fileRotations, [fileId]: newRot };
//     setFileRotations(newFileRots);

//     const newPageRots = { ...pageRotations };
//     globalPageOrder.forEach((pg) => {
//       if (pg.fileId === fileId) {
//         newPageRots[pg.globalId] = newRot;
//       }
//     });
//     setPageRotations(newPageRots);
//   };

//   // Modified: Removed calls to regenerate thumbnails
//   const rotatePage = (globalId, direction) => {
//     const current = pageRotations[globalId] || 0;
//     const newRot =
//       direction === "left"
//         ? rotateCounterClockwise(current)
//         : rotateClockwise(current);
//     const newPageRots = { ...pageRotations, [globalId]: newRot };
//     setPageRotations(newPageRots);
//   };

//   // Modified: Removed calls to regenerate thumbnails
//   const resetAllRotations = () => {
//     setGlobalRotation(0);
//     setFileRotations({});
//     setPageRotations({});
//   };

//   // Removed: regenerateAllThumbnails, regenerateFileThumbnails, regenerateSinglePageThumbnail are no longer needed.

//   // --------------------------- FILE HANDLING ---------------------------
//   // Removed convertOfficeToPdf function as only PDF files are accepted.

//   // Modified: handleFileSelect now only accepts and processes PDF files
//   const handleFileSelect = async (e) => {
//     const selected = Array.from(e.target.files);
//     for (const file of selected) {
//       const tempId = Date.now() + Math.random();
//       if (file.type === "application/pdf") {
//         const loading = {
//           id: tempId,
//           file,
//           name: file.name,
//           pages: 0,
//           pageOrder: [],
//           thumbnail: null,
//           type: file.type,
//           pdfDoc: null,
//           loading: true,
//           pageThumbnails: {},
//         };
//         setFiles((p) => [...p, loading]);

//         // Generate unrotated PDF thumbnail
//         const { thumbnail, pageCount, pdfDoc } = await generatePdfThumbnail(
//           file
//         );
//         const pageOrder = Array.from({ length: pageCount }, (_, i) => i + 1);
//         const thumbs = {};
//         for (let i = 1; i <= pageCount; i++) {
//           // Generate unrotated page thumbnails
//           thumbs[i] = await generatePageThumbnail(pdfDoc, i);
//         }

//         setFiles((p) =>
//           p.map((f) =>
//             f.id === tempId
//               ? {
//                   ...f,
//                   pages: pageCount,
//                   pageOrder,
//                   thumbnail,
//                   pdfDoc,
//                   loading: false,
//                   pageThumbnails: thumbs, // Here it is! Thumbnails are already stored.
//                 }
//               : f
//           )
//         );
//         setGlobalPageOrder((p) => [
//           ...p,
//           ...pageOrder.map((pg) => ({
//             fileId: tempId,
//             originalPageNum: pg,
//             globalId: `${tempId}-${pg}`,
//           })),
//         ]);
//       } else {
//         // Ignore non-PDF files and optionally show an error
//         setError(`Only PDF files are supported. "${file.name}" was ignored.`);
//       }
//     }
//     // Clear error after processing all files if no new errors occurred for valid files
//     if (selected.every((f) => f.type === "application/pdf")) {
//       setError(null);
//     }
//   };

//   // --------------------------- PREVIEW LOGIC ---------------------------
//   const totalGlobalPages = globalPageOrder.length;
//   const openPreview = (fileIndex) => {
//     const firstGlobalIdx = globalPageOrder.findIndex((p) => {
//       const file = files.find((f) => f.id === p.fileId);
//       return file && files.indexOf(file) === fileIndex;
//     });
//     setGlobalPageIndex(firstGlobalIdx >= 0 ? firstGlobalIdx : 0);
//     setPreviewOpen(true);
//   };
//   const closePreview = () => setPreviewOpen(false);
//   const handlePrevPage = useCallback(() => {
//     setGlobalPageIndex((p) => (p > 0 ? p - 1 : totalGlobalPages - 1));
//   }, [totalGlobalPages]);
//   const handleNextPage = useCallback(() => {
//     setGlobalPageIndex((p) => (p < totalGlobalPages - 1 ? p + 1 : 0));
//   }, [totalGlobalPages]);

//   const renderPdfPage = useCallback(async () => {
//     if (!previewOpen || totalGlobalPages === 0) return;
//     const pageRef = globalPageOrder[globalPageIndex];
//     if (!pageRef) return;
//     const file = files.find((f) => f.id === pageRef.fileId);
//     if (!file) return;
//     const canvas = canvasRef.current;
//     const container = previewContainerRef.current;
//     if (!canvas || !container) return;
//     if (renderTaskRef.current) {
//       renderTaskRef.current.cancel();
//       renderTaskRef.current = null;
//     }
//     try {
//       if (file.type === "application/pdf") {
//         let pdfDoc = file.pdfDoc;
//         if (!pdfDoc) {
//           await loadPdfJs();
//           const arrayBuffer = await file.file.arrayBuffer();
//           pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer })
//             .promise;
//         }
//         const page = await pdfDoc.getPage(pageRef.originalPageNum);
//         const rot =
//           pageRotations[pageRef.globalId] ||
//           fileRotations[file.id] ||
//           globalRotation ||
//           0;
//         let vp = page.getViewport({ scale: 1 });
//         if (rot) {
//           vp = page.getViewport({ scale: 1, rotation: rot });
//         }
//         const containerW = container.clientWidth - 64;
//         const containerH = container.clientHeight - 64;
//         const scale = Math.min(
//           containerW / vp.width,
//           containerH / vp.height,
//           2
//         );
//         const scaledVp = page.getViewport({ scale, rotation: rot });
//         canvas.width = scaledVp.width;
//         canvas.height = scaledVp.height;
//         const ctx = canvas.getContext("2d");
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         const renderTask = page.render({
//           canvasContext: ctx,
//           viewport: scaledVp,
//         });
//         renderTaskRef.current = renderTask;
//         await renderTask.promise;
//         renderTaskRef.current = null;
//       }
//     } catch (err) {
//       if (err.name !== "RenderingCancelledException") console.error(err);
//     }
//   }, [
//     previewOpen,
//     globalPageIndex,
//     globalPageOrder,
//     files,
//     pageRotations,
//     fileRotations,
//     globalRotation,
//   ]);

//   useEffect(() => {
//     if (previewOpen) renderPdfPage();
//     return () => {
//       if (renderTaskRef.current) {
//         renderTaskRef.current.cancel();
//         renderTaskRef.current = null;
//       }
//     };
//   }, [previewOpen, renderPdfPage]);

//   // --------------------------- EDIT PAGES ---------------------------
//   // Modified: openEditPages now uses pre-generated thumbnails
//   const openEditPages = async (index) => {
//     const file = files[index];
//     if (file.pages <= 1) return;
//     setEditingFileIndex(index);
//     const pages = file.pageOrder.map((n) => ({
//       pageNumber: n,
//       id: `${file.id}-${n}-${Math.random()}`,
//     }));
//     setEditingPages(pages);
//     setSelectedGlobalPages(new Set());
//     if (file.type === "application/pdf" && file.pdfDoc) {
//       setPageThumbnails(file.pageThumbnails); // Use already generated thumbnails
//     } else if (file.type.startsWith("image/")) {
//       setPageThumbnails({ 1: file.thumbnail }); // Use already generated thumbnail for images
//     }
//     setEditPagesOpen(true);
//   };

//   const closeEditPages = () => {
//     setEditPagesOpen(false);
//     setEditingFileIndex(null);
//     setEditingPages([]);
//     setPageThumbnails({});
//     setSelectedGlobalPages(new Set());
//   };

//   const saveEditedPages = () => {
//     if (editingFileIndex === null) return;
//     const newFiles = [...files];
//     const file = newFiles[editingFileIndex];
//     const newOrder = editingPages.map((p) => p.pageNumber);
//     newFiles[editingFileIndex] = {
//       ...file,
//       pageOrder: newOrder,
//       pages: newOrder.length,
//     };
//     setFiles(newFiles);

//     setGlobalPageOrder((prev) => {
//       const without = prev.filter((p) => p.fileId !== file.id);
//       const insertAt = prev.findIndex((p) => p.fileId === file.id);
//       const toInsert = newOrder.map((pg) => ({
//         fileId: file.id,
//         originalPageNum: pg,
//         globalId: `${file.id}-${pg}`,
//       }));
//       if (insertAt === -1) return [...without, ...toInsert];
//       without.splice(insertAt, 0, ...toInsert);
//       return without;
//     });
//     closeEditPages();
//   };

//   const deleteSelectedPagesFromEdit = () => {
//     const remaining = editingPages.filter(
//       (p) => !selectedGlobalPages.has(p.id)
//     );
//     if (remaining.length === 0) {
//       alert("At least one page must remain.");
//       return;
//     }
//     setEditingPages(remaining);
//     setSelectedGlobalPages(new Set());
//   };

//   const deleteSinglePageFromEdit = (id) => {
//     const remaining = editingPages.filter((p) => p.id !== id);
//     if (remaining.length === 0) {
//       alert("At least one page must remain.");
//       return;
//     }
//     setEditingPages(remaining);
//     const s = new Set(selectedGlobalPages);
//     s.delete(id);
//     setSelectedGlobalPages(s);
//   };

//   const handlePageDragStart = (i) => setDraggedEditPageIndex(i);
//   const handlePageDragOver = (e, i) => {
//     e.preventDefault();
//     if (draggedEditPageIndex === null || draggedEditPageIndex === i) return;
//     const newPages = [...editingPages];
//     const [moved] = newPages.splice(draggedEditPageIndex, 1);
//     newPages.splice(i, 0, moved);
//     setEditingPages(newPages);
//     setDraggedEditPageIndex(i);
//   };
//   const handlePageDragEnd = () => setDraggedEditPageIndex(null);

//   // --------------------------- FILE REORDER ---------------------------
//   const handleDragStart = (i) => setDraggedIndex(i);
//   const handleDragOver = (e, i) => {
//     e.preventDefault();
//     if (draggedIndex === null || draggedIndex === i) return;
//     const newFiles = [...files];
//     const [moved] = newFiles.splice(draggedIndex, 1);
//     newFiles.splice(i, 0, moved);
//     setFiles(newFiles);
//     setDraggedIndex(i);

//     setGlobalPageOrder((prev) => {
//       const newOrder = [];
//       newFiles.forEach((f) => {
//         f.pageOrder.forEach((pg) => {
//           newOrder.push({
//             fileId: f.id,
//             originalPageNum: pg,
//             globalId: `${f.id}-${pg}`,
//           });
//         });
//       });
//       return newOrder;
//     });
//   };
//   const handleDragEnd = () => setDraggedIndex(null);

//   const deleteFile = (i) => {
//     const file = files[i];
//     setFiles((p) => p.filter((_, idx) => idx !== i));
//     setGlobalPageOrder((p) => p.filter((pg) => pg.fileId !== file.id));
//     if (previewOpen && globalPageIndex >= totalGlobalPages - 1)
//       setGlobalPageIndex(0);
//   };

//   // --------------------------- GLOBAL PAGES ---------------------------
//   const filesMap = useMemo(() => new Map(files.map((f) => [f.id, f])), [files]);

//   const displayedGlobalPages = useMemo(() => {
//     return globalPageOrder
//       .map((ref) => {
//         const file = filesMap.get(ref.fileId);
//         if (!file) return null;
//         const rot =
//           pageRotations[ref.globalId] ||
//           fileRotations[ref.fileId] ||
//           globalRotation ||
//           0;
//         const thumb =
//           file.type === "application/pdf"
//             ? file.pageThumbnails[ref.originalPageNum]
//             : file.thumbnail; // This will now be the unrotated thumbnail
//         return {
//           globalId: ref.globalId,
//           fileId: file.id,
//           fileName: file.name,
//           originalPageNum: ref.originalPageNum,
//           type: file.type,
//           thumbnail: thumb,
//           rotation: rot, // This is the rotation degree for CSS transform
//         };
//       })
//       .filter(Boolean);
//   }, [globalPageOrder, filesMap, pageRotations, fileRotations, globalRotation]);

//   const handleGlobalPageDragStart = (e, gid) => {
//     const idx = globalPageOrder.findIndex((p) => p.globalId === gid);
//     setDraggedGlobalPageIndex(idx);
//   };
//   const handleGlobalPageDragOver = (e, gid) => {
//     e.preventDefault();
//     if (draggedGlobalPageIndex === null) return;
//     const target = globalPageOrder.findIndex((p) => p.globalId === gid);
//     if (draggedGlobalPageIndex === target) return;
//     const newOrder = [...globalPageOrder];
//     const [moved] = newOrder.splice(draggedGlobalPageIndex, 1);
//     newOrder.splice(target, 0, moved);
//     setGlobalPageOrder(newOrder);
//     setDraggedGlobalPageIndex(target);
//   };
//   const handleGlobalPageDragEnd = () => setDraggedGlobalPageIndex(null);

//   const deleteGlobalPage = (gid) => {
//     if (totalGlobalPages <= 1) {
//       setError("At least one page must remain.");
//       return;
//     }
//     const page = globalPageOrder.find((p) => p.globalId === gid);
//     if (!page) return;
//     setGlobalPageOrder((p) => p.filter((x) => x.globalId !== gid));
//     setFiles((prev) => {
//       return prev
//         .map((f) => {
//           if (f.id === page.fileId) {
//             const newOrder = f.pageOrder.filter(
//               (n) => n !== page.originalPageNum
//             );
//             return { ...f, pageOrder: newOrder, pages: newOrder.length };
//           }
//           return f;
//         })
//         .filter((f) => f.pages > 0);
//     });
//     const s = new Set(selectedGlobalPages);
//     s.delete(gid);
//     setSelectedGlobalPages(s);
//     setError(null);
//   };

//   const deleteSelectedGlobalPages = () => {
//     if (selectedGlobalPages.size === 0) return;
//     if (totalGlobalPages - selectedGlobalPages.size === 0) {
//       setError("At least one page must remain.");
//       return;
//     }
//     setGlobalPageOrder((p) =>
//       p.filter((x) => !selectedGlobalPages.has(x.globalId))
//     );
//     setFiles((prev) => {
//       const map = new Map(prev.map((f) => [f.id, { ...f }]));
//       selectedGlobalPages.forEach((gid) => {
//         const ref = globalPageOrder.find((p) => p.globalId === gid);
//         if (ref && map.has(ref.fileId)) {
//           const f = map.get(ref.fileId);
//           f.pageOrder = f.pageOrder.filter((n) => n !== ref.originalPageNum);
//           f.pages = f.pageOrder.length;
//         }
//       });
//       return Array.from(map.values()).filter((f) => f.pages > 0);
//     });
//     setSelectedGlobalPages(new Set());
//     setError(null);
//   };

//   // --------------------------- MERGE ---------------------------
//   const handleMerge = async () => {
//     if (globalPageOrder.length === 0) {
//       setError("Add files first");
//       return;
//     }
//     setMerging(true);
//     setError(null);
//     try {
//       await loadPdfJs();
//       const { PDFDocument } = await import("pdf-lib"); // Removed 'Rotation' from import
//       const merged = await PDFDocument.create();
//       const loaded = new Map();

//       for (const ref of globalPageOrder) {
//         const file = filesMap.get(ref.fileId);
//         if (!file) continue;

//         const rot =
//           pageRotations[ref.globalId] ||
//           fileRotations[ref.fileId] ||
//           globalRotation ||
//           0;

//         if (file.type === "application/pdf") {
//           let doc = loaded.get(file.id);
//           if (!doc) {
//             const arr = await file.file.arrayBuffer();
//             doc = await PDFDocument.load(arr);
//             loaded.set(file.id, doc);
//           }
//           const [copied] = await merged.copyPages(doc, [
//             ref.originalPageNum - 1,
//           ]);
//           if (rot) copied.setRotation(degrees(rot));
//           merged.addPage(copied);
//         } else if (file.type.startsWith("image/")) {
//           const arr = await file.file.arrayBuffer();
//           const img =
//             file.type === "image/png"
//               ? await merged.embedPng(arr)
//               : await merged.embedJpg(arr);
//           const page = merged.addPage([img.width, img.height]);
//           page.drawImage(img, {
//             x: 0,
//             y: 0,
//             width: img.width,
//             height: img.height,
//             rotate: rot ? { type: "degrees", angle: rot } : undefined,
//           });
//         }
//       }

//       const bytes = await merged.save();
//       const blob = new Blob([bytes], { type: "application/pdf" });
//       setDownloadUrl(URL.createObjectURL(blob));
//     } catch (e) {
//       console.error(e);
//       setError("Merge failed");
//     } finally {
//       setMerging(false);
//     }
//   };

//   const getFileIcon = (type) => {
//     if (type.includes("pdf")) return "PDF";
//     if (type.includes("word")) return "DOC";
//     if (type.includes("image")) return "IMG";
//     if (type.includes("excel")) return "XLS";
//     if (type.includes("powerpoint")) return "PPT";
//     return "FILE";
//   };

//   const toggleGlobalPageSelection = (gid) => {
//     const s = new Set(selectedGlobalPages);
//     s.has(gid) ? s.delete(gid) : s.add(gid);
//     setSelectedGlobalPages(s);
//   };

//   const deselectAll = () => setSelectedGlobalPages(new Set());

//   // --------------------------- KEYBOARD ---------------------------
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

//   // --------------------------- RENDER ---------------------------
//   return (
//     <div className="" style={{ background: theme.palette.ui.pageBackground }}>
//       {/* Header */}
//       <div className="w-full bg-white border-b border-gray-200 px-6 py-2 flex flex-col fixed z-[1000]">
//         <Stack
//           direction="row"
//           sx={{ justifyContent: "space-between", gap: "20px" }}
//         >
//           <div className="flex items-center gap-4">
//             <Box component={Link} href="/" sx={{ cursor: "pointer" }}>
//               <ToolsHubsIcon width="147" />
//             </Box>
//             <h1
//               className="text-2xl font-semibold"
//               style={{ minWidth: "180px" }}
//             >
//               PDF Merge Tool
//             </h1>
//           </div>
//           {files.length > 0 && (
//             <Stack
//               direction="row"
//               sx={{
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//               }}
//             >
//               <Stack direction="row" sx={{ alignItems: "center", gap: "20px" }}>
//                 {" "}
//                 <div className="flex gap-4 justify-self-center">
//                   {/* Replaced hardcoded buttons with dynamic rendering using qrCodesButtonsData */}
//                   {(() => {
//                     const qrCodesButtonsData = [
//                       {
//                         title: "Files",
//                         tooltipText: "View and manage your files",
//                         icon: () => (
//                           <svg
//                             className="w-7 h-7"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zM9 13l3-3m0 0l3 3m-3-3v8"
//                             />
//                           </svg>
//                         ),
//                         handler: () => {
//                           setPagesView(false);
//                           setSelectedGlobalPages(new Set());
//                           setError(null);
//                           closePreview(); // Close preview modal
//                           closeEditPages(); // Close edit pages modal
//                         },
//                       },
//                       {
//                         title: "Pages",
//                         tooltipText: "View and reorder individual pages",
//                         icon: () => (
//                           <svg
//                             className="w-7 h-7"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
//                             />
//                           </svg>
//                         ),
//                         handler: () => {
//                           setPagesView(true);
//                           setSelectedGlobalPages(new Set());
//                           setError(null);
//                           closePreview(); // Close preview modal
//                           closeEditPages(); // Close edit pages modal
//                         },
//                       },
//                     ];

//                     return (
//                       <Stack
//                         direction={{ xs: "column", sm: "row" }}
//                         sx={{
//                           flexWrap: "wrap",
//                           gap: "10px",
//                           width: { xs: "100%", sm: "auto" },
//                           borderWidth: "4px",
//                           borderColor: theme.palette.primary.main,
//                           p: "4px",
//                           borderRadius: "30px",
//                         }}
//                       >
//                         {qrCodesButtonsData.map((buttonData, index) => {
//                           const isActiveButton =
//                             (buttonData.title === "Files" && !pagesView) ||
//                             (buttonData.title === "Pages" && pagesView);

//                           return (
//                             <Tooltip
//                               key={index}
//                               title={buttonData.tooltipText}
//                               placement="top"
//                               arrow
//                               slotProps={{
//                                 popper: {
//                                   modifiers: [
//                                     {
//                                       name: "zIndex",
//                                       enabled: true,
//                                       phase: "write",
//                                       fn: ({ state }) => {
//                                         state.styles.popper.zIndex = 9999;
//                                       },
//                                     },
//                                   ],
//                                 },
//                                 tooltip: {
//                                   sx: {
//                                     bgcolor: "#333",
//                                     color: "#fff",
//                                     fontSize: "14px",
//                                     px: 1.5,
//                                     py: 0.5,
//                                     borderRadius: "8px",
//                                   },
//                                 },
//                                 arrow: { sx: { color: "#333" } },
//                               }}
//                             >
//                               <Button
//                                 variant="outlined"
//                                 startIcon={<buttonData.icon />}
//                                 sx={{
//                                   display: "flex",
//                                   flexDirection: "row",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   gap: "3px",
//                                   borderRadius: "30px",
//                                   transition: "all 0.3s ease",
//                                   textTransform: "none",
//                                   fontSize: "16px",
//                                   py: "4px",
//                                   px: "0px",
//                                   minWidth: { xs: "100%", sm: "135px" },
//                                   flex: { xs: "none", sm: "1" },
//                                   minHeight: "48px",
//                                   bgcolor: isActiveButton
//                                     ? theme.palette.primary.main
//                                     : "transparent",
//                                   color: isActiveButton
//                                     ? "#ffffff"
//                                     : theme.palette.primary.secondMain,
//                                   border: "none",
//                                   "& .MuiButton-startIcon": {
//                                     marginRight: "2px",
//                                   },
//                                   boxShadow: "none",
//                                 }}
//                                 onClick={buttonData.handler}
//                               >
//                                 {buttonData.title}
//                               </Button>
//                             </Tooltip>
//                           );
//                         })}
//                       </Stack>
//                     );
//                   })()}
//                 </div>
//                 <div className="flex gap-4 flex-wrap justify-self-center">
//                   {/* Rotation Buttons - Global */}
//                   <div className="flex items-center gap-2">
//                     <Tooltip title="Rotate left" placement="top">
//                       <button
//                         onClick={() => applyGlobalRotation("left")}
//                         style={{
//                           background: theme.palette.primary.main,
//                           color: "#fff",
//                         }}
//                         className="px-5 py-3 rounded-[6px] cursor-pointer"
//                       >
//                         <RotateLeftIcon />
//                       </button>
//                     </Tooltip>
//                     <Tooltip title="Rotate right" placement="top">
//                       <button
//                         onClick={() => applyGlobalRotation("right")}
//                         style={{
//                           background: theme.palette.primary.main,
//                           color: "#fff",
//                         }}
//                         className="px-5 py-3 rounded-[6px] cursor-pointer"
//                       >
//                         <RotateRightIcon />
//                       </button>
//                     </Tooltip>
//                     <Tooltip title="Reset all rotations" placement="top">
//                       <button
//                         onClick={resetAllRotations}
//                         style={{
//                           background: theme.palette.ui.delete,
//                           color: "#fff",
//                         }}
//                         className="px-5 py-3 rounded-[6px] cursor-pointer"
//                       >
//                         <svg
//                           className="w-6 h-6"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                           />
//                         </svg>
//                       </button>
//                     </Tooltip>
//                     <Tooltip title="Add More Files">
//                       {" "}
//                       <label className="cursor-pointer flex items-center gap-2 bg-transparent">
//                         <IconButton
//                           component="span"
//                           sx={{
//                             color: theme.palette.secondary.secondMain,
//                             bgcolor: theme.palette.primary.main,
//                             p: "8px",
//                             px: "18px",
//                             borderRadius: "6px",
//                             "&:hover": { bgcolor: theme.palette.primary.main },
//                           }}
//                         >
//                           <CloudUploadIcon sx={{ fontSize: "32px" }} />
//                         </IconButton>
//                         <input
//                           type="file"
//                           className="hidden"
//                           multiple
//                           accept="application/pdf" // Only accept PDF files
//                           onChange={handleFileSelect}
//                         />
//                       </label>
//                     </Tooltip>
//                   </div>

//                   {pagesView && selectedGlobalPages.size > 0 && (
//                     <>
//                       <button
//                         onClick={deleteSelectedGlobalPages}
//                         style={{ background: theme.palette.ui.delete }}
//                         className="text-white px-6 py-2 rounded flex items-center gap-2 cursor-pointer"
//                       >
//                         Delete Selected ({selectedGlobalPages.size})
//                       </button>
//                       <button
//                         onClick={deselectAll}
//                         style={{
//                           background: theme.palette.primary.main,
//                           color: "#fff",
//                         }}
//                         className="px-4 py-2 rounded cursor-pointer text-sm"
//                       >
//                         Deselect All
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </Stack>

//               {/* Merge button */}
//               <button
//                 onClick={handleMerge}
//                 disabled={
//                   merging ||
//                   files.some((f) => f.loading) ||
//                   globalPageOrder.length === 0
//                 }
//                 style={{ background: theme.palette.primary.main }}
//                 className="text-white px-12 py-3 rounded-[12px] text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[20px] cursor-pointer"
//               >
//                 {merging ? (
//                   <>
//                     <svg
//                       className="animate-spin h-5 w-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
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
//                     Merging...
//                   </>
//                 ) : (
//                   <>Finish →</>
//                 )}
//               </button>
//             </Stack>
//           )}
//         </Stack>

//         {downloadUrl && (
//           <div
//             style={{
//               color: theme.palette.primary.main,
//               borderColor: theme.palette.secondary.secondMain,
//             }}
//             className="mt-[10px] bg-green-50 border px-4 py-[8px] rounded flex items-center justify-between"
//           >
//             <span>Your merged PDF is ready!</span>
//             <Stack direction="row" sx={{ gap: "20px" }}>
//               {" "}
//               <a
//                 href={downloadUrl}
//                 download="merged.pdf"
//                 style={{
//                   background: theme.palette.primary.main,
//                   color: theme.palette.secondary.secondMain,
//                 }}
//                 className="px-4 py-2 rounded flex items-center gap-2"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                   />
//                 </svg>
//                 Download
//               </a>
//               <button
//                 onClick={() => setDownloadUrl(null)}
//                 style={{ color: theme.palette.primary.main }}
//                 className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
//                 aria-label="Close download notification"
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
//             </Stack>
//           </div>
//         )}
//       </div>

//       <div
//         className={`max-w-8xl mx-auto p-2 ${
//           downloadUrl ? "mt-[150px]" : "mt-[80px]"
//         }`}
//       >
//         {/* Files / Pages grid */}
//         <div className="border-2 border-dashed border-[#1fd5e9] rounded-[22px] min-h-[100vh] bg-white p-6 flex flex-wrap gap-8 items-start">
//           {files.length === 0 ? (
//             <div className="w-full flex flex-col items-center justify-center py-16">
//               <svg
//                 className="w-20 h-20 text-blue-600 mb-4"
//                 fill="none"
//                 stroke={theme.palette.primary.main}
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                 />
//               </svg>
//               <label
//                 style={{
//                   background: theme.palette.primary.main,
//                   color: theme.palette.secondary.secondMain,
//                 }}
//                 className="px-8 py-3 rounded cursor-pointer text-lg mb-4 flex items-center gap-2"
//               >
//                 Select files
//                 <input
//                   type="file"
//                   className="hidden"
//                   multiple
//                   accept="application/pdf" // Only accept PDF files
//                   onChange={handleFileSelect}
//                 />
//               </label>
//               <p className="text-[#4a5565] mb-[20px] text-2xl mt-[20px]">
//                 Only <strong>PDF</strong> Files Merge Tool
//               </p>
//               <div className="flex gap-2 flex-wrap justify-center">
//                 {["Add Only PDF Files"].map((f) => (
//                   <span
//                     key={f}
//                     className={`px-3 py-1 rounded text-lg font-semiboldbg-red-50 text-red-800
// 						}`}
//                   >
//                     {f}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           ) : !pagesView ? (
//             /* ---------- FILES VIEW ---------- */
//             <>
//               {files.map((file, idx) => (
//                 <div
//                   key={file.id}
//                   draggable={!file.loading}
//                   onDragStart={() => handleDragStart(idx)}
//                   onDragOver={(e) => handleDragOver(e, idx)}
//                   onDragEnd={handleDragEnd}
//                   style={{ background: theme.palette.secondary.main }}
//                   className={`flex-grow flex-shrink basis-[14.5rem] rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg ${
//                     !file.loading ? "cursor-move" : ""
//                   } ${draggedIndex === idx ? "opacity-50" : ""}`}
//                 >
//                   <div className="relative">
//                     <div
//                       onClick={() => !file.loading && openPreview(idx)}
//                       style={{ background: theme.palette.secondary.main }}
//                       className={`h-72 flex items-center justify-center relative overflow-hidden ${
//                         !file.loading ? "cursor-pointer" : ""
//                       }`}
//                     >
//                       {file.loading ? (
//                         <div className="flex flex-col items-center gap-3">
//                           <svg
//                             className="animate-spin h-12 w-12 text-blue-600"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           <p className="text-sm text-[#61698b] font-medium">
//                             {file.converting ? "Converting..." : "Loading..."}
//                           </p>
//                         </div>
//                       ) : file.thumbnail ? (
//                         <img
//                           src={file.thumbnail} // This is now the unrotated thumbnail
//                           alt={file.name}
//                           className="w-full h-full object-contain"
//                           style={{
//                             transform: `rotate(${
//                               fileRotations[file.id] || 0
//                             }deg)`,
//                           }} // CSS rotation applied here
//                         />
//                       ) : (
//                         <span className="text-6xl">
//                           {getFileIcon(file.type)}
//                         </span>
//                       )}
//                       {!file.loading && (
//                         <>
//                           <div className="absolute top-2 right-2 flex gap-1 flex-wrap max-w-42">
//                             <Tooltip title="Rotate left">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   rotateFile(file.id, "left");
//                                 }}
//                                 style={{
//                                   background: theme.palette.primary.main,
//                                   color: "#fff",
//                                 }}
//                                 className="w-7 h-7 rounded shadow cursor-pointer"
//                               >
//                                 <RotateLeftIcon />
//                               </button>
//                             </Tooltip>
//                             <Tooltip title="Rotate right">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   rotateFile(file.id, "right");
//                                 }}
//                                 style={{
//                                   background: theme.palette.primary.main,
//                                   color: "#fff",
//                                 }}
//                                 className="w-7 h-7 rounded shadow cursor-pointer"
//                               >
//                                 <RotateRightIcon />
//                               </button>
//                             </Tooltip>
//                             <button
//                               style={{
//                                 background: theme.palette.secondary.secondMain,
//                               }}
//                               className="p-1.5 rounded shadow cursor-pointer"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 openPreview(idx);
//                               }}
//                               title="Preview"
//                             >
//                               <svg
//                                 className="w-4 h-4"
//                                 fill="none"
//                                 stroke={theme.palette.primary.main}
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
//                                 />
//                               </svg>
//                             </button>
//                             {file.pages > 1 && (
//                               <button
//                                 className="bg-[#1fd5e9] hover:bg-[#1fd5e9] text-white p-1.5 rounded shadow cursor-pointer"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   openEditPages(idx);
//                                 }}
//                                 title="Edit pages"
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
//                                     d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                                   />
//                                 </svg>
//                               </button>
//                             )}

//                             <button
//                               className="p-1.5 rounded shadow cursor-pointer"
//                               style={{ background: theme.palette.ui.delete }}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 deleteFile(idx);
//                               }}
//                             >
//                               <svg
//                                 className="w-4 h-4"
//                                 style={{
//                                   color: theme.palette.primary.fourthMain,
//                                 }}
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                                 />
//                               </svg>
//                             </button>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   <div className={`p-3 border-t border-[#1fd5e9] text-center`}>
//                     <p
//                       className="text-sm font-medium truncate p-2 rounded-[8px] mb-2"
//                       style={{
//                         background: theme.palette.primary.main,
//                         color: "#ffffff",
//                       }}
//                     >
//                       {file.name}
//                     </p>
//                     <p className="text-xs text-gray-600">
//                       {file.loading
//                         ? file.converting
//                           ? "Converting..."
//                           : "Loading..."
//                         : `${file.pages} pages`}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//               <label className="w-62 h-80 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#1fd5e9]">
//                 <div
//                   style={{ background: theme.palette.primary.main }}
//                   className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
//                 >
//                   <IconButton
//                     component="span"
//                     sx={{
//                       color: theme.palette.secondary.secondMain,
//                       bgcolor: theme.palette.primary.main,
//                       p: "14px",

//                       borderRadius: "50px",
//                       "&:hover": { bgcolor: theme.palette.primary.main },
//                     }}
//                   >
//                     <CloudUploadIcon sx={{ fontSize: "46px" }} />
//                   </IconButton>
//                 </div>
//                 <p className="text-[#61698b] font-medium text-center px-4">
//                   Add PDF files
//                 </p>
//                 <input
//                   type="file"
//                   className="hidden"
//                   multiple
//                   accept="application/pdf" // Only accept PDF files
//                   onChange={handleFileSelect}
//                 />
//               </label>
//             </>
//           ) : (
//             /* ---------- PAGES VIEW ---------- */
//             <>
//               {displayedGlobalPages.length === 0 ? (
//                 <div className="w-full flex flex-col items-center justify-center py-16 text-gray-500">
//                   <p className="text-lg mb-2">No pages added yet.</p>
//                   <p className="text-sm">Add files using the "Add" button.</p>
//                 </div>
//               ) : (
//                 displayedGlobalPages.map((pg, i) => (
//                   <div
//                     key={pg.globalId}
//                     draggable
//                     onDragStart={(e) =>
//                       handleGlobalPageDragStart(e, pg.globalId)
//                     }
//                     onDragOver={(e) => handleGlobalPageDragOver(e, pg.globalId)}
//                     onDragEnd={handleGlobalPageDragEnd}
//                     className={`flex-grow flex-shrink basis-[12rem] bg-white rounded-lg border-2 transition-all hover:shadow-lg relative ${
//                       draggedGlobalPageIndex === i ? "opacity-50 scale-95" : ""
//                     } ${
//                       selectedGlobalPages.has(pg.globalId)
//                         ? " ring-6 ring-[#1fd5e947] border-none"
//                         : "border-none"
//                     }`}
//                   >
//                     <div
//                       className="relative cursor-pointer"
//                       onClick={() => toggleGlobalPageSelection(pg.globalId)}
//                     >
//                       <div
//                         style={{ background: theme.palette.secondary.main }}
//                         className="h-52 flex items-center justify-center relative"
//                       >
//                         {pg.thumbnail ? (
//                           <img
//                             src={pg.thumbnail} // This is now the unrotated thumbnail
//                             alt={`Page ${pg.originalPageNum}`}
//                             className="w-full h-full object-contain"
//                             style={{ transform: `rotate(${pg.rotation}deg)` }} // CSS rotation applied here
//                           />
//                         ) : (
//                           <span className="text-5xl">
//                             {getFileIcon(pg.type)}
//                           </span>
//                         )}
//                         <div
//                           style={{
//                             background: theme.palette.secondary.secondMain,
//                             color: theme.palette.primary.main,
//                           }}
//                           className="absolute top-0 right-[0] px-2 py-1 rounded text-xs font-semibold"
//                         >
//                           {i + 1}
//                         </div>
//                         {selectedGlobalPages.has(pg.globalId) && (
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <div
//                               style={{
//                                 background: theme.palette.secondary.secondMain,
//                                 color: theme.palette.primary.main,
//                               }}
//                               className="rounded-full p-2"
//                             >
//                               <svg
//                                 className="w-10 h-10"
//                                 fill="none"
//                                 stroke={theme.palette.primary.main}
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M5 13l4 4L19 7"
//                                 />
//                               </svg>
//                             </div>
//                           </div>
//                         )}
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             deleteGlobalPage(pg.globalId);
//                           }}
//                           style={{
//                             background: theme.palette.ui.delete,
//                           }}
//                           className="absolute left-[-10px] top-[-10px] text-white p-2 rounded shadow-lg cursor-pointer"
//                           title="Delete"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                             />
//                           </svg>
//                         </button>
//                         {/* Page-level rotation buttons */}
//                         <div className="absolute top-[-10px] left-[28px] flex gap-1">
//                           <Tooltip title="Rotate left">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 rotatePage(pg.globalId, "left");
//                               }}
//                               style={{
//                                 background: theme.palette.primary.main,
//                                 color: "#fff",
//                               }}
//                               className="w-8 h-8 rounded shadow cursor-pointer"
//                             >
//                               <RotateLeftIcon />
//                             </button>
//                           </Tooltip>
//                           <Tooltip title="Rotate right">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 rotatePage(pg.globalId, "right");
//                               }}
//                               style={{
//                                 background: theme.palette.primary.main,
//                                 color: "#fff",
//                               }}
//                               className="w-8 h-8 rounded shadow cursor-pointer"
//                             >
//                               <RotateRightIcon />
//                             </button>
//                           </Tooltip>
//                         </div>
//                       </div>
//                       <div
//                         style={{ background: theme.palette.secondary.main }}
//                         className="p-2 border-t border-gray-200"
//                       >
//                         <p
//                           className="text-xs truncate font-medium p-2 rounded-[8px] mb-2"
//                           style={{
//                             background: theme.palette.primary.main,
//                             color: "#ffffff",
//                           }}
//                         >
//                           {pg.fileName}
//                         </p>
//                         <p className="text-xs text-gray-500 text-center">
//                           Page {pg.originalPageNum}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </>
//           )}
//         </div>

//         {/* Errors / Download */}
//         {error && (
//           <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
//             {error}
//           </div>
//         )}
//       </div>

//       {/* ------------------- EDIT PAGES MODAL ------------------- */}
//       {editPagesOpen && editingFileIndex !== null && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
//           onClick={closeEditPages}
//         >
//           <div
//             className="bg-white rounded-lg overflow-hidden flex flex-col max-w-7xl w-full max-h-[90vh] mt-[100px]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div
//               style={{
//                 background: theme.palette.secondary.secondMain,
//                 borderColor: theme.palette.primary.main,
//               }}
//               className="flex justify-between items-center p-4 border-b"
//             >
//               <div>
//                 <h3
//                   style={{ color: theme.palette.primary.main }}
//                   className="text-lg font-semibold"
//                 >
//                   Edit Pages - {files[editingFileIndex]?.name}
//                 </h3>
//                 <p
//                   style={{ color: theme.palette.primary.main }}
//                   className="text-sm"
//                 >
//                   Reorder or remove pages from this file
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 {selectedGlobalPages.size > 0 && (
//                   <>
//                     <button
//                       onClick={deleteSelectedPagesFromEdit}
//                       style={{ background: theme.palette.ui.delete }}
//                       className="text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                       Delete ({selectedGlobalPages.size})
//                     </button>
//                     <button
//                       onClick={() => setSelectedGlobalPages(new Set())}
//                       style={{
//                         background: theme.palette.primary.main,
//                         color: "#fff",
//                       }}
//                       className="px-4 py-2 rounded cursor-pointer text-sm"
//                     >
//                       Deselect
//                     </button>
//                   </>
//                 )}
//                 <button
//                   onClick={closeEditPages}
//                   style={{ color: theme.palette.primary.main }}
//                   className="p-2 rounded cursor-pointer"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 ">
//               <div className="grid grid-cols-4 gap-8">
//                 {editingPages.map((pg, i) => {
//                   const gid = `${files[editingFileIndex].id}-${pg.pageNumber}`;
//                   const rot =
//                     pageRotations[gid] ||
//                     fileRotations[files[editingFileIndex].id] ||
//                     globalRotation ||
//                     0;
//                   return (
//                     <div
//                       key={pg.id}
//                       draggable
//                       onDragStart={() => handlePageDragStart(i)}
//                       onDragOver={(e) => handlePageDragOver(e, i)}
//                       onDragEnd={handlePageDragEnd}
//                       style={{ background: theme.palette.secondary.main }}
//                       className={`rounded-lg border-2 transition-all cursor-move hover:shadow-lg ${
//                         selectedGlobalPages.has(pg.id)
//                           ? "border-none ring-4 ring-blue-300"
//                           : "border-none"
//                       } ${
//                         draggedEditPageIndex === i ? "opacity-50 scale-95" : ""
//                       }`}
//                     >
//                       <div
//                         className="relative"
//                         onClick={() => toggleGlobalPageSelection(pg.id)}
//                       >
//                         <div
//                           style={{ background: theme.palette.secondary.main }}
//                           className="h-64 flex items-center justify-center relative"
//                         >
//                           {pageThumbnails[pg.pageNumber] ? ( // Corrected thumbnail access here
//                             <img
//                               src={
//                                 pageThumbnails[pg.pageNumber] // Corrected thumbnail access here
//                               }
//                               alt={`Page ${pg.pageNumber}`}
//                               className="w-full h-full object-contain"
//                               style={{ transform: `rotate(${rot}deg)` }} // CSS rotation applied here
//                             />
//                           ) : (
//                             <div className="flex flex-col items-center">
//                               <span className="text-5xl mb-2">PDF</span>
//                               <span className="text-sm text-gray-500">
//                                 Page {pg.pageNumber}
//                               </span>
//                             </div>
//                           )}
//                           <div className="absolute top-0 right-0 bg-[#1fd5e9] text-white px-3 py-1 rounded font-semibold text-sm">
//                             {i + 1}
//                           </div>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               deleteSinglePageFromEdit(pg.id);
//                             }}
//                             style={{ background: theme.palette.ui.delete }}
//                             className="absolute top-[-10px] left-[-10px] text-white p-2 rounded shadow-lg"
//                             title="Delete"
//                           >
//                             <svg
//                               className="w-4 h-4"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                               />
//                             </svg>
//                           </button>
//                           <div className="absolute top-[-10px] left-[28px] flex gap-1">
//                             <Tooltip title="Rotate left">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   const fileId = files[editingFileIndex].id;
//                                   const gid = `${fileId}-${pg.pageNumber}`;
//                                   rotatePage(gid, "left");
//                                 }}
//                                 style={{
//                                   background: theme.palette.primary.main,
//                                   color: "#fff",
//                                 }}
//                                 className="w-8 h-8 rounded shadow cursor-pointer"
//                               >
//                                 <RotateLeftIcon />
//                               </button>
//                             </Tooltip>
//                             <Tooltip title="Rotate right">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   const fileId = files[editingFileIndex].id;
//                                   const gid = `${fileId}-${pg.pageNumber}`;
//                                   rotatePage(gid, "right");
//                                 }}
//                                 style={{
//                                   background: theme.palette.primary.main,
//                                   color: "#fff",
//                                 }}
//                                 className="w-8 h-8 rounded shadow cursor-pointer"
//                               >
//                                 <RotateRightIcon />
//                               </button>
//                             </Tooltip>
//                           </div>
//                           {selectedGlobalPages.has(pg.id) && (
//                             <div className="absolute inset-0 bg-transparent bg-opacity-20 flex items-center justify-center">
//                               <div
//                                 style={{
//                                   background:
//                                     theme.palette.secondary.secondMain,
//                                   color: theme.palette.primary.main,
//                                 }}
//                                 className="rounded-full p-3"
//                               >
//                                 <svg
//                                   className="w-10 h-10"
//                                   fill="none"
//                                   stroke={theme.palette.primary.main}
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M5 13l4 4L19 7"
//                                   />
//                                 </svg>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                         <div
//                           style={{
//                             background: theme.palette.primary.main,
//                             color: theme.palette.primary.fourthMain,
//                           }}
//                           className={`p-3 bg-gray-50 border-t border-gray-200 p-2 rounded-[8px] m-2`}
//                         >
//                           <p className="text-sm font-medium text-center">
//                             Original Page {pg.pageNumber}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div
//               style={{
//                 background: theme.palette.secondary.secondMain,
//                 borderColor: theme.palette.primary.main,
//               }}
//               className="flex justify-between items-center p-4 border-t"
//             >
//               <div
//                 style={{ color: theme.palette.primary.main }}
//                 className="text-sm"
//               >
//                 <span
//                   style={{ color: theme.palette.primary.main }}
//                   className="font-semibold"
//                 >
//                   {editingPages.length}
//                 </span>{" "}
//                 pages
//                 {selectedGlobalPages.size > 0 && (
//                   <span>
//                     {" "}
//                     •{" "}
//                     <span className="font-semibold text-[#ffffff]">
//                       {selectedGlobalPages.size}
//                     </span>{" "}
//                     selected
//                   </span>
//                 )}
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={closeEditPages}
//                   style={{
//                     borderColor: theme.palette.primary.main,
//                     color: theme.palette.primary.main,
//                   }}
//                   className="px-6 py-2 border rounded cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={saveEditedPages}
//                   disabled={editingPages.length === 0}
//                   style={{
//                     background: theme.palette.primary.main,
//                     color: theme.palette.primary.fourthMain,
//                   }}
//                   className="px-6 py-2 rounded font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ------------------- PREVIEW MODAL (ALL PAGES) ------------------- */}
//       {previewOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
//           onClick={closePreview}
//         >
//           <div
//             className="bg-gray-800 rounded-lg overflow-hidden flex flex-col w-full h-full max-w-7xl max-h-[85vh] m-4 mt-[110px]"
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
//                 className="font-medium"
//               >
//                 {globalPageOrder[globalPageIndex]
//                   ? files.find(
//                       (f) => f.id === globalPageOrder[globalPageIndex].fileId
//                     )?.name
//                   : "Preview"}
//               </h3>

//               <button
//                 onClick={closePreview}
//                 style={{ background: theme.palette.primary.main }}
//                 className="text-white p-2 rounded cursor-pointer"
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
//               {globalPageOrder[globalPageIndex] &&
//               files.find(
//                 (f) => f.id === globalPageOrder[globalPageIndex].fileId
//               )?.type === "application/pdf" ? (
//                 <canvas
//                   ref={canvasRef}
//                   className="max-w-full max-h-full shadow-2xl"
//                 />
//               ) : globalPageOrder[globalPageIndex] &&
//                 files.find(
//                   (f) => f.id === globalPageOrder[globalPageIndex].fileId
//                 )?.thumbnail ? (
//                 <img
//                   src={
//                     files.find(
//                       (f) => f.id === globalPageOrder[globalPageIndex].fileId
//                     )?.thumbnail
//                   }
//                   alt="preview"
//                   className="max-w-full max-h-full object-contain shadow-2xl"
//                 />
//               ) : (
//                 <div className="bg-white p-16 rounded flex items-center justify-center">
//                   <span className="text-9xl">
//                     {getFileIcon(
//                       files.find(
//                         (f) => f.id === globalPageOrder[globalPageIndex]?.fileId
//                       )?.type || ""
//                     )}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <div
//               style={{
//                 background: theme.palette.secondary.secondMain,
//                 borderColor: theme.palette.primary.main,
//               }}
//               className="flex items-center justify-center gap-4 p-4 border-y"
//             >
//               <button
//                 onClick={handlePrevPage}
//                 style={{
//                   color: theme.palette.secondary.secondMain,
//                   background: theme.palette.primary.main,
//                 }}
//                 className="p-3 rounded cursor-pointer"
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
//                 {globalPageIndex + 1} / {totalGlobalPages}
//               </span>
//               <button
//                 onClick={handleNextPage}
//                 style={{
//                   color: theme.palette.secondary.secondMain,
//                   background: theme.palette.primary.main,
//                 }}
//                 className="p-3 rounded cursor-pointer"
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
//               <button
//                 onClick={() => {
//                   const fileIdx = files.findIndex(
//                     (f) => f.id === globalPageOrder[globalPageIndex].fileId
//                   );
//                   deleteFile(fileIdx);
//                 }}
//                 style={{
//                   background: theme.palette.ui.delete,
//                   color: theme.palette.primary.fourthMain,
//                 }}
//                 className="p-3 rounded cursor-pointer"
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
//                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





"use client";
import ToolsHubsIcon from "@/icons/ToolsHubsIcon";
import theme from "@/styles/theme";
import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import Link from "next/link";
import { degrees } from "pdf-lib";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
// Removed imports for wordToPdf, excelToPdf, pptToPdf as only PDF files are accepted now.

export default function MergePdfClient() {
  const [files, setFiles] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editPagesOpen, setEditPagesOpen] = useState(false);
  const [editingFileIndex, setEditingFileIndex] = useState(null);
  const [globalPageIndex, setGlobalPageIndex] = useState(0); // 0-based index in globalPageOrder
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedGlobalPageIndex, setDraggedGlobalPageIndex] = useState(null);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState(null);
  const [pagesView, setPagesView] = useState(false);
  const [selectedGlobalPages, setSelectedGlobalPages] = useState(new Set());
  const [globalPageOrder, setGlobalPageOrder] = useState([]);
  const [editingPages, setEditingPages] = useState([]);
  const [pageThumbnails, setPageThumbnails] = useState({});
  const canvasRef = useRef(null);
  const previewContainerRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [draggedEditPageIndex, setDraggedEditPageIndex] = useState(null);

  // --------------------------- ROTATION STATE ---------------------------
  const [globalRotation, setGlobalRotation] = useState(0);
  const [fileRotations, setFileRotations] = useState({});
  const [pageRotations, setPageRotations] = useState({});

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

  // Modified: generatePageThumbnail now always generates an unrotated thumbnail
  const generatePageThumbnail = async (pdfDoc, pageNum) => {
    try {
      const page = await pdfDoc.getPage(pageNum);
      const vp = page.getViewport({ scale: 0.5 }); // No rotation applied here
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

  // Modified: generatePdfThumbnail now always generates an unrotated thumbnail
  const generatePdfThumbnail = async (file, onProgress) => {
    await loadPdfJs();
    
    // Report initial progress
    if (onProgress) onProgress(10);
    
    const arrayBuffer = await file.arrayBuffer();
    
    // Report progress after reading file
    if (onProgress) onProgress(30);
    
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
      .promise;
    
    // Report progress after loading PDF
    if (onProgress) onProgress(50);
    
    const page = await pdf.getPage(1);
    const vp = page.getViewport({ scale: 1.5 }); // No rotation applied here
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.height = vp.height;
    canvas.width = vp.width;
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    
    // Report progress after rendering thumbnail
    if (onProgress) onProgress(70);
    
    return {
      thumbnail: canvas.toDataURL(),
      pageCount: pdf.numPages,
      pdfDoc: pdf,
    };
  };

  // --------------------------- ROTATION HELPERS ---------------------------
  const rotateClockwise = (current) => (current + 90) % 360;
  const rotateCounterClockwise = (current) => (current - 90 + 360) % 360;

  // Modified: Removed calls to regenerate thumbnails
  const applyGlobalRotation = (direction) => {
    const delta = direction === "left" ? -90 : 90;
    const newGlobalRotationValue = (globalRotation + delta + 360) % 360;
    setGlobalRotation(newGlobalRotationValue);

    const newFileRots = {};
    const newPageRots = {};

    files.forEach((f) => {
      newFileRots[f.id] = newGlobalRotationValue;
    });
    globalPageOrder.forEach((pg) => {
      newPageRots[pg.globalId] = newGlobalRotationValue;
    });

    setFileRotations(newFileRots);
    setPageRotations(newPageRots);
  };

  // Modified: Removed calls to regenerate thumbnails
  const rotateFile = (fileId, direction) => {
    const current = fileRotations[fileId] || 0;
    const newRot =
      direction === "left"
        ? rotateCounterClockwise(current)
        : rotateClockwise(current);
    const newFileRots = { ...fileRotations, [fileId]: newRot };
    setFileRotations(newFileRots);

    const newPageRots = { ...pageRotations };
    globalPageOrder.forEach((pg) => {
      if (pg.fileId === fileId) {
        newPageRots[pg.globalId] = newRot;
      }
    });
    setPageRotations(newPageRots);
  };

  // Modified: Removed calls to regenerate thumbnails
  const rotatePage = (globalId, direction) => {
    const current = pageRotations[globalId] || 0;
    const newRot =
      direction === "left"
        ? rotateCounterClockwise(current)
        : rotateClockwise(current);
    const newPageRots = { ...pageRotations, [globalId]: newRot };
    setPageRotations(newPageRots);
  };

  // Modified: Removed calls to regenerate thumbnails
  const resetAllRotations = () => {
    setGlobalRotation(0);
    setFileRotations({});
    setPageRotations({});
  };

  const resetPageRotation = (globalId) => {
    setPageRotations((prev) => {
      const newState = { ...prev };
      delete newState[globalId];
      return newState;
    });
  };

  // Removed: regenerateAllThumbnails, regenerateFileThumbnails, regenerateSinglePageThumbnail are no longer needed.

  // --------------------------- FILE HANDLING ---------------------------
  // Removed convertOfficeToPdf function as only PDF files are accepted.

  // Modified: handleFileSelect now only accepts and processes PDF files
  const handleFileSelect = async (e) => {
    const selected = Array.from(e.target.files);
    for (const file of selected) {
      const tempId = Date.now() + Math.random();
      if (file.type === "application/pdf") {
        const loading = {
          id: tempId,
          file,
          name: file.name,
          pages: 0,
          pageOrder: [],
          thumbnail: null,
          type: file.type,
          pdfDoc: null,
          loading: true,
          loadingProgress: 0,
          pageThumbnails: {},
        };
        setFiles((p) => [...p, loading]);

        // Progress callback to update loading percentage
        const updateProgress = (progress) => {
          setFiles((p) =>
            p.map((f) =>
              f.id === tempId ? { ...f, loadingProgress: progress } : f
            )
          );
        };

        // Generate unrotated PDF thumbnail with progress tracking
        const { thumbnail, pageCount, pdfDoc } = await generatePdfThumbnail(
          file,
          updateProgress
        );
        
        // Update progress for page thumbnail generation
        updateProgress(75);
        
        const pageOrder = Array.from({ length: pageCount }, (_, i) => i + 1);
        const thumbs = {};
        
        // Generate page thumbnails with progress updates
        for (let i = 1; i <= pageCount; i++) {
          // Generate unrotated page thumbnails
          thumbs[i] = await generatePageThumbnail(pdfDoc, i);
          
          // Update progress incrementally (75% to 95%)
          const pageProgress = 75 + Math.floor((i / pageCount) * 20);
          updateProgress(pageProgress);
        }
        
        // Final update with 100% progress
        updateProgress(100);

        setFiles((p) =>
          p.map((f) =>
            f.id === tempId
              ? {
                  ...f,
                  pages: pageCount,
                  pageOrder,
                  thumbnail,
                  pdfDoc,
                  loading: false,
                  loadingProgress: 100,
                  pageThumbnails: thumbs, // Here it is! Thumbnails are already stored.
                }
              : f
          )
        );
        setGlobalPageOrder((p) => [
          ...p,
          ...pageOrder.map((pg) => ({
            fileId: tempId,
            originalPageNum: pg,
            globalId: `${tempId}-${pg}`,
          })),
        ]);
      } else {
        // Ignore non-PDF files and optionally show an error
        setError(`Only PDF files are supported. "${file.name}" was ignored.`);
      }
    }
    // Clear error after processing all files if no new errors occurred for valid files
    if (selected.every((f) => f.type === "application/pdf")) {
      setError(null);
    }
  };

  // --------------------------- PREVIEW LOGIC ---------------------------
  const totalGlobalPages = globalPageOrder.length;
  const openPreview = (fileIndex) => {
    const firstGlobalIdx = globalPageOrder.findIndex((p) => {
      const file = files.find((f) => f.id === p.fileId);
      return file && files.indexOf(file) === fileIndex;
    });
    setGlobalPageIndex(firstGlobalIdx >= 0 ? firstGlobalIdx : 0);
    setPreviewOpen(true);
  };
  const closePreview = () => setPreviewOpen(false);
  const handlePrevPage = useCallback(() => {
    setGlobalPageIndex((p) => (p > 0 ? p - 1 : totalGlobalPages - 1));
  }, [totalGlobalPages]);
  const handleNextPage = useCallback(() => {
    setGlobalPageIndex((p) => (p < totalGlobalPages - 1 ? p + 1 : 0));
  }, [totalGlobalPages]);

  const renderPdfPage = useCallback(async () => {
    if (!previewOpen || totalGlobalPages === 0) return;
    const pageRef = globalPageOrder[globalPageIndex];
    if (!pageRef) return;
    const file = files.find((f) => f.id === pageRef.fileId);
    if (!file) return;
    const canvas = canvasRef.current;
    const container = previewContainerRef.current;
    if (!canvas || !container) return;
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }
    try {
      if (file.type === "application/pdf") {
        let pdfDoc = file.pdfDoc;
        if (!pdfDoc) {
          await loadPdfJs();
          const arrayBuffer = await file.file.arrayBuffer();
          pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer })
            .promise;
        }
        const page = await pdfDoc.getPage(pageRef.originalPageNum);
        const rot =
          pageRotations[pageRef.globalId] ||
          fileRotations[file.id] ||
          globalRotation ||
          0;
        let vp = page.getViewport({ scale: 1 });
        if (rot) {
          vp = page.getViewport({ scale: 1, rotation: rot });
        }
        const containerW = container.clientWidth - 64;
        const containerH = container.clientHeight - 64;
        const scale = Math.min(
          containerW / vp.width,
          containerH / vp.height,
          2
        );
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
      }
    } catch (err) {
      if (err.name !== "RenderingCancelledException") console.error(err);
    }
  }, [
    previewOpen,
    globalPageIndex,
    globalPageOrder,
    files,
    pageRotations,
    fileRotations,
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

  // --------------------------- EDIT PAGES ---------------------------
  // Modified: openEditPages now uses pre-generated thumbnails
  const openEditPages = async (index) => {
    const file = files[index];
    if (file.pages <= 1) return;
    setEditingFileIndex(index);
    const pages = file.pageOrder.map((n) => ({
      pageNumber: n,
      id: `${file.id}-${n}-${Math.random()}`,
    }));
    setEditingPages(pages);
    setSelectedGlobalPages(new Set());
    if (file.type === "application/pdf" && file.pdfDoc) {
      setPageThumbnails(file.pageThumbnails); // Use already generated thumbnails
    } else if (file.type.startsWith("image/")) {
      setPageThumbnails({ 1: file.thumbnail }); // Use already generated thumbnail for images
    }
    setEditPagesOpen(true);
  };

  const closeEditPages = () => {
    setEditPagesOpen(false);
    setEditingFileIndex(null);
    setEditingPages([]);
    setPageThumbnails({});
    setSelectedGlobalPages(new Set());
  };

  const saveEditedPages = () => {
    if (editingFileIndex === null) return;
    const newFiles = [...files];
    const file = newFiles[editingFileIndex];
    const newOrder = editingPages.map((p) => p.pageNumber);
    newFiles[editingFileIndex] = {
      ...file,
      pageOrder: newOrder,
      pages: newOrder.length,
    };
    setFiles(newFiles);

    setGlobalPageOrder((prev) => {
      const without = prev.filter((p) => p.fileId !== file.id);
      const insertAt = prev.findIndex((p) => p.fileId === file.id);
      const toInsert = newOrder.map((pg) => ({
        fileId: file.id,
        originalPageNum: pg,
        globalId: `${file.id}-${pg}`,
      }));
      if (insertAt === -1) return [...without, ...toInsert];
      without.splice(insertAt, 0, ...toInsert);
      return without;
    });
    closeEditPages();
  };

  const deleteSelectedPagesFromEdit = () => {
    const remaining = editingPages.filter(
      (p) => !selectedGlobalPages.has(p.id)
    );
    if (remaining.length === 0) {
      alert("At least one page must remain.");
      return;
    }
    setEditingPages(remaining);
    setSelectedGlobalPages(new Set());
  };

  const deleteSinglePageFromEdit = (id) => {
    const remaining = editingPages.filter((p) => p.id !== id);
    if (remaining.length === 0) {
      alert("At least one page must remain.");
      return;
    }
    setEditingPages(remaining);
    const s = new Set(selectedGlobalPages);
    s.delete(id);
    setSelectedGlobalPages(s);
  };

  const handlePageDragStart = (i) => setDraggedEditPageIndex(i);
  const handlePageDragOver = (e, i) => {
    e.preventDefault();
    if (draggedEditPageIndex === null || draggedEditPageIndex === i) return;
    const newPages = [...editingPages];
    const [moved] = newPages.splice(draggedEditPageIndex, 1);
    newPages.splice(i, 0, moved);
    setEditingPages(newPages);
    setDraggedEditPageIndex(i);
  };
  const handlePageDragEnd = () => setDraggedEditPageIndex(null);

  // --------------------------- FILE REORDER ---------------------------
  const handleDragStart = (i) => setDraggedIndex(i);
  const handleDragOver = (e, i) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === i) return;
    const newFiles = [...files];
    const [moved] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(i, 0, moved);
    setFiles(newFiles);
    setDraggedIndex(i);

    setGlobalPageOrder((prev) => {
      const newOrder = [];
      newFiles.forEach((f) => {
        f.pageOrder.forEach((pg) => {
          newOrder.push({
            fileId: f.id,
            originalPageNum: pg,
            globalId: `${f.id}-${pg}`,
          });
        });
      });
      return newOrder;
    });
  };
  const handleDragEnd = () => setDraggedIndex(null);

  const deleteFile = (i) => {
    const file = files[i];
    setFiles((p) => p.filter((_, idx) => idx !== i));
    setGlobalPageOrder((p) => p.filter((pg) => pg.fileId !== file.id));
    if (previewOpen && globalPageIndex >= totalGlobalPages - 1)
      setGlobalPageIndex(0);
  };

  // --------------------------- GLOBAL PAGES ---------------------------
  const filesMap = useMemo(() => new Map(files.map((f) => [f.id, f])), [files]);

  const displayedGlobalPages = useMemo(() => {
    return globalPageOrder
      .map((ref) => {
        const file = filesMap.get(ref.fileId);
        if (!file) return null;
        const rot =
          pageRotations[ref.globalId] ||
          fileRotations[ref.fileId] ||
          globalRotation ||
          0;
        const thumb =
          file.type === "application/pdf"
            ? file.pageThumbnails[ref.originalPageNum]
            : file.thumbnail; // This will now be the unrotated thumbnail
        return {
          globalId: ref.globalId,
          fileId: file.id,
          fileName: file.name,
          originalPageNum: ref.originalPageNum,
          type: file.type,
          thumbnail: thumb,
          rotation: rot, // This is the rotation degree for CSS transform
        };
      })
      .filter(Boolean);
  }, [globalPageOrder, filesMap, pageRotations, fileRotations, globalRotation]);

  const handleGlobalPageDragStart = (e, gid) => {
    const idx = globalPageOrder.findIndex((p) => p.globalId === gid);
    setDraggedGlobalPageIndex(idx);
  };
  const handleGlobalPageDragOver = (e, gid) => {
    e.preventDefault();
    if (draggedGlobalPageIndex === null) return;
    const target = globalPageOrder.findIndex((p) => p.globalId === gid);
    if (draggedGlobalPageIndex === target) return;
    const newOrder = [...globalPageOrder];
    const [moved] = newOrder.splice(draggedGlobalPageIndex, 1);
    newOrder.splice(target, 0, moved);
    setGlobalPageOrder(newOrder);
    setDraggedGlobalPageIndex(target);
  };
  const handleGlobalPageDragEnd = () => setDraggedGlobalPageIndex(null);

  const deleteGlobalPage = (gid) => {
    if (totalGlobalPages <= 1) {
      setError("At least one page must remain.");
      return;
    }
    const page = globalPageOrder.find((p) => p.globalId === gid);
    if (!page) return;
    setGlobalPageOrder((p) => p.filter((x) => x.globalId !== gid));
    setFiles((prev) => {
      return prev
        .map((f) => {
          if (f.id === page.fileId) {
            const newOrder = f.pageOrder.filter(
              (n) => n !== page.originalPageNum
            );
            return { ...f, pageOrder: newOrder, pages: newOrder.length };
          }
          return f;
        })
        .filter((f) => f.pages > 0);
    });
    const s = new Set(selectedGlobalPages);
    s.delete(gid);
    setSelectedGlobalPages(s);
    setError(null);
  };

  const deleteSelectedGlobalPages = () => {
    if (selectedGlobalPages.size === 0) return;
    if (totalGlobalPages - selectedGlobalPages.size === 0) {
      setError("At least one page must remain.");
      return;
    }
    setGlobalPageOrder((p) =>
      p.filter((x) => !selectedGlobalPages.has(x.globalId))
    );
    setFiles((prev) => {
      const map = new Map(prev.map((f) => [f.id, { ...f }]));
      selectedGlobalPages.forEach((gid) => {
        const ref = globalPageOrder.find((p) => p.globalId === gid);
        if (ref && map.has(ref.fileId)) {
          const f = map.get(ref.fileId);
          f.pageOrder = f.pageOrder.filter((n) => n !== ref.originalPageNum);
          f.pages = f.pageOrder.length;
        }
      });
      return Array.from(map.values()).filter((f) => f.pages > 0);
    });
    setSelectedGlobalPages(new Set());
    setError(null);
  };

  // --------------------------- MERGE ---------------------------
  const handleMerge = async () => {
    if (globalPageOrder.length === 0) {
      setError("Add files first");
      return;
    }
    setMerging(true);
    setError(null);
    try {
      await loadPdfJs();
      const { PDFDocument } = await import("pdf-lib"); // Removed 'Rotation' from import
      const merged = await PDFDocument.create();
      const loaded = new Map();

      for (const ref of globalPageOrder) {
        const file = filesMap.get(ref.fileId);
        if (!file) continue;

        const rot =
          pageRotations[ref.globalId] ||
          fileRotations[ref.fileId] ||
          globalRotation ||
          0;

        if (file.type === "application/pdf") {
          let doc = loaded.get(file.id);
          if (!doc) {
            const arr = await file.file.arrayBuffer();
            doc = await PDFDocument.load(arr);
            loaded.set(file.id, doc);
          }
          const [copied] = await merged.copyPages(doc, [
            ref.originalPageNum - 1,
          ]);
          if (rot) copied.setRotation(degrees(rot));
          merged.addPage(copied);
        } else if (file.type.startsWith("image/")) {
          const arr = await file.file.arrayBuffer();
          const img =
            file.type === "image/png"
              ? await merged.embedPng(arr)
              : await merged.embedJpg(arr);
          const page = merged.addPage([img.width, img.height]);
          page.drawImage(img, {
            x: 0,
            y: 0,
            width: img.width,
            height: img.height,
            rotate: rot ? { type: "degrees", angle: rot } : undefined,
          });
        }
      }

      const bytes = await merged.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      
      // Auto-download the file
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "merged.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError("Merge failed");
    } finally {
      setMerging(false);
    }
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return "PDF";
    if (type.includes("word")) return "DOC";
    if (type.includes("image")) return "IMG";
    if (type.includes("excel")) return "XLS";
    if (type.includes("powerpoint")) return "PPT";
    return "FILE";
  };

  const toggleGlobalPageSelection = (gid) => {
    const s = new Set(selectedGlobalPages);
    s.has(gid) ? s.delete(gid) : s.add(gid);
    setSelectedGlobalPages(s);
  };

  const deselectAll = () => setSelectedGlobalPages(new Set());

  // --------------------------- KEYBOARD ---------------------------
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

  // --------------------------- RENDER ---------------------------
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
              PDF Merge Tool
            </h1>
          </div>
          {files.length > 0 && (
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: "20px" }}>
                {" "}
                <div className="flex gap-4 justify-self-center">
                  {/* Replaced hardcoded buttons with dynamic rendering using qrCodesButtonsData */}
                  {(() => {
                    const qrCodesButtonsData = [
                      {
                        title: "Files",
                        tooltipText: "View and manage your files",
                        icon: () => (
                          <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zM9 13l3-3m0 0l3 3m-3-3v8"
                            />
                          </svg>
                        ),
                        handler: () => {
                          setPagesView(false);
                          setSelectedGlobalPages(new Set());
                          setError(null);
                          closePreview(); // Close preview modal
                          closeEditPages(); // Close edit pages modal
                        },
                      },
                      {
                        title: "Pages",
                        tooltipText: "View and reorder individual pages",
                        icon: () => (
                          <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                        ),
                        handler: () => {
                          setPagesView(true);
                          setSelectedGlobalPages(new Set());
                          setError(null);
                          closePreview(); // Close preview modal
                          closeEditPages(); // Close edit pages modal
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
                        {qrCodesButtonsData.map((buttonData, index) => {
                          const isActiveButton =
                            (buttonData.title === "Files" && !pagesView) ||
                            (buttonData.title === "Pages" && pagesView);

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
                                startIcon={<buttonData.icon />}
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
                <div className="flex gap-4 flex-wrap justify-self-center">
                  {/* Rotation Buttons - Global */}
                  <div className="flex items-center gap-2">
                    <Tooltip title="Rotate left" placement="top">
                      <button
                        onClick={() => applyGlobalRotation("left")}
                        style={{
                          background: theme.palette.primary.main,
                          color: "#fff",
                        }}
                        className="px-5 py-3 rounded-[6px] cursor-pointer"
                      >
                        <RotateLeftIcon />
                      </button>
                    </Tooltip>
                    <Tooltip title="Rotate right" placement="top">
                      <button
                        onClick={() => applyGlobalRotation("right")}
                        style={{
                          background: theme.palette.primary.main,
                          color: "#fff",
                        }}
                        className="px-5 py-3 rounded-[6px] cursor-pointer"
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
                    <Tooltip title="Add More Files">
                      {" "}
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
                        >
                          <CloudUploadIcon sx={{ fontSize: "32px" }} />
                        </IconButton>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="application/pdf" // Only accept PDF files
                          onChange={handleFileSelect}
                        />
                      </label>
                    </Tooltip>
                  </div>

                  {pagesView && selectedGlobalPages.size > 0 && (
                    <>
                      <button
                        onClick={deleteSelectedGlobalPages}
                        style={{ background: theme.palette.ui.delete }}
                        className="text-white px-6 py-2 rounded flex items-center gap-2 cursor-pointer"
                      >
                        Delete Selected ({selectedGlobalPages.size})
                      </button>
                      <button
                        onClick={deselectAll}
                        style={{
                          background: theme.palette.primary.main,
                          color: "#fff",
                        }}
                        className="px-4 py-2 rounded cursor-pointer text-sm"
                      >
                        Deselect All
                      </button>
                    </>
                  )}
                </div>
              </Stack>

              {/* Merge button */}
              <button
                onClick={handleMerge}
                disabled={
                  merging ||
                  files.some((f) => f.loading) ||
                  globalPageOrder.length === 0
                }
                style={{ background: theme.palette.primary.main }}
                className="text-white px-12 py-3 rounded-[12px] text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[20px] cursor-pointer"
              >
                {merging ? (
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
                    Merging...
                  </>
                ) : (
                  <>Finish →</>
                )}
              </button>
            </Stack>
          )}
        </Stack>


      </div>

      <div
        className={`max-w-8xl mx-auto p-2 mt-[80px]`}
      >
        {/* Files / Pages grid */}
        <div className="border-2 border-dashed border-[#1fd5e9] rounded-[22px] min-h-[100vh] bg-white p-6 flex flex-wrap gap-8 items-start">
          {files.length === 0 ? (
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
                Select files
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="application/pdf" // Only accept PDF files
                  onChange={handleFileSelect}
                />
              </label>
              <p className="text-[#4a5565] mb-[20px] text-2xl mt-[20px]">
                Only <strong>PDF</strong> Files Merge Tool
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {["Add Only PDF Files"].map((f) => (
                  <span
                    key={f}
                    className={`px-3 py-1 rounded text-lg font-semiboldbg-red-50 text-red-800
						}`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ) : !pagesView ? (
            /* ---------- FILES VIEW ---------- */
            <>
              {files.map((file, idx) => (
                <div
                  key={file.id}
                  draggable={!file.loading}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  style={{ background: theme.palette.secondary.main }}
                  className={`flex-grow flex-shrink basis-[14.5rem] rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg ${
                    !file.loading ? "cursor-move" : ""
                  } ${draggedIndex === idx ? "opacity-50" : ""}`}
                >
                  <div className="relative">
                    <div
                      onClick={() => !file.loading && openPreview(idx)}
                      style={{ background: theme.palette.secondary.main }}
                      className={`h-72 flex items-center justify-center relative overflow-hidden ${
                        !file.loading ? "cursor-pointer" : ""
                      }`}
                    >
                      {file.loading ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative">
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
                              <span className="text-[16px] font-bold"
                              style={{ color: theme.palette.primary.main }}>
                                {file.loadingProgress || 0}%
                              </span>
                            </div>
                          </div>
                          <p style={{color: theme.palette.primary.main,fontWeight: 'bold'}} className="text-[18px] font-medium">
                            Uploading
                          </p>
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all duration-300"
                              style={{ width: `${file.loadingProgress || 0}%`, backgroundColor: theme.palette.primary.main }}
                            ></div>
                          </div>
                        </div>
                      ) : file.thumbnail ? (
                        <img
                          src={file.thumbnail} // This is now the unrotated thumbnail
                          alt={file.name}
                          className="w-full h-full object-contain"
                          style={{
                            transform: `rotate(${
                              fileRotations[file.id] || 0
                            }deg)`,
                          }} // CSS rotation applied here
                        />
                      ) : (
                        <span className="text-6xl">
                          {getFileIcon(file.type)}
                        </span>
                      )}
                      {!file.loading && (
                        <>
                          <div className="absolute top-2 right-2 flex gap-1 flex-wrap max-w-42">
                            <Tooltip title="Rotate left">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  rotateFile(file.id, "left");
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
                                  rotateFile(file.id, "right");
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
                                background: theme.palette.secondary.secondMain,
                              }}
                              className="p-1.5 rounded shadow cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPreview(idx);
                              }}
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
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                />
                              </svg>
                            </button>
                            {file.pages > 1 && (
                              <button
                                className="bg-[#1fd5e9] hover:bg-[#1fd5e9] text-white p-1.5 rounded shadow cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditPages(idx);
                                }}
                                title="Edit pages"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                            )}

                            <button
                              className="p-1.5 rounded shadow cursor-pointer"
                              style={{ background: theme.palette.ui.delete }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFile(idx);
                              }}
                            >
                              <svg
                                className="w-4 h-4"
                                style={{
                                  color: theme.palette.primary.fourthMain,
                                }}
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
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 border-t border-[#1fd5e9] text-center`}>
                    <p
                      className="text-sm font-medium truncate p-2 rounded-[8px] mb-2"
                      style={{
                        background: theme.palette.primary.main,
                        color: "#ffffff",
                      }}
                    >
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {file.loading
                        ? file.converting
                          ? "Converting..."
                          : "Loading..."
                        : `${file.pages} pages`}
                    </p>
                  </div>
                </div>
              ))}
              <label className="w-62 h-80 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#1fd5e9]">
                <div
                  style={{ background: theme.palette.primary.main }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                >
                  <IconButton
                    component="span"
                    sx={{
                      color: theme.palette.secondary.secondMain,
                      bgcolor: theme.palette.primary.main,
                      p: "14px",

                      borderRadius: "50px",
                      "&:hover": { bgcolor: theme.palette.primary.main },
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: "46px" }} />
                  </IconButton>
                </div>
                <p className="text-[#61698b] font-medium text-center px-4">
                  Add PDF files
                </p>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="application/pdf" // Only accept PDF files
                  onChange={handleFileSelect}
                />
              </label>
            </>
          ) : (
            /* ---------- PAGES VIEW ---------- */
            <>
              {displayedGlobalPages.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-16 text-gray-500">
                  <p className="text-lg mb-2">No pages added yet.</p>
                  <p className="text-sm">Add files using the "Add" button.</p>
                </div>
              ) : (
                displayedGlobalPages.map((pg, i) => (
                  <div
                    key={pg.globalId}
                    draggable
                    onDragStart={(e) =>
                      handleGlobalPageDragStart(e, pg.globalId)
                    }
                    onDragOver={(e) => handleGlobalPageDragOver(e, pg.globalId)}
                    onDragEnd={handleGlobalPageDragEnd}
                    className={`flex-grow flex-shrink basis-[12rem] bg-white rounded-lg border-2 transition-all hover:shadow-lg relative ${
                      draggedGlobalPageIndex === i ? "opacity-50 scale-95" : ""
                    } ${
                      selectedGlobalPages.has(pg.globalId)
                        ? " ring-6 ring-[#1fd5e947] border-none"
                        : "border-none"
                    }`}
                  >
                    <div
                      className="relative cursor-pointer"
                      onClick={() => toggleGlobalPageSelection(pg.globalId)}
                    >
                      <div
                        style={{ background: theme.palette.secondary.main }}
                        className="h-52 flex items-center justify-center relative"
                      >
                        {pg.thumbnail ? (
                          <img
                            src={pg.thumbnail} // This is now the unrotated thumbnail
                            alt={`Page ${pg.originalPageNum}`}
                            className="w-full h-full object-contain"
                            style={{ transform: `rotate(${pg.rotation}deg)` }} // CSS rotation applied here
                          />
                        ) : (
                          <span className="text-5xl">
                            {getFileIcon(pg.type)}
                          </span>
                        )}
                        <div
                          style={{
                            background: theme.palette.secondary.secondMain,
                            color: theme.palette.primary.main,
                          }}
                          className="absolute top-0 right-[0] px-2 py-1 rounded text-xs font-semibold"
                        >
                          {i + 1}
                        </div>
                        {selectedGlobalPages.has(pg.globalId) && (
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGlobalPage(pg.globalId);
                          }}
                          style={{
                            background: theme.palette.ui.delete,
                          }}
                          className="absolute left-[-10px] top-[-10px] text-white p-2 rounded shadow-lg cursor-pointer"
                          title="Delete"
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
                        {/* Page-level rotation buttons */}
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
                            >
                              <RotateRightIcon />
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
                          {pg.fileName}
                        </p>
                        <p className="text-xs text-gray-500 text-center">
                          Page {pg.originalPageNum}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Errors / Download */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>

      {/* ------------------- EDIT PAGES MODAL ------------------- */}
      {editPagesOpen && editingFileIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeEditPages}
        >
          <div
            className="bg-white rounded-lg overflow-hidden flex flex-col max-w-7xl w-full max-h-[90vh] mt-[100px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: theme.palette.secondary.secondMain,
                borderColor: theme.palette.primary.main,
              }}
              className="flex justify-between items-center p-4 border-b"
            >
              <div>
                <h3
                  style={{ color: theme.palette.primary.main }}
                  className="text-lg font-semibold"
                >
                  Edit Pages - {files[editingFileIndex]?.name}
                </h3>
                <p
                  style={{ color: theme.palette.primary.main }}
                  className="text-sm"
                >
                  Reorder or remove pages from this file
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedGlobalPages.size > 0 && (
                  <>
                    <button
                      onClick={deleteSelectedPagesFromEdit}
                      style={{ background: theme.palette.ui.delete }}
                      className="text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
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
                      Delete ({selectedGlobalPages.size})
                    </button>
                    <button
                      onClick={() => setSelectedGlobalPages(new Set())}
                      style={{
                        background: theme.palette.primary.main,
                        color: "#fff",
                      }}
                      className="px-4 py-2 rounded cursor-pointer text-sm"
                    >
                      Deselect
                    </button>
                  </>
                )}
                <button
                  onClick={closeEditPages}
                  style={{ color: theme.palette.primary.main }}
                  className="p-2 rounded cursor-pointer"
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
            </div>

            <div className="flex-1 overflow-y-auto p-6 ">
              <div className="grid grid-cols-4 gap-8">
                {editingPages.map((pg, i) => {
                  const gid = `${files[editingFileIndex].id}-${pg.pageNumber}`;
                  const rot =
                    pageRotations[gid] ||
                    fileRotations[files[editingFileIndex].id] ||
                    globalRotation ||
                    0;
                  return (
                    <div
                      key={pg.id}
                      draggable
                      onDragStart={() => handlePageDragStart(i)}
                      onDragOver={(e) => handlePageDragOver(e, i)}
                      onDragEnd={handlePageDragEnd}
                      style={{ background: theme.palette.secondary.main }}
                      className={`rounded-lg border-2 transition-all cursor-move hover:shadow-lg ${
                        selectedGlobalPages.has(pg.id)
                          ? "border-none ring-4 ring-blue-300"
                          : "border-none"
                      } ${
                        draggedEditPageIndex === i ? "opacity-50 scale-95" : ""
                      }`}
                    >
                      <div
                        className="relative"
                        onClick={() => toggleGlobalPageSelection(pg.id)}
                      >
                        <div
                          style={{ background: theme.palette.secondary.main }}
                          className="h-64 flex items-center justify-center relative"
                        >
                          {pageThumbnails[pg.pageNumber] ? ( // Corrected thumbnail access here
                            <img
                              src={
                                pageThumbnails[pg.pageNumber] // Corrected thumbnail access here
                              }
                              alt={`Page ${pg.pageNumber}`}
                              className="w-full h-full object-contain"
                              style={{ transform: `rotate(${rot}deg)` }} // CSS rotation applied here
                            />
                          ) : (
                            <div className="flex flex-col items-center">
                              <span className="text-5xl mb-2">PDF</span>
                              <span className="text-sm text-gray-500">
                                Page {pg.pageNumber}
                              </span>
                            </div>
                          )}
                          <div className="absolute top-0 right-0 bg-[#1fd5e9] text-white px-3 py-1 rounded font-semibold text-sm">
                            {i + 1}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSinglePageFromEdit(pg.id);
                            }}
                            style={{ background: theme.palette.ui.delete }}
                            className="absolute top-[-10px] left-[-10px] text-white p-2 rounded shadow-lg"
                            title="Delete"
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
                          <div className="absolute top-[-10px] left-[28px] flex gap-1">
                            <Tooltip title="Rotate left">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const fileId = files[editingFileIndex].id;
                                  const gid = `${fileId}-${pg.pageNumber}`;
                                  rotatePage(gid, "left");
                                }}
                                style={{
                                  background: theme.palette.primary.main,
                                  color: "#fff",
                                }}
                                className="w-8 h-8 rounded shadow cursor-pointer"
                              >
                                <RotateLeftIcon />
                              </button>
                            </Tooltip>
                            <Tooltip title="Rotate right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const fileId = files[editingFileIndex].id;
                                  const gid = `${fileId}-${pg.pageNumber}`;
                                  rotatePage(gid, "right");
                                }}
                                style={{
                                  background: theme.palette.primary.main,
                                  color: "#fff",
                                }}
                                className="w-8 h-8 rounded shadow cursor-pointer"
                              >
                                <RotateRightIcon />
                              </button>
                            </Tooltip>
                          </div>
                          {selectedGlobalPages.has(pg.id) && (
                            <div className="absolute inset-0 bg-transparent bg-opacity-20 flex items-center justify-center">
                              <div
                                style={{
                                  background:
                                    theme.palette.secondary.secondMain,
                                  color: theme.palette.primary.main,
                                }}
                                className="rounded-full p-3"
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
                            background: theme.palette.primary.main,
                            color: theme.palette.primary.fourthMain,
                          }}
                          className={`p-3 bg-gray-50 border-t border-gray-200 p-2 rounded-[8px] m-2`}
                        >
                          <p className="text-sm font-medium text-center">
                            Original Page {pg.pageNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                background: theme.palette.secondary.secondMain,
                borderColor: theme.palette.primary.main,
              }}
              className="flex justify-between items-center p-4 border-t"
            >
              <div
                style={{ color: theme.palette.primary.main }}
                className="text-sm"
              >
                <span
                  style={{ color: theme.palette.primary.main }}
                  className="font-semibold"
                >
                  {editingPages.length}
                </span>{" "}
                pages
                {selectedGlobalPages.size > 0 && (
                  <span>
                    {" "}
                    •{" "}
                    <span className="font-semibold text-[#ffffff]">
                      {selectedGlobalPages.size}
                    </span>{" "}
                    selected
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeEditPages}
                  style={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  }}
                  className="px-6 py-2 border rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedPages}
                  disabled={editingPages.length === 0}
                  style={{
                    background: theme.palette.primary.main,
                    color: theme.palette.primary.fourthMain,
                  }}
                  className="px-6 py-2 rounded font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- PREVIEW MODAL (ALL PAGES) ------------------- */}
      {previewOpen && (
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
                {globalPageOrder[globalPageIndex]
                  ? files.find(
                      (f) => f.id === globalPageOrder[globalPageIndex].fileId
                    )?.name
                  : "Preview"}
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
              {globalPageOrder[globalPageIndex] &&
              files.find(
                (f) => f.id === globalPageOrder[globalPageIndex].fileId
              )?.type === "application/pdf" ? (
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full shadow-2xl"
                />
              ) : globalPageOrder[globalPageIndex] &&
                files.find(
                  (f) => f.id === globalPageOrder[globalPageIndex].fileId
                )?.thumbnail ? (
                <img
                  src={
                    files.find(
                      (f) => f.id === globalPageOrder[globalPageIndex].fileId
                    )?.thumbnail
                  }
                  alt="preview"
                  className="max-w-full max-h-full object-contain shadow-2xl"
                />
              ) : (
                <div className="bg-white p-16 rounded flex items-center justify-center">
                  <span className="text-9xl">
                    {getFileIcon(
                      files.find(
                        (f) => f.id === globalPageOrder[globalPageIndex]?.fileId
                      )?.type || ""
                    )}
                  </span>
                </div>
              )}
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
                {globalPageIndex + 1} / {totalGlobalPages}
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
                onClick={() =>
                  rotatePage(globalPageOrder[globalPageIndex].globalId, "left")
                }
                style={{
                  color: theme.palette.secondary.secondMain,
                  background: theme.palette.primary.main,
                }}
                className="py-[10px] px-[11px] rounded cursor-pointer"
              >
                <RotateLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  rotatePage(globalPageOrder[globalPageIndex].globalId, "right")
                }
                style={{
                  color: theme.palette.secondary.secondMain,
                  background: theme.palette.primary.main,
                }}
                className="py-[10px] px-[11px] rounded cursor-pointer"
              >
                <RotateRightIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  resetPageRotation(globalPageOrder[globalPageIndex].globalId)
                }
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
                  const fileIdx = files.findIndex(
                    (f) => f.id === globalPageOrder[globalPageIndex].fileId
                  );
                  deleteFile(fileIdx);
                }}
                style={{
                  background: theme.palette.ui.delete,
                  color: theme.palette.primary.fourthMain,
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
