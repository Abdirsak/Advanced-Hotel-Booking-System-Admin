"use client";

import { Fragment, useState, useEffect } from "react";
import Select from 'react-select';
import Joi from "joi";
import {
  Button, Col, Form, FormFeedback, Input, Label, Row, Spinner, Container
} from "reactstrap";
import { ProductsApi, SuppliersApi, ProductCategoryApi, UsersAPI } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";
import { useQuery } from "@tanstack/react-query"; // or "react-query" if using older version
import request from "common/utils/axios/index";

const fetchSuppliers = async () => {
  const response = await request({
    method: 'GET',
    url: SuppliersApi,
  });
  return response.data;
};

const fetchProductCategories = async () => {
  const response = await request({
    method: 'GET',
    url: ProductCategoryApi,
  });
  return response.data;
};

const fetchUsers = async () => {
  const response = await request({
    method: 'GET',
    url: UsersAPI,
  });
  return response.data;
};
const useSuppliers = () => {
  return useQuery({
    queryKey: 'suppliers',
    queryFn: fetchSuppliers,
  });
};

const useProductCategories = () => {
  return useQuery({
    queryKey: 'productCategories',
    queryFn: fetchProductCategories,
  });
};

const useUsers = () => {
  return useQuery({
    queryKey: 'users',
    queryFn: fetchUsers,
  });
};
// Validation schema using Joi
const schema = Joi.object({
  name: Joi.string().min(2).max(50).required().label("Name"),
  quantity: Joi.number().min(1).required().label("Quantity"),
  price: Joi.number().min(1).required().label("Price"),
 
  expireDate: Joi.date().required().label("expireDate"),
  description: Joi.string().allow('', null).label("Description"),
  
  cost: Joi.number().min(1).required().label("Cost"),
  profilePicture: Joi.string().allow('', null).label("Profile Image"),
  category: Joi.string().required().label("Category"),
  supplier: Joi.string().required().label("supplier"),
  brand: Joi.string().required().valid("New", "Old").label("Brand")
}).unknown();

const ProductsRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "", quantity: 0, price: 0,  description: "", cost: 0, profilePicture: "", category: "",supplier:"",
    expireDate:"", brand: "New",createdBy:"65fe91208f8240812e267742"
  });
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [errors, setErrors] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [image, setImage] = useState(null);

  const { data: suppliersData } = useSuppliers();
  const { data: productCategories } = useProductCategories();
  const { data: usersData } = useUsers();

  // console.log(suppliersData)
  const suppliersOptions = suppliersData?.data?.docs?.map(supplier => ({ value: supplier._id, label: supplier.SupplierName }));
  const categoriesOptions = productCategories?.data?.docs?.map(category => ({ value: category._id, label: category.name }));
  const usersOptions = usersData?.data?.docs?.map(user => ({ value: user._id, label: user.username }));

  const { mutate, isPending: isLoading } = useCreate(
    ProductsApi, "Product Created Successfully", () => {}
  );
  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    ProductsApi, false, () => {}
  );

  const specialtiesOptions = [
    { value: 'Renting', label: 'Renting' },
    { value: 'Selling', label: 'Selling' },
    { value: 'Keeping', label: 'Keeping' },
    { value: 'Ordering', label: 'Ordering' }
  ];

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    setFormData({ ...formData, specialties: selected.map(opt => opt.value) });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({ ...formData, profilePicture: reader.result });
    };
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase64(file);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    console.log(newErrors)
    setErrors(newErrors || {});
    if (newErrors) return;
    console.log(formData)
    mutate(formData);
  };

  const onDiscard = () => {
    setFormData({
      name: "", quantity: 0, price: 0, description: "", cost: 0, profilePicture: "", category: "",supplier:"",
      expireDate:"",  brand: ""
    });
    setErrors({});
  };

  return (
    <Fragment>
      <Container>
        <Form onSubmit={handleSubmit} className="m-5 shadow-lg p-2">
          <Row className="justify-content-center">
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                invalid={!!errors.name}
              />
              {errors.name && <FormFeedback>{errors.name}</FormFeedback>}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="category">Category</Label>
              <Select
                id="category"
                name="category"
                options={categoriesOptions}
                value={categoriesOptions?.find(option => option.value === formData.category)}
                onChange={(selected) => setFormData({ ...formData, category: selected.value })}
                invalid={!!errors.category}
              />
              {errors.category && <FormFeedback>{errors.category}</FormFeedback>}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="supplier">Supplier</Label>
              <Select
                id="supplier"
                name="supplier"
                options={suppliersOptions}
                value={suppliersOptions?.find(option => option.value === formData.supplier)}
                onChange={(selected) => setFormData({ ...formData, supplier: selected.value })}
                invalid={!!errors.supplier}
              />
              {errors.supplier && <FormFeedback>{errors.supplier}</FormFeedback>}
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={3} lg={3} sm={12} className="mb-2">
              <Label className="form-label" for="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                type="select"
                value={formData.brand}
                onChange={handleInputChange}
                invalid={!!errors.brand}
              
              >
                <option value="New">New</option>
                <option value="Old">Old</option>
              </Input>
             
              {errors.brand && <FormFeedback>{errors.brand}</FormFeedback>}
            </Col>
            <Col md={2} lg={2} sm={12} className="mb-2">
              <Label className="form-label" for="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                invalid={!!errors.quantity}
              />
              {errors.quantity && <FormFeedback>{errors.quantity}</FormFeedback>}
            </Col>
            <Col md={2} lg={2} sm={12} className="mb-2">
              <Label className="form-label" for="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                invalid={!!errors.price}
              />
              {errors.price && <FormFeedback>{errors.price}</FormFeedback>}
            </Col>
            <Col md={2} lg={2} sm={12} className="mb-2">
              <Label className="form-label" for="cost">Cost</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                placeholder="Cost"
                value={formData.cost}
                onChange={handleInputChange}
                invalid={!!errors.cost}
              />
              {errors.cost && <FormFeedback>{errors.cost}</FormFeedback>}
            </Col>
            <Col md={3} lg={3} sm={12} className="mb-2">
              <Label className="form-label" for="expireDate">expireDate</Label>
              <Input
                id="expireDate"
                name="expireDate"
                type="date"
               onChange={handleDateChange}
                
                placeholder="expireDate"
                value={formData.expireDate}
                invalid={!!errors.expireDate}
              />
              {errors.expireDate && <FormFeedback>{errors.expireDate}</FormFeedback>}
            </Col>
          </Row>

          <Row className="justify-content-center">
      
            {/* <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="createdBy">Created By</Label>
              <Select
                id="createdBy"
                name="createdBy"
                options={categoriesOptions}
                value={categoriesOptions?.find(option => option.value === formData.createdBy)}
                onChange={(selected) => setFormData({ ...formData, createdBy: selected.value })}
                invalid={!!errors.createdBy}
              />
              {errors.createdBy && <FormFeedback>{errors.createdBy}</FormFeedback>}
            </Col> */}
            <Col xs={12} className="mb-2">
              <Label className="form-label" for="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="textarea"
                rows="3"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                invalid={!!errors.description}
              />
              {errors.description && <FormFeedback>{errors.description}</FormFeedback>}
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={6} lg={6} sm={12}>
              <Label className="form-label">Profile Picture</Label>
              <Input
                type="file"
                name="image"
                accept="image/png, image/gif, image/jpeg, image/jpg"
                onChange={handleImage}
              />
            </Col>
            <Col md={6} sm={12} lg={6}>
              <div className="mb-2">
                {image && (
                  <img
                    className="mt-3"
                    src={image}
                    alt="Applicant"
                    style={{ width: "200px", height: "200px" }}
                  />
                )}
              </div>
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

export default ProductsRegistrationForm;
