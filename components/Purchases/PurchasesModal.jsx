// import { useQuery } from "@tanstack/react-query";
// import { SuppliersApi, ProductsApi } from "common/utils/axios/api";
// import request from "common/utils/axios/index";
// import useCreate from "Hooks/useCreate";
// import useUpdate from "Hooks/useUpdate";
// import React, { useEffect } from "react";
// import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
// import {
//   Button,
//   Col,
//   Form,
//   FormFeedback,
//   Input,
//   Label,
//   Modal,
//   ModalBody,
//   ModalFooter,
//   ModalHeader,
//   Row,
//   Table,
// } from "reactstrap";
// import { Plus, Trash } from "react-feather";

// // Fetch Suppliers
// const fetchSuppliers = async () => {
//   const response = await request({
//     method: 'GET',
//     url: SuppliersApi,
//   });
//   return response.data;
// };

// // Fetch Products
// const fetchProducts = async () => {
//   const response = await request({
//     method: 'GET',
//     url: ProductsApi,
//   });
//   return response.data;
// };

// const useSuppliers = () => {
//   return useQuery({
//     queryKey: 'suppliers',
//     queryFn: fetchSuppliers,
//   });
// };

// const useProducts = () => {
//   return useQuery({
//     queryKey: 'products',
//     queryFn: fetchProducts,
//   });
// };

// const PurchaseForm = ({ showModal, setShowModal }) => {
//   const {
//     control,
//     handleSubmit,
//     register,
//     reset,
//     setValue,
//     getValues,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       supplierId: "",
//       purchaseDate: "",
//       reference: "",
//       expectedDate: "",
//       orderStatus: "Pending",
//       paymentStatus: "Pending",
//       billingAddress: "",
//       shippingAddress: "",
//       items: [
//         {
//           productId: "",
//           quantityAvailable: 0,
//           quantity: 0,
//           cost: 0,
//           total: 0,
//         },
//       ],
//       totalAmount: 0,
//       taxInformation: "",
//       invoiceId: "",
//     },
//   });

//   const { data: suppliersData } = useSuppliers();
//   const { data: productsData } = useProducts();

//   const { fields, append, remove, update } = useFieldArray({
//     control,
//     name: "items",
//   });

//   const items = useWatch({
//     control,
//     name: "items",
//   });

//   useEffect(() => {
//     let totalAmount = 0;
//     items.forEach((item) => {
//       totalAmount += parseFloat(item.total) || 0;
//     });
//     setValue("totalAmount", totalAmount);
//   }, [items, setValue]);

//   const handleItemChange = (index, productId) => {
//     const selectedItem = productsData?.data?.docs?.find(
//       (item) => item._id === productId
//     );
//     if (selectedItem) {
//       update(index, {
//         ...getValues(`items[${index}]`),
//         productId: selectedItem._id,
//         quantityAvailable: selectedItem.quantity,
//         cost: selectedItem.cost,
//         total: 0,
//       });
//     }
//   };

//   const handleQuantityChange = (index, quantity) => {
//     const item = getValues(`items[${index}]`);
//     const total = parseFloat(quantity) * parseFloat(item.cost || 0);
//     update(index, { ...item, quantity, total });
//   };

//   const handleCostChange = (index, cost) => {
//     const item = getValues(`items[${index}]`);
//     const total = parseFloat(item.quantity || 0) * parseFloat(cost);
//     update(index, { ...item, cost, total });
//   };

//   const handleClose = () => {
//     reset();
//     setShowModal(false);
//   };
//   const onSubmit = (data) => {
//     console.log(data)
//    if (selectedRow) {
//      mutateUpdate({ data, updateId: selectedRow?._id });
//    } else {
//      // console.log(data)
//     //  mutate(data);
//    }
//  };

//  const onDiscard = () => {
//    clearErrors();
//    reset();
//    setShowModal(false);
//   //  setSelectedRow && setSelectedRow();
//  };

