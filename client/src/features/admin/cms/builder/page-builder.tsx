import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  ListOrdered,
  Monitor,
  Plus,
  Settings2,
  Sparkles,
} from "lucide-react";
import {
  ALL_BLOCKS,
  createBlock,
  getBlockDef,
  type BlockInstance,
  type BuilderContent,
} from "./block-registry";
import { createFallbackBlockDef } from "./block-fallback-def";
import { FrontendPreviewDialog, type PreviewDevice } from "./page-builder-preview";
import type { VisualCanvasProps } from "./page-builder-canvas";
import { BlockInspectorPanel } from "./page-builder-inspector";
import { BuilderLeftRail, DesktopBuilderLayout, MobileBuilderLayout } from "./page-builder-layout";
import { InserterPanel, StructurePanel } from "./page-builder-panels";
import { SaveSectionDialog } from "./page-builder-support";
import {
  duplicateBlockInstance,
  filterBlockGroupsBySearch,
  filterBlocksBySearch,
  insertBlocksAt,
  moveBlockInList,
  reorderBlockList,
  selectionAfterRemoval,
  toggleBlockActiveInList,
} from "./page-builder-utils";
import { useBlockNodeRegistry, useBuilderDragAndDrop, useDesktopInspectorAlignment } from "./page-builder-hooks";

const EMPTY_BLOCKS: BlockInstance[] = [];

interface PageBuilderProps {
  content: BuilderContent;
  onChange: (content: BuilderContent) => void;
}

