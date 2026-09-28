import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { AdminSidebar } from "@/features/admin/admin-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Image,
  Search,
  Trash2,
  Copy,
  Upload,
  Save,
  Crop,
  Loader2,
  FileText,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { CmsImageUpload } from "./components/cms-image-upload";
import type { CmsMediaLibraryAsset } from "@shared/schema";
import { handleCmsPreviewImageError } from "./builder/block-renderer.shared";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiRequest } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { ImageCropperSheet } from "@/components/shared/image-cropper-sheet";
import { withContentKeys } from "@/lib/content-keys";

type MediaMetadataForm = {
  originalName: string;
  title: string;
  alt: string;
  caption: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
};

function buildMetadataForm(asset: CmsMediaLibraryAsset | null): MediaMetadataForm {
  return {
    originalName: asset?.originalName ?? "",
    title: asset?.title ?? "",
    alt: asset?.alt ?? "",
    caption: asset?.caption ?? "",
    description: asset?.description ?? "",
    seoTitle: asset?.seoTitle ?? "",
    seoDescription: asset?.seoDescription ?? "",
    ogTitle: asset?.ogTitle ?? "",
    ogDescription: asset?.ogDescription ?? "",
  };
}

function DeleteMediaDialog({ deletingId, setDeletingId, deleteMutation }: {
  deletingId: string | null;
  setDeletingId: React.Dispatch<React.SetStateAction<string | null>>;
  deleteMutation: UseMutationResult<void, Error, string, unknown>;
}) {
  return (
    <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this media item?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the file from your media library and from Cloudflare R2.
            Any pages, posts, events, or blocks that reference this URL will show a broken file
            link or missing image.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deletingId && deleteMutation.mutate(deletingId)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-testid="button-confirm-delete"
          >
            Delete File
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function MediaAssetActions({
  prepareCropper,
  selectedAsset,
  isPreparingCrop,
  isReplaceImagePending,
  copyUrl,
  metadataMutation,
  metadataForm,
  hasMetadataChanges,
  setDeletingId,
}: {
  prepareCropper: () => Promise<void>;
  selectedAsset: CmsMediaLibraryAsset;
  isPreparingCrop: boolean;
  isReplaceImagePending: boolean;
  copyUrl: (url: string) => void;
  metadataMutation: UseMutationResult<Partial<CmsMediaLibraryAsset>, Error, { id: string; data: MediaMetadataForm; }, unknown>;
  metadataForm: MediaMetadataForm;
  hasMetadataChanges: boolean;
  setDeletingId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <div className="flex justify-between items-center pt-1 gap-2 flex-wrap">
      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={prepareCropper}
          disabled={
            selectedAsset.assetKind !== "image" ||
            selectedAsset.isManaged === false ||
            isPreparingCrop ||
            isReplaceImagePending
          }
          data-testid="button-crop-image"
        >
          {isPreparingCrop ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Crop className="h-3.5 w-3.5" />
          )}
          {isPreparingCrop ? "Preparing..." : "Crop Image"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => copyUrl(selectedAsset.url)}
          data-testid="button-copy-url-main"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy URL
        </Button>
        <Button
          type="button"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            metadataMutation.mutate({ id: selectedAsset.id, data: metadataForm })
          }
          disabled={
            !hasMetadataChanges ||
            selectedAsset.isManaged === false ||
            metadataMutation.isPending ||
            isReplaceImagePending
          }
          data-testid="button-save-media-details"
        >
          <Save className="h-3.5 w-3.5" />
          {metadataMutation.isPending ? "Saving..." : "Save Details"}
        </Button>
      </div>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="gap-1.5"
        onClick={() => setDeletingId(selectedAsset.id)}
        disabled={selectedAsset.isManaged === false || isReplaceImagePending}
        data-testid="button-delete-asset"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </Button>
    </div>
  );
}

