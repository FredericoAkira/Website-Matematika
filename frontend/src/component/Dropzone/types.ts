import type { DragEventHandler, FC, ReactNode } from "react";
import type {
  Accept,
  DropEvent,
  FileError,
  FileRejection,
} from "react-dropzone";

export type DropzoneProps = FC<{
  deleteable?: boolean;
  downloadable?: boolean;
  /**
   * @description
   * Set accepted file types.
   *
   * Keep in mind that mime type determination is not reliable across platforms. CSV files, for example, are reported as `text/plain` under macOS but as
   * `application/vnd.ms-excel` under Windows. In some cases there might not be a mime type set at all.
   *
   * @see {@link https://github.com/react-dropzone/react-dropzone/issues/276} for more information about cross platform determination.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker} for more types option information.
   */
  accept?: Accept;
  /**
   * @description
   * Set to true to focus the root element on render.
   *
   * @default false
   */
  autoFocus?: boolean;
  /**
   * @description
   * Custom class name targeting the container of the dropzone.
   */
  className?: string;
  /**
   * @description
   * Your custom UI looks.
   */
  children?: ReactNode;
  /**
   * @description
   * Suppose you want to render your own custom file items (preview)
   */
  fileItems?: (
    files: File[],
    actions: {
      previewFile: (file: File) => void;
      removeFile: (file: File) => void;
    },
  ) => ReactNode;
  /**
   * @description
   * Custom helper message that renders below the dropzone container.
   *
   * When not specified, the helper message will render a message within the following format:
   * [Upload file {acceptedFileTypes}, {maximumFileSize}]
   *
   * The `acceptedFileTypes` automatically inferred based on the `accept` props you provide.
   * If you don't set the `accept` props, the value of this expression will be "of all types".
   *
   * The `maximumFileSize` determined by the `maxSize` props. The bytes size will be converted
   * automatically towards the appropriate sizing (e.g.: KB or MB).
   */
  helper?: ReactNode;
  /**
   * @description
   * Enable/disable the dropzone.
   *
   * @default false
   */
  stringUrlPreview?: string;
  openInNewTab?: boolean;
  onPreviewClick?: (stringUrl: string) => void;
  onDelete?:() => void;
  disabled?: boolean;
  /**
   * @description
   * Use this to provide a custom file aggregator.
   *
   * @param {(DragEvent | Event)} event - A drag event or input change event (if files were selected via the file dialog).
   * @returns {Promise<Array<File | DataTransferItem>>}
   */
  getFilesFromEvent?: (
    event: DropEvent,
  ) => Promise<Array<File | DataTransferItem>>;
  /**
   * @description
   * The initial files you want to supply the dropzone with.
   *
   * @note
   * Each file could contain a reserved property of `preview` which is a `base64format` (data:{mimetype};base64,{base64string}).
   * When your file does not have that property yet, or has the property set to undefined or null, the component will automatically
   * creates it under the hood.
   *
   * @see FileDecoder.toBase64 for encoding a file into a base64.
   * @see FileDecoder.fromBase64Attachment for decoding a file from base64.
   */
  initialFiles?: (File & {
    /**
     * The `Base64String` format.
     */
    preview?: string;
  })[];
  /**
   * @description
   * Maximum accepted number of files.
   *
   * The default value is 0 which means there is no limitation to how many files are accepted.
   *
   * @default 0
   */
  maxFiles?: number;
  /**
   * @description
   * Maximum file size (in bytes).
   *
   * @default Infinity
   */
  maxSize?: number;
  /**
   * @description
   * Minimum file size (in bytes).
   *
   * @default 0
   */
  minSize?: number;
  /**
   * @description
   * Allow drag 'n' drop (or selection from the file dialog) of multiple files.
   *
   * @default true
   */
  multiple?: boolean;
  /**
   * @description
   * If true, disables click to open the native file selection dialog.
   *
   * @default false
   */
  noClick?: boolean;
  /**
   * @description
   * If true, disables drag 'n' drop.
   *
   * @default false
   */
  noDrag?: boolean;
  /**
   * @description
   * If true, stops drag event propagation to parents.
   *
   * @default false
   */
  noDragEventsBubbling?: boolean;
  /**
   * @description
   * If true, disables SPACE/ENTER to open the native file selection dialog. Note that it also stops tracking the focus state.
   *
   * @default false
   */
  noKeyboard?: boolean;
  /**
   * @description
   * Cb for when the dragenter event occurs.
   *
   * @param {DragEvent} event
   */
  onDragEnter?: DragEventHandler<HTMLElement>;
  /**
   * @description
   * Cb for when the dragleave event occurs
   *
   * @param {DragEvent} event
   */
  onDragLeave?: DragEventHandler<HTMLElement>;
  /**
   * @description
   * Cb for when the dragover event occurs
   *
   * @param {DragEvent} event
   */
  onDragOver?: DragEventHandler<HTMLElement>;
  /**
   * @description
   * Cb for when the drop event occurs.
   *
   * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
   * `accept` must be a valid MIME type according to input element specification or a valid file extension.
   * If multiple is set to false and additional files are dropped, all files besides the first will be rejected.
   * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
   *
   * `onDrop` will provide you with an array of `File` objects which you can then process and send to a server.
   * For example, with `SuperAgent` as a http/ajax library:
   *
   * @note
   * - This callback is invoked after the `getFilesFromEvent` callback is done.
   * - The `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
   * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
   *
   * @example
   * function onDrop(acceptedFiles) {
   *   const req = request.post('/upload');
   *   acceptedFiles.forEach(file => {
   *     req.attach(file.name, file);
   *   });
   *   req.end(callback)
   * }
   *
   * @param {Array.<File>} acceptedFiles
   * @param {Array.<FileRejection>} fileRejections
   * @param {(DragEvent | Event)} event - A drag event or input change event (if files were selected via the file dialog)
   * @returns {void}
   */
  onDrop?: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void;
  /**
   * @description
   * Cb for when the drop event occurs. Note that if no files are accepted, this callback is not invoked.
   *
   * @param {Array.<File>} files
   * @param {(DragEvent | Event)} event
   * @returns {void}
   */
  onDropAccepted?: <T extends File>(files: T[], event: DropEvent) => void;
  /**
   * @description
   * Cb for when the drop event occurs. Note that if no files are rejected, this callback is not invoked.
   *
   * @param {Array.<FileRejection>} files
   * @param {(DragEvent | Event)} event
   * @returns {void}
   */
  onDropRejected?: (fileRejections: FileRejection[], event: DropEvent) => void;
  /**
   * @description
   * Cb for when there's some error from any of the promises.
   *
   * @param {Error} error
   * @returns {void}
   */
  onError?: (err: Error) => void;
  /**
   * Cb for when closing the file dialog with no selection
   *
   * @returns {void}
   */
  onFileDialogCancel?: () => void;
  /**
   * Cb for when opening the file dialog
   *
   * @returns {void}
   */
  onFileDialogOpen?: () => void;
  /**
   * The callback once your file has been uploaded.
   *
   * @param files
   * @returns {void}
   */
  onFileUploaded?: (files: (File & { preview?: string })[]) => void;
  /**
   * @description
   * If false, allow dropped items to take over the current browser window
   *
   * @default true
   */
  preventDropOnDocument?: boolean;
  /**
   * @description
   * Set to true to use the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
   * to open the file picker instead of using an <input type="file"> click event.
   *
   * @default true
   */
  useFsAccessApi?: boolean;
  /**
   * @description
   * Custom validation function. It must return null if there's no errors.
   *
   * @param {File} file
   * @returns {FileError | FileError[] | null}
   */
  validator?: <T extends File>(file: T) => FileError | FileError[] | null;
}>;
