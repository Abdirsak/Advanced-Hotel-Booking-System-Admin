import { Fragment, useEffect } from "react";

//3rd party packages
import Joi from "joi";
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
import { UsersAPI } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";

//validation schema
const schema = Joi.object({
  name: Joi.string().min(2).max(20).required().label("name"),
  email: Joi.string().min(2).max(20).required().label("email"),
  phone: Joi.string().min(2).max(20).required().label("phone"),
  password: Joi.string().min(2).max(20).required().label("password"),

  fcmToken: Joi.string().min(2).max(20).required().label("fcmToken"),
  addressCountry: Joi.string()
    .min(2)
    .max(20)
    .required()
    .label("addressCountry"),
  addressCity: Joi.string().min(2).max(20).required().label("addressCity"),
  addressArea: Joi.string().min(2).max(20).required().label("addressArea"),
  bio: Joi.string().min(2).max(20).required().label("bio"),
  role: Joi.string().min(2).max(20).required().label("role"),
  status: Joi.string().min(2).max(20).required().label("status"),
  registerType: Joi.string().min(2).max(20).required().label("registerType"),
  isOnline: Joi.boolean().label("isOnline"),
});

//component
const UsersModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const defaultValues = {
    name: selectedRow?.name || "",
    email: selectedRow?.email || "",
    phone: selectedRow?.phone || "",
    password: selectedRow?.password || "",

    fcmToken: selectedRow?.fcmToken || "",
    addressCountry: selectedRow?.addressCountry || "",
    addressCity: selectedRow?.addressCity || "",
    addressArea: selectedRow?.addressArea || "",
    bio: selectedRow?.bio || "",
    role: selectedRow?.role || "",
    status: selectedRow?.status || "active",
    registerType: selectedRow?.registerType || "",
    isOnline: selectedRow?.isOnline || "",
  };

  const {
    control,
    setError,
    handleSubmit,
    register,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({ defaultValues, resolver: joiResolver(schema) });

  const { mutate, isPending: isLoading } = useCreate(
    UsersAPI,
    "users Created Successfully",
    () => {
      setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    UsersAPI,
    "Users Updated Successfully",
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
        phone: selectedRow?.phone || "",
        password: selectedRow?.password || "",

        fcmToken: selectedRow?.fcmToken || "",
        addressCountry: selectedRow?.addressCountry || "",
        addressCity: selectedRow?.addressCity || "",
        addressArea: selectedRow?.addressArea || "",
        bio: selectedRow?.bio || "",
        role: selectedRow?.role || "admin",
        status: selectedRow?.status || "active",
        registerType: selectedRow?.registerType || "",
        isOnline: selectedRow?.isOnline || "",
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
            {!selectedRow ? "New Users" : "Update Users"}
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col xs={12} className="mb-2">
                <Label className="form-label" for="name">
                  Name
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

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="email">
                  Email
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
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

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="phone">
                  phone
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="phone"
                      placeholder="phone"
                      {...register(
                        "phone",
                        { required: true },
                        "phone is required"
                      )}
                      invalid={errors.phone && true}
                      {...field}
                    />
                  )}
                />
                {errors.phone && (
                  <FormFeedback>{errors.phone.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="password">
                  password
                </Label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="password"
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

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="fcmToken">
                  fcmToken
                </Label>
                <Controller
                  name="fcmToken"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fcmToken"
                      placeholder="fcmToken"
                      {...register(
                        "fcmToken",
                        { required: true },
                        "fcmToken is required"
                      )}
                      invalid={errors.fcmToken && true}
                      {...field}
                    />
                  )}
                />
                {errors.fcmToken && (
                  <FormFeedback>{errors.fcmToken.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="addressCountry">
                  addressCountry
                </Label>
                <Controller
                  name="addressCountry"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="addressCountry"
                      placeholder="addressCountry"
                      {...register(
                        "addressCountry",
                        { required: true },
                        "addressCountry is required"
                      )}
                      invalid={errors.name && true}
                      {...field}
                    />
                  )}
                />
                {errors.addressCountry && (
                  <FormFeedback>{errors.addressCountry.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="addressCity">
                  addressCity
                </Label>
                <Controller
                  name="addressCity"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="addressCity"
                      placeholder="addressCity"
                      {...register(
                        "addressCity",
                        { required: true },
                        "addressCity is required"
                      )}
                      invalid={errors.addressCity && true}
                      {...field}
                    />
                  )}
                />
                {errors.addressCity && (
                  <FormFeedback>{errors.addressCity.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="addressArea">
                  addressArea
                </Label>
                <Controller
                  name="addressArea"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="addressArea"
                      placeholder="addressArea"
                      {...register(
                        "addressArea",
                        { required: true },
                        "addressArea is required"
                      )}
                      invalid={errors.addressArea && true}
                      {...field}
                    />
                  )}
                />
                {errors.addressArea && (
                  <FormFeedback>{errors.addressArea.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="bio">
                  bio
                </Label>
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="bio"
                      placeholder="bio"
                      {...register(
                        "bio",
                        { required: true },
                        "bio is required"
                      )}
                      invalid={errors.name && true}
                      {...field}
                    />
                  )}
                />
                {errors.bio && (
                  <FormFeedback>{errors.bio.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} className="mb-2">
                <Label className="form-label" for="role">
                  Role
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      type="select"
                      placeholder="Role"
                      {...register(
                        "role",
                        { required: true },
                        "Role is required"
                      )}
                      invalid={errors.role && true}
                      {...field}
                    >
                      <option value="admin">Admin</option>
                      <option value="teacher">User</option>
                    </Input>
                  )}
                />
                {errors.role && (
                  <FormFeedback>{errors.role.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="status">
                  Status
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="status"
                      type="select"
                      placeholder="status"
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

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="registerType">
                  registerType
                </Label>
                <Controller
                  name="registerType"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="registerType"
                      placeholder="registerType"
                      {...register(
                        "registerType",
                        { required: true },
                        "registerType is required"
                      )}
                      invalid={errors.registerType && true}
                      {...field}
                    />
                  )}
                />
                {errors.registerType && (
                  <FormFeedback>{errors.registerType.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="isOnline">
                  isOnline
                </Label>
                <Controller
                  name="isOnline"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="isOnline"
                      placeholder="isOnline"
                      {...register(
                        "isOnline",
                        { required: true },
                        "isOnline is required"
                      )}
                      invalid={errors.isOnline && true}
                      {...field}
                    />
                  )}
                />
                {errors.isOnline && (
                  <FormFeedback>{errors.isOnline.message}</FormFeedback>
                )}
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

export default UsersModal;
