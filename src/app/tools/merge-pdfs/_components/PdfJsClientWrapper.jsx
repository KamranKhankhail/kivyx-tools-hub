"use client";

import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf.mjs";

const PdfJsClientWrapper = ({ children, onPdfjsLoaded }) => {
  const [isPdfjsReady, setIsPdfjsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
      setIsPdfjsReady(true);
      if (onPdfjsLoaded) {
        onPdfjsLoaded(pdfjsLib);
      }
    }
  }, [onPdfjsLoaded]);

  if (!isPdfjsReady) {
    return null;
  }

  return children;
};

export default PdfJsClientWrapper;

export const getPdfjsLib = async () => {
  if (typeof window !== "undefined") {
    GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
    return pdfjsLib;
  }
  return null;
};
