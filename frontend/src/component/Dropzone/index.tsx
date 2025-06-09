import {
  Download,
  EyeIcon,
  FileIcon,
  FileWarningIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import {
  type RefObject,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "../Button/button";
import { Dialog } from "../Dialog";
import { FileDecoder, FileDownloader, FileSizeConversions } from "../file.utils";
import { toast } from "../Toast/hooks";
import { cn } from "../utils";
import { usePDFViewer } from "./hooks";
import type { DropzoneProps } from "./types";
import { isImage, isPDF, parseErrorCode } from "./utils";
  
  type File = globalThis.File & {
    /**
     * The `Base64String` format.
     */
    preview?: string;
  };
  
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  
  export const Dropzone: DropzoneProps = ({
    children,
    helper,
    fileItems,
    initialFiles,
    onFileUploaded,
    deleteable = true,
    downloadable = false,
    onPreviewClick,
    stringUrlPreview,
    openInNewTab = false,
    onDelete,
    ...dropzoneProps
  }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [filePreview, setFilePreview] = useState<File | undefined>(undefined);
    const [openFilePreview, setOpenFilePreview] = useState<boolean>(false);
    const [showFileRejectionsInformation, setShowFileRejectionsInformation] =
      useState<boolean>(false);
  
    const {
      fileRejections,
      inputRef,
      isDragAccept,
      isDragActive,
      isDragReject,
      isFileDialogActive,
      isFocused,
      rootRef,
      getRootProps,
      getInputProps,
      open,
    } = useDropzone({
      ...dropzoneProps,
      onDropAccepted: async (acceptedFiles) => {
        /**
         * The files coming from previous (empty array initially) selected files.
         * By design, we want to add more selected files (from file browser obv)
         * towards the files stored on the state (see useState above).
         */
        const selectedFiles: File[] = [...files];
  
        /**
         * By identifying the base64 signature, we can find files that exactly the
         * same (or matches) to determine wether they are duplicated or not.
         */
        const duplicatedFiles: File[] = [];
  
        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = Object.assign<File, Partial<File>>(acceptedFiles[i], {
            preview: undefined,
          });
  
          const base64string = await FileDecoder.toBase64(acceptedFiles[i]);
          file.preview = base64string;
  
          const duplicatedEntryFound = selectedFiles.find((f) => {
            return f.preview === base64string;
          });
  
          if (duplicatedEntryFound) {
            duplicatedFiles.push(file);
          } else {
            selectedFiles.push(file);
          }
        }
  
        if (duplicatedFiles.length > 0) {
          toast({
            title: "Duplicated Entry",
            description: (
              <ul className="list-disc list-inside">
                <p>Some of these files might have been uploaded:</p>
                {duplicatedFiles.map((file, key) => (
                  <li key={key}>{file.name}</li>
                ))}
              </ul>
            ),
            icon: <FileWarningIcon className="text-warning-500" />,
            duration: 5000,
            className: "!max-w-[960px] w-full",
          });
        }
  
        setFiles(selectedFiles);
        onFileUploaded?.(selectedFiles);
      },
      onDropRejected: (fileRejections) => {
        toast({
          title: "File Rejections",
          description:
            fileRejections.length > 1
              ? "Some of the files has been rejected!"
              : "A file has been rejected!",
          icon: <XCircleIcon className="text-fail-500" />,
          duration: 5000,
          className: "!max-w-[960px] w-full",
        });
      },
    });
  
    const { numPages, onDocumentLoaded } = usePDFViewer();
  
    const acceptedFileTypes = useMemo(() => {
      const accept = dropzoneProps.accept;
      if (!accept) return "off all types";
      const extensions = Object.keys(accept)
        .flat(1)
        .map((extension) => {
          const ext = extension.split("/");
          return ext[ext.length - 1];
        })
        .map((extension) => extension.toUpperCase());
  
      return extensions.join("/");
    }, [dropzoneProps.accept]);
  
    const maximumFileSize = useMemo(() => {
      const maxSize = dropzoneProps.maxSize;
      if (maxSize === Infinity || !maxSize) return "without maximal size.";
      return `Maximum ${FileSizeConversions.convert(maxSize as number)}.`;
    }, [dropzoneProps.maxSize]);
  
    const setInitialFiles = useCallback(async (files: File[]) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.preview) file.preview = await FileDecoder.toBase64(file);
      }
  
      setFiles(files);
    }, []);
  
    function previewFile(file: File) {
      if (openInNewTab) {
        const blob = new Blob([file], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } else {
        setFilePreview(file);
        setOpenFilePreview(true);
      }
    }
  
    function closePreviewFile() {
      setFilePreview(undefined);
      setOpenFilePreview(false);
    }
  
    const downloadFile = async (file: File) => {
      FileDownloader.fromFileObject(file);
    };
  
    function removeFile(file: File) {
      const selectedFiles = [...files.filter((f) => f.preview !== file.preview)];
      setFiles(selectedFiles);
      onFileUploaded?.(selectedFiles);
    }
  
    const FileHelper = () => {
      return (
        <p className="text-xxs text-neutral-secondary -mt-3">
          {helper !== undefined ? (
            helper
          ) : (
            <span className="text-[12px]">
              Upload file {acceptedFileTypes}, {maximumFileSize}
            </span>
          )}
        </p>
      );
    };
  
    const FileItems = () => {
      return (
        files.length > 0 && (
          <div className="flex flex-col gap-2">
            {fileItems ? (
              fileItems(files, { previewFile, removeFile })
            ) : (
              <ul className="flex flex-col border rounded bg-neutral-bg border-neutral-outline">
                {files.map((file) => (
                  <li
                    key={file.name}
                    className="flex items-center justify-between border-b border-neutral-divider last:border-b-0"
                  >
                    <div className="flex items-center gap-2 pl-4">
                      {isImage(file) ? (
                        <img
                          className="object-cover w-6 h-6 rounded"
                          src={file.preview}
                          onLoad={() =>
                            URL.revokeObjectURL(file.preview as string)
                          }
                        />
                      ) : (
                        <FileIcon className="w-6 h-6 text-neutral-tertiary" />
                      )}
                      <p
                        className={cn(
                          "text-xs line-clamp-1",
                          dropzoneProps.disabled && "text-neutral-tertiary",
                        )}
                      >
                        {file.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-0">
                      {(isImage(file) || isPDF(file)) && (
                        <button
                          className={cn(
                            "p-4 transition ease-out duration-200",
                            "border border-transparent focus-visible:outline-none",
                            "focus-visible:ring-2 focus-visible:border-primary-500 focus-visible:ring-primary-100",
                          )}
                          type="button"
                          onClick={() => {
                            if (onPreviewClick && stringUrlPreview) {
                              onPreviewClick(stringUrlPreview);
                            } else {
                              previewFile(file);
                            }
                          }}
                        >
                          <EyeIcon className="text-fail-500 -mr-4" />
                        </button>
                      )}
                      {deleteable && (
                        <button
                          className={cn(
                            "p-4 transition ease-out duration-200",
                            "border border-transparent focus-visible:outline-none",
                            "focus-visible:ring-2 focus-visible:border-primary-500 focus-visible:ring-primary-100",
                            dropzoneProps.disabled && "cursor-not-allowed",
                          )}
                          disabled={dropzoneProps.disabled}
                          type="button"
                          onClick={() => {
                            onDelete?.()
                            removeFile(file)
                          }}
                        >
                          <Trash2Icon
                            className={`${
                              dropzoneProps.disabled
                                ? "text-neutral-tertiary"
                                : "text-fail-500"
                            }`}
                          />
                        </button>
                      )}
  
                      {downloadable && (
                        <button
                          className={cn(
                            "p-4",
                            "border border-transparent focus-visible:outline-none",
                            "focus-visible:ring-2 focus-visible:text-neutral-tertiary focus-visible:ring-primary-100",
                          )}
                          type="button"
                          onMouseDown={() => {
                            downloadFile(file);
                          }}
                        >
                          <Download className="text-neutral-tertiary" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {dropzoneProps.multiple !== false && (
              <Button
                className="self-start"
                disabled={dropzoneProps.disabled}
                trailingIcon={PlusIcon}
                type="button"
                onClick={open}
              >
                Add more
              </Button>
            )}
          </div>
        )
      );
    };
  
    const FilePreview = () => {
      return (
        filePreview && (
          <Dialog
            open={openFilePreview}
            onOpenChange={closePreviewFile}
          >
            <Dialog.Content
              className="bg-transparent shadow-none max-w-none"
              scrollable
            >
              <Dialog.Close className="absolute right-4 top-4">
                <XCircleIcon
                  className="h-8 w-8"
                  color="#000000"
                />
              </Dialog.Close>
              {isImage(filePreview) ? (
                <img
                  alt={"Preview"}
                  className="object-contain w-full h-auto"
                  src={filePreview.preview as string}
                />
              ) : (
                <Document
                  className={"w-full relative"}
                  file={filePreview.preview}
                  loading={<Loader2Icon className="animate-spin" />}
                  onLoadSuccess={onDocumentLoaded}
                >
                  {Array.from(new Array(numPages), (_, index) => (
                    <Fragment key={`page_${index + 1}`}>
                      <Page
                        className={
                          "absolute left-1/2 -translate-x-1/2 border-b border-neutral-divider"
                        }
                        loading={null}
                        pageNumber={index + 1}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    </Fragment>
                  ))}
                </Document>
              )}
            </Dialog.Content>
          </Dialog>
        )
      );
    };
  
    const FileRejections = () => {
      return (
        showFileRejectionsInformation && (
          <div className="relative py-2 text-xs border-dashed text-fail-500 border-y border-fail-500">
            <button
              className="absolute right-0 underline top-2 text-fail-500"
              onClick={() => setShowFileRejectionsInformation(false)}
            >
              Close information
            </button>
            <p className="mb-2 font-bold">Rejected files information:</p>
            <ul className="flex flex-col gap-1">
              {fileRejections.map(({ file, errors }) => (
                <li key={file.name}>
                  <strong>{file.name}</strong>
                  <ul className="list-disc list-inside">
                    {errors.map((e) => (
                      <li key={e.code}>{parseErrorCode(e.code)}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )
      );
    };
  
    useEffect(() => {
      setShowFileRejectionsInformation(fileRejections.length > 0);
    }, [fileRejections]);
  
    useEffect(() => {
      setInitialFiles(initialFiles || []);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialFiles]);
  
    return (
      <section className="flex flex-col gap-2">
        <div
          ref={rootRef as RefObject<HTMLDivElement>}
          {...getRootProps({
            className: cn(
              files.length > 0 && "!hidden",
              "w-full flex flex-col items-center gap-1 outline-none",
              "rounded bg-white border border-dashed border-neutral-outline px-5 py-8",
              "transition ease-out duration-200",
              isDragActive && "ring-2 border-solid",
              isDragAccept && "ring-primary-100 border-primary-500",
              isDragReject && "ring-fail-100 border-fail-500",
              (isFocused || isFileDialogActive) &&
                "ring-2 ring-primary-100 border-primary-500",
              dropzoneProps.disabled
                ? "cursor-not-allowed bg-neutral-bg border-solid"
                : "cursor-pointer",
              dropzoneProps.className,
            ),
          })}
        >
          <input
            ref={inputRef}
            {...getInputProps()}
          />
          {children || (
            <Fragment>
              <FileIcon className="w-12 h-12 text-neutral-tertiary" />
              <span className="text-sm text-neutral-tertiary">
                <em className="italic underline">Click to upload</em>, or drag and
                drop. <br />
                {isDragReject && (
                  <Fragment>
                    <strong>Warning: </strong> Some files will be rejected!
                  </Fragment>
                )}
              </span>
            </Fragment>
          )}
        </div>
        <FileItems />
        <FileRejections />
        <FileHelper />
        <FilePreview />
      </section>
    );
  };
