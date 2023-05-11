import { Router } from "express";
import CustomersController from "../controllers/customers.controller.js";
import { validCustomer } from "../middlewares/customers.middleware.js";

const customersRouter = Router();

customersRouter.get('/', CustomersController.getAllCustomers);
customersRouter.get('/:id', CustomersController.getOneCustomer);
customersRouter.post('/', validCustomer, CustomersController.postCustomer);

export default customersRouter;