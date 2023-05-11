import { Router } from "express";
import RentalsController from "../controllers/rentals.controller.js";
import { validRental, validFinishRental } from "../middlewares/rentals.middleware.js";

const rentalsRouter = Router();

rentalsRouter.get('/', RentalsController.getAllRentals);
rentalsRouter.post('/', validRental, RentalsController.postRental);
rentalsRouter.post('/:id/return', validFinishRental, RentalsController.finishRental);

export default rentalsRouter;