import fs from "fs";
import path from "path";

const DEFAULT_UPLOAD_ROOT = path.resolve(process.cwd(), "uploads");

export function getLocalUploadsRoot() {
  return path.resolve(
    process.env.UPLOADS_DIR ||
      process.env.LOCAL_UPLOADS_DIR ||
      process.env.RAILWAY_VOLUME_MOUNT_PATH ||
      DEFAULT_UPLOAD_ROOT,
  );
}

export function getLocalUploadDirectory(category: string) {
  return path.join(getLocalUploadsRoot(), category);
}

export function ensureLocalUploadDirectory(category: string) {
  const directory = getLocalUploadDirectory(category);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  return directory;
}

export function getLocalUploadPublicUrl(category: string, filename: string) {
  const encodedFilename = filename
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `/uploads/${encodeURIComponent(category)}/${encodedFilename}`;
}

export function resolveLocalUploadPathFromUrl(url: string) {
  if (!url.startsWith("/uploads/")) return null;

  const relativePath = url
    .replace(/^\/uploads\/?/, "")
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment))
    .join(path.sep);

  const uploadRoot = getLocalUploadsRoot();
  const resolvedPath = path.resolve(uploadRoot, relativePath);

  if (resolvedPath !== uploadRoot && !resolvedPath.startsWith(`${uploadRoot}${path.sep}`)) {
    return null;
  }

  return resolvedPath;
}
