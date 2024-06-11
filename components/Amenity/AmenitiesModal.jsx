import { joiResolver } from "@hookform/resolvers/joi";
import { AmenitiesAPI } from "common/utils/axios/api";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";
import Joi from "joi";
import { useEffect, Fragment } from "react";

import { Controller, useForm } from "react-hook-form";
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

//validation schema
const schema = Joi.object({
  name: Joi.string().min(2).max(40).required().label("name"),
  type: Joi.string().min(3).max(20).required().label("type"),
  status: Joi.string().label("Status"),
});

const defaultValues = {
  name: "",
  type: "",
  status: "active",
};

const AmenitiesModal = ({
  showModal,
  setShowModal,
  selectedRow,
  setSelectedRow,
}) => {
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
    AmenitiesAPI,
    "Amenities created successfully...",
    () => {
      setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    AmenitiesAPI,
    "Amenities Updated successfully...",
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
        type: selectedRow?.type || "",
        status: selectedRow?.status || "active",
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
                <Label className="form-label" for="type">
                  Type
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="Type"
                      {...register(
                        "type",
                        { required: true },
                        "type is required"
                      )}
                      invalid={errors.type && true}
                      {...field}
                    />
                  )}
                />
                {errors.type && (
                  <FormFeedback>{errors.type.message}</FormFeedback>
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

export default AmenitiesModal;
