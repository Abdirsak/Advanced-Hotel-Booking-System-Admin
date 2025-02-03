import { Fragment, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import request from "common/utils/axios/index";

// 3rd party packages
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

// custom packages
import { RoomsApi } from "common/utils/axios/api";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";

// validation schema
const schema = Joi.object({
  roomNo: Joi.string().required().label("Room Number"),
  roomType: Joi.string()
    .valid("Single", "Double", "Suite", "Deluxe")
    .required()
    .label("Room Type"),
  pricePerNight: Joi.number().min(0).required().label("Price per Night"),
  floor: Joi.number().min(0).required().label("Floor"),
  description: Joi.string().allow('').optional().label("Description"),
  amenities: Joi.array().items(Joi.string()).optional().label("Amenities"),
});

// Room types
const roomTypes = [
  { value: "Single", label: "Single" },
  { value: "Double", label: "Double" },
  { value: "Suite", label: "Suite" },
  { value: "Deluxe", label: "Deluxe" },
];

// component
const RoomsModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const queryClient = useQueryClient();
  const [amenities, setAmenities] = useState([]);
  const [currentAmenity, setCurrentAmenity] = useState('');

  const defaultValues = {
    roomNo: "",
    roomType: "",
    pricePerNight: "",
    floor: "",
    description: "",
    amenities: [],
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
    RoomsApi,
    "Room Created Successfully",
    () => {
      setShowModal(false);
      reset(defaultValues);
      setAmenities([]);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    RoomsApi,
    "Room Updated Successfully",
    () => {
      setShowModal(false);
      setSelectedRow(null);
      reset(defaultValues);
      setAmenities([]);
    }
  );

  const handleAddAmenity = () => {
    if (currentAmenity.trim() && !amenities.includes(currentAmenity.trim())) {
      const newAmenities = [...amenities, currentAmenity.trim()];
      setAmenities(newAmenities);
      setCurrentAmenity('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    const newAmenities = amenities.filter(
      (amenity) => amenity !== amenityToRemove
    );
    setAmenities(newAmenities);
  };

  const onSubmit = (data) => {
    const submissionData = {
      ...data,
      amenities,
    };

    if (selectedRow) {
      mutateUpdate({ data: submissionData, updateId: selectedRow?._id });
    } else {
      mutate(submissionData);
    }
  };

  const onDiscard = () => {
    clearErrors();
    reset(defaultValues);
    setShowModal(false);
    setSelectedRow && setSelectedRow(null);
    setAmenities([]);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (selectedRow) {
      reset({
        roomNo: selectedRow?.roomNo || "",
        roomType: selectedRow?.roomType || "",
        pricePerNight: selectedRow?.pricePerNight || "",
        floor: selectedRow?.floor || "",
        description: selectedRow?.description || "",
      });
      setAmenities(selectedRow?.amenities || []);
    }
  }, [selectedRow, reset]);

  return (
    <Fragment>
      <Modal
        isOpen={showModal}
        onClosed={onDiscard}
        toggle={toggleModal}
        size="lg"
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal} className="bg-white">
            {!selectedRow ? "New Room" : "Update Room"}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="roomNo">
                  Room Number
                </Label>
                <Controller
                  name="roomNo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="roomNo"
                      placeholder="Room Number"
                      {...register("roomNo")}
                      invalid={errors.roomNo && true}
                      {...field}
                    />
                  )}
                />
                {errors.roomNo && (
                  <FormFeedback>{errors.roomNo.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="roomType">
                  Room Type
                </Label>
                <Controller
                  name="roomType"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="roomType"
                      type="select"
                      {...register("roomType")}
                      invalid={errors.roomType && true}
                      {...field}
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.roomType && (
                  <FormFeedback>{errors.roomType.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="pricePerNight">
                  Price per Night
                </Label>
                <Controller
                  name="pricePerNight"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="pricePerNight"
                      type="number"
                      placeholder="Price per Night"
                      {...register("pricePerNight")}
                      invalid={errors.pricePerNight && true}
                      {...field}
                    />
                  )}
                />
                {errors.pricePerNight && (
                  <FormFeedback>{errors.pricePerNight.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="floor">
                  Floor
                </Label>
                <Controller
                  name="floor"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="floor"
                      type="number"
                      placeholder="Floor"
                      {...register("floor")}
                      invalid={errors.floor && true}
                      {...field}
                    />
                  )}
                />
                {errors.floor && (
                  <FormFeedback>{errors.floor.message}</FormFeedback>
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
                      placeholder="Room Description"
                      {...register("description")}
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
                <Label className="form-label">Amenities</Label>
                <div className="d-flex mb-2">
                  <Input
                    placeholder="Add Amenity"
                    value={currentAmenity}
                    onChange={(e) => setCurrentAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAmenity()}
                    className="me-2"
                  />
                  <Button 
                    color="primary" 
                    onClick={handleAddAmenity}
                    disabled={!currentAmenity.trim()}
                  >
                    Add
                  </Button>
                </div>
                {amenities.length > 0 && (
                  <div className="d-flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                      <div 
                        key={amenity} 
                        className="badge bg-light text-dark d-flex align-items-center"
                      >
                        {amenity}
                        <Button 
                          close 
                          onClick={() => handleRemoveAmenity(amenity)}
                          className="ms-2"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
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

export default RoomsModal;