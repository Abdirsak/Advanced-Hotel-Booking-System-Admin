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
import { CategoryAPI } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";

//validation schema
const schema = Joi.object({
  name: Joi.string().min(3).max(50).required().label("Name"),
  description: Joi.string().min(2).max(50).required().label("Description"),
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
    name: selectedRow?.name || "",
    description: selectedRow?.description || "",
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
    CategoryAPI,
    "users Created Successfully",
    () => {
      setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    CategoryAPI,
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
        name: selectedRow?.name || "",
        description: selectedRow?.description || "",
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
            {!selectedRow ? "New Category" : "Update Category"}
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
                      placeholder="Name"
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
                <Label className="form-label" for="description">
                  Description
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="description"
                      type="textarea"
                      placeholder="Full Name"
                      {...register(
                        "description",
                        { required: true },
                        "Description is required"
                      )}
                      invalid={errors.description && true}
                      {...field}
                    />
                  )}
                />
                {errors.description && (
                  <FormFeedback>{errors.description.message}</FormFeedback>
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
