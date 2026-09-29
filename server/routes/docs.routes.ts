import { Router } from "express";
import { storage } from "../storage/index";
import { authenticateToken, requireRole } from "../middleware/auth";
import { asyncHandler } from "../middleware/error-handler";
import { paramString } from "../utils/params";
import { ensureSystemDocs } from "../services/system-docs.service";
import { insertDocSchema } from "@shared/schema";
import { validateBody } from "../middleware/validation";
import type { z } from "zod";

const createDocSchema = insertDocSchema.omit({ createdBy: true });
const updateDocSchema = createDocSchema.partial();

type CreateDocInput = z.infer<typeof createDocSchema>;
type UpdateDocInput = z.infer<typeof updateDocSchema>;

const router = Router();

router.use(authenticateToken);
router.use(requireRole("admin"));

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const allDocs = await storage.docs.getAllDocs();
    res.json(allDocs);
  }),
);

router.post(
  "/sync",
  asyncHandler(async (_req, res) => {
    const result = await ensureSystemDocs();
    const allDocs = await storage.docs.getAllDocs();
    res.json({
      ...result,
      docs: allDocs,
    });
  }),
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const doc = await storage.docs.getDocBySlug(paramString(req.params.slug));
    if (!doc) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.json(doc);
  }),
);

router.post(
  "/",
  validateBody(createDocSchema),
  asyncHandler(async (req, res) => {
    const input: CreateDocInput = req.body;
    const doc = await storage.docs.createDoc({
      ...input,
      createdBy: req.user!.id,
    });
    res.status(201).json(doc);
  }),
);

router.put(
  "/:id",
  validateBody(updateDocSchema),
  asyncHandler(async (req, res) => {
    const input: UpdateDocInput = req.body;
    const doc = await storage.docs.updateDoc(paramString(req.params.id), input);
    if (!doc) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.json(doc);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await storage.docs.deleteDoc(paramString(req.params.id));
    res.json({ message: "Document deleted" });
  }),
);

export default router;
