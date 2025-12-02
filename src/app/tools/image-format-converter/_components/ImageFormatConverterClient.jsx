// "use client";
// import React, { useState, useCallback, useRef } from "react";

// const theme = {
//   palette: {
//     primary: {
//       main: "#1fd5e9",
//       secondMain: "#ffffff",
//       fourthMain: "#000000",
//     },
//     secondary: {
//       main: "#f5f5f5",
//       secondMain: "#e0e0e0",
//     },
//     ui: {
//       pageBackground: "#fafafa",
//       delete: "#ff4757",
//     },
//   },
// };

// const SUPPORTED_FORMATS = ["JPEG", "PNG", "WebP", "GIF", "BMP", "TIFF"];
// const QUALITY_PRESETS = [
//   { label: "High", value: 0.95 },
//   { label: "Medium", value: 0.8 },
//   { label: "Low", value: 0.6 },
// ];

// export default function ImageFormatConverter() {
//   const [images, setImages] = useState([]);
//   const [outputFormat, setOutputFormat] = useState("PNG");
//   const [qualityPreset, setQualityPreset] = useState(0.8);
//   const [converting, setConverting] = useState(false);
//   const [error, setError] = useState(null);
//   const [downloadUrls, setDownloadUrls] = useState({});
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleDrag = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(e.type === "dragenter" || e.type === "dragover");
//   }, []);

//   const processFiles = useCallback(
//     async (files) => {
//       const validFiles = Array.from(files).filter((file) => {
//         const isImage = file.type.startsWith("image/");
//         if (!isImage) {
//           setError(`"${file.name}" is not a valid image file`);
//         }
//         return isImage;
//       });

//       if (validFiles.length === 0) return;

//       const newImages = await Promise.all(
//         validFiles.slice(0, 10 - images.length).map(async (file) => {
//           const preview = URL.createObjectURL(file);
//           return {
//             id: Date.now() + Math.random(),
//             file,
//             name: file.name,
//             preview,
//             originalFormat: file.type.split("/")[1].toUpperCase(),
//             size: file.size,
//             loading: true,
//             dimensions: null,
//             downloadUrl: null,
//           };
//         })
//       );

//       // Get dimensions for each image
//       const imagesWithDimensions = await Promise.all(
//         newImages.map(
//           (img) =>
//             new Promise((resolve) => {
//               const imgElement = document.createElement("img");
//               imgElement.onload = () => {
//                 resolve({
//                   ...img,
//                   dimensions: {
//                     width: imgElement.width,
//                     height: imgElement.height,
//                   },
//                   loading: false,
//                 });
//               };
//               imgElement.onerror = () => {
//                 resolve({ ...img, loading: false });
//               };
//               imgElement.src = img.preview;
//             })
//         )
//       );

//       setImages((prev) => [...prev, ...imagesWithDimensions]);
//       setError(null);
//     },
//     [images.length]
//   );

//   const handleDrop = useCallback(
//     (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       setDragActive(false);
//       processFiles(e.dataTransfer.files);
//     },
//     [processFiles]
//   );

//   const handleFileInput = useCallback(
//     (e) => {
//       processFiles(e.target.files);
//     },
//     [processFiles]
//   );

//   const removeImage = (id) => {
//     setImages((prev) => prev.filter((img) => img.id !== id));
//     setDownloadUrls((prev) => {
//       const newUrls = { ...prev };
//       delete newUrls[id];
//       return newUrls;
//     });
//   };

//   const convertImage = async (imageData, targetFormat) => {
//     return new Promise((resolve, reject) => {
//       const img = document.createElement("img");
//       img.onload = () => {
//         try {
//           const canvas = document.createElement("canvas");
//           canvas.width = img.width;
//           canvas.height = img.height;
//           const ctx = canvas.getContext("2d");
//           ctx.drawImage(img, 0, 0);

//           // Convert to target format
//           const mimeType = `image/${targetFormat.toLowerCase()}`;
//           canvas.toBlob(
//             (blob) => {
//               if (blob) {
//                 resolve(blob);
//               } else {
//                 reject(new Error(`Failed to convert to ${targetFormat}`));
//               }
//             },
//             mimeType,
//             targetFormat === "PNG" ? undefined : qualityPreset
//           );
//         } catch (err) {
//           reject(err);
//         }
//       };
//       img.onerror = () => reject(new Error("Failed to load image"));
//       img.src = URL.createObjectURL(imageData.file);
//     });
//   };

