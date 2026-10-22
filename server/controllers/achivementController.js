import Achievement from "../models/Achievement.js";
import { createCrudController } from "./crudController.js";

const achievementController = createCrudController(Achievement);

export default achievementController;
export { achievementController };
