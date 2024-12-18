"use client";
import investmentType from "@/types/investment";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa6";

const initialValues: investmentType = {
  _id: undefined,
  title: "",
  location: "",
  description: "",
  security_type: "",
  multiple_invest: 0,
  profile_img: "",
  min_invest: 0,
  get_price: 0,
  total_price: 0,
  maturity: "",
  tags: "",
};

const InvestmentPopUp = ({
  selectedInvest,
  isOpen,
  setISOpen,
  update,
}: {
  selectedInvest: any;
  isOpen: boolean;
  setISOpen: (value: boolean) => void;
  update: any;
}) => {
  const [isProfileUploading, setisProfileUploading] = useState<boolean>(false);
  const { register, watch, reset, setValue, unregister } =
    useForm<investmentType>();
  const { _id, profile_img, ...remInvestData } = watch();

  // save data
  const handleSave = async () => {
    if (_id) {
      try {
        const response = await axios.put(`/api/investments/update/${_id}`, {
          ...remInvestData,
          profile_img,
        });
        update();
        handleClose();
        toast.success(response.data.message);
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      try {
        const response = await axios.post("/api/investments/create", watch());
        update();
        handleClose();
        toast.success(response.data.message);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const DeleteInvestment = async () => {
    try {
      const resonse = await axios.delete(`/api/investments/${_id}`);
      toast.success(resonse.data.message);
      update();
      handleClose();
      reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleChange = (e: any) => {
    const formdata = new FormData();
    formdata.append("file", e.target.files[0]);
    formdata.append("upload_preset", "Turfease");
    setValue("profile_img", URL.createObjectURL(e.target.files[0]));
    setisProfileUploading(true);
    uploadProf(formdata);
  };
  //uploadprofie
  const uploadProf = async (data: any) => {
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/ddos89bpu/image/upload`,
        data
      );
      setValue("profile_img", response.data.secure_url);
      setisProfileUploading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    reset(initialValues);
    if (Object.keys(selectedInvest || {})?.length > 0) {
      const { maturity, ...remSelectedInvest } = selectedInvest;
      const UpdateMaturity = maturity.split("T")[0];
      reset({ maturity: UpdateMaturity, ...remSelectedInvest });
    }
  }, [selectedInvest, isOpen]);

  const handleClose = () => {
    unregister();
    reset();
    setISOpen(false);
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={handleClose} placement="top-center">
        <ModalContent>
          <ModalBody>
            <form
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <h2 className="text-4xl font-semibold mb-5">Investment Info</h2>
              <div className="mb-2 w-24 relative">
                <img
                  className="w-24 h-24 overflow-hidden object-cover
                rounded-md"
                  alt="invest-img"
                  src={profile_img ? profile_img : "/images/fallback-img.jpg"}
                />
                <div className="rounded-full py-[3px] px-[3px] absolute bottom-1 right-1 bg-black text-white w-4 h-4">
                  <FaCamera className="text-[10px]" />
                  <div className="relative">
                    <input
                      className="w-5 h-5 absolute top-[-9px] opacity-0 right-0"
                      type="file"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p>Title</p>
                  <input
                    {...register("title", { required: true })}
                    className="border w-full p-2 border-gray-300"
                    type="text"
                    placeholder="Enter Title"
                  />
                </div>
                <div>
                  <p>Description</p>
                  <input
                    {...register("description", { required: true })}
                    className="border w-full p-2 border-gray-300"
                    type="text"
                    placeholder="Enter Description"
                  />
                </div>
                <div>
                  <p>location</p>
                  <input
                    {...register("location", { required: true })}
                    className="border w-full p-2 border-gray-300"
                    type="text"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <p>Get Price</p>
                  <input
                    {...register("get_price", {
                      required: true,
                      pattern: {
                        value: /^\d+$/,
                        message: "Enter valid get_price",
                      },
                    })}
                    className="border w-full p-2 border-gray-300"
                    type="number"
                    placeholder="Enter Get Price"
                  />
                </div>
                <div>
                  <p>Total Price</p>
                  <input
                    {...register("total_price", {
                      required: true,
                      pattern: {
                        value: /^\d+$/,
                        message: "Enter valid total_price",
                      },
                    })}
                    className="border w-full p-2 border-gray-300"
                    type="number"
                    placeholder="Enter total Price"
                  />
                </div>
                <div>
                  <p>Min Investment</p>
                  <input
                    {...register("min_invest", {
                      required: true,
                      pattern: {
                        value: /^\d+$/,
                        message: "Enter valid min_invest",
                      },
                    })}
                    className="border w-full p-2 border-gray-300"
                    type="number"
                    placeholder="Enter Min Investment"
                  />
                </div>
                <div>
                  <p>Maturity</p>
                  <input
                    {...register("maturity", { required: true })}
                    className="border w-full p-2 border-gray-300"
                    type="date"
                    placeholder="Enter Maturity"
                  />
                </div>
                <div>
                  <p>Security Type</p>
                  <input
                    {...register("security_type", { required: true })}
                    className="border w-full p-2 border-gray-300"
                    type="text"
                    placeholder="Enter Security Type"
                  />
                </div>
                <div>
                  <p>Invest Multiple</p>
                  <input
                    {...register("multiple_invest", {
                      required: true,
                      pattern: {
                        value: /^-?\d+(\.\d+)?$/,
                        message: "Enter valid invest_multiple",
                      },
                    })}
                    className="border w-full p-2 border-gray-300"
                    type="text"
                    placeholder="Enter Invest Multiple"
                  />
                </div>
                <div>
                  <p>tags</p>
                  <input
                    {...register("tags", { required: true })}
                    className="border w-full p-2 border-gray-300"
                    type="text"
                    placeholder="Enter tags"
                  />
                  <p className="text-[10px] text-gray-600">
                    you can add one ore more tags separating by " , "
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between mt-5">
                <button
                  onClick={_id ? DeleteInvestment : handleClose}
                  type="reset"
                  className="secondary-button !w-max"
                >
                  {_id ? "Delete" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className={`lightGreen-button !w-max ${
                    isProfileUploading ? "cursor-wait pointer-events-none" : ""
                  }`}
                >
                  {_id ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default InvestmentPopUp;
