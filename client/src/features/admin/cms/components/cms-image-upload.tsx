import { useRef, useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, X, RefreshCw, Image, Library, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaPickerDialog } from "./media-picker-dialog";
import type { CmsMediaAsset, CmsMediaLibraryAsset } from "@shared/schema";
import { handleCmsPreviewImageError } from "../builder/block-renderer.shared";
import { onActivateKey } from "@/lib/a11y";

const IMAGE_ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const IMAGE_ACCEPTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
const MEDIA_ACCEPTED_TYPES = [
  ...IMAGE_ACCEPTED_TYPES,
  "application/pdf",
  "application/msword",
  "application/vnd.ms-word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/csv",
  "text/plain",
  "application/rtf",
  "text/rtf",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.presentation",
];
const MEDIA_ACCEPTED_EXTENSIONS = [
  ...IMAGE_ACCEPTED_EXTENSIONS,
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".csv",
  ".txt",
  ".rtf",
  ".odt",
  ".ods",
  ".odp",
];
const MAX_BYTES = 10 * 1024 * 1024;

function inferAssetKind(mimeType?: string | null): "image" | "document" {
  return mimeType?.startsWith("image/") ? "image" : "document";
}

function inferAssetKindFromValue(value: string): "image" | "document" {
  return /\.(png|jpe?g|webp|gif|svg)(?:\?.*)?$/i.test(value) ? "image" : "document";
}

function isAcceptedFile(file: File, acceptedMode: "images" | "all") {
  const extensionIndex = file.name.lastIndexOf(".");
  const extension = extensionIndex >= 0 ? file.name.slice(extensionIndex).toLowerCase() : "";
  const acceptedTypes = acceptedMode === "all" ? MEDIA_ACCEPTED_TYPES : IMAGE_ACCEPTED_TYPES;
  const acceptedExtensions =
    acceptedMode === "all" ? MEDIA_ACCEPTED_EXTENSIONS : IMAGE_ACCEPTED_EXTENSIONS;
  return acceptedTypes.includes(file.type) || acceptedExtensions.includes(extension);
}

export interface CmsImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helpText?: string;
  className?: string;
  acceptedMode?: "images" | "all";
  "data-testid"?: string;
}

const ACCEPT_ATTRIBUTE = {
  all: [
    ...MEDIA_ACCEPTED_TYPES,
    ...MEDIA_ACCEPTED_EXTENSIONS.filter((ext) => !IMAGE_ACCEPTED_EXTENSIONS.includes(ext)),
  ].join(","),
  images: IMAGE_ACCEPTED_TYPES.join(","),
};

const MODE_COPY = {
  all: {
    invalidType:
      "Accepted file types: images, PDF, Word, Excel, PowerPoint, CSV, TXT, RTF, and OpenDocument files",
    uploaded: "File uploaded successfully",
    noun: "file",
    formats: "Images, PDF, Word, Excel, PowerPoint, CSV, TXT, RTF, OpenDocument · Max 10 MB",
  },
  images: {
    invalidType: "Only PNG, JPEG, WebP, and GIF files are accepted",
    uploaded: "Image uploaded successfully",
    noun: "image",
    formats: "PNG, JPG, WebP, GIF · Max 10 MB",
  },
};

function uploadTestId(testId: string | undefined, suffix: string) {
  return testId ? `${testId}-${suffix}` : `cms-image-${suffix}`;
}

function parseUploadError(xhr: XMLHttpRequest) {
  try {
    const err = JSON.parse(xhr.responseText);
    return new Error(err.error || "Upload failed");
  } catch {
    return new Error(`Upload failed (${xhr.status})`);
  }
}

function toLibraryAsset(asset: CmsMediaAsset): CmsMediaLibraryAsset {
  return {
    ...asset,
    assetKind: inferAssetKind(asset.mimeType),
    usageRefs: [],
    usageCount: 0,
    liveUsageCount: 0,
    isInUse: false,
    isManaged: true,
    sourceLabel: "Managed upload",
  };
}

