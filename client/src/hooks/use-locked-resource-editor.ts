import { useEditorLock } from "@/hooks/use-editor-lock";
import { useLockConflictGuard } from "@/hooks/use-lock-conflict-guard";

type EditorLockResourceType = Parameters<typeof useEditorLock>[0]["resourceType"];

/**
 * Editor lock plus conflict handling for an admin editor of an existing
 * resource. `resourceId` is null while creating a new resource (no lock).
 */
export function useLockedResourceEditor({
  resourceType,
  resourceId,
  resourceLabel,
  onConflict,
}: {
  resourceType: EditorLockResourceType;
  resourceId: string | null;
  resourceLabel: string;
  onConflict: () => void;
}) {
  const editorLock = useEditorLock({ resourceType, resourceId, enabled: resourceId !== null });

  useLockConflictGuard({
    active: resourceId !== null,
    resourceId,
    resourceLabel,
    editorLock,
    onConflict,
  });

  const lockedClass: string | false =
    editorLock.hasLocking && editorLock.isReadOnly ? "pointer-events-none select-none opacity-70" : false;

  return { editorLock, lockedClass };
}