//   const handleConvert = async () => {
//     if (images.length === 0) {
//       setError("Please add at least one image");
//       return;
//     }

//     setConverting(true);
//     setError(null);

//     try {
//       const newDownloadUrls = { ...downloadUrls };

//       for (const image of images) {
//         const blob = await convertImage(image, outputFormat);
//         const url = URL.createObjectURL(blob);
//         newDownloadUrls[image.id] = {
//           url,
//           filename: `${image.name.split(".")[0]}.${outputFormat.toLowerCase()}`,
//           size: blob.size,
//         };
//       }

//       setDownloadUrls(newDownloadUrls);
//     } catch (err) {
//       setError(`Conversion failed: ${err.message}`);
//     } finally {
//       setConverting(false);
//     }
//   };

//   const downloadImage = (imageId, url, filename) => {
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   const downloadAll = async () => {
//     for (const [imageId, data] of Object.entries(downloadUrls)) {
//       downloadImage(imageId, data.url, data.filename);
//       await new Promise((resolve) => setTimeout(resolve, 200));
//     }
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 B";
//     const k = 1024;
//     const sizes = ["B", "KB", "MB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
//   };

//   const hasConvertedImages = Object.keys(downloadUrls).length > 0;

//   return (
//     <div
//       style={{ background: theme.palette.ui.pageBackground }}
//       className="min-h-screen"
//     >
//       {/* Header */}
//       <div className="w-full bg-white border-b border-gray-200 px-6 py-4 fixed z-[1000]">
//         <div className="flex justify-between items-center gap-5 flex-wrap">
//           <div className="flex items-center gap-4">
//             <h1
//               className="text-2xl font-semibold"
//               style={{ color: theme.palette.primary.main }}
//             >
//               Image Format Converter
//             </h1>
//           </div>

//           {images.length > 0 && (
//             <div className="flex items-center gap-4 flex-wrap justify-end">
//               {/* Format Selection */}
//               <div className="flex items-center gap-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Output Format:
//                 </label>
//                 <select
//                   value={outputFormat}
//                   onChange={(e) => setOutputFormat(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
//                   style={{ borderColor: theme.palette.primary.main }}
//                 >
//                   {SUPPORTED_FORMATS.map((format) => (
//                     <option key={format} value={format}>
//                       {format}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Quality Preset */}
//               <div className="flex items-center gap-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Quality:
//                 </label>
//                 <select
//                   value={qualityPreset}
//                   onChange={(e) => setQualityPreset(parseFloat(e.target.value))}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
//                   style={{ borderColor: theme.palette.primary.main }}
//                 >
//                   {QUALITY_PRESETS.map((preset) => (
//                     <option key={preset.value} value={preset.value}>
//                       {preset.label} ({Math.round(preset.value * 100)}%)
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Convert Button */}
//               <button
//                 onClick={handleConvert}
//                 disabled={converting || images.some((img) => img.loading)}
//                 style={{
//                   background: theme.palette.primary.main,
//                   opacity:
//                     converting || images.some((img) => img.loading) ? 0.5 : 1,
//                   cursor:
//                     converting || images.some((img) => img.loading)
//                       ? "not-allowed"
//                       : "pointer",
//                 }}
//                 className="text-black px-8 py-2 rounded-lg font-semibold flex items-center gap-2"
//               >
//                 {converting ? (
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
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                     Converting...
//                   </>
//                 ) : (
//                   <>Convert →</>
//                 )}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Download All Button */}
//         {hasConvertedImages && (
//           <div className="mt-4 bg-green-50 border border-green-200 px-4 py-3 rounded flex items-center justify-between">
//             <span
//               style={{ color: theme.palette.primary.main }}
//               className="font-medium"
//             >
//               ✓ {Object.keys(downloadUrls).length} image(s) ready for download
//             </span>
//             <button
//               onClick={downloadAll}
//               style={{ background: theme.palette.primary.main }}
//               className="text-black px-4 py-2 rounded font-semibold flex items-center gap-2"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                 />
//               </svg>
//               Download All
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="mt-[180px] max-w-7xl mx-auto p-4">
//         {/* Upload Area */}
//         {images.length === 0 ? (
//           <div
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//             style={{
//               background: dragActive ? theme.palette.primary.main : "white",
//               borderColor: dragActive ? theme.palette.primary.main : "#1fd5e9",
//             }}
//             className="border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer"
//           >
//             <div className="flex flex-col items-center gap-4">
//               <div
//                 style={{ background: theme.palette.primary.main }}
//                 className="w-20 h-20 rounded-full flex items-center justify-center"
//               >
//                 <svg
//                   className="w-10 h-10 text-black"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xl font-semibold text-gray-800">
//                   {dragActive
//                     ? "Drop your images here"
//                     : "Drag & drop images here"}
//                 </p>
//                 <p className="text-sm text-gray-600 mt-1">or click to browse</p>
//               </div>
//               <p className="text-xs text-gray-500">
//                 Supported formats: {SUPPORTED_FORMATS.join(", ")} • Max 10
//                 images
//               </p>
//               <button
//                 style={{ background: theme.palette.primary.main }}
//                 className="px-6 py-2 text-black rounded-lg font-semibold"
//                 onClick={() => fileInputRef.current.click()}
//               >
//                 Select Images
//               </button>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={handleFileInput}
//                 className="hidden"
//               />
//             </div>
//           </div>
//         ) : (
//           <div>
//             {/* Image Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
//               {images.map((image) => {
//                 const converted = downloadUrls[image.id];
//                 return (
//                   <div
//                     key={image.id}
//                     style={{ background: theme.palette.secondary.main }}
//                     className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
//                   >
//                     {/* Image Preview */}
//                     <div className="relative bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
//                       {image.loading ? (
//                         <svg
//                           className="animate-spin h-8 w-8 text-gray-400"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           />
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           />
//                         </svg>
//                       ) : (
//                         <img
//                           src={image.preview}
//                           alt={image.name}
//                           className="w-full h-full object-contain"
//                         />
//                       )}
//                     </div>

