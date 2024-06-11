import { Fragment, useEffect,useState } from "react";
import Select from 'react-select';

//3rd party packages
import Joi, { string } from "joi";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import SingleFileUpload from "../../common/fileUpload/SingleFileUploader";
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
  Spinner,
  Container
} from "reactstrap";

//custom packages
import { AgentsAPI } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";

//validation schema
const schema = Joi.object({
  name: Joi.string().min(2).max(50).required().label("name"),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().min(3).max(20).required().label("Password"),
  address: Joi.string().min(3).max(20).required().label("Address"),
  contactInfo: Joi.string().min(3).max(20).required().label("ContactInfo"),
  title: Joi.string().min(3).max(20).required().label("title"),
  experience: Joi.required().label("experience"),
  socialMedia: Joi.string().label("socialMedia"),
  about: Joi.string().label("about"),
});

//component
const AgentsFormRegistration = ({

}) => {
  const defaultValues = {
    name:  "",
    email:  "",
    password:  "",
    address: "",
    about: "",
    contactInfo: "",
    socialMedia: {},
    profileImage:"",
    status:"",
    experience:0,
    title:"",
    specialties:[]

  };

  const {
    control,
    setError,
    handleSubmit,
    register,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });
  // resolver: joiResolver(schema)
  const { mutate, isPending: isLoading } = useCreate(
    AgentsAPI,
    "Agent Created Successfully",
    () => {
    //   setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    AgentsAPI,
    false,
    () => {
    //   setShowModal(false);
    //   setSelectedRow(null);
    }
  );

  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'Renting', label: 'Renting' },
    { value: 'Selling', label: 'Selling' },
    { value: 'Keeping', label: 'Keeping' },
    { value: 'Orderinng', label: 'Orderinng' }
 
  ];

  const handleChange = (selected) => {
    console.log(selected.value)
    setSelectedOptions(selected.value);
  };
  const [image, setImage] = useState([]);

  const handleImage = (e) =>{
    const file = e.target.files[0];
    setFileToBase(file);
    console.log(file);
}

const setFileToBase = (file) =>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () =>{
        setImage(reader.result);
    }

}
  const onSubmit = (data) => {
    console.log(data)
    if (selectedRow) {
      mutateUpdate({ data, updateId: selectedRow?._id });
    } else {
      mutate(data);
    }
  };

  const onDiscard = () => {
    clearErrors();
    reset();
    // setShowModal(false);
    // setSelectedRow && setSelectedRow();
  };

//   const toggleModal = () => {
//     setShowModal(!showModal);
//   };

