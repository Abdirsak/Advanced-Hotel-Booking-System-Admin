"use client";

import { Fragment, useState,useEffect } from "react";
import Select from 'react-select';
import Joi from "joi";
import {
  Button, Col, Form, FormFeedback, Input, Label, Row, Spinner, Container
} from "reactstrap";
import { ProductsApi,SuppliersApi } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";
import { useQuery } from "@tanstack/react-query"; // or "react-query" if using older version
import request  from "common/utils/axios/index";
const fetchSuppliers = async () => {
    const response = await request({
      method: 'GET',
      url: SuppliersApi,
    });
    return response.data;
  };
  
  const useQueryFunc = () => {
    return useQuery({
      queryKey: 'supplier',
      queryFn: fetchSuppliers,
    });
  };
// Validation schema using Joi
const schema = Joi.object({
  name: Joi.string().min(2).max(50).required().label("Name"),
  quantity: Joi.number().min(1).required().label("quantity"),
  price: Joi.number().min(1).required().label("price"),
  address: Joi.number().min(1).required().label("Address"),
  contactInfo: Joi.string().min(3).max(20).required().label("Contact Info"),
  title: Joi.string().min(3).max(20).required().label("Title"),
  experience: Joi.number().required().label("Experience"),
  about: Joi.string().label("About"),
  specialties: Joi.array().items(Joi.string()).label("Specialties"),
  cost: Joi.number().min(1).required().label("cost"),
  profilePicture: Joi.string().allow('', null).label("Profile Image"),
  status: Joi.string().valid('active', 'inactive').required().label("Status")
}).unknown(); 

const ProductsRegistrationForm = () => {
    const [suppliers,setSuppliers] =  useState([])

    const { data, error } = useQueryFunc();

    useEffect(()=>{
        setSuppliers(data?.data?.docs)
    },[data])
    console.log(suppliers)

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>Error: {error.message}</div>;
    // }
  const [formData, setFormData] = useState({
    name: "", quantity: "", price: "", address: "", about: "",
    contactInfo: "", cost: "", profilePicture: "", status: "active",
    experience: 0, title: "", specialties: []
  });

  const [errors, setErrors] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [image, setImage] = useState(null);

  const { mutate, isPending: isLoading } = useCreate(
    ProductsApi, "Products Created Successfully", () => {}
  );
  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    ProductsApi, false, () => {}
  );

  const options = [
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

  // const handleImage = (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     setImage(reader.result);
  //     setFormData({ ...formData, profilePicture: reader.result });
  //   };
  // };

//   const handleImage = (e) =>{
//     const file = e.target.files[0];
//     setFileToBase(file);
//     console.log(file);
// }

// const setFileToBase = (file) =>{
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () =>{
//       setFormData({ ...formData, profilePicture: reader.result })
//         // setImage(reader.result);
//     }

// }
// const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState("");

    // convert image file to base64
    const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // setImage(reader.result); 
      setFormData({ ...formData, profilePicture: reader.result })
      // setImageBase64(reader.result);
    };
  };

  // receive file from form
    const handleImage = (e) => {
      
    const file = e.target.files[0];
    // setImage(file);
    setFileToBase64(file);
  };
const setFileToBase = (file) =>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () =>{
        setImage(reader.result);
    }
  }
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
    console.log(formData);
    const newErrors = validate();
    setErrors(newErrors || {});
    console.log(newErrors)
    if (newErrors) return;


     // Log formData to check if data is correct

  
    
      mutate(formData);
    
  };

  const onDiscard = () => {
    setFormData({
      name: "", quantity: "", price: "", address: "", about: "",
      contactInfo: "", cost: "", profilePicture: "", status: "active",
      experience: 0, title: "", specialties: []
    });
    setErrors({});
  };

  return (
    <Fragment>
      <Container>
        <Form onSubmit={handleSubmit} className="m-5 shadow-lg p-2">
          <Row className="justify-content-center">
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="name">Agent Name</Label>
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
              <Label className="form-label" for="status">Status</Label>
              <Input
                id="status"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Input>
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="select"
                value={formData.title}
                onChange={handleInputChange}
                invalid={!!errors.title}
              >
                <option value="Agent">Agent</option>
                <option value="Seller">Seller</option>
              </Input>
              {errors.title && <FormFeedback>{errors.title}</FormFeedback>}
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={3} lg={3} sm={12} className="mb-2">
              <Label className="form-label" for="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                invalid={!!errors.quantity}
              />
              {errors.quantity && <FormFeedback>{errors.quantity}</FormFeedback>}
            </Col>
            <Col md={3} lg={3} sm={12} className="mb-2">
              <Label className="form-label" for="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="price"
                value={formData.price}
                onChange={handleInputChange}
                invalid={!!errors.price}
              />
              {errors.price && <FormFeedback>{errors.price}</FormFeedback>}
            </Col>
            <Col md={3} lg={3} sm={12} className="mb-2">
              <Label className="form-label" for="cost">Cost</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                placeholder="Social Media"
                value={formData.cost}
                onChange={handleInputChange}
              />
            </Col>
            <Col md={3} lg={3} sm={12} className="mb-2">
              <Label className="form-label" for="cost">Social Media</Label>
              <Input
                id="cost"
                name="cost"
                type="text"
                placeholder="Social Media"
                value={formData.cost}
                onChange={handleInputChange}
              />
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={3} lg={3} sm={12} className="mb-2">
              <Label className="form-label" for="status">Status</Label>
              <Input
                id="status"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Input>
            </Col>
            <Col md={3} lg={3} sm={12} className="mb-2">
              <Label className="form-label" for="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="select"
                value={formData.title}
                onChange={handleInputChange}
                invalid={!!errors.title}
              >
                <option value="Agent">Agent</option>
                <option value="Seller">Seller</option>
              </Input>
              {errors.title && <FormFeedback>{errors.title}</FormFeedback>}
            </Col>
            <Col md={3} lg={3} sm={12} className="mb-2">
              <Label className="form-label" for="experience">Experience</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                placeholder="Experience"
                value={formData.experience}
                onChange={handleInputChange}
                invalid={!!errors.experience}
              />
              {errors.experience && <FormFeedback>{errors.experience}</FormFeedback>}
            </Col>
            <Col md={3} lg={3} sm={12} className="mb-2">
              <Label className="form-label" for="specialties">Specialties</Label>
              <Select
                isMulti
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedOptions}
                onChange={handleChange}
              />
              {errors.specialties && <FormFeedback>{errors.specialties}</FormFeedback>}
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs={12} className="mb-2">
              <Label className="form-label" for="about">About</Label>
              <Input
                id="about"
                name="about"
                type="textarea"
                rows="3"
                placeholder="About"
                value={formData.about}
                onChange={handleInputChange}
                invalid={!!errors.about}
              />
              {errors.about && <FormFeedback>{errors.about}</FormFeedback>}
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={6} lg={6} sm={12}>
              <Label className="form-label">Applicant Image <span className="text-danger">*</span></Label>
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