//  const toggleModal = () => {
//    setShowModal(!showModal);
//  };
//   return (
//     <Modal isOpen={showModal} toggle={onDiscard} size="lg">
//       <Form  onSubmit={handleSubmit(onSubmit)}>
//         <ModalHeader toggle={onDiscard}>Add Purchase Order</ModalHeader>
//         <ModalBody>
//           <Row>
//             <Col xs={12} md={6} lg={4} className="mb-2">
//               <Label for="supplierId">Supplier</Label>
//               <Controller
//                 name="supplierId"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="select"
//                     {...register("supplierId")}
//                     {...field}
//                     invalid={errors.supplierId && true}
//                   >
//                     <option value="">Select Supplier</option>
//                     {suppliersData?.data?.docs?.map((supplier) => (
//                       <option key={supplier._id} value={supplier._id}>
//                         {supplier?.SupplierName}
//                       </option>
//                     ))}
//                   </Input>
//                 )}
//               />
//               {errors.supplierId && (
//                 <FormFeedback>{errors.supplierId.message}</FormFeedback>
//               )}
//             </Col>
//             <Col xs={12} md={6} lg={4} className="mb-2">
//               <Label for="purchaseDate">Purchase Date</Label>
//               <Controller
//                 name="purchaseDate"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="date"
//                     {...register("purchaseDate")}
//                     {...field}
//                     invalid={errors.purchaseDate && true}
//                   />
//                 )}
//               />
//               {errors.purchaseDate && (
//                 <FormFeedback>{errors.purchaseDate.message}</FormFeedback>
//               )}
//             </Col>
//             <Col xs={12} md={6} lg={4} className="mb-2">
//               <Label for="reference">Reference No</Label>
//               <Controller
//                 name="reference"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="text"
//                     {...register("reference")}
//                     {...field}
//                     invalid={errors.reference && true}
//                   />
//                 )}
//               />
//               {errors.reference && (
//                 <FormFeedback>{errors.reference.message}</FormFeedback>
//               )}
//             </Col>
//           </Row>
//           <Row>
//             <Col xs={12} md={6} lg={4} className="mb-2">
//               <Label for="expectedDate">Expected Date</Label>
//               <Controller
//                 name="expectedDate"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="date"
//                     {...register("expectedDate")}
//                     {...field}
//                     invalid={errors.expectedDate && true}
//                   />
//                 )}
//               />
//               {errors.expectedDate && (
//                 <FormFeedback>{errors.expectedDate.message}</FormFeedback>
//               )}
//             </Col>
//             <Col xs={12} md={6} lg={4} className="mb-2">
//               <Label for="orderStatus">Order Status</Label>
//               <Controller
//                 name="orderStatus"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="select"
//                     {...register("orderStatus")}
//                     {...field}
//                     invalid={errors.orderStatus && true}
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Received">Received</option>
//                     <option value="Processing">Processing</option>
//                     <option value="Shipped">Shipped</option>
//                   </Input>
//                 )}
//               />
//               {errors.orderStatus && (
//                 <FormFeedback>{errors.orderStatus.message}</FormFeedback>
//               )}
//             </Col>
//             <Col xs={12} md={6} lg={4} className="mb-2">
//               <Label for="paymentStatus">Payment Status</Label>
//               <Controller
//                 name="paymentStatus"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="select"
//                     {...register("paymentStatus")}
//                     {...field}
//                     invalid={errors.paymentStatus && true}
//                   >
//                     <option value="Paid">Paid</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Overdue">Overdue</option>
//                   </Input>
//                 )}
//               />
//               {errors.paymentStatus && (
//                 <FormFeedback>{errors.paymentStatus.message}</FormFeedback>
//               )}
//             </Col>
//           </Row>
          
