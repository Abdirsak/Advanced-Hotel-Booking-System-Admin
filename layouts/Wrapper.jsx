"use client";
import React from "react";

//
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "redux/store";
import { Toaster } from "react-hot-toast";

const Wrapper = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {/* <Hydrate state={children.dehydratedState}> */}
      <Toaster />

      <Provider store={store}>{children}</Provider>

      {/* </Hydrate> */}
    </QueryClientProvider>
  );
};

export default Wrapper;
