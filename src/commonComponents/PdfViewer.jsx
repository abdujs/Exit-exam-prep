import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

// Import pdfjs from pdfjs-dist
import * as pdfjs from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry'; // Import the worker entry

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFViewer({ fileUrl }) {
  return (
    <div style={{ height: '600px', border: '1px solid #ccc' }}>
      <Worker>
        <Viewer fileUrl={fileUrl} />
      </Worker>
    </div>
  );
}

export default PDFViewer;