//           <Row>
//             <Col xs={12} md={6} lg={4} className="mb-2">
//               <Label for="billingAddress">Billing Address</Label>
//               <Controller
//                 name="billingAddress"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="text"
//                     {...register("billingAddress")}
//                     {...field}
//                     invalid={errors.billingAddress && true}
//                   />
//                 )}
//               />
//               {errors.billingAddress && (
//                 <FormFeedback>{errors.billingAddress.message}</FormFeedback>
//               )}
//             </Col>
//             <Col xs={12} md={6} lg={4} className="mb-2">
//               <Label for="shippingAddress">Shipping Address</Label>
//               <Controller
//                 name="shippingAddress"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="text"
//                     {...register("shippingAddress")}
//                     {...field}
//                     invalid={errors.shippingAddress && true}
//                   />
//                 )}
//               />
//               {errors.shippingAddress && (
//                 <FormFeedback>{errors.shippingAddress.message}</FormFeedback>
//               )}
//             </Col>
//             <Col xs={12} md={6} lg={4} className="mb-2">
//               <Label for="taxInformation">Tax Information</Label>
//               <Controller
//                 name="taxInformation"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="text"
//                     {...register("taxInformation")}
//                     {...field}
//                     invalid={errors.taxInformation && true}
//                   />
//                 )}
//               />
//               {errors.taxInformation && (
//                 <FormFeedback>{errors.taxInformation.message}</FormFeedback>
//               )}
//             </Col>
//           </Row>
//           <Table responsive>
//             <thead>
//               <tr>
//                 <th>Item Name</th>
//                 <th>Quantity Available</th>
//                 <th>Quantity</th>
//                 <th>Cost</th>
//                 <th>Total</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fields.map((item, index) => (
//                 <tr key={item.id}>
//                   <td>
//                     <Controller
//                       name={`items[${index}].productId`}
//                       control={control}
//                       render={({ field }) => (
//                         <Input
//                           type="select"
//                           {...register(`items[${index}].productId`)}
//                           {...field}
//                           onChange={(e) => handleItemChange(index, e.target.value)}
//                         >
//                           <option value="">Select Item</option>
//                           {productsData?.data?.docs?.map((item) => (
//                             <option key={item._id} value={item._id}>
//                               {item.name}
//                             </option>
//                           ))}
//                         </Input>
//                       )}
//                     />
//                   </td>
//                   {/* <td>
//                     <Controller
//                       name={`items[${index}].quantityAvailable`}
//                       control={control}
//                       render={({ field }) => (
//                         <Input
//                           type="number"
//                           {...register(`items[${index}].quantityAvailable`)}
//                           {...field}
//                           readOnly
//                         />
//                       )}
//                     />
//                   </td> */}
//                   <td>
//                     <Controller
//                       name={`items[${index}].quantity`}
//                       control={control}
//                       render={({ field }) => (
//                         <Input
//                           type="number"
//                           {...register(`items[${index}].quantity`)}
//                           {...field}
//                           onBlur={(e) => handleQuantityChange(index, e.target.value)}
//                         />
//                       )}
//                     />
//                   </td>
//                   <td>
//                     <Controller
//                       name={`items[${index}].cost`}
//                       control={control}
//                       render={({ field }) => (
//                         <Input
//                           type="number"
//                           {...register(`items[${index}].cost`)}
//                           {...field}
//                           onBlur={(e) => handleCostChange(index, e.target.value)}
//                         />
//                       )}
//                     />
//                   </td>
//                   <td>
//                     <Controller
//                       name={`items[${index}].total`}
//                       control={control}
//                       render={({ field }) => (
//                         <Input
//                           type="number"
//                           {...register(`items[${index}].total`)}
//                           {...field}
//                           readOnly
//                         />
//                       )}
//                     />
//                   </td>
//                   <td>
//                     <Button color="danger" onClick={() => remove(index)}>
//                       <Trash size={16} />
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//               <tr>
//                 <td colSpan="5"></td>
//                 <td>
//                   <Button
//                     color="success"
//                     onClick={() =>
//                       append({
//                         productId: "",
//                         quantityAvailable: 0,
//                         quantity: 0,
//                         cost: 0,
//                         total: 0,
//                       })
//                     }
//                   >
//                     <Plus size={16} />
//                   </Button>
//                 </td>
//               </tr>
//             </tbody>
//           </Table>
//           {/* <Row>
           
