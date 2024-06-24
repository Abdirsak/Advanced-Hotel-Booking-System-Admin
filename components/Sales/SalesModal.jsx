import React, { useState, useEffect } from "react";
import Select from 'react-select';
import Joi from "joi";
import {
  Button, Col, Form, FormFeedback, Input, Label, Row, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Table
} from "reactstrap";
import { CustomersApi, ProductsApi, SalesApi } from "common/utils/axios/api";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";
import { useQuery } from "@tanstack/react-query";
import request from "common/utils/axios/index";

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

const schema = Joi.object({
  customerId: Joi.string().required().label("Customer"),
  saleDate: Joi.date().required().label("Sale Date"),
  totalAmount: Joi.number().required().label("Total Amount"),
  discount: Joi.number().optional().allow(0).label("Discount"),
  status: Joi.string().valid("completed", "pending", "cancelled").required().label("Status"),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required().label("Product"),
      quantity: Joi.number().required().label("Quantity"),
      price: Joi.number().required().label("Price"),
      total: Joi.number().required().label("Total"),
    })
  ).required().label("Items")
});

const SalesFormModal = ({ showModal, setShowModal, selectedRow, setSelectedRow }) => {
  const [formData, setFormData] = useState({
    customerId: "", saleDate: "", totalAmount: 0, discount: 0, status: "pending",
    items: [{ productId: "", quantity: 0, price: 0, total: 0 }]
  });
  const [errors, setErrors] = useState({});
  const { data: customersData } = useCustomers();
  const { data: productsData } = useProducts();

  const { mutate, isPending: isLoading } = useCreate(
    SalesApi, "Sale Created Successfully", () => { }
  );
  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    SalesApi, "Sale Updated Successfully", () => {
      setShowModal(false);
      setSelectedRow(null);
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
      const updatedItems = [...formData.items];
      updatedItems[index] = {
        ...updatedItems[index],
        productId: selectedItem._id,
        price: selectedItem.price,
        total: updatedItems[index].quantity * selectedItem.price
      };
      setFormData({ ...formData, items: updatedItems });
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedItems = [...formData.items];
    const item = updatedItems[index];
    const total = parseFloat(quantity) * parseFloat(item.price || 0);
    updatedItems[index] = { ...item, quantity, total };
    setFormData({ ...formData, items: updatedItems });
  };

  const handlePriceChange = (index, price) => {
    const updatedItems = [...formData.items];
    const item = updatedItems[index];
    const total = parseFloat(item.quantity || 0) * parseFloat(price);
    updatedItems[index] = { ...item, price, total };
    setFormData({ ...formData, items: updatedItems });
  };

  useEffect(() => {
    let totalAmount = 0;
    formData?.items?.forEach(item => {
      totalAmount += parseFloat(item.total) || 0;
    });
    setFormData({ ...formData, totalAmount });
  }, [formData.items]);

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
    const newErrors = validate();
    setErrors(newErrors || {});
    if (newErrors) return;
    if (selectedRow) {
      mutateUpdate({ id: selectedRow._id, ...formData });
    } else {
      mutate(formData);
    }
  };

  const onDiscard = () => {
    setFormData({
      customerId: "", saleDate: "", totalAmount: 0, discount: 0, status: "pending",
      items: [{ productId: "", quantity: 0, price: 0, total: 0 }]
    });
    setErrors({});
    setShowModal(false);
  };

  return (
    <Modal isOpen={showModal} toggle={onDiscard} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={onDiscard}>{selectedRow ? "Update Sale" : "Create Sale"}</ModalHeader>
        <ModalBody>
          <Row className="justify-content-center">
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="customerId">Customer</Label>
              <Select
                id="customerId"
                name="customerId"
                options={customersOptions}
                value={customersOptions?.find(option => option.value === formData.customerId)}
                onChange={(selected) => setFormData({ ...formData, customerId: selected.value })}
                isInvalid={!!errors.customerId}
              />
              {errors.customerId && <FormFeedback>{errors.customerId}</FormFeedback>}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
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
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData?.items?.map((item, index) => (
                <tr key={index}>
                  <td style={{ width: "250px" }}>
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
                      name={`items[${index}].quantity`}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      onBlur={(e) => handleQuantityChange(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`items[${index}].price`}
                      value={item.price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      onBlur={(e) => handlePriceChange(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`items[${index}].total`}
                      value={item.total}
                      disabled
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
                <td colSpan="4"></td>
                <td className="px-4">
                  <Button
                    color="success"
                    onClick={() => setFormData({ ...formData, items: [...formData.items, { productId: "", quantity: 0, price: 0, total: 0 }] })}
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
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary" disabled={isLoading || updateLoading}>
            {(isLoading || updateLoading) && <Spinner size="sm" className="me-2" />}
            {isLoading || updateLoading ? "Submitting..." : "Submit"}
          </Button>
          <Button type="reset" color="dark" outline onClick={onDiscard}>
            Close
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default SalesFormModal;
