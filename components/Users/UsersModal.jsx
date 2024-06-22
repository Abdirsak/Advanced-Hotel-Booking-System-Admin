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
  username: Joi.string().min(3).max(50).required().label("username"),
  password: Joi.string().min(2).max(1000),
  fullName: Joi.string().min(2).max(50).required().label("fullName"),
  role: Joi.string().min(2).max(50).required().label("role"),
  departmentId: Joi.string().required().label("departmentId"),
  status: Joi.string().min(2).max(50).required().label("status"),
});

//component
const UsersModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const defaultValues = {
    username: selectedRow?.username || "",
    password: selectedRow?.password || "",
    fullName: selectedRow?.fullName || "",
    role: selectedRow?.role || "",
    departmentId: selectedRow?.departmentId || "",
    status: selectedRow?.status || "Active",
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

  console.log("selected row :", selectedRow);

  const onSubmit = (data) => {
    if (selectedRow) {
      console.log("submitted Data :", data);
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
        username: selectedRow?.username || "",
        password: selectedRow?.password || "",
        fullName: selectedRow?.fullName || "",
        departmentId: selectedRow?.departmentId || "",
        role: selectedRow?.role || "Admin",
        status: selectedRow?.status || "Active",
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
                  User Name
                </Label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="username"
                      placeholder="User Name"
                      {...register(
                        "username",
                        { required: true },
                        "username is required"
                      )}
                      invalid={errors.username && true}
                      {...field}
                    />
                  )}
                />
                {errors.username && (
                  <FormFeedback>{errors.username.message}</FormFeedback>
                )}
              </Col>
              {selectedRow === null && (
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
              )}
              <Col xs={12} className="mb-2">
                <Label className="form-label" for="name">
                  Full Name
                </Label>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fullName"
                      placeholder="Full Name"
                      {...register(
                        "fullName",
                        { required: true },
                        "fullName is required"
                      )}
                      invalid={errors.fullName && true}
                      {...field}
                    />
                  )}
                />
                {errors.fullName && (
                  <FormFeedback>{errors.fullName.message}</FormFeedback>
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
                      <option value="Admin">Admin</option>
                      <option value="user">User</option>
                    </Input>
                  )}
                />
                {errors.role && (
                  <FormFeedback>{errors.role.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} className="mb-2">
                <Label className="form-label" for="role">
                  Department
                </Label>
                <Controller
                  name="departmentId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="departmentId"
                      type="select"
                      placeholder="Department"
                      {...register(
                        "departmentId",
                        { required: true },
                        "Department is required"
                      )}
                      invalid={errors.departmentId && true}
                      {...field}
                    >
                      <option value="666460b1b5d4a06682376000">
                        Main Department
                      </option>
                      <option value="66698cc4fb412e674ef092bf">Second</option>
                      <option value="666460b1b5d4a06682376000">Nasteexo</option>
                      <option value="666460b1b5d4a06682376000">
                        Xawo Taako
                      </option>
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
                      <option value="Active">Active</option>
                      <option value="Inactive">InActive</option>
                    </Input>
                  )}
                />
                {errors.status && (
                  <FormFeedback>{errors.status.message}</FormFeedback>
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
