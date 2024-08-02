"use client"
import { Fragment, useState, useEffect, useRef } from "react";
import Select from 'react-select';
import Joi from "joi";
import {
  Button, Col, Form, FormFeedback, Input, Label, Row, Spinner, Container, Table, Card
} from "reactstrap";

import { CustomersApi, ProductsApi, SalesApi, InvoicesApi } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import request from "common/utils/axios/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InvoiceTemplate from "./InvoiceTemplate"; // Import the InvoiceTemplate component
import { getUserData } from "common/utils";

// Fetch Customers
const fetchCustomers = async () => {
  const response = await request({
    method: "GET",
    url: CustomersApi,
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

// Fetch invoices
const fetchInvoices = async () => {
  const response = await request({
    method: "GET",
    url: `invoices/invoiceNo/last`,
  });
  return response.data;
};

const useCustomers = () => {
  return useQuery({
    queryKey: "customers",
    queryFn: fetchCustomers,
  });
};

const useInvoices = () => {
  return useQuery({
    queryKey: "invoices",
    queryFn: fetchInvoices,
  });
};

const useProducts = () => {
  return useQuery({
    queryKey: "products",
    queryFn: fetchProducts,
  });
};

const schema = Joi.object({
  customer: Joi.string().required().label("Customer"),
  saleDate: Joi.date().required().label("Sale Date"),
  totalAmount: Joi.number().required().label("Total Amount"),
  discount: Joi.number().optional().allow(0).label("Discount"),
  paidBalance: Joi.number().optional().allow(0).label("Paid Balance"),
  status: Joi.string().valid("completed", "pending", "cancelled").required().label("Status"),
  reference: Joi.string().required().label("Reference"),
  salesItems: Joi.array().items(
    Joi.object({
      productId: Joi.string().required().label("Product"),
      quantity: Joi.number().required().label("Quantity"),
      price: Joi.number().required().label("Price"),
      total: Joi.number().required().label("Total"),
      quantityAvailable: Joi.number().required().label("Available Quantity"),
    })
  ).required().label("salesItems")
});

const SalesFormRegistration = ({ showModal, setShowModal, selectedRow, setSelectedRow }) => {
  const [formData, setFormData] = useState({
    customer: "", saleDate: "", totalAmount: 0, discount: 0, status: "pending",
    paidBalance: 0, reference: "",
    salesItems: [{ productId: "", quantity: 0, price: 0, total: 0, quantityAvailable: 0 }]
  });
  
  const [errors, setErrors] = useState({});
  const [customerPhone, setCustomerPhone] = useState(""); // State for customer phone
  const queryClient = useQueryClient();
  
  const { data: customersData } = useCustomers();
  const { data: productsData } = useProducts();
  const { data: lastInvoiceNo } = useInvoices();
  const invoiceTemplateRef = useRef(); // Create a ref for InvoiceTemplate

  const nextInvoiceNo = lastInvoiceNo + 1;

  console.log(nextInvoiceNo)
  const { mutate, isPending: isLoading } = useCreate(
    SalesApi, "Sale Created Successfully", () => {
      // Generate the PDF after a successful creation
      invoiceTemplateRef.current.generatePDF();
      queryClient.invalidateQueries("products"); // Invalidate the products query to refetch the latest products
    }
  );
  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    SalesApi, "Sale Updated Successfully", () => {
      setShowModal(false);
      setSelectedRow(null);
      queryClient.invalidateQueries("products"); // Invalidate the products query to refetch the latest products
    }
  );

  const customersOptions = customersData?.data?.docs?.map(customer => ({ value: customer._id, label: customer.fullName }));
  const productsOptions = productsData?.data?.docs?.map(product => ({ value: product._id, label: product.name }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCustomerChange = (selected) => {
    const customer = customersData?.data?.docs?.find(c => c._id === selected.value);
    setCustomerPhone(customer?.contact || ""); // Set the customer phone
    setFormData({ ...formData, customer: selected.value });
  };

  const handleItemChange = (index, productId) => {
    const selectedItem = productsData?.data?.docs?.find(item => item._id === productId);
    if (selectedItem) {
      const updatedsalesItems = [...formData.salesItems];
      updatedsalesItems[index] = {
        ...updatedsalesItems[index],
        productId: selectedItem._id,
        price: selectedItem.price,
        quantityAvailable: selectedItem.quantity,
        total: updatedsalesItems[index].quantity * selectedItem.price
      };
      setFormData({ ...formData, salesItems: updatedsalesItems });
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedsalesItems = [...formData.salesItems];
    const item = updatedsalesItems[index];
    const total = parseFloat(quantity) * parseFloat(item.price || 0);
    updatedsalesItems[index] = { ...item, quantity, total };
    setFormData({ ...formData, salesItems: updatedsalesItems });
    if (quantity > formData.salesItems[0].quantityAvailable) {
      return toast.error("Quantity cannot be greater than Available Quantity")
    }
  };

  const handlePriceChange = (index, price) => {
    const updatedsalesItems = [...formData.salesItems];
    const item = updatedsalesItems[index];
    const total = parseFloat(price) * parseFloat(item.quantity || 0);
    updatedsalesItems[index] = { ...item, price, total };
    setFormData({ ...formData, salesItems: updatedsalesItems });
  };

  const userData = getUserData();
  const branch = userData?.res?.branch;
  const createdBy = userData?.res?._id;

  useEffect(() => {
    let totalAmount = 0;
    formData?.salesItems?.forEach(item => {
      totalAmount += parseFloat(item.total) || 0;
    });
    setFormData({ ...formData, totalAmount });
  }, [formData.salesItems]);

  useEffect(() => {
    if (selectedRow) {
      const parsedSale = selectedRow;
      setFormData(parsedSale);
    }
  }, [selectedRow]);

  const validate = () => {
    const result = schema.validate(formData, { abortEarly: false });
    if (!result.error) return null;
    const newErrors = {};
    result.error.details.forEach(err => {
      newErrors[err.path[0]] = err.message;
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.totalAmount <= 0) {
      return toast.error("Discount cannot exceed total amount");
    }
    const newErrors = validate();
    setErrors(newErrors || {});
    if (newErrors) return;
    const updatedFormData = { ...formData, invoiceNo: nextInvoiceNo, createdBy, branch };
    if (selectedRow) {
      mutateUpdate({ id: selectedRow._id, ...updatedFormData });
    } else {
      mutate(updatedFormData);
    }
  };

  const onDiscard = () => {
    setFormData({
      customer: "", saleDate: "", totalAmount: 0, discount: 0, status: "pending",
      salesItems: [{ productId: "", quantity: 0, price: 0, total: 0, quantityAvailable: 0 }]
    });
    setErrors({});
    setShowModal(false);
  };

  return (
    <Fragment>
      <ToastContainer />
      <InvoiceTemplate ref={invoiceTemplateRef} invoiceData={{
        date: formData.saleDate,
        name: customersOptions?.find(option => option.value === formData.customer)?.label,
        invoiceNo: nextInvoiceNo,
        customerTel: customerPhone, // Add the customer's phone number to the invoice template
        items: formData.salesItems.map(item => ({
          description: productsOptions?.find(option => option.value === item.productId)?.label,
          qty: item.quantity,
          unitPrice: parseFloat(item.price),
        })),
        total: formData.totalAmount,
        discount: formData.discount,
        paid: parseFloat(formData.paidBalance),
      }} />
      <Card className="m-4 p-4">
        <Form onSubmit={handleSubmit} className="">
          <Row className="justify-content-center">
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="customer">Customer</Label>
              <Select
                id="customer"
                name="customer"
                options={customersOptions}
                value={customersOptions?.find(option => option.value === formData.customer)}
                onChange={handleCustomerChange}
                isInvalid={!!errors.customer}
              />
              {errors.customer && <FormFeedback>{errors.customer}</FormFeedback>}
            </Col>
            <Col md={4} lg={3} sm={12} className="mb-2">
              <Label className="form-label" for="saleDate">Sale Date</Label>
              <Input
                id="saleDate"
                name="saleDate"
                type="date"
                value={formData.saleDate}
                onChange={handleInputChange}
                invalid={!!errors.saleDate}
              />
              {errors.saleDate && <FormFeedback>{errors.saleDate}</FormFeedback>}
            </Col>
            <Col md={4} lg={2} sm={12} className="mb-2">
              <Label className="form-label" for="status">Status</Label>
              <Input
                id="status"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleInputChange}
                invalid={!!errors.status}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </Input>
              {errors.status && <FormFeedback>{errors.status}</FormFeedback>}
            </Col>
            <Col xs={3} className="mb-2">
              <Label for="reference">Reference</Label>
              <Input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                invalid={!!errors.reference}
              />
              {errors.reference && <FormFeedback>{errors.reference}</FormFeedback>}
            </Col>
          </Row>
       
          <Table responsive>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity Available</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData?.salesItems?.map((item, index) => (
                <tr key={index}>
                  <td style={{ width: "300px" }}>
                    <Select
                      name={`salesItems[${index}].productId`}
                      options={productsOptions}
                      value={productsOptions?.find(option => option.value === item.productId)}
                      onChange={(selected) => handleItemChange(index, selected.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`salesItems[${index}].quantityAvailable `}
                      value={item.quantityAvailable}
                      disabled
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`salesItems[${index}].quantity`}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      onBlur={(e) => handleQuantityChange(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`salesItems[${index}].price`}
                      value={item.price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`salesItems[${index}].total`}
                      value={item.total}
                      disabled
                    />
                  </td>
                  <td>
                    <Button color="danger" onClick={() => {
                      const updatedsalesItems = formData.salesItems.filter((_, i) => i !== index);
                      setFormData({ ...formData, salesItems: updatedsalesItems });
                    }}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5"></td>
                <td className="px-4">
                  <Button
                    color="success"
                    onClick={() => setFormData({ ...formData, salesItems: [...formData.salesItems, { productId: "", quantity: 0, price: 0, total: 0, quantityAvailable: 0 }] })}
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
                disabled
                invalid={!!errors.totalAmount}
              />
              {errors.totalAmount && <FormFeedback>{errors.totalAmount}</FormFeedback>}
            </Col>
          </Row>
          {/* Receipt Details Section */}
          <Row>
            <h5 className="mt-4">Receipt Details</h5>
            <Col md={3}>
              <Label for="grandTotal">Grand Total</Label>
              <Input
                type="number"
                name="grandTotal"
                value={formData.totalAmount}
                disabled
              />
            </Col>
            <Col md={3}>
              <Label for="discount">Discount</Label>
              <Input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
              />
            </Col>
            <Col md={3}>
              <Label for="paidBalance">Paid Balance</Label>
              <Input
                type="number"
                name="paidBalance"
                placeholder="Enter Paid Balance"
                value={formData.paidBalance}
                onChange={handleInputChange}
              />
            </Col>
            <Col md={3}>
              <Label for="balance">Balance</Label>
              <Input
                type="number"
                name="balance"
                value={(formData.totalAmount - (formData.discount || 0) - (formData.paidBalance || 0)).toFixed(2)}
                disabled
              />
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
      </Card>
    </Fragment>
  );
};

export default SalesFormRegistration;