//   useEffect(() => {
//     if (selectedRow) {
//       reset({
//         ...defaultValues,
//         name: selectedRow?.name || "",
//         email: selectedRow?.email || "",
//         password: selectedRow?.password || "",
//         address: selectedRow?.status || "",
//         about: selectedRow?.about || "",
//         contactInfo: selectedRow?.contactInfo || "",
//         socialMedia: selectedRow?.socialMedia || {
//           facebook: "facebook.com",
//           twitter: "twitter.com",
//           instagram: "instagram.com",
//         },
//       });
//     }
//   }, [selectedRow]);

  return (
    <Fragment>
    <Container> 
        <Form onSubmit={handleSubmit(onSubmit)}>
     
            <Row className="justify-content-center">
              <Col md={4} className="mb-2">
                <Label className="form-label" for="name">
                  Agent Name
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="name"
                      {...register(
                        "name",
                        { required: true },
                        "name is required"
                      )}
                      invalid={errors.name && true}
                      {...field}
                    />
                  )}
                />
                {errors.name && (
                  <FormFeedback>{errors.name.message}</FormFeedback>
                )}
              </Col>
              <Col md={4} className="mb-2">
                <Label className="form-label" for="address">
                  Address
                </Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="address"
                      placeholder="address"
                      {...register(
                        "address",
                        { required: true },
                        "Address is required"
                      )}
                      invalid={errors.address && true}
                      {...field}
                    />
                  )}
                />
                {errors.address && (
                  <FormFeedback>{errors.address.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="contactInfo">
                  Contact
                </Label>
                <Controller
                  name="contactInfo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="contactInfo"
                      type="text"
                      placeholder="contactInfo"
                      {...register(
                        "contactInfo",
                        { required: true },
                        "contactInfo is required"
                      )}
                      invalid={errors.contactInfo && true}
                      {...field}
                    />
                  )}
                />
                {errors.contactInfo && (
                  <FormFeedback>{errors.contactInfo.message}</FormFeedback>
                )}
              </Col>
             
            </Row>
            <Row className="justify-content-center">
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="email">
                  Email
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="email"
                      {...register(
                        "email",
                        { required: true },
                        "email is required"
                      )}
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
                {errors.email && (
                  <FormFeedback>{errors.email.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="password">
                  Password
                </Label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="password"
                      type="password"
                      placeholder="password"
                      {...register(
                        "password",
                        { required: true },
                        "password is required"
                      )}
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="socialMedia">
                  socialMedia
                </Label>
                <Controller
                  name="socialMedia"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="socialMedia"
                      type="text"
                      placeholder="Social Media"
                      {...register("socialMedia")}
                      // invalid={errors.address && true}
                      {...field}
                    />
                  )}
                />
                {/* {errors.address && (
                  <FormFeedback>{errors.address.message}</FormFeedback>
                )} */}
              </Col>

       
                
            </Row>
         
            <Row className="justify-content-center">
              <Col md={3} className="mb-2">
                <Label className="form-label" for="status">
                  Status
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      type="select"
                      placeholder="Name"
                      {...register(
                        "status",
                        { required: true },
                        "Status is required"
                      )}
                      invalid={errors.status && true}
                      {...field}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">InActive</option>
                    </Input>
                  )}
                />
                {errors.status && (
                  <FormFeedback>{errors.status.message}</FormFeedback>
                )}
              </Col> 
              <Col md={3} className="mb-2">
                <Label className="form-label" for="title">
                  Title
                </Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      type="select"
                      placeholder="Name"
                      {...register(
                        "title",
                        { required: true },
                        "title is required"
                      )}
                      invalid={errors.title && true}
                      {...field}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">InActive</option>
                    </Input>
                  )}
                />
                {errors.title && (
                  <FormFeedback>{errors.title.message}</FormFeedback>
                )}
              </Col> 
              <Col md={3} className="mb-2">
                <Label className="form-label" for="experience">
                  Experience
                </Label>
                <Controller
                  name="experience"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="experience"
                      type="Number"
                      placeholder="experience"
                      {...register(
                        "experience",
                        { required: true },
                        "experience is required"
                      )}
                      invalid={errors.experience && true}
                      {...field}
                    />
                  )}
                />
                {errors.experience && (
                  <FormFeedback>{errors.experience.message}</FormFeedback>
                )}
              </Col>
              <Col xs={3} className="mb-2">
                
              <Label className="form-label" for="specialties">
                  specialties
                </Label>
                <Controller
                  name="specialties"
                  control={control}
                  render={({ field }) => (
                    <Select
                    isMulti
                    value={selectedOptions}
                    onChange={handleChange}
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    invalid={errors.specialties && true}
                      {...field}
                  />
                  )}
                />
                {errors.specialties && (
                  <FormFeedback>{errors.specialties.message}</FormFeedback>
                )}
              </Col>
             
            </Row>
            <Row className="justify-content-center">
              
            
              <Col xs={12} className="mb-2">
                <Label className="form-label" for="about">
                  About
                </Label>
                <Controller
                  name="about"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="about"
                      type="textarea"
                      rows="3"
                      placeholder="about"
                      {...register("about")}
                      // invalid={errors.address && true}
                      {...field}
                    />
                  )}
                />
                {/* {errors.address && (
                  <FormFeedback>{errors.address.message}</FormFeedback>
                )} */}
              </Col>
            </Row>
            <Row className="justify-content-center">
            {/* <Col sm={6} md={6}>
                {/* <Label className="form-label">Profile Image</Label> */}
                {/* <SingleFileUpload
                  title={"Profile Image"}
                  files={image}
                  setFiles={setImage}
                  
                /> */}
              {/* </Col> */}
              <Col sm={6} md={6}>
              <label className="form-label">
                    Applicant Image <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="file"
                    name="image"
                    accept="image/png, image/gif, image/jpeg, image/jpg"
                    onChange={handleImage}
                    
                    // onChange={(e) => {
                    //   const file = e.target.files[0];
                    //   const reader = new FileReader();
                    //   reader.readAsDataURL(file);
                    //   reader.onload = () => {
                    //     setImage(reader.result);
                    //   };
                    // }}
                  />
                
              </Col>
              <Col md={6} sm={12} lg={5} >
                <div className="mb-2" >
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
                {(isLoading || updateLoading) && (
                  <Spinner size="sm" className="me-2" />
                )}
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

export default AgentsFormRegistration;
