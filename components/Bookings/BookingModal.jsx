import { Fragment, useEffect } from "react";
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
import { BookingsApi, CustomersApi, RoomsApi } from "common/utils/axios/api";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";

// Fetch customers and rooms
const fetchCustomers = async () => {
  const response = await request({
    method: 'GET',
    url: CustomersApi,
  });
  return response.data;
};

const fetchRooms = async () => {
  const response = await request({
    method: 'GET',
    url: RoomsApi,
  });
  return response.data;
};

// Validation schema
const schema = Joi.object({
  customer: Joi.string().required().label("Customer"),
  room: Joi.string().required().label("Room"),
  checkInDate: Joi.date().min(
    Joi.ref('$now', { 
      adjust: (value) => {
        const today = new Date(value);
        today.setHours(0, 0, 0, 0);
        return today;
      }
    })
  ).required().label("Check-in Date"),
  checkOutDate: Joi.date().min(Joi.ref('checkInDate')).required().label("Check-out Date"),
  totalAmount: Joi.number().min(0).required().label("Total Amount"),
  status: Joi.string().valid('Pending', 'Confirmed', 'Canceled').default('Pending').label("Status")
});

// Custom hook for fetching customers and rooms
const useCustomersAndRooms = () => {
  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const roomsQuery = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
  });

  return {
    customers: customersQuery.data?.data || [],
    rooms: roomsQuery.data?.data || [],
    isLoading: customersQuery.isLoading || roomsQuery.isLoading
  };
};

