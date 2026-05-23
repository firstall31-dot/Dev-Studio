import { Router } from "express";
import {
  getSaved,
  postSaved,
  deleteSavedById,
  getRemote,
  getScrape,
  postScrape,
} from "../controllers/jobs.controller.js";
import { validateBody, validateQuery, validateParams } from "../middleware/validation.js";
import { SavedJobDto, RemoteJobsQueryDto, ScrapeJobsQueryDto } from "../dtos/career.dto.js";
import { IdParamDto } from "../dtos/common.dto.js";

const router = Router();
router.get("/saved", getSaved);
router.post("/saved", validateBody(SavedJobDto), postSaved);
router.delete("/saved/:id", validateParams(IdParamDto), deleteSavedById);
router.get("/remote", validateQuery(RemoteJobsQueryDto), getRemote);
router.get("/scrape", validateQuery(ScrapeJobsQueryDto), getScrape);
router.post("/scrape", postScrape);

export default router;
