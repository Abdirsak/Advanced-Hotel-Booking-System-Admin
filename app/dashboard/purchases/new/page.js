"use client";

import { Fragment, useState, useEffect } from "react";
import Select from 'react-select';
import Joi from "joi";
import {
  Button, Col, Form, FormFeedback, Input, Label, Row, Spinner, Container, Table
} from "reactstrap";
import { SuppliersApi, ProductsApi, PurchasesApi } from "common/utils/axios/api";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";
import { useQuery } from "@tanstack/react-query";
import request from "common/utils/axios/index";

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
  totalAmount: Joi.number().required().label("Total Amount"),
  taxInformation: Joi.string().required().label("Tax Information"),
  invoiceId: Joi.string().allow("",null).required().label("Invoice ID"),
});

const PurchaseForm = () => {
  const [formData, setFormData] = useState({
    supplierId: "", purchaseDate: "", reference: "", expectedDate: "",
    orderStatus: "Pending", paymentStatus: "Pending", billingAddress: "",
    shippingAddress: "", items: [{ productId: "", quantityAvailable: 0, quantity: 0, cost: 0, total: 0 }],
    totalAmount: 0, taxInformation: "", invoiceId: ""
  });
  const [errors, setErrors] = useState({});
  const { data: suppliersData } = useSuppliers();
  const { data: productsData } = useProducts();

  const { mutate, isPending: isLoading } = useCreate(
    PurchasesApi, "Purchase Created Successfully", () => { }
  );
  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    PurchasesApi, false, () => { }
  );

  const suppliersOptions = suppliersData?.data?.docs?.map(supplier => ({ value: supplier._id, label: supplier.SupplierName }));
  const productsOptions = productsData?.data?.docs?.map(product => ({ value: product._id, label: product.name }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, productId) => {
    const selectedItem = productsData?.data?.docs?.find(item => item._id === productId);
    if (selectedItem) {
      const updatedItems = [...formData.items];
      updatedItems[index] = {
        ...updatedItems[index],
        productId: selectedItem._id,
        quantityAvailable: selectedItem.quantity,
        cost: selectedItem.cost,
        total: 0,
      };
      setFormData({ ...formData, items: updatedItems });
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedItems = [...formData.items];
    const item = updatedItems[index];
    const total = parseFloat(quantity) * parseFloat(item.cost || 0);
    updatedItems[index] = { ...item, quantity, total };
    setFormData({ ...formData, items: updatedItems });
  };

  const handleCostChange = (index, cost) => {
    const updatedItems = [...formData.items];
    const item = updatedItems[index];
    const total = parseFloat(item.quantity || 0) * parseFloat(cost);
    updatedItems[index] = { ...item, cost, total };
    setFormData({ ...formData, items: updatedItems });
  };

  useEffect(() => {
    let totalAmount = 0;
    formData.items.forEach(item => {
      totalAmount += parseFloat(item.total) || 0;
    });
    setFormData({ ...formData, totalAmount });
  }, [formData.items]);

  const validate = () => {
    const result = schema.validate({
      supplierId: formData.supplierId,
      purchaseDate: formData.purchaseDate,
      reference: formData.reference,
      expectedDate: formData.expectedDate,
      orderStatus: formData.orderStatus,
      paymentStatus: formData.paymentStatus,
      billingAddress: formData.billingAddress,
      shippingAddress: formData.shippingAddress,
      totalAmount: formData.totalAmount,
      taxInformation: formData.taxInformation,
      invoiceId: formData.invoiceId,
    }, { abortEarly: false });
    if (!result.error) return null;
    const newErrors = {};
    result.error.details.forEach(err => {
      newErrors[err.path[0]] = err.message;
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData)
    const newErrors = validate();
    setErrors(newErrors || {});
    // console.log(newErrors)
    if (newErrors) return;
    mutate(formData);
  };

  const onDiscard = () => {
    setFormData({
      supplierId: "", purchaseDate: "", reference: "", expectedDate: "",
      orderStatus: "Pending", paymentStatus: "Pending", billingAddress: "",
      shippingAddress: "", items: [{ productId: "", quantityAvailable: 0, quantity: 0, cost: 0, total: 0 }],
      totalAmount: 0, taxInformation: "", invoiceId: ""
    });
    setErrors({});
  };

  return (
    <Fragment>
      <Container>
        <Form onSubmit={handleSubmit} className="m-5 shadow-lg p-2">
          <Row className="justify-content-center">
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="supplierId">Supplier</Label>
              <Select
                id="supplierId"
                name="supplierId"
                options={suppliersOptions}
                value={suppliersOptions?.find(option => option.value === formData.supplierId)}
                onChange={(selected) => setFormData({ ...formData, supplierId: selected.value })}
                isInvalid={!!errors.supplierId}
              />
              {errors.supplierId && <FormFeedback>{errors.supplierId}</FormFeedback>}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                invalid={!!errors.purchaseDate}
              />
              {errors.purchaseDate && <FormFeedback>{errors.purchaseDate}</FormFeedback>}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="reference">Reference No</Label>
              <Input
                id="reference"
                name="reference"
                placeholder="Reference No"
                value={formData.reference}
                onChange={handleInputChange}
                invalid={!!errors.reference}
              />
              {errors.reference && <FormFeedback>{errors.reference}</FormFeedback>}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="expectedDate">Expected Date</Label>
              <Input
                id="expectedDate"
                name="expectedDate"
                type="date"
                value={formData.expectedDate}
                onChange={handleInputChange}
                invalid={!!errors.expectedDate}
              />
              {errors.expectedDate && <FormFeedback>{errors.expectedDate}</FormFeedback>}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="orderStatus">Order Status</Label>
              <Input
                id="orderStatus"
                name="orderStatus"
                type="select"
                value={formData.orderStatus}
                onChange={handleInputChange}
                invalid={!!errors.orderStatus}
              >
                <option value="Pending">Pending</option>
                <option value="Received">Received</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
              </Input>
              {errors.orderStatus && <FormFeedback>{errors.orderStatus}</FormFeedback>}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="paymentStatus">Payment Status</Label>
              <Input
                id="paymentStatus"
                name="paymentStatus"
                type="select"
                value={formData.paymentStatus}
                onChange={handleInputChange}
                invalid={!!errors.paymentStatus}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </Input>
              {errors.paymentStatus && <FormFeedback>{errors.paymentStatus}</FormFeedback>}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="billingAddress">Billing Address</Label>
              <Input
                id="billingAddress"
                name="billingAddress"
                placeholder="Billing Address"
                value={formData.billingAddress}
                onChange={handleInputChange}
                invalid={!!errors.billingAddress}
              />
              {errors.billingAddress && <FormFeedback>{errors.billingAddress}</FormFeedback>}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="shippingAddress">Shipping Address</Label>
              <Input
                id="shippingAddress"
                name="shippingAddress"
                placeholder="Shipping Address"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                invalid={!!errors.shippingAddress}
              />
              {errors.shippingAddress && <FormFeedback>{errors.shippingAddress}</FormFeedback>}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="taxInformation">Tax Information</Label>
              <Input
                id="taxInformation"
                name="taxInformation"
                placeholder="Tax Information"
                value={formData.taxInformation}
                onChange={handleInputChange}
                invalid={!!errors.taxInformation}
              />
              {errors.taxInformation && <FormFeedback>{errors.taxInformation}</FormFeedback>}
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
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Select
                      name={`items[${index}].productId`}
                      options={productsOptions}
                      value={productsOptions?.find(option => option.value === item.productId)}
                      onChange={(selected) => handleItemChange(index, selected.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`items[${index}].quantityAvailable`}
                      value={item.quantityAvailable}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`items[${index}].quantity`}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      onBlur={(e) => handleQuantityChange(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`items[${index}].cost`}
                      value={item.cost}
                      onChange={(e) => handleCostChange(index, e.target.value)}
                      onBlur={(e) => handleCostChange(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`items[${index}].total`}
                      value={item.total}
                      readOnly
                    />
                  </td>
                  <td>
                    <Button color="danger" onClick={() => {
                      const updatedItems = formData.items.filter((_, i) => i !== index);
                      setFormData({ ...formData, items: updatedItems });
                    }}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5"></td>
                <td>
                  <Button
                    color="success"
                    onClick={() => setFormData({ ...formData, items: [...formData.items, { productId: "", quantityAvailable: 0, quantity: 0, cost: 0, total: 0 }] })}
                  >
                    Add Item
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
          <Row className="justify-content-end">
            <Col xs={3} className="mb-2">
              <Label for="totalAmount">Total Amount</Label>
              <Input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                readOnly
                invalid={!!errors.totalAmount}
              />
              {errors.totalAmount && <FormFeedback>{errors.totalAmount}</FormFeedback>}
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end my-5">
              <Button
                type="submit"
                className="me-1"
                color="primary"
                disabled={isLoading || updateLoading}
              >
                {(isLoading || updateLoading) && <Spinner size="sm" className="me-2" />}
                {isLoading || updateLoading ? "Submitting..." : "Submit"}
              </Button>
              <Button
                type="reset"
                className="w-20"
                color="dark"
                outline
                onClick={onDiscard}
              >
                Close
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </Fragment>
  );
};

export default PurchaseForm;