//             <Col xs={12} md={6} className="mb-2">
//               <Label for="invoiceId">Invoice ID</Label>
//               <Controller
//                 name="invoiceId"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="text"
//                     {...register("invoiceId")}
//                     {...field}
//                     invalid={errors.invoiceId && true}
//                   />
//                 )}
//               />
//               {errors.invoiceId && (
//                 <FormFeedback>{errors.invoiceId.message}</FormFeedback>
//               )}
//             </Col>
//           </Row> */}
//           <Row className="justify-content-end">
//             <Col xs={3} className="mb-2">
//               <Label for="totalAmount">Total Amount</Label>
//               <Controller
//                 name="totalAmount"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="number"
//                     {...register("totalAmount")}
//                     {...field}
//                     readOnly
//                     invalid={errors.totalAmount && true}
//                   />
//                 )}
//               />
//               {errors.totalAmount && (
//                 <FormFeedback>{errors.totalAmount.message}</FormFeedback>
//               )}
//             </Col>
//           </Row>
//         </ModalBody>
//         <ModalFooter>
//           <Button type="submit" color="primary">
//             Submit
//           </Button>
//           <Button type="button" color="secondary" onClick={onDiscard}>
//             Cancel
//           </Button>
//         </ModalFooter>
//       </Form>
//     </Modal>
//   );
// };

// export default PurchaseForm;
import { useQuery } from "@tanstack/react-query";
import { SuppliersApi, ProductsApi,PurchasesApi } from "common/utils/axios/api";
import request from "common/utils/axios/index";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";
import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import { Plus, Trash } from "react-feather";

// Fetch Suppliers
const fetchSuppliers = async () => {
  const response = await request({
    method: "GET",
    url: SuppliersApi,
  });
  return response.data;
};

// Fetch Products
const fetchProducts = async () => {
  const response = await request({
    method: "GET",
    url: ProductsApi,
  });
  return response.data;
};

const useSuppliers = () => {
  return useQuery({
    queryKey: "suppliers",
    queryFn: fetchSuppliers,
  });
};

const useProducts = () => {
  return useQuery({
    queryKey: "products",
    queryFn: fetchProducts,
  });
};

const schema = Joi.object({
  supplierId: Joi.string().required().label("Supplier"),
  purchaseDate: Joi.date().required().label("Purchase Date"),
  reference: Joi.string().required().label("Reference No"),
  expectedDate: Joi.date().required().label("Expected Date"),
  orderStatus: Joi.string().valid("Pending", "Received", "Processing", "Shipped").required().label("Order Status"),
  paymentStatus: Joi.string().valid("Paid", "Pending", "Overdue").required().label("Payment Status"),
  billingAddress: Joi.string().required().label("Billing Address"),
  shippingAddress: Joi.string().required().label("Shipping Address"),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required().label("Item Name"),
      quantityAvailable: Joi.number().required().label("Quantity Available"),
      quantity: Joi.number().required().label("Quantity"),
      cost: Joi.number().required().label("Cost"),
      total: Joi.number().required().label("Total"),
    })
  ).required().label("Items"),
  totalAmount: Joi.number().required().label("Total Amount"),
  taxInformation: Joi.string().required().label("Tax Information"),
  invoiceId: Joi.string().required().label("Invoice ID"),
});

