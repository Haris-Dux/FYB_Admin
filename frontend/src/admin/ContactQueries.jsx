import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getAllQueriesAsync } from "../features/contactSlice";
import Loader from "react-loaders";

const ContactQueries = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryId, setQueryId] = useState(null);

  // GETTING QUERIES
  const { queries, isLoading } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(getAllQueriesAsync());
  }, []);

  const handleMsgShow = (id) => {
    navigate(`/admin/client-message/${id}`);
  };

  // TOGGLE MODAL
  const toggleModal = (id) => {
    setQueryId(id);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <section className="bg-gray-200 dark:bg-gray-900 p-3 sm:p-5 min-h-screen">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-3">
          <div className="bg-white dark:bg-gray-800 relative shadow-md overflow-hidden">
            <h2 className="p-6 text-2xl font-semibold text-gray-700 dark:text-gray-100 tracking-wide">
              Contact Queries
            </h2>

            {/* ----------- TABLE ----------- */}
            {isLoading ? (
               <div className="flex justify-center items-center min-h-screen">
               <Loader type="ball-beat" active={true} />
             </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-md text-left text-gray-500 dark:text-gray-100">
                  <thead className="text-sm tracking-wide text-white uppercase bg-[#EC72AF] ">
                    <tr>
                      <th className="px-4 py-4 border-r-[#EC72AF]" scope="col">
                        Sr #
                      </th>
                      <th className="px-4 py-4" scope="col">
                        Client Name
                      </th>
                      <th className="px-4 py-4" scope="col">
                        Email
                      </th>
                      <th className="px-4 py-4" scope="col">
                        Date
                      </th>
                      <th className="px-4 py-4" scope="col">
                        Message
                      </th>
                      <th className="px-4 py-4" scope="col">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {queries?.orders?.map((data, index) => (
                      <tr
                        key={index}
                        onClick={() => handleMsgShow(data.id)}
                        className="border-b border-[#EC72AF] cursor-pointer"
                      >
                        <th
                          className="px-4 py-4 font-medium border-r border-[#EC72AF] text-gray-900 whitespace-nowrap dark:text-white"
                          scope="row"
                        >
                          {index + 1}
                        </th>
                        <td className="px-4 py-4">{data.name}</td>
                        <td className="px-4 py-4">{data.email}</td>
                        <td className="px-4 py-4">
                          {new Date(data?.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-4">
                          <p>
                            {data.message.length > 50
                              ? `${data.message.substring(0, 30)}`
                              : data.message}{" "}
                            ...
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactQueries;
