import { Fragment, useEffect } from "react";

//3rd party packages
import Joi, { string } from "joi";
import { Controller, useForm } from "react-hook-form";
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
  Spinner,
} from "reactstrap";

//custom packages
import { ProductsApi } from "common/utils/axios/api";
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
  socialMedia: Joi.string().label("socialMedia"),
  about: Joi.string().label("about"),
});

//component
const ProductsModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const defaultValues = {
    name: selectedRow?.name || "",
    email: selectedRow?.email || "",
    password: selectedRow?.password || "",
    address: selectedRow?.status || "",
    about: selectedRow?.about || "",
    contactInfo: selectedRow?.contactInfo || "",
    socialMedia: selectedRow?.socialMedia || {
      facebook: "facebook.com",
      twitter: "twitter.com",
      instagram: "instagram.com",
    },
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
    ProductsApi,
    "Agent Created Successfully",
    () => {
      setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    ProductsApi,
    false,
    () => {
      setShowModal(false);
      setSelectedRow(null);
    }
  );

  const onSubmit = (data) => {
    if (selectedRow) {
      mutateUpdate({ data, updateId: selectedRow?._id });
    } else {
      mutate(data);
    }
  };

  const onDiscard = () => {
    clearErrors();
    reset();
    setShowModal(false);
    setSelectedRow && setSelectedRow();
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (selectedRow) {
      reset({
        ...defaultValues,
        name: selectedRow?.name || "",
        email: selectedRow?.email || "",
        password: selectedRow?.password || "",
        address: selectedRow?.status || "",
        about: selectedRow?.about || "",
        contactInfo: selectedRow?.contactInfo || "",
        socialMedia: selectedRow?.socialMedia || {
          facebook: "facebook.com",
          twitter: "twitter.com",
          instagram: "instagram.com",
        },
      });
    }
  }, [selectedRow]);

  return (
    <Fragment>
      <Modal
        isOpen={showModal}
        onClosed={onDiscard}
        toggle={toggleModal}
        modalClassName=""
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal} className="bg-white">
            {!selectedRow ? "New Agent" : "Update Agent"}
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col xs={6} className="mb-2">
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
              <Col xs={6} className="mb-2">
                <Label className="form-label" for="name">
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

              {/* <Col xs={12} className="mb-2">
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
              </Col> */}
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

              {/* <Col xs={12} className="mb-2">
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
              </Col> */}
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
                      rows="2"
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
              <Col xs={12} className="mb-2">
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
          </ModalBody>
          <ModalFooter>
            <Col className="d-flex justify-content-end">
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
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default ProductsModal;