//                     {/* Image Info */}
//                     <div className="p-4">
//                       <p className="text-sm font-semibold text-gray-800 truncate mb-2">
//                         {image.name}
//                       </p>
//                       <div className="text-xs text-gray-600 space-y-1 mb-3">
//                         <p>Format: {image.originalFormat}</p>
//                         <p>Size: {formatFileSize(image.size)}</p>
//                         {image.dimensions && (
//                           <p>
//                             Dimensions: {image.dimensions.width}×
//                             {image.dimensions.height}px
//                           </p>
//                         )}
//                       </div>

//                       {/* Download or Status */}
//                       {converted ? (
//                         <div className="space-y-2">
//                           <button
//                             onClick={() =>
//                               downloadImage(
//                                 image.id,
//                                 converted.url,
//                                 converted.filename
//                               )
//                             }
//                             style={{ background: theme.palette.primary.main }}
//                             className="w-full py-2 text-black rounded font-semibold text-sm flex items-center justify-center gap-1"
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
//                                 d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                               />
//                             </svg>
//                             Download
//                           </button>
//                           <p className="text-xs text-green-600 font-semibold">
//                             ✓ Converted • {formatFileSize(converted.size)} into{" "}
//                             {outputFormat}
//                           </p>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => removeImage(image.id)}
//                           style={{ background: theme.palette.ui.delete }}
//                           className="w-full py-2 text-white rounded font-semibold text-sm flex items-center justify-center gap-1"
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
//                           Remove
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}

