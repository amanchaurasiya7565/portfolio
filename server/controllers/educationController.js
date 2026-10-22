import Education from "../models/Education.js";
import { createCrudController } from "./crudController.js";

const educationController = createCrudController(Education);

export default educationController;
export { educationController };
