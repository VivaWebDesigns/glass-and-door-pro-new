import { useCallback, useEffect, useRef, useState, type DragEvent, type MutableRefObject } from "react";
import type { BlockInstance } from "./block-registry";

export type InsertPayload =
  | { kind: "block"; type: string }
  | { kind: "section"; sectionId: string; blocks: BlockInstance[] };

export type DropTarget = { id: string; position: "before" | "after" };

const INSERT_PAYLOAD_MIME = "application/x-page-builder-insert";

function findScrollViewport(node: Element | null | undefined) {
  return (node?.querySelector("[data-radix-scroll-area-viewport]") ?? null) as HTMLElement | null;
}

/** Keeps a registry of rendered block nodes and scrolls the selected one into a comfortable position. */
export function useBlockNodeRegistry() {
  const blockRefs = useRef(new Map<string, HTMLDivElement | null>());

  const registerBlockRef = useCallback((id: string, node: HTMLDivElement | null) => {
    if (node) {
      blockRefs.current.set(id, node);
    } else {
      blockRefs.current.delete(id);
    }
  }, []);

  const scrollBlockIntoView = useCallback((id: string) => {
    const node = blockRefs.current.get(id);
    if (!node) return;

    const viewport = node.closest("[data-radix-scroll-area-viewport]") as HTMLElement | null;
    if (viewport) {
      const viewportRect = viewport.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const highZoneThreshold = viewportRect.top + viewport.clientHeight * 0.14;
      const lowZoneThreshold = viewportRect.top + viewport.clientHeight * 0.68;
      const bottomSafetyThreshold = viewportRect.bottom - Math.min(180, viewport.clientHeight * 0.18);
      const desiredTop = viewportRect.top + Math.min(240, viewport.clientHeight * 0.34);

      if (nodeRect.top < highZoneThreshold || nodeRect.top > lowZoneThreshold || nodeRect.bottom > bottomSafetyThreshold) {
        viewport.scrollTo({
          top: Math.max(0, viewport.scrollTop + (nodeRect.top - desiredTop)),
          behavior: "smooth",
        });
        return;
      }
    }

    node.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  }, []);

  return { blockRefs, registerBlockRef, scrollBlockIntoView };
}

function computeInspectorOffset(
  selectedNode: HTMLDivElement | null | undefined,
  canvasViewport: HTMLElement | null,
  inspectorShell: HTMLDivElement | null,
) {
  if (!selectedNode || !canvasViewport || !inspectorShell) return 0;
  const shellHeight = inspectorShell.clientHeight;
  if (shellHeight <= 0) return 0;

  const viewportRect = canvasViewport.getBoundingClientRect();
  const blockRect = selectedNode.getBoundingClientRect();
  const blockAnchorRelative = blockRect.top - viewportRect.top + blockRect.height * 0.42;
  const desiredTopAnchor = Math.max(150, Math.min(250, shellHeight * 0.3));
  const minInspectorHeight = Math.min(560, Math.max(440, shellHeight * 0.62));
  const maxOffset = Math.max(0, shellHeight - minInspectorHeight);
  return Math.max(0, Math.min(maxOffset, blockAnchorRelative - desiredTopAnchor));
}

/** Vertically aligns the desktop inspector with the selected block as the canvas scrolls. */
export function useDesktopInspectorAlignment({
  enabled,
  selectedId,
  blocks,
  blockRefs,
}: {
  enabled: boolean;
  selectedId: string | null;
  blocks: BlockInstance[];
  blockRefs: MutableRefObject<Map<string, HTMLDivElement | null>>;
}) {
  const desktopCanvasPanelRef = useRef<HTMLDivElement | null>(null);
  const desktopInspectorShellRef = useRef<HTMLDivElement | null>(null);
  const [desktopInspectorOffset, setDesktopInspectorOffset] = useState(0);

  const updateAlignment = useCallback(() => {
    const nextOffset =
      enabled && selectedId
        ? computeInspectorOffset(
            blockRefs.current.get(selectedId),
            findScrollViewport(desktopCanvasPanelRef.current),
            desktopInspectorShellRef.current,
          )
        : 0;
    setDesktopInspectorOffset((current) => (Math.abs(current - nextOffset) > 2 || nextOffset === 0 ? nextOffset : current));
  }, [blockRefs, enabled, selectedId]);

  useEffect(() => {
    updateAlignment();
  }, [updateAlignment, selectedId, blocks]);

  useEffect(() => {
    if (!enabled || !selectedId) return;
    const canvasViewport = findScrollViewport(desktopCanvasPanelRef.current);
    if (!canvasViewport) return;

    let frame = 0;
    const queueAlignment = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateAlignment);
    };

    canvasViewport.addEventListener("scroll", queueAlignment, { passive: true });
    window.addEventListener("resize", queueAlignment);
    queueAlignment();

    return () => {
      cancelAnimationFrame(frame);
      canvasViewport.removeEventListener("scroll", queueAlignment);
      window.removeEventListener("resize", queueAlignment);
    };
  }, [enabled, selectedId, updateAlignment]);

  return { desktopCanvasPanelRef, desktopInspectorShellRef, desktopInspectorOffset };
}

