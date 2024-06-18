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
import { ProductCategoryApi } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";

//validation schema
const schema = Joi.object({
  name: Joi.string().min(2).max(20).required().label("Name"),
  description: Joi.string().label("description"),
});

//component
const CategoryModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const defaultValues = {
    name: selectedRow?.name || "",
    description: selectedRow?.description || "",
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
    ProductCategoryApi,
    "Prooduct Category Created Successfully",
    () => {
      setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    ProductCategoryApi,
    "Prooduct Category Updated Successfully",
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
        description: selectedRow?.description || "",
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
                <Label className="form-label" for="description">
                  Description
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                    id="description"
                    placeholder="description"
                    {...register(
                      "description",
                      { required: true },
                      "description is required"
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

export default CategoryModal;