function validateUploadFile(file: File, acceptedMode: "images" | "all") {
  if (!isAcceptedFile(file, acceptedMode)) {
    throw new Error(MODE_COPY[acceptedMode].invalidType);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(
      `File must be under 10 MB (this file is ${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
    );
  }
}

function uploadMediaFile(file: File, onProgress: (percent: number) => void) {
  const fd = new FormData();
  fd.append("file", file);

  return new Promise<CmsMediaLibraryAsset>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/cms/upload");
    xhr.withCredentials = true;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 90));
      }
    };

    xhr.onload = () => {
      onProgress(100);
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(parseUploadError(xhr));
        return;
      }
      try {
        resolve(toLibraryAsset(JSON.parse(xhr.responseText) as CmsMediaAsset));
      } catch {
        reject(new Error("Invalid server response"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(fd);
  });
}

function UploadedMediaPreview({
  value,
  selectedAsset,
  testId,
  onReplace,
  onOpenLibrary,
  onRemove,
}: {
  value: string;
  selectedAsset: CmsMediaLibraryAsset | null;
  testId?: string;
  onReplace: () => void;
  onOpenLibrary: () => void;
  onRemove: () => void;
}) {
  const assetKind =
    selectedAsset?.url === value ? selectedAsset.assetKind : inferAssetKindFromValue(value);
  return (
    <div className="relative group rounded-lg border bg-muted/20 overflow-hidden">
      {assetKind === "image" ? (
        <img
          src={value}
          alt="Preview"
          className="w-full object-cover max-h-48 rounded-lg"
          onError={handleCmsPreviewImageError}
          data-testid={uploadTestId(testId, "preview")}
        />
      ) : (
        <div className="flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-lg bg-muted/40 p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-sm">
            <FileText className="h-7 w-7 text-violet-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {selectedAsset?.originalName || "Uploaded document"}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedAsset?.mimeType || "Document file"}
            </p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg" />
      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-7 px-2 text-xs gap-1 shadow"
          onClick={onReplace}
          data-testid={uploadTestId(testId, "replace")}
        >
          <RefreshCw className="h-3 w-3" />
          Replace
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-7 px-2 text-xs gap-1 shadow"
          onClick={onOpenLibrary}
          data-testid={uploadTestId(testId, "library")}
        >
          <Library className="h-3 w-3" />
          Library
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          aria-label="Remove"
          className="h-7 w-7 p-0 shadow"
          onClick={onRemove}
          data-testid={uploadTestId(testId, "remove")}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function UploadDropzone({
  acceptedMode,
  isDragging,
  isUploading,
  uploadProgress,
  testId,
  onBrowse,
  onOpenLibrary,
  onDragStateChange,
  onFile,
}: {
  acceptedMode: "images" | "all";
  isDragging: boolean;
  isUploading: boolean;
  uploadProgress: number;
  testId?: string;
  onBrowse: () => void;
  onOpenLibrary: () => void;
  onDragStateChange: (dragging: boolean) => void;
  onFile: (file: File | undefined) => void;
}) {
  const copy = MODE_COPY[acceptedMode];
  const browse = () => {
    if (!isUploading) onBrowse();
  };
  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer",
        isDragging
          ? "border-violet-400 bg-violet-50 dark:bg-violet-950/20"
          : "border-muted-foreground/25 hover:border-violet-300 bg-muted/10 hover:bg-muted/20",
      )}
      onDrop={(e) => {
        e.preventDefault();
        onDragStateChange(false);
        onFile(e.dataTransfer.files[0]);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragStateChange(true);
      }}
      onDragLeave={() => onDragStateChange(false)}
      onClick={browse}
      onKeyDown={onActivateKey(browse)}
      role="button"
      tabIndex={0}
      aria-label="Upload image"
      aria-disabled={isUploading}
      data-testid={uploadTestId(testId, "dropzone")}
    >
      {isUploading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8 px-4">
          <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
            <UploadCloud className="h-5 w-5 text-violet-500 animate-bounce" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Uploading…</p>
          <Progress value={uploadProgress} className="w-full max-w-[200px] h-1.5" />
          <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-7 px-4 text-center select-none">
          <div className="h-11 w-11 rounded-full bg-muted/60 flex items-center justify-center mb-1">
            <Image className="h-5 w-5 text-muted-foreground/60" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/80">
              Drop {copy.noun} here or{" "}
              <span className="text-violet-500 hover:text-violet-600 underline underline-offset-2">
                browse
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{copy.formats}</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="mt-1 h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLibrary();
            }}
            data-testid={uploadTestId(testId, "pick-library")}
          >
            <Library className="h-3.5 w-3.5" />
            Pick from library
          </Button>
        </div>
      )}
    </div>
  );
}

export function CmsImageUpload({
  value,
  onChange,
  label,
  helpText,
  className,
  acceptedMode = "images",
  "data-testid": testId,
}: CmsImageUploadProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CmsMediaLibraryAsset | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      validateUploadFile(file, acceptedMode);
      return uploadMediaFile(file, setUploadProgress);
    },
    onSuccess: (asset) => {
      onChange(asset.url);
      setSelectedAsset(asset);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/media"] });
      toast({ title: MODE_COPY[acceptedMode].uploaded });
      setTimeout(() => setUploadProgress(0), 800);
    },
    onError: (err: Error) => {
      setUploadProgress(0);
      toast({ title: err.message, variant: "destructive" });
    },
  });

  const handleFile = useCallback(
    (file: File | undefined | null) => {
      if (file) uploadMutation.mutate(file);
    },
    [uploadMutation],
  );
  const openFileBrowser = () => fileInputRef.current?.click();

  return (
    <div className={cn("space-y-1.5", className)} data-testid={testId}>
      {label && <p className="text-sm font-medium leading-none">{label}</p>}

      {value ? (
        <UploadedMediaPreview
          value={value}
          selectedAsset={selectedAsset}
          testId={testId}
          onReplace={openFileBrowser}
          onOpenLibrary={() => setPickerOpen(true)}
          onRemove={() => onChange("")}
        />
      ) : (
        <UploadDropzone
          acceptedMode={acceptedMode}
          isDragging={isDragging}
          isUploading={uploadMutation.isPending}
          uploadProgress={uploadProgress}
          testId={testId}
          onBrowse={openFileBrowser}
          onOpenLibrary={() => setPickerOpen(true)}
          onDragStateChange={setIsDragging}
          onFile={handleFile}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE[acceptedMode]}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
        data-testid={uploadTestId(testId, "file-input")}
      />

      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        typeFilter={acceptedMode}
        onSelect={(url, asset) => {
          setSelectedAsset(asset);
          onChange(url);
        }}
      />
    </div>
  );
}