function readInsertPayload(event: DragEvent): InsertPayload | null {
  const raw = event.dataTransfer.getData(INSERT_PAYLOAD_MIME);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InsertPayload;
  } catch {
    return null;
  }
}

/** Drag-and-drop state for reordering canvas blocks and dropping new content from the inserter. */
export function useBuilderDragAndDrop({
  blocks,
  onInsertBlock,
  onInsertBlocks,
  onReorder,
}: {
  blocks: BlockInstance[];
  onInsertBlock: (type: string, index: number) => void;
  onInsertBlocks: (blocks: BlockInstance[], index: number) => void;
  onReorder: (sourceId: string, targetId: string, position: "before" | "after") => void;
}) {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [draggedInsertPayload, setDraggedInsertPayload] = useState<InsertPayload | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const clearDragState = useCallback(() => {
    setDraggedBlockId(null);
    setDraggedInsertPayload(null);
    setDropTarget(null);
  }, []);

  const handleDragStart = useCallback((event: DragEvent, blockId: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", blockId);
    setDraggedBlockId(blockId);
    setDraggedInsertPayload(null);
    setDropTarget(null);
  }, []);

  const handleInserterDragStart = useCallback((event: DragEvent, payload: InsertPayload) => {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData(INSERT_PAYLOAD_MIME, JSON.stringify(payload));
    setDraggedBlockId(null);
    setDraggedInsertPayload(payload);
    setDropTarget(null);
  }, []);

  const handleDragOver = useCallback((event: DragEvent, targetId: string) => {
    if (!draggedBlockId && !draggedInsertPayload) return;
    if (draggedBlockId && draggedBlockId === targetId) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = draggedInsertPayload ? "copy" : "move";

    const bounds = event.currentTarget.getBoundingClientRect();
    const position = event.clientY - bounds.top < bounds.height / 2 ? "before" : "after";

    setDropTarget((current) =>
      current?.id === targetId && current.position === position ? current : { id: targetId, position },
    );
  }, [draggedBlockId, draggedInsertPayload]);

  const handleDrop = useCallback((event: DragEvent, targetId: string) => {
    event.preventDefault();

    const sourceId = draggedBlockId ?? event.dataTransfer.getData("text/plain");
    const insertPayload = draggedInsertPayload ?? readInsertPayload(event);
    const position = dropTarget?.id === targetId ? dropTarget.position : "after";
    const targetIndex = blocks.findIndex((block) => block.id === targetId);
    const insertIndex = position === "before" ? targetIndex : targetIndex + 1;

    if (insertPayload && targetIndex >= 0) {
      if (insertPayload.kind === "block") {
        onInsertBlock(insertPayload.type, insertIndex);
      } else {
        onInsertBlocks(insertPayload.blocks, insertIndex);
      }
    } else if (sourceId && sourceId !== targetId) {
      onReorder(sourceId, targetId, position);
    }

    clearDragState();
  }, [blocks, clearDragState, draggedBlockId, draggedInsertPayload, dropTarget, onInsertBlock, onInsertBlocks, onReorder]);

  return {
    draggedBlockId,
    draggedInsertPayload,
    dropTarget,
    clearDragState,
    handleDragStart,
    handleInserterDragStart,
    handleDragOver,
    handleDrop,
  };
}