//               {/* Add More Button */}
//               {images.length < 10 && (
//                 <label
//                   style={{
//                     background: theme.palette.secondary.main,
//                     borderColor: theme.palette.primary.main,
//                   }}
//                   className="rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer h-80 hover:bg-gray-50 transition-all"
//                 >
//                   <div className="text-center">
//                     <svg
//                       className="w-10 h-10 mx-auto mb-2"
//                       style={{ color: theme.palette.primary.main }}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                       />
//                     </svg>
//                     <p className="text-sm font-semibold text-gray-700">
//                       Add More
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       ({images.length}/10)
//                     </p>
//                   </div>
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={handleFileInput}
//                     className="hidden"
//                   />
//                 </label>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// ... existing code ...
"use client";
import theme from "@/styles/theme";
import Image from "next/image";
import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ToolsHubsIcon from "@/icons/ToolsHubsIcon";
import { Box } from "@mui/material";
import Link from "next/link";
// Import GIF library (assuming it's installed and available globally or via a specific import path if using a module build)
// You might need to adjust this import based on how gif.js is bundled/configured for your project.
// For CommonJS/module-aware setups, it might be:
// import GIF from 'gif.js';
// For direct script inclusion or if using the worker path directly for instantiation:
// import GIF from '../../../../public/static/gif.js'; // Example if you copy the main script too
const SUPPORTED_FORMATS = ["JPEG", "PNG", "WebP", "GIF", "BMP", "TIFF"];
const QUALITY_PRESETS = [
  { label: "High", value: 0.95 },
  { label: "Medium", value: 0.8 },
  { label: "Low", value: 0.6 },
];