// Booking Modal Component
const BookingModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const queryClient = useQueryClient();
  const { customers, rooms, isLoading: isDataLoading } = useCustomersAndRooms();

  const defaultValues = {
    customer: "",
    room: "",
    checkInDate: "",
    checkOutDate: "",
    totalAmount: "",
    status: "Pending"
  };

  const {
    control,
    handleSubmit,
    register,
    clearErrors,
    reset,
    watch,
    formState: { errors },
  } = useForm({ 
    defaultValues, 
    resolver: joiResolver(schema),
    context: { now: new Date() } // Pass current date as context
  });

  const { mutate, isPending: isCreating } = useCreate(
    BookingsApi,
    "Booking Created Successfully",
    () => {
      setShowModal(false);
      reset(defaultValues);
    }
  );

  const { mutate: mutateUpdate, isPending: isUpdating } = useUpdate(
    BookingsApi,
    "Booking Updated Successfully",
    () => {
      setShowModal(false);
      setSelectedRow(null);
      reset(defaultValues);
    }
  );

  // Calculate total amount based on room price and dates
  const calculateTotalAmount = (checkInDate, checkOutDate, roomPrice) => {
    if (checkInDate && checkOutDate && roomPrice) {
      const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
      return nights * roomPrice;
    }
    return 0;
  };

  // Watch form values for dynamic calculations
  const watchCheckInDate = watch("checkInDate");
  const watchCheckOutDate = watch("checkOutDate");
  const watchRoom = watch("room");

  // Dynamically calculate total amount
  useEffect(() => {
    if (watchRoom) {
      const selectedRoom = rooms.docs.find(room => room._id === watchRoom);
      if (selectedRoom) {
        // Set default total amount based on room price per night
        reset(prev => ({ 
          ...prev, 
          totalAmount: selectedRoom.pricePerNight 
        }));
      }
    }
  }, [watchRoom, rooms, reset]);

  // Calculate total amount when dates change
  useEffect(() => {
    if (watchCheckInDate && watchCheckOutDate && watchRoom) {
      const selectedRoom = rooms.docs.find(room => room._id === watchRoom);
      if (selectedRoom) {
        const totalAmount = calculateTotalAmount(
          watchCheckInDate, 
          watchCheckOutDate, 
          selectedRoom.pricePerNight
        );
        reset(prev => ({ ...prev, totalAmount }));
      }
    }
  }, [watchCheckInDate, watchCheckOutDate, watchRoom, rooms, reset]);

  // Submit handler
  const onSubmit = (data) => {
    if (selectedRow) {
      mutateUpdate({ data, updateId: selectedRow?._id });
    } else {
      mutate(data);
    }
  };

  // Discard/Close handler
  const onDiscard = () => {
    clearErrors();
    reset(defaultValues);
    setShowModal(false);
    setSelectedRow && setSelectedRow(null);
  };

  // Populate form with selected row data when editing
  useEffect(() => {
    if (selectedRow) {
      reset({
        customer: selectedRow?.customer?._id || "",
        room: selectedRow?.room?._id || "",
        checkInDate: selectedRow?.checkInDate?.split("T")[0] || "",
        checkOutDate: selectedRow?.checkOutDate?.split("T")[0] || "",
        totalAmount: selectedRow?.totalAmount || "",
        status: selectedRow?.status || "Pending"
      });
    }
  }, [selectedRow, reset]);

  return (
    <Fragment>
      <Modal
        isOpen={showModal}
        onClosed={onDiscard}
        toggle={() => setShowModal(!showModal)}
        size="lg"
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={() => setShowModal(!showModal)} className="bg-white">
            {!selectedRow ? "New Booking" : "Update Booking"}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col xs={12} md={6} className="mb-2">
                <Label className="form-label" for="customer">
                  Customer
                </Label>
                <Controller
                  name="customer"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="customer"
                      type="select"
                      {...register("customer")}
                      invalid={errors.customer && true}
                      {...field}
                    >
                      <option value="">Select Customer</option>
                      {customers?.docs.map((customer) => (
                        <option key={customer._id} value={customer._id}>
                          {customer.fullName}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.customer && (
                  <FormFeedback>{errors.customer.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} className="mb-2">
                <Label className="form-label" for="room">
                  Room
                </Label>
                <Controller
                  name="room"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="room"
                      type="select"
                      {...register("room")}
                      invalid={errors.room && true}
                      {...field}
                    >
                      <option value="">Select Room</option>
                      {rooms.docs.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.roomNo} - {room.roomType} (${room.pricePerNight}/night)
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.room && (
                  <FormFeedback>{errors.room.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} className="mb-2">
                <Label className="form-label" for="checkInDate">
                  Check-in Date
                </Label>
                <Controller
                  name="checkInDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="checkInDate"
                      type="date"
                      {...register("checkInDate")}
                      invalid={errors.checkInDate && true}
                      {...field}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  )}
                />
                {errors.checkInDate && (
                  <FormFeedback>{errors.checkInDate.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} className="mb-2">
                <Label className="form-label" for="checkOutDate">
                  Check-out Date
                </Label>
                <Controller
                  name="checkOutDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="checkOutDate"
                      type="date"
                      {...register("checkOutDate")}
                      invalid={errors.checkOutDate && true}
                      {...field}
                      min={watchCheckInDate || new Date().toISOString().split('T')[0]}
                    />
                  )}
                />
                {errors.checkOutDate && (
                  <FormFeedback>{errors.checkOutDate.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} className="mb-2">
                <Label className="form-label" for="totalAmount">
                  Total Amount
                </Label>
                <Controller
                  name="totalAmount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="totalAmount"
                      type="number"
                      placeholder="Total Amount"
                      {...register("totalAmount")}
                      invalid={errors.totalAmount && true}
                      {...field}
                      readOnly
                    />
                  )}
                />
                {errors.totalAmount && (
                  <FormFeedback>{errors.totalAmount.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} className="mb-2">
                <Label className="form-label" for="status">
                  Booking Status
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="status"
                      type="select"
                      {...register("status")}
                      invalid={errors.status && true}
                      {...field}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Canceled">Canceled</option>
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
                disabled={isCreating || isUpdating || isDataLoading}
              >
                {(isCreating || isUpdating || isDataLoading) && (
                  <Spinner size="sm" className="me-2" />
                )}
                {isCreating || isUpdating || isDataLoading 
                  ? "Submitting..." 
                  : "Submit"
                }
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

export default BookingModal;