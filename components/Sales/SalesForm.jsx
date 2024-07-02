'use client'
import { Fragment, useState, useEffect } from "react";
import Select from 'react-select';
import Joi from "joi";
import {
  Button, Col, Form, FormFeedback, Input, Label, Row, Spinner, Container, Table
} from "reactstrap";
import { CustomersApi, ProductsApi, SalesApi } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";
import { useQuery } from "@tanstack/react-query";
import request from "common/utils/axios/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const fetchSale = async (id) => {
  const response = await request({
    method: "GET",
    url: `${SalesApi}/${id}`,
  });
  return response.data.data; // Adjusted to return the 'data' object directly
};

const useCustomers = () => {
  return useQuery({
    queryKey: "customers",
    queryFn: fetchCustomers,
  });
};

const useProducts = () => {
  return useQuery({
    queryKey: "products",
    queryFn: fetchProducts,
  });
};

const SalesFormRegistration = ({id }) => {
  const [formData, setFormData] = useState({
    customer: "", saleDate: "", totalAmount: 0, discount: 0, status: "pending",
    paidBalance: 0,
    salesItems: [{ productId: "", quantity: 0, price: 0, total: 0, quantityAvailable: 0 }]
  });
  const [errors, setErrors] = useState({});
  const { data: customersData } = useCustomers();
  const { data: productsData } = useProducts();
  
  const { mutate, isPending: isLoading } = useCreate(
    SalesApi, "Sale Created Successfully", () => { }
  );
  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    SalesApi, "Sale Updated Successfully", () => {
      // setShowModal(false);
      
    }
  );

  const customersOptions = customersData?.data?.docs?.map(customer => ({ value: customer._id, label: customer.fullName }));
  const productsOptions = productsData?.data?.docs?.map(product => ({ value: product._id, label: product.name }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, productId) => {
    const selectedItem = productsData?.data?.docs?.find(item => item._id === productId);
    if (selectedItem) {
      const updatedSalesItems = [...formData.salesItems];
      updatedSalesItems[index] = {
        ...updatedSalesItems[index],
        productId: selectedItem._id,
        price: selectedItem.price.$numberDecimal,
        quantityAvailable: selectedItem.quantity,
        total: updatedSalesItems[index].quantity * selectedItem.price.$numberDecimal
      };
      setFormData({ ...formData, salesItems: updatedSalesItems });
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedSalesItems = [...formData.salesItems];
    const item = updatedSalesItems[index];
    const total = parseFloat(quantity) * parseFloat(item.price || 0);
    updatedSalesItems[index] = { ...item, quantity, total };
    setFormData({ ...formData, salesItems: updatedSalesItems });
    if(quantity > formData.salesItems[0].quantityAvailable) {
      return toast.error("Quantity can not be greater than Available Quantity")
    }
  };

  useEffect(() => {
    let totalAmount = 0;
    formData?.salesItems?.forEach(item => {
      totalAmount += parseFloat(item.total) || 0;
    });
    setFormData({ ...formData, totalAmount });
  }, [formData.salesItems]);

  useEffect(() => {
    if (id) {
      fetchSale(id).then(sale => {
        // Convert totalAmount, discount, and salesItems total and price to numbers
        sale.totalAmount = parseFloat(sale.totalAmount.$numberDecimal);
        sale.discount = parseFloat(sale.discount.$numberDecimal);
        // formData.paidBalance = parseFloat(sale.totalAmount.$numberDecimal);
        sale.salesItems = sale.salesItems.map(item => ({
          ...item,
          total: parseFloat(item.total.$numberDecimal),
          price: parseFloat(item.price.$numberDecimal)
        }));
        setFormData(sale);
      });
    }
  }, [id]);

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
    if(formData.totalAmount <= 0) {
      return toast.error("Discount cannot exceed total amount")
    }
    const newErrors = validate();
    setErrors(newErrors || {});
    if (newErrors) return;
    if (id) {
      console.log(formData)
      // mutateUpdate({ id, ...formData });
    } else {
      // mutate(formData);
    }
  };

  const onDiscard = () => {
    setFormData({
      customer: "", saleDate: "", totalAmount: 0, discount: 0, status: "pending",
      salesItems: [{ productId: "", quantity: 0, price: 0, total: 0, quantityAvailable: 0 }]
    });
    setErrors({});
    // setShowModal(false);
  };

  return (
    <Fragment>
      <ToastContainer />
      <Container>
        <Form onSubmit={handleSubmit} className="m-5 shadow-lg p-2">
          <Row className="justify-content-center">
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="customer">Customer</Label>
              <Select
                id="customer"
                name="customer"
                options={customersOptions}
                value={customersOptions?.find(option => option.value === formData.customer)}
                onChange={(selected) => setFormData({ ...formData, customer: selected.value })}
                isInvalid={!!errors.customer}
              />
              {errors.customer && <FormFeedback>{errors.customer}</FormFeedback>}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="saleDate">Sale Date</Label>
              <Input
                id="saleDate"
                name="saleDate"
                type="date"
                value={formData.saleDate.split('T')[0]}
                onChange={handleInputChange}
                invalid={!!errors.saleDate}
              />
              {errors.saleDate && <FormFeedback>{errors.saleDate}</FormFeedback>}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
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
                  <td style={{ width: "250px" }}>
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
                      disabled
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
                      const updatedSalesItems = formData.salesItems.filter((_, i) => i !== index);
                      setFormData({ ...formData, salesItems: updatedSalesItems });
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
      </Container>
    </Fragment>
  );
};

export default SalesFormRegistration;