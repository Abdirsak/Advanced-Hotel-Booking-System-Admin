import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import request from "common/utils/axios";

const useUpdate = (url, message = null, extraFunction) => {
  const queryClient = useQueryClient();

  const errorHandler = (error) => {
    const errorMessage =
      error?.response?.data?.message ??
      error?.response?.data ??
      error.message ??
      "Unknown error Occurred";

    toast.error(errorMessage);
  };

  const successHandler = (response) => {
    if (response.status === 200 || response.status === 201) {
      const successMessage = message || response?.data?.message;
      extraFunction && extraFunction();
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: [url] });
    } else {
      const errorMsg = response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    }
  };

  return useMutation({
    mutationFn: ({ updateId, data }) =>
      request({
        url: `${url}/${updateId}`,
        method: "PATCH",
        data,
      }),
    onSuccess: (response) => successHandler(response),
    onError: (err) => errorHandler(err),
  });
};

export default useUpdate;