function MediaSeoMetadataFields({ metadataForm, updateMetadataField, selectedAsset }: {
  metadataForm: MediaMetadataForm;
  updateMetadataField: (key: keyof MediaMetadataForm, value: string) => void;
  selectedAsset: CmsMediaLibraryAsset;
}) {
  return (
    <div className="rounded-xl border p-4 space-y-4 bg-muted/10">
      <div>
        <h3 className="text-sm font-semibold">SEO & Social Metadata</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Use these fields when an image needs its own editorial metadata for search
          previews or social sharing workflows.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="media-seo-title">SEO Title</Label>
          <Input
            id="media-seo-title"
            value={metadataForm.seoTitle}
            onChange={(e) => updateMetadataField("seoTitle", e.target.value)}
            placeholder="Search-friendly image title"
            disabled={selectedAsset.isManaged === false}
            data-testid="input-media-seo-title"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="media-og-title">Open Graph Title</Label>
          <Input
            id="media-og-title"
            value={metadataForm.ogTitle}
            onChange={(e) => updateMetadataField("ogTitle", e.target.value)}
            placeholder="Social sharing title"
            disabled={selectedAsset.isManaged === false}
            data-testid="input-media-og-title"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="media-seo-description">SEO Description</Label>
          <Textarea
            id="media-seo-description"
            value={metadataForm.seoDescription}
            onChange={(e) => updateMetadataField("seoDescription", e.target.value)}
            placeholder="Short metadata description for search contexts"
            rows={3}
            disabled={selectedAsset.isManaged === false}
            data-testid="textarea-media-seo-description"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="media-og-description">Open Graph Description</Label>
          <Textarea
            id="media-og-description"
            value={metadataForm.ogDescription}
            onChange={(e) => updateMetadataField("ogDescription", e.target.value)}
            placeholder="Short description for social previews"
            rows={3}
            disabled={selectedAsset.isManaged === false}
            data-testid="textarea-media-og-description"
          />
        </div>
      </div>
    </div>
  );
}

function MediaFileDetailsFields({ metadataForm, updateMetadataField, selectedAsset }: {
  metadataForm: MediaMetadataForm;
  updateMetadataField: (key: keyof MediaMetadataForm, value: string) => void;
  selectedAsset: CmsMediaLibraryAsset;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="media-original-name">File Name</Label>
        <Input
          id="media-original-name"
          value={metadataForm.originalName}
          onChange={(e) => updateMetadataField("originalName", e.target.value)}
          placeholder="hero-image.webp"
          disabled={selectedAsset.isManaged === false}
          data-testid="input-media-original-name"
        />
        <p className="text-xs text-muted-foreground">
          Updates the library label without changing the current file URL.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="media-title">Title</Label>
        <Input
          id="media-title"
          value={metadataForm.title}
          onChange={(e) => updateMetadataField("title", e.target.value)}
          placeholder="Human-friendly media title"
          disabled={selectedAsset.isManaged === false}
          data-testid="input-media-title"
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="media-alt">Alt Text</Label>
        <Input
          id="media-alt"
          value={metadataForm.alt}
          onChange={(e) => updateMetadataField("alt", e.target.value)}
          placeholder="Describe the image for accessibility and SEO"
          disabled={selectedAsset.isManaged === false}
          data-testid="input-media-alt"
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="media-caption">Caption</Label>
        <Textarea
          id="media-caption"
          value={metadataForm.caption}
          onChange={(e) => updateMetadataField("caption", e.target.value)}
          placeholder="Optional caption shown alongside the image"
          rows={2}
          disabled={selectedAsset.isManaged === false}
          data-testid="textarea-media-caption"
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="media-description">Description</Label>
        <Textarea
          id="media-description"
          value={metadataForm.description}
          onChange={(e) => updateMetadataField("description", e.target.value)}
          placeholder="Internal notes or fuller editorial context"
          rows={3}
          disabled={selectedAsset.isManaged === false}
          data-testid="textarea-media-description"
        />
      </div>
    </div>
  );
}

