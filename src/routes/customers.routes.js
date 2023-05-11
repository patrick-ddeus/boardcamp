import { Router } from "express";
import CustomersController from "../controllers/customers.controller.js";
import { validCustomer, validUpdateCustomer } from "../middlewares/customers.middleware.js";

const customersRouter = Router();

customersRouter.get('/', CustomersController.getAllCustomers);
customersRouter.get('/:id', CustomersController.getOneCustomer);
customersRouter.put('/:id', validUpdateCustomer, CustomersController.updateCustomer);
customersRouter.post('/', validCustomer, CustomersController.postCustomer);

export default customersRouter;