type LeftRailMode = "structure" | "inserter";
function SaveSectionPickerDialog({ savingSectionBlockId, setSavingSectionBlockId, savingBlock }: {
  savingSectionBlockId: string | null;
  setSavingSectionBlockId: React.Dispatch<React.SetStateAction<string | null>>;
  savingBlock: BlockInstance | null;
}) {
  return (
    <Dialog
      open={!!savingSectionBlockId}
      onOpenChange={(open) => {
        if (!open) setSavingSectionBlockId(null);
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-amber-500" />
            Save as Reusable Section
          </DialogTitle>
        </DialogHeader>
        {savingBlock && (
          <SaveSectionDialog block={savingBlock} onClose={() => setSavingSectionBlockId(null)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function PageBuilderToolbar({
  blocks,
  setStructurePanelOpen,
  structurePanelOpen,
  setAdvancedInspectorOpen,
  selectedBlock,
  advancedInspectorOpen,
  setFrontendPreviewOpen,
  setInsertAtIndex,
  selectedId,
  resolveInsertIndex,
  setLeftRailMode,
}: {
  blocks: BlockInstance[];
  setStructurePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  structurePanelOpen: boolean;
  setAdvancedInspectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBlock: BlockInstance | null;
  advancedInspectorOpen: boolean;
  setFrontendPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setInsertAtIndex: React.Dispatch<React.SetStateAction<number | null>>;
  selectedId: string | null;
  resolveInsertIndex: () => number;
  setLeftRailMode: React.Dispatch<React.SetStateAction<LeftRailMode>>;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <p className="text-sm font-semibold">Visual Builder</p>
          <Badge variant="outline">{blocks.length} block{blocks.length !== 1 ? "s" : ""}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Structure on the left, real page canvas in the center, a compact section toolbar on-canvas, and a docked inspector for full editing.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="gap-1">
          <Monitor className="h-3 w-3" />
          Canvas-first editing
        </Badge>
        <Button
          variant="outline"
          size="sm"
          className="xl:hidden"
          onClick={() => setStructurePanelOpen((current) => !current)}
        >
          <ListOrdered className="mr-1.5 h-4 w-4" />
          {structurePanelOpen ? "Hide Structure" : "Show Structure"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="xl:hidden"
          onClick={() => setAdvancedInspectorOpen((current) => !current)}
          disabled={!selectedBlock}
        >
          <Settings2 className="mr-1.5 h-4 w-4" />
          {advancedInspectorOpen ? "Hide Inspector" : "Show Inspector"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFrontendPreviewOpen(true)}
          data-testid="button-open-frontend-preview"
        >
          <Monitor className="mr-1.5 h-4 w-4" />
          Frontend Preview
        </Button>
        <Button
          data-testid="button-add-block-toolbar"
          onClick={() => {
            setInsertAtIndex(selectedId ? resolveInsertIndex() : null);
            setLeftRailMode("inserter");
            setStructurePanelOpen(true);
          }}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Content
        </Button>
      </div>
    </div>
  );
}

export function PageBuilder({ content, onChange }: PageBuilderProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savingSectionBlockId, setSavingSectionBlockId] = useState<string | null>(null);
  const [navigatorSearch, setNavigatorSearch] = useState("");
  const [addContentSearch, setAddContentSearch] = useState("");
  const [leftRailMode, setLeftRailMode] = useState<LeftRailMode>("structure");
  const [structurePanelOpen, setStructurePanelOpen] = useState(true);
  const [advancedInspectorOpen, setAdvancedInspectorOpen] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [frontendPreviewOpen, setFrontendPreviewOpen] = useState(false);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);

  const blocks = content.blocks ?? EMPTY_BLOCKS;
  const selectedBlock = blocks.find((block) => block.id === selectedId) ?? null;
  const selectedEditorDef = selectedBlock
    ? (getBlockDef(selectedBlock.type) ?? createFallbackBlockDef(selectedBlock.type, selectedBlock.props))
    : null;
  const selectedBlockIndex = selectedBlock ? blocks.indexOf(selectedBlock) : -1;

  const { blockRefs, registerBlockRef, scrollBlockIntoView } = useBlockNodeRegistry();
  const { desktopCanvasPanelRef, desktopInspectorShellRef, desktopInspectorOffset } = useDesktopInspectorAlignment({
    enabled: advancedInspectorOpen,
    selectedId,
    blocks,
    blockRefs,
  });

  const selectBlock = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) {
      setAdvancedInspectorOpen(true);
    }
  }, []);

  const setBlocks = useCallback(
    (nextBlocks: BlockInstance[] | null) => {
      if (nextBlocks) onChange({ ...content, blocks: nextBlocks });
    },
    [content, onChange]
  );

  const visibleBlocks = useMemo(() => filterBlocksBySearch(blocks, navigatorSearch), [blocks, navigatorSearch]);
  const filteredAddContentGroups = useMemo(
    () => filterBlockGroupsBySearch(ALL_BLOCKS, addContentSearch),
    [addContentSearch],
  );

  const desktopCanvasFrameClassName = useMemo(() => {
    if (!structurePanelOpen && !advancedInspectorOpen) return "max-w-[1280px]";
    if (structurePanelOpen && advancedInspectorOpen) return "max-w-[980px] 2xl:max-w-[1080px]";
    return "max-w-[1120px] 2xl:max-w-[1200px]";
  }, [advancedInspectorOpen, structurePanelOpen]);

  useEffect(() => {
    if (!selectedId) return;
    scrollBlockIntoView(selectedId);
  }, [scrollBlockIntoView, selectedId]);

  const resolveInsertIndex = useCallback(() => {
    if (insertAtIndex !== null) return insertAtIndex;
    const selectedIndex = selectedId ? blocks.findIndex((block) => block.id === selectedId) : -1;
    return selectedIndex >= 0 ? selectedIndex + 1 : blocks.length;
  }, [blocks, insertAtIndex, selectedId]);

  const insertBlocksAtIndex = useCallback((insertedBlocks: BlockInstance[], index: number) => {
    setBlocks(insertBlocksAt(blocks, index, insertedBlocks));
    selectBlock(insertedBlocks[0]?.id ?? null);
    setInsertAtIndex(null);
    setLeftRailMode("structure");
    setStructurePanelOpen(true);
  }, [blocks, selectBlock, setBlocks]);

  const addBlockAtIndex = useCallback(
    (type: string, index: number) => insertBlocksAtIndex([createBlock(type)], index),
    [insertBlocksAtIndex],
  );
  const addBlock = useCallback((type: string) => addBlockAtIndex(type, resolveInsertIndex()), [addBlockAtIndex, resolveInsertIndex]);
  const insertBlocks = useCallback(
    (insertedBlocks: BlockInstance[]) => insertBlocksAtIndex(insertedBlocks, resolveInsertIndex()),
    [insertBlocksAtIndex, resolveInsertIndex],
  );

  const openAddBelow = useCallback((id: string) => {
    const sourceIndex = blocks.findIndex((block) => block.id === id);
    setInsertAtIndex(sourceIndex < 0 ? blocks.length : sourceIndex + 1);
    setLeftRailMode("inserter");
    setStructurePanelOpen(true);
  }, [blocks]);

  const updateBlockProps = useCallback((id: string, props: Record<string, unknown>) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, props } : block)));
  }, [blocks, setBlocks]);

  const toggleBlockActive = useCallback((id: string) => setBlocks(toggleBlockActiveInList(blocks, id)), [blocks, setBlocks]);

  const removeBlock = useCallback((id: string) => {
    if (selectedId === id) selectBlock(selectionAfterRemoval(blocks, id));
    setBlocks(blocks.filter((block) => block.id !== id));
  }, [blocks, selectBlock, selectedId, setBlocks]);

  const duplicateBlock = useCallback((id: string) => {
    const sourceIndex = blocks.findIndex((block) => block.id === id);
    if (sourceIndex < 0) return;
    const copy = duplicateBlockInstance(blocks[sourceIndex]);
    setBlocks(insertBlocksAt(blocks, sourceIndex + 1, [copy]));
    selectBlock(copy.id);
  }, [blocks, selectBlock, setBlocks]);

  const moveBlock = useCallback(
    (id: string, direction: "up" | "down") => setBlocks(moveBlockInList(blocks, id, direction)),
    [blocks, setBlocks],
  );
  const reorderBlocks = useCallback(
    (sourceId: string, targetId: string, position: "before" | "after") =>
      setBlocks(reorderBlockList(blocks, sourceId, targetId, position)),
    [blocks, setBlocks],
  );

  const {
    draggedBlockId,
    draggedInsertPayload,
    dropTarget,
    clearDragState,
    handleDragStart,
    handleInserterDragStart,
    handleDragOver,
    handleDrop,
  } = useBuilderDragAndDrop({
    blocks,
    onInsertBlock: addBlockAtIndex,
    onInsertBlocks: insertBlocksAtIndex,
    onReorder: reorderBlocks,
  });

  const savingBlock = savingSectionBlockId
    ? blocks.find((block) => block.id === savingSectionBlockId) ?? null
    : null;

  const structurePanel = (
    <StructurePanel
      blocks={blocks}
      visibleBlocks={visibleBlocks}
      navigatorSearch={navigatorSearch}
      onNavigatorSearchChange={setNavigatorSearch}
      selectedId={selectedId}
      draggedBlockId={draggedBlockId}
      dropTarget={dropTarget}
      onSelectBlock={selectBlock}
      onOpenInserter={() => {
        setInsertAtIndex(selectedId ? resolveInsertIndex() : null);
        setLeftRailMode("inserter");
      }}
      onMoveBlock={moveBlock}
      onDuplicateBlock={duplicateBlock}
      onDeleteBlock={removeBlock}
      onDragStart={handleDragStart}
      onDragEnd={clearDragState}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  );

  const inserterPanel = (
    <InserterPanel
      insertAtIndex={insertAtIndex}
      selectedId={selectedId}
      addContentSearch={addContentSearch}
      onAddContentSearchChange={setAddContentSearch}
      filteredAddContentGroups={filteredAddContentGroups}
      onAddBlock={addBlock}
      onInsertBlocks={insertBlocks}
      onDragStart={handleInserterDragStart}
      onDragEnd={clearDragState}
    />
  );

  const leftRailPanel = (
    <BuilderLeftRail
      leftRailMode={leftRailMode}
      onLeftRailModeChange={setLeftRailMode}
      structurePanel={structurePanel}
      inserterPanel={inserterPanel}
    />
  );

  const inspectorPanel = (
    <BlockInspectorPanel
      selectedBlock={selectedBlock}
      selectedEditorDef={selectedEditorDef}
      selectedBlockIndex={selectedBlockIndex}
      onLocateBlock={() => selectedBlock && scrollBlockIntoView(selectedBlock.id)}
      onSaveSection={() => selectedBlock && setSavingSectionBlockId(selectedBlock.id)}
      onClose={() => setAdvancedInspectorOpen(false)}
      onUpdateBlockProps={(props) => selectedBlock && updateBlockProps(selectedBlock.id, props)}
    />
  );

  const canvasProps: VisualCanvasProps = {
    blocks,
    selectedId,
    onSelect: selectBlock,
    onToggleActive: toggleBlockActive,
    onDuplicate: duplicateBlock,
    onDelete: removeBlock,
    onMove: moveBlock,
    onAddBelow: openAddBelow,
    registerBlockRef,
    onCanvasDragStart: handleDragStart,
    onCanvasDragEnd: clearDragState,
    draggedBlockId,
    hasActiveDragPayload: !!draggedBlockId || !!draggedInsertPayload,
    dropTarget,
    onBlockDragOver: handleDragOver,
    onBlockDrop: handleDrop,
    onBlockDragEnd: clearDragState,
    desktopFrameClassName: desktopCanvasFrameClassName,
  };

  return (
    <div className="space-y-4">
      <PageBuilderToolbar
        blocks={blocks}
        setStructurePanelOpen={setStructurePanelOpen}
        structurePanelOpen={structurePanelOpen}
        setAdvancedInspectorOpen={setAdvancedInspectorOpen}
        selectedBlock={selectedBlock}
        advancedInspectorOpen={advancedInspectorOpen}
        setFrontendPreviewOpen={setFrontendPreviewOpen}
        setInsertAtIndex={setInsertAtIndex}
        selectedId={selectedId}
        resolveInsertIndex={resolveInsertIndex}
        setLeftRailMode={setLeftRailMode}
      />
      <MobileBuilderLayout
        structurePanelOpen={structurePanelOpen}
        advancedInspectorOpen={advancedInspectorOpen}
        leftRailPanel={leftRailPanel}
        inspectorPanel={inspectorPanel}
        canvasProps={canvasProps}
      />

      <DesktopBuilderLayout
        structurePanelOpen={structurePanelOpen}
        advancedInspectorOpen={advancedInspectorOpen}
        leftRailPanel={leftRailPanel}
        inspectorPanel={inspectorPanel}
        canvasPanelRef={desktopCanvasPanelRef}
        inspectorShellRef={desktopInspectorShellRef}
        desktopInspectorOffset={desktopInspectorOffset}
        onSetStructurePanelOpen={setStructurePanelOpen}
        onSetAdvancedInspectorOpen={setAdvancedInspectorOpen}
        canvasProps={canvasProps}
      />

      <SaveSectionPickerDialog savingSectionBlockId={savingSectionBlockId} setSavingSectionBlockId={setSavingSectionBlockId} savingBlock={savingBlock} />
      <FrontendPreviewDialog
        open={frontendPreviewOpen}
        onOpenChange={setFrontendPreviewOpen}
        blocks={blocks}
        previewDevice={previewDevice}
        onPreviewDeviceChange={setPreviewDevice}
      />
    </div>
  );
}
