import { useState } from "react";
import { type DocumentProps } from "react-pdf";

export const usePDFViewer = () => {
  const [numPages, setNumPages] = useState<number>(0);

  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoaded: DocumentProps["onLoadSuccess"] = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return {
    numPages,
    pageNumber,
    onDocumentLoaded,
    previousPage,
    nextPage,
  };
};
