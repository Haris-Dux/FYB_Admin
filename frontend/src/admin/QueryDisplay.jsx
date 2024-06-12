import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const QueryDisplay = () => {
  const { id } = useParams();
  console.log("id", id);
  // GETTING QUERIES
  const { queries, isLoading } = useSelector((state) => state.contact);

  const queryMessage = queries.orders.find((data) => data.id === id);
  console.log("queryMessage", queryMessage);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader type="ball-beat" active={true} />
        </div>
      ) : (
        <section class="bg-gray-200 dark:bg-gray-700 p-3 sm:p-5 min-h-screen">
          <div className="mx-auto max-w-screen-xl px-4 lg:px-3">
            <div className="bg-white dark:bg-gray-800 relative px-7 py-5 shadow-md sm:rounded-lg overflow-hidden">
              <h2 class="mb-4 text-3xl tracking-tight font-bold text-gray-900 dark:text-gray-100">
                Name : {queryMessage.name}
              </h2>
              <h2 class="mb-4 text-lg font-medium underline underline-offset-4 text-blue-700">
                Email : {queryMessage.email}
              </h2>
              <h2 class="mb-4 text-lg font-medium underline underline-offset-4 text-blue-700">
                Number : {queryMessage.phoneNumber}
              </h2>
              <p class="mb-4 text-md text-gray-700 dark:text-gray-100 font-light leading-6">
                <span className="text-lg font-medium underline text-blue-700">
                  Message
                </span>{" "}
                : {queryMessage.message}
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default QueryDisplay;
