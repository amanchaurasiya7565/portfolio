import { body, validationResult } from "express-validator";

export const validateProject = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required.")
    .isLength({ max: 100 })
    .withMessage("Project title is too long."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description is too long."),

  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array."),

  body("githubUrl")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("GitHub URL must be valid."),

  body("liveUrl")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Live URL must be valid."),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean."),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a positive number."),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: errors.array(),
      });
    }

    next();
  },
];