const PurchaseForm = ({ showModal, setShowModal, selectedRow, setSelectedRow }) => {
  const { control, handleSubmit, register, reset, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: {
      supplierId: "",
      purchaseDate: "",
      reference: "",
      expectedDate: "",
      orderStatus: "Pending",
      paymentStatus: "Pending",
      billingAddress: "",
      shippingAddress: "",
      items: [
        {
          productId: "",
          quantityAvailable: 0,
          quantity: 0,
          cost: 0,
          total: 0,
        },
      ],
      totalAmount: 0,
      taxInformation: "",
      invoiceId: "",
    },
    resolver: joiResolver(schema),
  });

  const { data: suppliersData } = useSuppliers();
  const { data: productsData } = useProducts();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({
    control,
    name: "items",
  });

  useEffect(() => {
    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += parseFloat(item.total) || 0;
    });
    setValue("totalAmount", totalAmount);
  }, [items, setValue]);

  const handleItemChange = (index, productId) => {
    const selectedItem = productsData?.data?.docs?.find(
      (item) => item._id === productId
    );
    if (selectedItem) {
      update(index, {
        ...getValues(`items[${index}]`),
        productId: selectedItem._id,
        quantityAvailable: selectedItem.quantity,
        cost: selectedItem.cost,
        total: 0,
      });
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const item = getValues(`items[${index}]`);
    const total = parseFloat(quantity) * parseFloat(item.cost || 0);
    update(index, { ...item, quantity, total });
  };

  const handleCostChange = (index, cost) => {
    const item = getValues(`items[${index}]`);
    const total = parseFloat(item.quantity || 0) * parseFloat(cost);
    update(index, { ...item, cost, total });
  };

  const handleClose = () => {
    reset();
    setShowModal(false);
  };
  const validate = () => {
    const result = schema.validate(formData, { abortEarly: false });
    if (!result.error) return null;
    const newErrors = {};
    result.error.details.forEach(err => {
      newErrors[err.path[0]] = err.message;
    });
    return newErrors;
  };
  const onSubmit = (data) => {
    const newErrors = validate();
    console.log(newErrors)
    setErrors(newErrors || {});
    if (newErrors) return;
    // console.log(data);
    if (selectedRow) {
      // mutateUpdate({ data, updateId: selectedRow?._id });
    } else {
      console.log(data)
      // mutate(data);
    }
  };

  const { mutate } = useCreate(PurchasesApi, "Purchase Created Successfully", () => {
    setShowModal(false);
    reset();
  });

  const { mutateUpdate } = useUpdate(PurchasesApi, "Purchase Updated Successfully", () => {
    setShowModal(false);
    setSelectedRow(null);
    reset();
  });

  return (
    <Modal isOpen={showModal} toggle={handleClose} size="lg">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={handleClose}>Add Purchase Order</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12} md={6} lg={4} className="mb-2">
              <Label for="supplierId">Supplier</Label>
              <Controller
                name="supplierId"
                control={control}
                render={({ field }) => (
                  <Input
                    type="select"
                    {...register("supplierId")}
                    {...field}
                    invalid={errors.supplierId && true}
                  >
                    <option value="">Select Supplier</option>
                    {suppliersData?.data?.docs?.map((supplier) => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier?.SupplierName}
                      </option>
                    ))}
                  </Input>
                )}
              />
              {errors.supplierId && (
                <FormFeedback>{errors.supplierId.message}</FormFeedback>
              )}
            </Col>
            <Col xs={12} md={6} lg={4} className="mb-2">
              <Label for="purchaseDate">Purchase Date</Label>
              <Controller
                name="purchaseDate"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    {...register("purchaseDate")}
                    {...field}
                    invalid={errors.purchaseDate && true}
                  />
                )}
              />
              {errors.purchaseDate && (
                <FormFeedback>{errors.purchaseDate.message}</FormFeedback>
              )}
            </Col>
            <Col xs={12} md={6} lg={4} className="mb-2">
              <Label for="reference">Reference No</Label>
              <Controller
                name="reference"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    {...register("reference")}
                    {...field}
                    invalid={errors.reference && true}
                  />
                )}
              />
              {errors.reference && (
                <FormFeedback>{errors.reference.message}</FormFeedback>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} lg={4} className="mb-2">
              <Label for="expectedDate">Expected Date</Label>
              <Controller
                name="expectedDate"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    {...register("expectedDate")}
                    {...field}
                    invalid={errors.expectedDate && true}
                  />
                )}
              />
              {errors.expectedDate && (
                <FormFeedback>{errors.expectedDate.message}</FormFeedback>
              )}
            </Col>
            <Col xs={12} md={6} lg={4} className="mb-2">
              <Label for="orderStatus">Order Status</Label>
              <Controller
                name="orderStatus"
                control={control}
                render={({ field }) => (
                  <Input
                    type="select"
                    {...register("orderStatus")}
                    {...field}
                    invalid={errors.orderStatus && true}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Received">Received</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                  </Input>
                )}
              />
              {errors.orderStatus && (
                <FormFeedback>{errors.orderStatus.message}</FormFeedback>
              )}
            </Col>
            <Col xs={12} md={6} lg={4} className="mb-2">
              <Label for="paymentStatus">Payment Status</Label>
              <Controller
                name="paymentStatus"
                control={control}
                render={({ field }) => (
                  <Input
                    type="select"
                    {...register("paymentStatus")}
                    {...field}
                    invalid={errors.paymentStatus && true}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </Input>
                )}
              />
              {errors.paymentStatus && (
                <FormFeedback>{errors.paymentStatus.message}</FormFeedback>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} lg={4} className="mb-2">
              <Label for="billingAddress">Billing Address</Label>
              <Controller
                name="billingAddress"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    {...register("billingAddress")}
                    {...field}
                    invalid={errors.billingAddress && true}
                  />
                )}
              />
              {errors.billingAddress && (
                <FormFeedback>{errors.billingAddress.message}</FormFeedback>
              )}
            </Col>
            <Col xs={12} md={6} lg={4} className="mb-2">
              <Label for="shippingAddress">Shipping Address</Label>
              <Controller
                name="shippingAddress"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    {...register("shippingAddress")}
                    {...field}
                    invalid={errors.shippingAddress && true}
                  />
                )}
              />
              {errors.shippingAddress && (
                <FormFeedback>{errors.shippingAddress.message}</FormFeedback>
              )}
            </Col>
            <Col xs={12} md={6} lg={4} className="mb-2">
              <Label for="taxInformation">Tax Information</Label>
              <Controller
                name="taxInformation"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    {...register("taxInformation")}
                    {...field}
                    invalid={errors.taxInformation && true}
                  />
                )}
              />
              {errors.taxInformation && (
                <FormFeedback>{errors.taxInformation.message}</FormFeedback>
              )}
            </Col>
          </Row>
          <Table responsive>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity Available</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <Controller
                      name={`items[${index}].productId`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="select"
                          {...register(`items[${index}].productId`)}
                          {...field}
                          onChange={(e) => handleItemChange(index, e.target.value)}
                        >
                          <option value="">Select Item</option>
                          {productsData?.data?.docs?.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
                        </Input>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`items[${index}].quantityAvailable`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...register(`items[${index}].quantityAvailable`)}
                          {...field}
                          readOnly
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`items[${index}].quantity`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...register(`items[${index}].quantity`)}
                          {...field}
                          onBlur={(e) => handleQuantityChange(index, e.target.value)}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`items[${index}].cost`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...register(`items[${index}].cost`)}
                          {...field}
                          onBlur={(e) => handleCostChange(index, e.target.value)}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`items[${index}].total`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...register(`items[${index}].total`)}
                          {...field}
                          readOnly
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Button color="danger" onClick={() => remove(index)}>
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5"></td>
                <td>
                  <Button
                    color="success"
                    onClick={() =>
                      append({
                        productId: "",
                        quantityAvailable: 0,
                        quantity: 0,
                        cost: 0,
                        total: 0,
                      })
                    }
                  >
                    <Plus size={16} />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
          <Row className="justify-content-end">
            <Col xs={3} className="mb-2">
              <Label for="totalAmount">Total Amount</Label>
              <Controller
                name="totalAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    {...register("totalAmount")}
                    {...field}
                    readOnly
                    invalid={errors.totalAmount && true}
                  />
                )}
              />
              {errors.totalAmount && (
                <FormFeedback>{errors.totalAmount.message}</FormFeedback>
              )}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary">
            Submit
          </Button>
          <Button type="button" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default PurchaseForm;