export default function ImageFormatConverter() {
  const [images, setImages] = useState([]);
  const [outputFormat, setOutputFormat] = useState("BMP"); // Changed default to BMP based on image
  const [qualityPreset, setQualityPreset] = useState(0.8);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrls, setDownloadUrls] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const addMoreFileInputRef = useRef(null); // New ref for "Add More" button
  const [showDownloadNotification, setShowDownloadNotification] =
    useState(true);
  // New state for GIF merging options
  const [mergeIntoOneGif, setMergeIntoOneGif] = useState(false);
  const [gifFrameDelay, setGifFrameDelay] = useState(100); // Default 100ms delay per frame

  // Removed useMemo and useEffect related to availableOutputFormats to keep all formats available.

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const processFiles = useCallback(
    async (files) => {
      const validFiles = Array.from(files).filter((file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
          setError(`"${file.name}" is not a valid image file`);
        }
        return isImage;
      });

      if (validFiles.length === 0) return;

      const newImages = await Promise.all(
        validFiles.slice(0, 10 - images.length).map(async (file) => {
          const preview = URL.createObjectURL(file);
          return {
            id: Date.now() + Math.random(),
            file,
            name: file.name,
            preview,
            originalFormat: file.type.split("/")[1].toUpperCase(),
            size: file.size,
            loading: true,
            dimensions: null,
            downloadUrl: null,
          };
        })
      );

      // Get dimensions for each image
      const imagesWithDimensions = await Promise.all(
        newImages.map(
          (img) =>
            new Promise((resolve) => {
              const imgElement = document.createElement("img");
              imgElement.onload = () => {
                resolve({
                  ...img,
                  dimensions: {
                    width: imgElement.width,
                    height: imgElement.height,
                  },
                  loading: false,
                });
              };
              imgElement.onerror = () => {
                resolve({ ...img, loading: false });
              };
              imgElement.src = img.preview;
            })
        )
      );

      setImages((prev) => [...prev, ...imagesWithDimensions]);
      setError(null);
      // Reset conversion results when new images are added
      setDownloadUrls({});
      setShowDownloadNotification(false);
    },
    [images.length]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e) => {
      processFiles(e.target.files);
    },
    [processFiles]
  );

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setDownloadUrls((prev) => {
      const newUrls = { ...prev };
      delete newUrls[id];
      return newUrls;
    });
  };

  const convertImage = async (imageData, targetFormat) => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          // Convert to target format
          const mimeType = `image/${targetFormat.toLowerCase()}`;
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error(`Failed to convert to ${targetFormat}`));
              }
            },
            mimeType,
            targetFormat === "PNG" ? undefined : qualityPreset
          );
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(imageData.file);
    });
  };

  const mergeGif = async (imagesToMerge, frameDelay) => {
    // Dynamically import gif.js if it's a client-side only library
    const GIF = (await import("gif.js")).default;
    return new Promise((resolve, reject) => {
      console.log("Starting GIF merging process..."); // Added log
      const gif = new GIF({
        workers: 2, // Use 2 web workers for better performance
        quality: 10, // GIF quality (lower is better, 1 is best)
        workerScript: "/static/gif.worker.js", // Path to gif.worker.js in your public folder
      });

      let loadedImages = 0;
      const totalImages = imagesToMerge.length;
      const tempImages = [];

      imagesToMerge.forEach((imageData) => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(imageData.file);
        img.onload = () => {
          console.log(`Image loaded: ${imageData.name}`); // Added log
          tempImages.push({ img, id: imageData.id });
          loadedImages++;
          if (loadedImages === totalImages) {
            console.log("All images loaded. Proceeding to render GIF."); // Added log
            // All images loaded, sort by original order if necessary
            tempImages.sort(
              (a, b) =>
                imagesToMerge.findIndex((img) => img.id === a.id) -
                imagesToMerge.findIndex((img) => img.id === b.id)
            );

            // Determine max dimensions to ensure all frames fit
            let maxWidth = 0;
            let maxHeight = 0;
            tempImages.forEach(({ img }) => {
              if (img.width > maxWidth) maxWidth = img.width;
              if (img.height > maxHeight) maxHeight = img.height;
            });

            const canvas = document.createElement("canvas");
            canvas.width = maxWidth;
            canvas.height = maxHeight;
            const ctx = canvas.getContext("2d");

            tempImages.forEach(({ img }) => {
              // Clear canvas for each frame
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              // Draw image centered
              const x = (maxWidth - img.width) / 2;
              const y = (maxHeight - img.height) / 2;
              ctx.drawImage(img, x, y, img.width, img.height);
              gif.addFrame(canvas, { delay: frameDelay, copy: true });
            });

            gif.on("finished", (blob) => {
              console.log("GIF finished rendering!"); // Added log
              resolve(blob);
            });

            gif.on("error", (error) => {
              console.error("GIF rendering error:", error); // Added log
              reject(error);
            });

            gif.render();
            console.log("gif.render() called."); // Added log
          }
        };
        img.onerror = () => {
          console.error(
            `Failed to load image for GIF merging: ${imageData.name}`
          ); // Added log
          reject(
            new Error(`Failed to load image for GIF merging: ${imageData.name}`)
          );
        };
      });
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setError("Please add at least one image");
      return;
    }

    setConverting(true);
    setError(null);
    setDownloadUrls({}); // Always reset downloadUrls before new conversion

    try {
      if (outputFormat === "GIF" && mergeIntoOneGif && images.length > 1) {
        // Handle GIF merging
        const mergedBlob = await mergeGif(images, gifFrameDelay);
        const url = URL.createObjectURL(mergedBlob);
        setDownloadUrls({
          mergedGif: {
            url,
            filename: `merged_animation.${outputFormat.toLowerCase()}`,
            size: mergedBlob.size,
          },
        });
      } else {
        // Handle individual image conversions
        const newDownloadUrls = {};

        for (const image of images) {
          const blob = await convertImage(image, outputFormat);
          const url = URL.createObjectURL(blob);
          newDownloadUrls[image.id] = {
            url,
            filename: `${
              image.name.split(".")[0]
            }.${outputFormat.toLowerCase()}`,
            size: blob.size,
          };
        }
        setDownloadUrls(newDownloadUrls);
      }
    } catch (err) {
      setError(`Conversion failed: ${err.message}`);
    } finally {
      setConverting(false);
    }
  };

  const downloadImage = (imageId, url, filename) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = async () => {
    for (const [imageId, data] of Object.entries(downloadUrls)) {
      downloadImage(imageId, data.url, data.filename);
      // Introduce a small delay to avoid browser blocking multiple downloads too quickly
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const hasConvertedImages = Object.keys(downloadUrls).length > 0;

  return (
    <div
      style={{ background: theme.palette.background.default }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="w-full pb-4">
        <div className="">
          <div
            className="bg-white shadow-sm p-2 px-7 flex flex-col md:flex-row justify-between items-center"
            style={{
              border: `1px solid ${theme.palette.ui.borderColor}`,
            }}
          >
            <div className="flex items-center gap-4">
              <Box component={Link} href="/" sx={{ cursor: "pointer" }}>
                <ToolsHubsIcon width="147" />
              </Box>
              <h1
                className="text-3xl font-bold "
                style={{ color: theme.palette.primary.main }}
              >
                Image Format Converter
              </h1>
            </div>
            {images.length > 0 && (
              <div className="flex items-center gap-8 flex-wrap justify-center md:justify-end">
                {/* Output Format */}
                <div className="flex items-center gap-3">
                  <label
                    className="text-[20px] font-medium"
                    style={{ color: theme.palette.primary.main }}
                  >
                    Output Format
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => {
                      setOutputFormat(e.target.value);
                      setDownloadUrls({}); // Reset converted images when format changes
                      setShowDownloadNotification(false); // Hide notification as conversions are reset
                    }}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                    style={{ borderColor: theme.palette.primary.main }}
                  >
                    {SUPPORTED_FORMATS.map(
                      (
                        format // Using SUPPORTED_FORMATS directly
                      ) => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* GIF Merging Option */}
                {outputFormat === "GIF" && images.length > 1 && (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="mergeGif"
                        checked={mergeIntoOneGif}
                        onChange={(e) => {
                          setMergeIntoOneGif(e.target.checked);
                          setDownloadUrls({}); // Reset if merge option changes
                          setShowDownloadNotification(false);
                        }}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        style={{ accentColor: theme.palette.primary.main }}
                      />
                      <label
                        htmlFor="mergeGif"
                        className="text-[18px] font-medium"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Merge into one GIF
                      </label>
                    </div>
                    {mergeIntoOneGif && (
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="gifDelay"
                          className="text-[18px] font-medium"
                          style={{ color: theme.palette.primary.main }}
                        >
                          Frame Delay (ms)
                        </label>
                        <input
                          type="number"
                          id="gifDelay"
                          value={gifFrameDelay}
                          onChange={
                            (e) =>
                              setGifFrameDelay(
                                Math.max(50, parseInt(e.target.value))
                              ) // Min delay 50ms
                          }
                          min="50"
                          step="50"
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400 w-24"
                          style={{ borderColor: theme.palette.primary.main }}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Quality Preset */}
                {/* <div className="flex items-center gap-3">
                  <label className="text-[20px] font-medium text-gray-700">
                    Quality
                  </label>
                  <select
                    value={qualityPreset}
                    onChange={(e) =>
                      setQualityPreset(parseFloat(e.target.value))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  >
                    {QUALITY_PRESETS.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label} ({Math.round(preset.value * 100)}%)
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* Convert Button */}
                <button
                  onClick={handleConvert}
                  disabled={converting || images.some((img) => img.loading)}
                  style={{
                    background:
                      "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 75%, #80C0C0 100%)",
                    opacity:
                      converting || images.some((img) => img.loading) ? 0.7 : 1,
                    cursor:
                      converting || images.some((img) => img.loading)
                        ? "not-allowed"
                        : "pointer",
                  }}
                  className="text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow text-[22px]"
                >
                  {converting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Converting...
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      Convert
                      <svg
                        width="20px"
                        height="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        fill={theme.palette.primary.fourthMain}
                      >
                        <path d="M480.1 192l7.9 0c13.3 0 24-10.7 24-24l0-144c0-9.7-5.8-18.5-14.8-22.2S477.9 .2 471 7L419.3 58.8C375 22.1 318 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1C79.2 135.5 159.3 64 256 64 300.4 64 341.2 79 373.7 104.3L327 151c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 192 344 192l136.1 0zm29.4 100.5c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-44.4 0-85.2-15-117.7-40.3L185 361c6.9-6.9 8.9-17.2 5.2-26.2S177.7 320 168 320L24 320c-13.3 0-24 10.7-24 24L0 488c0 9.7 5.8 18.5 14.8 22.2S34.1 511.8 41 505l51.8-51.8C137 489.9 194 512 256 512 385 512 491.7 416.6 509.4 292.5z" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            )}
            {/* Controls */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Download All Notification */}
        {hasConvertedImages && showDownloadNotification && (
          <div
            className="mt-6 mb-8 p-4 rounded-xl flex items-center justify-between shadow-sm border relative"
            style={{
              background: theme.palette.secondary.greenSuccess,
              borderColor: theme.palette.primary.main,
            }}
          >
            <span
              style={{ color: theme.palette.primary.main }}
              className="font-semibold flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>{" "}
              {Object.keys(downloadUrls).length} image(s) ready for download
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                alignItems: "center",
              }}
            >
              {" "}
              <button
                onClick={downloadAll}
                style={{
                  background:
                    "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 75%, #80C0C0 100%)",
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                }}
                className="text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow text-[18px] cursor-pointer"
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
                </svg>{" "}
                Download All
              </button>
              <button
                onClick={() => setShowDownloadNotification(false)}
                className="p-1.5 rounded-full transition-colors cursor-pointer"
                style={{
                  backgroundColor: theme.palette.ui.delete,
                  color: theme.palette.primary.fourthMain,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {images.length === 0 ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()} // Re-added onClick handler
            style={{
              background: dragActive
                ? theme.palette.primary.lightBlue
                : theme.palette.secondMain,
              borderColor: theme.palette.primary.main,
            }}
            className="border-3 border-dashed rounded-2xl p-22 text-center transition-all cursor-pointer min-h-[300px] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div
                style={{ color: theme.palette.primary.main }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-20 h-20 mb-4"
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
              </div>
              <p className="text-[22px] font-semibold text-gray-800 py-[14px]">
                Drag & Drop or Click to Upload
              </p>
              <p className="text-[18px] text-gray-600">
                ({images.length}/10 files)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2.5 gap-6 mb-8">
              {images.map((image) => {
                let shouldShowDownloadButtonForCard = false;
                let cardStatusMessage =
                  "Ready for conversion. Click 'Convert' above to process."; // Default for all images initially
                let outputFormatDisplayDetails = null;
                let downloadUrlForThisCard = null;
                let downloadFilenameForThisCard = null;

                // --- Determine the state of the overall output and this specific image ---

                const isMergedGifModeSelected =
                  outputFormat === "GIF" && mergeIntoOneGif;
                const hasSuccessfulMergedGifOutput = !!downloadUrls.mergedGif; // Check if the mergedGif key actually exists and has a value

                const hasIndividualConversionResultForThisImage =
                  !!downloadUrls[image.id];

                // --- Apply logic based on the determined states ---

                if (isMergedGifModeSelected && hasSuccessfulMergedGifOutput) {
                  // Scenario 1: User has chosen merged GIF mode AND a merged GIF has been successfully produced.
                  // In this case, ALL images are considered part of that single output.
                  shouldShowDownloadButtonForCard = false; // No individual download for merged GIF parts
                  cardStatusMessage = "Included in combined GIF (download all)";
                  outputFormatDisplayDetails = (
                    <>
                      <ArrowRightAltIcon />
                      <p style={{ color: theme.palette.secondary.thirdMain }}>
                        Output:{" "}
                        <span
                          className="font-medium"
                          style={{ color: theme.palette.primary.main }}
                        >
                          {outputFormat},{" "}
                          {formatFileSize(downloadUrls.mergedGif.size)}
                        </span>
                      </p>
                    </>
                  );
                } else if (
                  !isMergedGifModeSelected &&
                  hasIndividualConversionResultForThisImage
                ) {
                  // Scenario 2: User has NOT chosen merged GIF mode, AND this specific image has an individual conversion result.
                  // This covers single image conversions to other formats.
                  shouldShowDownloadButtonForCard = true;
                  cardStatusMessage = "Converted successfully";
                  downloadUrlForThisCard = downloadUrls[image.id].url;
                  downloadFilenameForThisCard = downloadUrls[image.id].filename;
                  outputFormatDisplayDetails = (
                    <>
                      <ArrowRightAltIcon />
                      <p style={{ color: theme.palette.secondary.thirdMain }}>
                        Output:{" "}
                        <span
                          className="font-medium"
                          style={{ color: theme.palette.primary.main }}
                        >
                          {outputFormat},{" "}
                          {formatFileSize(downloadUrls[image.id].size)}
                        </span>
                      </p>
                    </>
                  );
                }
                // If neither of the above conditions is met (e.g., newly added images, conversion pending, or downloadUrls is truly empty),
                // the default `cardStatusMessage` ("Ready for conversion...") and `shouldShowDownloadButtonForCard = false` will apply.

                return (
                  <div
                    style={{
                      background: theme.palette.primary.fourthMain,
                      borderColor: theme.palette.primary.main,
                    }}
                    key={image.id}
                    className="rounded-xl shadow-sm relative border min-h-[300px]"
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-[-14px] right-[-14px] rounded-full p-1.5 shadow-md transition-colors z-10 cursor-pointer"
                      style={{
                        color: theme.palette.primary.fourthMain,
                        backgroundColor: theme.palette.ui.delete,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    {/* Image Preview */}
                    <div
                      style={{}}
                      className="relative h-52 flex items-center justify-center overflow-hidden px-6 pt-6 rounded"
                    >
                      {image.loading ? (
                        <svg
                          className="animate-spin h-8 w-8 text-gray-400"
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
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <Image
                          src={image.preview}
                          alt={image.name}
                          width={image.dimensions?.width || 100} // Added width prop
                          height={image.dimensions?.height || 100} // Added height prop
                          className="w-full h-full object-contain "
                          style={{
                            borderRadius: "10px",
                            backgroundColor: theme.palette.primary.thirdMain,
                          }}
                        />
                      )}
                    </div>

                    {/* Image Info */}
                    <div className="p-4 px-6">
                      <p
                        className="text-[18px] font-semibold truncate mb-2"
                        style={{ color: theme.palette.primary.main }}
                      >
                        {image.name}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center", // Align items for better display with ArrowRightAltIcon
                        }}
                        className="text-[14px] space-y-1 mb-3"
                      >
                        <p style={{ color: theme.palette.secondary.thirdMain }}>
                          Input:{" "}
                          <span
                            style={{
                              color: theme.palette.primary.main,
                            }}
                            className="font-medium"
                          >
                            {image.originalFormat}, {formatFileSize(image.size)}
                          </span>
                        </p>
                        {outputFormatDisplayDetails}
                      </div>

                      {/* Download or Status */}
                      {shouldShowDownloadButtonForCard ? (
                        <div className="space-y-2">
                          <button
                            onClick={() =>
                              downloadImage(
                                image.id,
                                downloadUrlForThisCard,
                                downloadFilenameForThisCard
                              )
                            }
                            style={{
                              background:
                                "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 75%, #80C0C0 100%)",
                            }}
                            className="w-full py-3 text-white rounded-lg font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
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
                            Download
                          </button>
                          <p
                            className="text-[14px] font-medium text-center flex items-center justify-center gap-1"
                            style={{ color: theme.palette.secondary.thirdMain }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {cardStatusMessage}
                          </p>
                        </div>
                      ) : (
                        <div
                          className="w-full py-2 rounded-lg text-sm text-center font-medium"
                          style={{
                            background:
                              "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 75%, #80C0C0 100%)",
                            color: theme.palette.primary.fourthMain,
                          }}
                        >
                          {cardStatusMessage}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add More Button */}
              {images.length < 10 && (
                <label
                  style={{
                    background: theme.palette.secondMain,
                    borderColor: theme.palette.ui.borderColor,
                  }}
                  className="rounded-xl border-3 border-dashed flex items-center justify-center cursor-pointer min-h-[300px] transition-all shadow-sm"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      className="w-12 h-12"
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
                    <p
                      className="text-[20px] font-semibold py-[14px]"
                      style={{ color: theme.palette.primary.main }}
                    >
                      Drag & Drop or Click to Upload
                    </p>
                    <p
                      className="text-[20px]"
                      style={{ color: theme.palette.primary.main }}
                    >
                      ({images.length}/10 files)
                    </p>
                  </div>
                  <input
                    ref={addMoreFileInputRef} // Assigned new ref
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* New conditional button for when notification is hidden */}
      {/* This button should appear if there's *any* converted image/gif and the notification is not showing. */}
      {Object.keys(downloadUrls).length > 0 && !showDownloadNotification && (
        <button
          onClick={downloadAll}
          className="fixed top-28 right-0 p-3 shadow-lg z-50 flex flex-col items-center gap-2 cursor-pointer w-30"
          style={{
            background: theme.palette.primary.main,
            color: theme.palette.primary.fourthMain,
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {Object.keys(downloadUrls).length > 1
            ? `Download All (${Object.keys(downloadUrls).length})`
            : "Download"}
        </button>
      )}
    </div>
  );
}