function MediaUsageSummary({ selectedAsset }: {
  selectedAsset: CmsMediaLibraryAsset;
}) {
  return (
    <div className="rounded-xl border p-4 space-y-3 bg-muted/10">
      <div className="flex flex-wrap items-center gap-2">
        {selectedAsset.isInUse ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            In use on the live site
          </span>
        ) : selectedAsset.usageCount > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            <Circle className="h-3.5 w-3.5" />
            Used only in draft or private content
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Circle className="h-3.5 w-3.5" />
            Not referenced anywhere
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {selectedAsset.liveUsageCount} live use
          {selectedAsset.liveUsageCount !== 1 ? "s" : ""}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {selectedAsset.usageCount} total reference
          {selectedAsset.usageCount !== 1 ? "s" : ""}
        </span>
        {selectedAsset.isManaged === false && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
            Discovered from site content
          </span>
        )}
      </div>
      {selectedAsset.usageRefs.length > 0 ? (
        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
          {selectedAsset.usageRefs.map(withContentKeys((reference, _index, itemKey) => (
            <div
              key={itemKey}
              className="rounded-lg border bg-background px-3 py-2 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{reference.entityName}</span>
                <span className="text-xs text-muted-foreground">{reference.field}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${reference.isLive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                >
                  {reference.statusLabel}
                </span>
              </div>
              {reference.path && (
                <p className="mt-1 text-xs text-muted-foreground">{reference.path}</p>
              )}
            </div>
          )))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No page, post, event, or global SEO references were found for this media item.
        </p>
      )}
    </div>
  );
}

function MediaAssetPreview({ selectedAsset }: {
  selectedAsset: CmsMediaLibraryAsset;
}) {
  return (
    <>
      {selectedAsset.assetKind === "image" ? (
        <img
          src={selectedAsset.url}
          alt={selectedAsset.alt ?? selectedAsset.originalName}
          className="w-full rounded-lg border object-cover max-h-[420px]"
          onError={handleCmsPreviewImageError}
          data-testid="img-asset-preview"
        />
      ) : (
        <div className="flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-lg border bg-muted/20 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-background shadow-sm">
            <FileText className="h-8 w-8 text-violet-500" />
          </div>
          <div>
            <p className="text-base font-semibold">{selectedAsset.originalName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{selectedAsset.mimeType}</p>
          </div>
        </div>
      )}
    </>
  );
}

function MediaGridItem({ asset, setSelectedAsset }: {
  asset: CmsMediaLibraryAsset;
  setSelectedAsset: React.Dispatch<React.SetStateAction<CmsMediaLibraryAsset | null>>;
}) {
  return (
    <button
      className="group relative aspect-square rounded-xl border bg-muted/20 overflow-hidden transition hover:border-violet-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-400"
      onClick={() => setSelectedAsset(asset)}
      data-testid={`media-asset-${asset.id}`}
    >
      {asset.assetKind === "image" ? (
        <img
          src={asset.url}
          alt={asset.alt ?? asset.originalName}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={handleCmsPreviewImageError}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted/40 p-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-sm">
            <FileText className="h-7 w-7 text-violet-500" />
          </div>
          <div>
            <p className="line-clamp-2 text-xs font-semibold text-foreground">
              {asset.originalName}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">{asset.mimeType}</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl" />
      <div
        className="absolute left-2 top-2 rounded-full bg-background/90 p-1 shadow-sm"
        title={
          asset.isInUse
            ? `In use on ${asset.liveUsageCount} live page${asset.liveUsageCount !== 1 ? "s" : ""}`
            : asset.usageCount > 0
              ? `Referenced ${asset.usageCount} time${asset.usageCount !== 1 ? "s" : ""}, but only in draft or private content`
              : "Not currently referenced anywhere"
        }
      >
        {asset.isInUse ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="absolute right-2 top-2 rounded-full bg-background/90 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground shadow-sm">
        {asset.isManaged === false ? "site image" : asset.assetKind}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-[10px] font-medium truncate leading-tight">
          {asset.originalName}
        </p>
        <p className="text-white/70 text-[9px]">
          {formatBytes(asset.fileSize)} ·{" "}
          {asset.isInUse
            ? `${asset.liveUsageCount} live use`
            : asset.usageCount > 0
              ? `${asset.usageCount} draft/private ref`
              : "unused"}
        </p>
      </div>
    </button>
  );
}

function MediaEmptyState({
  search,
  usageFilter,
  typeFilter,
  setUploadOpen,
}: {
  search: string;
  usageFilter: "all" | "in-use" | "draft-only" | "unused";
  typeFilter: "all" | "images" | "documents";
  setUploadOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Card>
      <CardContent className="pt-14 pb-14 text-center">
        <div className="h-16 w-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
          <Image className="h-8 w-8 text-violet-400" />
        </div>
        <h2 className="text-lg font-semibold mb-2">
          {search || usageFilter !== "all" || typeFilter !== "all"
            ? "No media matches your filters"
            : "No media yet"}
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-5">
          {search || usageFilter !== "all" || typeFilter !== "all"
            ? "Try a different search term or adjust your filters."
            : "Upload your first image or document to get started. All uploads are stored in Cloudflare R2."}
        </p>
        {!search && usageFilter === "all" && typeFilter === "all" && (
          <Button
            variant="outline"
            onClick={() => setUploadOpen(true)}
            className="gap-2"
            data-testid="button-upload-first"
          >
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function MediaFilters({
  search,
  setSearch,
  usageFilter,
  setUsageFilter,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  usageFilter: "all" | "in-use" | "draft-only" | "unused";
  setUsageFilter: React.Dispatch<React.SetStateAction<"all" | "in-use" | "draft-only" | "unused">>;
  typeFilter: "all" | "images" | "documents";
  setTypeFilter: React.Dispatch<React.SetStateAction<"all" | "images" | "documents">>;
  sortBy: "newest" | "oldest" | "name-asc" | "name-desc" | "largest" | "smallest" | "most-used" | "least-used";
  setSortBy: React.Dispatch<React.SetStateAction<"newest" | "oldest" | "name-asc" | "name-desc" | "largest" | "smallest" | "most-used" | "least-used">>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media by name, title, alt text, or description…"
          className="pl-9"
          data-testid="input-media-search"
        />
      </div>
      <select
        value={usageFilter}
        onChange={(e) => setUsageFilter(e.target.value as typeof usageFilter)}
        aria-label="Filter by usage"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        data-testid="select-media-usage-filter"
      >
        <option value="all">All Usage</option>
        <option value="in-use">Live Usage</option>
        <option value="draft-only">Draft / Private Only</option>
        <option value="unused">Unused Everywhere</option>
      </select>
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
        aria-label="Filter by type"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        data-testid="select-media-type-filter"
      >
        <option value="all">All Types</option>
        <option value="images">Images</option>
        <option value="documents">Documents</option>
      </select>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        aria-label="Sort media"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        data-testid="select-media-sort"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name-asc">Name A-Z</option>
        <option value="name-desc">Name Z-A</option>
        <option value="largest">Largest File</option>
        <option value="smallest">Smallest File</option>
        <option value="most-used">Most Used</option>
        <option value="least-used">Least Used</option>
      </select>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type MediaUsageFilter = "all" | "in-use" | "draft-only" | "unused";
type MediaTypeFilter = "all" | "images" | "documents";
type MediaSort = "newest" | "oldest" | "name-asc" | "name-desc" | "largest" | "smallest" | "most-used" | "least-used";

function mediaMatchesSearch(asset: CmsMediaLibraryAsset, query: string) {
  if (!query) return true;
  return [asset.originalName, asset.title, asset.alt, asset.caption, asset.description].some((value) =>
    (value ?? "").toLowerCase().includes(query),
  );
}

function mediaMatchesUsage(asset: CmsMediaLibraryAsset, usageFilter: MediaUsageFilter) {
  switch (usageFilter) {
    case "in-use":
      return asset.isInUse;
    case "draft-only":
      return !asset.isInUse && asset.usageCount > 0;
    case "unused":
      return asset.usageCount === 0;
    default:
      return true;
  }
}

function mediaMatchesType(asset: CmsMediaLibraryAsset, typeFilter: MediaTypeFilter) {
  if (typeFilter === "images") return asset.assetKind === "image";
  if (typeFilter === "documents") return asset.assetKind === "document";
  return true;
}

function createdTime(asset: CmsMediaLibraryAsset) {
  return new Date(asset.createdAt ?? 0).getTime();
}

const MEDIA_SORTERS: Record<MediaSort, (a: CmsMediaLibraryAsset, b: CmsMediaLibraryAsset) => number> = {
  newest: (a, b) => createdTime(b) - createdTime(a),
  oldest: (a, b) => createdTime(a) - createdTime(b),
  "name-asc": (a, b) => a.originalName.localeCompare(b.originalName),
  "name-desc": (a, b) => b.originalName.localeCompare(a.originalName),
  largest: (a, b) => b.fileSize - a.fileSize,
  smallest: (a, b) => a.fileSize - b.fileSize,
  "most-used": (a, b) => b.liveUsageCount - a.liveUsageCount || b.usageCount - a.usageCount,
  "least-used": (a, b) => a.liveUsageCount - b.liveUsageCount || a.usageCount - b.usageCount,
};

function filterAndSortMediaAssets(
  assets: CmsMediaLibraryAsset[],
  filters: { search: string; usageFilter: MediaUsageFilter; typeFilter: MediaTypeFilter; sortBy: MediaSort },
) {
  const query = filters.search.toLowerCase();
  return assets
    .filter(
      (asset) =>
        mediaMatchesSearch(asset, query) &&
        mediaMatchesUsage(asset, filters.usageFilter) &&
        mediaMatchesType(asset, filters.typeFilter),
    )
    .sort(MEDIA_SORTERS[filters.sortBy] ?? MEDIA_SORTERS.newest);
}

function summarizeMediaAssets(assets: CmsMediaLibraryAsset[]) {
  return {
    total: assets.length,
    inUse: assets.filter((asset) => asset.isInUse).length,
    draftOnly: assets.filter((asset) => !asset.isInUse && asset.usageCount > 0).length,
    unused: assets.filter((asset) => asset.usageCount === 0).length,
    documents: assets.filter((asset) => asset.assetKind === "document").length,
    discovered: assets.filter((asset) => asset.isManaged === false).length,
  };
}

function plural(count: number, word: string) {
  return `${count} ${word}${count !== 1 ? "s" : ""}`;
}

function MediaLibraryHeader({
  summary,
  onUpload,
}: {
  summary: ReturnType<typeof summarizeMediaAssets>;
  onUpload: () => void;
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-heading font-semibold" data-testid="text-media-title">
          Media Library
        </h1>
        <p className="text-muted-foreground mt-1">
          {plural(summary.total, "media item")} · {summary.inUse} live · {summary.draftOnly} draft-only ·{" "}
          {summary.unused} unused · {plural(summary.documents, "document")}
          {summary.discovered > 0 ? ` · ${plural(summary.discovered, "discovered site image")}` : ""}
        </p>
      </div>
      <Button onClick={onUpload} className="gap-2" data-testid="button-upload-media">
        <Upload className="h-4 w-4" />
        Upload File
      </Button>
    </div>
  );
}

function useMediaAssetMutations({
  selectedAsset,
  setSelectedAsset,
  setMetadataForm,
  setDeletingId,
  cropSrc,
  setCropSrc,
}: {
  selectedAsset: CmsMediaLibraryAsset | null;
  setSelectedAsset: React.Dispatch<React.SetStateAction<CmsMediaLibraryAsset | null>>;
  setMetadataForm: (form: MediaMetadataForm) => void;
  setDeletingId: (id: string | null) => void;
  cropSrc: string | null;
  setCropSrc: (src: string | null) => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/cms/media/${id}`);
    },
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/media"] });
      toast({ title: "Media item deleted" });
      setDeletingId(null);
      setSelectedAsset((current) => (current?.id === deletedId ? null : current));
    },
    onError: () => toast({ title: "Failed to delete media item", variant: "destructive" }),
  });

  const metadataMutation = useMutation({
    mutationFn: async (payload: { id: string; data: MediaMetadataForm }) => {
      const response = await apiRequest(
        "PATCH",
        `/api/admin/cms/media/${payload.id}`,
        payload.data,
      );
      return response.json() as Promise<Partial<CmsMediaLibraryAsset>>;
    },
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/media"] });
      const current = selectedAsset;
      if (current) {
        const nextAsset = { ...current, ...asset } as CmsMediaLibraryAsset;
        setSelectedAsset(nextAsset);
        setMetadataForm(buildMetadataForm(nextAsset));
      }
      toast({ title: "Media details saved" });
    },
    onError: () => toast({ title: "Failed to save media details", variant: "destructive" }),
  });

  const replaceImageMutation = useMutation({
    mutationFn: async (payload: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", payload.file);
      const res = await fetch(`/api/admin/cms/media/${payload.id}/replace`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.message || "Failed to replace image");
      }
      return res.json() as Promise<Partial<CmsMediaLibraryAsset>>;
    },
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/media"] });
      setSelectedAsset((current) =>
        current ? ({ ...current, ...asset } as CmsMediaLibraryAsset) : current,
      );
      toast({ title: "Media file updated" });
      if (cropSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(cropSrc);
      }
      setCropSrc(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to crop image", description: error.message, variant: "destructive" });
    },
  });

  return { deleteMutation, metadataMutation, replaceImageMutation };
}

export default function CmsMediaPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingUploadUrl, setPendingUploadUrl] = useState("");
  const [usageFilter, setUsageFilter] = useState<"all" | "in-use" | "draft-only" | "unused">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "images" | "documents">("all");
  const [sortBy, setSortBy] = useState<
    | "newest"
    | "oldest"
    | "name-asc"
    | "name-desc"
    | "largest"
    | "smallest"
    | "most-used"
    | "least-used"
  >("newest");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<CmsMediaLibraryAsset | null>(null);
  const [metadataForm, setMetadataForm] = useState<MediaMetadataForm>(() => buildMetadataForm(null));
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState("image.webp");
  const [isPreparingCrop, setIsPreparingCrop] = useState(false);

  const { data: assets = [], isLoading } = useQuery<CmsMediaLibraryAsset[]>({
    queryKey: ["/api/admin/cms/media"],
  });

  useEffect(() => {
    setMetadataForm(buildMetadataForm(selectedAsset));
  }, [selectedAsset]);

  useEffect(() => {
    return () => {
      if (cropSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(cropSrc);
      }
    };
  }, [cropSrc]);

  const { deleteMutation, metadataMutation, replaceImageMutation } = useMediaAssetMutations({
    selectedAsset,
    setSelectedAsset,
    setMetadataForm,
    setDeletingId,
    cropSrc,
    setCropSrc,
  });

  const filteredAssets = useMemo(
    () => filterAndSortMediaAssets(assets, { search, usageFilter, typeFilter, sortBy }),
    [assets, search, sortBy, typeFilter, usageFilter],
  );
  const summary = summarizeMediaAssets(assets);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: "URL copied to clipboard" });
    });
  };

  const updateMetadataField = (key: keyof MediaMetadataForm, value: string) => {
    setMetadataForm((current) => ({ ...current, [key]: value }));
  };

  const prepareCropper = async () => {
    if (!selectedAsset) return;
    setIsPreparingCrop(true);
    try {
      const response = await fetch(`/api/admin/cms/media/${selectedAsset.id}/source`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Could not load image for cropping");
      }
      const blob = await response.blob();
      if (cropSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(cropSrc);
      }
      setCropFileName(selectedAsset.originalName || "image.webp");
      const nextCropSrc = URL.createObjectURL(blob);
      setCropSrc(nextCropSrc);
    } catch (error) {
      toast({
        title: "Unable to open crop tool",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPreparingCrop(false);
    }
  };

  const hasMetadataChanges = selectedAsset
    ? JSON.stringify(metadataForm) !== JSON.stringify(buildMetadataForm(selectedAsset))
    : false;

  return (
    <AdminSidebar>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <MediaLibraryHeader summary={summary} onUpload={() => setUploadOpen(true)} />

        <MediaFilters
          search={search}
          setSearch={setSearch}
          usageFilter={usageFilter}
          setUsageFilter={setUsageFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : filteredAssets.length === 0 ? (
          <MediaEmptyState
            search={search}
            usageFilter={usageFilter}
            typeFilter={typeFilter}
            setUploadOpen={setUploadOpen}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAssets.map((asset) => (
              <MediaGridItem key={asset.id} asset={asset} setSelectedAsset={setSelectedAsset} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>
              Upload images, PDFs, and common business documents to your media library. Max 10 MB.
            </DialogDescription>
          </DialogHeader>
          <CmsImageUpload
            value={pendingUploadUrl}
            acceptedMode="all"
            onChange={(url) => {
              setPendingUploadUrl(url);
              if (url) {
                queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/media"] });
                setTimeout(() => {
                  setUploadOpen(false);
                  setPendingUploadUrl("");
                }, 600);
              }
            }}
            data-testid="media-upload-dropzone"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        {selectedAsset && (
          <DialogContent className="w-[min(96vw,72rem)] max-w-5xl h-[min(94vh,920px)] overflow-hidden p-0 gap-0 flex flex-col">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle className="truncate">{selectedAsset.originalName}</DialogTitle>
              <DialogDescription>
                {formatBytes(selectedAsset.fileSize)} · {selectedAsset.mimeType}
                {selectedAsset.sourceLabel && <> · {selectedAsset.sourceLabel}</>}
                {selectedAsset.createdAt && (
                  <> · Uploaded {format(new Date(selectedAsset.createdAt), "MMM d, yyyy")}</>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <MediaAssetPreview selectedAsset={selectedAsset} />
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 text-xs font-mono break-all">
                  <span className="flex-1 text-muted-foreground line-clamp-2">
                    {selectedAsset.url}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Copy URL"
                    className="h-7 w-7 flex-shrink-0"
                    onClick={() => copyUrl(selectedAsset.url)}
                    data-testid="button-copy-url"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <MediaUsageSummary selectedAsset={selectedAsset} />

              <MediaFileDetailsFields metadataForm={metadataForm} updateMetadataField={updateMetadataField} selectedAsset={selectedAsset} />

              <MediaSeoMetadataFields metadataForm={metadataForm} updateMetadataField={updateMetadataField} selectedAsset={selectedAsset} />

              <MediaAssetActions
                prepareCropper={prepareCropper}
                selectedAsset={selectedAsset}
                isPreparingCrop={isPreparingCrop}
                isReplaceImagePending={replaceImageMutation.isPending}
                copyUrl={copyUrl}
                metadataMutation={metadataMutation}
                metadataForm={metadataForm}
                hasMetadataChanges={hasMetadataChanges}
                setDeletingId={setDeletingId}
              />
            </div>
          </DialogContent>
        )}
      </Dialog>

      <ImageCropperSheet
        imageSrc={cropSrc}
        fileName={cropFileName}
        title="Crop Image"
        description="Adjust the crop area and save it back to this media item."
        applyLabel={replaceImageMutation.isPending ? "Saving..." : "Apply Crop"}
        outputMimeType="image/webp"
        confirmDisabled={replaceImageMutation.isPending}
        onConfirm={(file) => {
          if (!selectedAsset) return;
          replaceImageMutation.mutate({ id: selectedAsset.id, file });
        }}
        onCancel={() => {
          if (cropSrc?.startsWith("blob:")) {
            URL.revokeObjectURL(cropSrc);
          }
          setCropSrc(null);
        }}
      />

      <DeleteMediaDialog deletingId={deletingId} setDeletingId={setDeletingId} deleteMutation={deleteMutation} />
    </AdminSidebar>
  );
}
