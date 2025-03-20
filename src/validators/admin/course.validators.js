import { body } from "express-validator";
const courseCreateValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is required"),
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description is required"),
        body("price")
            .isNumeric()
            .withMessage("Price is required"),
        body("duration")
            .isNumeric()
            .withMessage("Duration is required"),
        body("lastdateforregistration")
            .isDate()
            .withMessage("Last date for registration is required"),
        body("maxStudents")
            .isNumeric()
            .withMessage("Max students is required"),
    ];
}

const courseUpdateValidator = () => {
    return [
        body("name")
            .optional()
            .trim(),
        body("description")
            .optional()
            .trim(),
        body("price")
            .optional()
            .isNumeric(),
        body("duration")
            .optional()
            .isNumeric(),
        body("lastdateforregistration")
            .optional()
            .isDate(),
        body("maxStudents")
            .optional()
            .isNumeric(),
    ];
}

export {
    courseCreateValidator,
    courseUpdateValidator
};