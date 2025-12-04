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

const COMPRESSION_FORMATS = ["JPEG", "WebP", "PNG"]; // Common formats for compression
const QUALITY_PRESETS = [
  { label: "High", value: 0.9 },
  { label: "Medium", value: 0.7 },
  { label: "Low", value: 0.5 },
];

export default function ImageCompressorClient() {
  const [images, setImages] = useState([]); // Stores original image files and previews
  const [outputFormat, setOutputFormat] = useState("JPEG"); // Default output format for compression
  const [compressionQuality, setCompressionQuality] = useState(0.7); // Default compression quality
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState(null);
  const [compressedImages, setCompressedImages] = useState({}); // Stores compressed image data
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const addMoreFileInputRef = useRef(null);
  const [showDownloadNotification, setShowDownloadNotification] =
    useState(false);

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
          setError(`"${file.name}" is not a valid image file.`);
        }
        return isImage;
      });

      if (validFiles.length === 0) return;

      const newImages = await Promise.all(
        validFiles.slice(0, 10 - images.length).map(async (file) => {
          const preview = URL.createObjectURL(file);
          return new Promise((resolve) => {
            const imgElement = document.createElement("img");
            imgElement.onload = () => {
              resolve({
                id: Date.now() + Math.random(),
                file,
                name: file.name,
                preview,
                originalFormat: file.type.split("/")[1].toUpperCase(),
                originalSize: file.size,
                dimensions: {
                  width: imgElement.width,
                  height: imgElement.height,
                },
                compressed: null, // To store compressed data (url, size)
              });
            };
            imgElement.onerror = () => {
              resolve({
                id: Date.now() + Math.random(),
                file,
                name: file.name,
                preview,
                originalFormat: file.type.split("/")[1].toUpperCase(),
                originalSize: file.size,
                dimensions: null,
                compressed: null,
              });
            };
            imgElement.src = preview;
          });
        })
      );

      setImages((prev) => [...prev, ...newImages]);
      setError(null);
      setCompressedImages({}); // Reset compressed results when new images are added
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
    setCompressedImages((prev) => {
      const newCompressed = { ...prev };
      delete newCompressed[id];
      return newCompressed;
    });
  };

  const compressImage = async (imageData, targetFormat, quality) => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, img.width, img.height);

          const mimeType = `image/${targetFormat.toLowerCase()}`;
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error(`Failed to compress to ${targetFormat}`));
              }
            },
            mimeType,
            targetFormat === "PNG" ? 1 : quality // PNG quality is 0-1, 1 is no compression, jpeg/webp use 0-1 for actual quality
          );
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () =>
        reject(new Error("Failed to load image for compression"));
      img.src = URL.createObjectURL(imageData.file);
    });
  };

  const handleCompress = async () => {
    if (images.length === 0) {
      setError("Please add at least one image to compress.");
      return;
    }

    setCompressing(true);
    setError(null);
    setCompressedImages({}); // Reset previous compressed results

    try {
      const newCompressedImages = {};
      for (const image of images) {
        const compressedBlob = await compressImage(
          image,
          outputFormat,
          compressionQuality
        );
        const compressedUrl = URL.createObjectURL(compressedBlob);
        newCompressedImages[image.id] = {
          url: compressedUrl,
          filename: `${image.name.split(".")[0]}.${outputFormat.toLowerCase()}`,
          size: compressedBlob.size,
          originalSize: image.originalSize,
        };
      }
      setCompressedImages(newCompressedImages);
      setShowDownloadNotification(true);
    } catch (err) {
      setError(`Compression failed: ${err.message}`);
    } finally {
      setCompressing(false);
    }
  };

  const downloadImage = (url, filename) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = async () => {
    for (const [imageId, data] of Object.entries(compressedImages)) {
      downloadImage(data.url, data.filename);
      await new Promise((resolve) => setTimeout(resolve, 200)); // Small delay
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const hasCompressedImages = Object.keys(compressedImages).length > 0;

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
                Image Compressor
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
                      setCompressedImages({});
                      setShowDownloadNotification(false);
                    }}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                    style={{ borderColor: theme.palette.primary.main }}
                  >
                    {COMPRESSION_FORMATS.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Compression Quality */}
                {outputFormat !== "PNG" && ( // PNG typically doesn't use a 'quality' setting for toBlob
                  <div className="flex items-center gap-3">
                    <label
                      className="text-[20px] font-medium"
                      style={{ color: theme.palette.primary.main }}
                    >
                      Quality
                    </label>
                    <select
                      value={compressionQuality}
                      onChange={(e) =>
                        setCompressionQuality(parseFloat(e.target.value))
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                      style={{ borderColor: theme.palette.primary.main }}
                    >
                      {QUALITY_PRESETS.map((preset) => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label} ({Math.round(preset.value * 100)}%)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Compress Button */}
                <button
                  onClick={handleCompress}
                  disabled={compressing}
                  style={{
                    background:
                      "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 75%, #80C0C0 100%)",
                    opacity: compressing ? 0.7 : 1,
                    cursor: compressing ? "not-allowed" : "pointer",
                  }}
                  className="text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow text-[22px]"
                >
                  {compressing ? (
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
                      Compressing...
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
                      Compress
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Download All Notification */}
        {hasCompressedImages &&
          showDownloadNotification &&
          Object.keys(compressedImages).length > 1 && (
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
                {Object.keys(compressedImages).length} image(s) compressed and
                ready for download
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
            onClick={() => fileInputRef.current.click()}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
              {images.map((image) => {
                const compressed = compressedImages[image.id];
                const compressionSavings = compressed
                  ? (
                      ((image.originalSize - compressed.size) /
                        image.originalSize) *
                      100
                    ).toFixed(1)
                  : "0";

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

                    {/* Image Previews */}
                    <div className="flex justify-around items-center gap-4 px-6 pt-6 pb-2 rounded">
                      {/* Original Image */}
                      <div className="text-center">
                        <p
                          className="text-[14px] font-medium mb-2"
                          style={{ color: theme.palette.primary.main }}
                        >
                          Original
                        </p>
                        <div
                          style={{
                            backgroundColor: theme.palette.primary.thirdMain,
                            border: `1px solid ${theme.palette.ui.borderColor}`,
                          }}
                          className="relative h-32 w-32 flex items-center justify-center overflow-hidden rounded-lg"
                        >
                          <Image
                            src={image.preview}
                            alt={image.name}
                            width={image.dimensions?.width || 100}
                            height={image.dimensions?.height || 100}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p
                          className="text-[12px] text-gray-600 mt-1"
                          style={{ color: theme.palette.secondary.thirdMain }}
                        >
                          {formatFileSize(image.originalSize)}
                        </p>
                      </div>

                      <ArrowRightAltIcon
                        sx={{ color: theme.palette.primary.main }}
                      />

                      {/* Compressed Image */}
                      <div className="text-center">
                        <p
                          className="text-[14px] font-medium mb-2"
                          style={{ color: theme.palette.primary.main }}
                        >
                          Compressed
                        </p>
                        <div
                          style={{
                            backgroundColor: theme.palette.primary.thirdMain,
                            border: `1px solid ${theme.palette.ui.borderColor}`,
                          }}
                          className="relative h-32 w-32 flex items-center justify-center overflow-hidden rounded-lg"
                        >
                          {compressed ? (
                            <Image
                              src={compressed.url}
                              alt={`Compressed ${image.name}`}
                              width={image.dimensions?.width || 100}
                              height={image.dimensions?.height || 100}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span
                              className="text-gray-400 text-xs"
                              style={{
                                color: theme.palette.secondary.thirdMain,
                              }}
                            >
                              Not Compressed
                            </span>
                          )}
                        </div>
                        {compressed && (
                          <p
                            className="text-[12px] text-green-600 font-semibold mt-1"
                            style={{ color: theme.palette.primary.main }}
                          >
                            {formatFileSize(compressed.size)} (
                            {compressionSavings}%)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Image Info & Download Button */}
                    <div className="p-4 px-6">
                      <p
                        className="text-[18px] font-semibold truncate mb-2"
                        style={{ color: theme.palette.primary.main }}
                      >
                        {image.name}
                      </p>
                      <div className="text-[14px] space-y-1 mb-3">
                        <p style={{ color: theme.palette.secondary.thirdMain }}>
                          Dimensions: {image.dimensions?.width}×
                          {image.dimensions?.height}px
                        </p>
                      </div>

                      {/* Download or Status */}
                      {compressed ? (
                        <div className="space-y-2">
                          <button
                            onClick={() =>
                              downloadImage(compressed.url, compressed.filename)
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
                            Download Compressed
                          </button>
                        </div>
                      ) : (
                        <div
                          className="w-full py-3 rounded-lg text-sm text-center font-medium"
                          style={{
                            background:
                              "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 75%, #80C0C0 100%)",
                            color: theme.palette.primary.fourthMain,
                          }}
                        >
                          Ready to Compress
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
                    ref={addMoreFileInputRef}
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
      {Object.keys(compressedImages).length > 0 &&
        !showDownloadNotification && (
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
            {Object.keys(compressedImages).length > 1
              ? `Download All (${Object.keys(compressedImages).length})`
              : "Download"}
          </button>
        )}
    </div>
  );
}
