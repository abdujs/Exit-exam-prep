import React from 'react';
import { Document, Page } from 'react-pdf';
import './PDFViewer.css';

function PDFViewer({ fileUrl }) {
  return (
    <div className="pdf-viewer">
      <Document file={fileUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}

export default PDFViewer;
