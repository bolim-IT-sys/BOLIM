import axios from "axios";
import type { Dispatch, SetStateAction } from "react";
import type { Part } from "./Part.Service";
import Swal from "sweetalert2";

export interface Inbound {
  id?: number;
  partId: number;
  quantity: number;
  inboundDate: Date;
  createdAt?: Date;
}

export interface Outbound {
  id?: number;
  partId: number;
  quantity: number;
  outboundDate: Date;
  createdAt?: Date;
}

export interface ITStocks {
  id?: number;
  stockId?: number;
  serialNumber: string;
  PRDate: string | null;
  receivedDate: Date | null;
  deployedDate?: Date | null;
  station?: string;
  department?: string;
  reason?: string;
  from?: string;
  to?: string;
  remarks?: string;
  status?: string;
}

export interface InboundOutboundType {
  partNumber: string;
  partId: number;
  lotNo: string;
  from: string;
  to: string;
  currentQuantity: number;
  serialNumber?: string;
  quantity: string;
  inboundDate?: string;
  outboundDate?: string;
  createdAt?: Date;
}

export interface addItemType {
  stockId: number;
  serialNumber: string;
  PRDate: string;
  receivedDate: string;
}

export interface deployItemType {
  from: string;
  to: string;
  serialNumber: string;
  deployedDate: string;
  station: string;
  department: string;
  reason: string;
  remarks: string;
}

export interface updateStatusType {
  stockId?: number;
  serialNumber?: string;
  remarks?: string;
  status?: string;
  newStatus?: string;
  from?: string;
  reason?: string;
}

export interface InboundOutboundResponse {
  success: boolean;
  message?: string;
  data?: Inbound;
}

export interface FetchingInboundsResponse {
  success: boolean;
  message?: string;
  data?: Inbound[];
}

export interface FetchingItemsResponse {
  success: boolean;
  message?: string;
  data?: ITStocks[];
}

export interface outboundItemResponse {
  success: boolean;
  message?: string;
  data?: ITStocks;
}

export interface FetchingOutboundsResponse {
  success: boolean;
  message?: string;
  data?: Outbound[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchAllInbounds(): Promise<FetchingInboundsResponse> {
  try {
    const response = await axios.get(`${API_URL}/parts/fetch-all-inbounds`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      // console.log("Parts Inbounds Fetched: ", response.data);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while fetching parts. Check your internet connection and try again.",
    };
  }
}

export async function fetchInbounds(
  partId: number,
): Promise<FetchingInboundsResponse> {
  try {
    const response = await axios.get(
      `${API_URL}/parts/fetch-inbounds/${partId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status === 200) {
      // console.log("Parts Inbounds Fetched: ", response.data);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while fetching parts. Check your internet connection and try again.",
    };
  }
}

export async function inboundPart(
  item: Part,
  formData: InboundOutboundType,
  fetchTransactions: () => void,
  fetchAllParts: () => void,
  setInboundShow: (value: boolean) => void,
  setModalShow: (value: boolean) => void,
  setData: Dispatch<SetStateAction<Part[]>>,
  setFormData: Dispatch<SetStateAction<InboundOutboundType>>,
  generateZPL: (
    part: string,
    lot: string,
    qty: string,
    user: string,
    date?: string,
  ) => string,
  print: (value: string) => Promise<boolean>,
  printLabel: boolean,
): Promise<InboundOutboundResponse> {
  // FOR ZEBRA PRINTING
  const handlePrint = async (): Promise<void> => {
    const zpl = generateZPL(
      formData.partNumber,
      formData.lotNo,
      formData.quantity,
      formData.from,
      formData.inboundDate,
    );
    const success = await print(zpl);
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Print Sent",
        text: "Label print job was sent successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  try {
    const response = await axios.post(`${API_URL}/parts/inbound`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("creating user");
    if (response.status === 201) {
      setTimeout(
        () => {
          setInboundShow(false);
          Swal.fire({
            icon: "success",
            title: "Inbound Successful",
            text: response.data.message,
            timer: 5000,
            showConfirmButton: false,
          }).then(() => {
            setModalShow(true);
          });

          fetchTransactions();
          fetchAllParts();
          if (printLabel) {
            handlePrint();
          }
          // UPDATING THE QUANTITY OF THE INBOUNDED PART
          setData((prevParts) =>
            prevParts.map((p) =>
              p.id === formData.partId
                ? { ...p, quantity: p.quantity + Number(formData.quantity) }
                : p,
            ),
          );
          // RESETTING FORMDATA AFTER INBOUND
          setFormData((prev) => ({
            ...prev,
            partId: item.id!,
            lotNo: "",
            currentQuantity: item.quantity + Number(formData.quantity),
            serialNumber: `${item.partNumber} ${item.inbounds!.length + 1}`,
            quantity: "1",
          }));
        },
        import.meta.env.VITE_TIME_OUT,
      );
    } else {
      setTimeout(
        () => {
          setInboundShow(false);
          Swal.fire({
            icon: "error",
            title: "Inbound Failed",
            text: response.data.message,
          }).then(() => {
            setModalShow(true);
          });
        },
        import.meta.env.VITE_TIME_OUT,
      );
    }

    return {
      success: false,
      message: "Unexpected response status",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while fetching parts. Check your internet connection and try again.",
    };
  }
}

export async function fetchAllOutbounds(): Promise<FetchingOutboundsResponse> {
  try {
    const response = await axios.get(`${API_URL}/parts/fetch-all-outbounds`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      // console.log("Parts Outbounds Fetched: ", response.data);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while fetching parts. Check your internet connection and try again.",
    };
  }
}

export async function fetchOutbounds(
  partId: number,
): Promise<FetchingOutboundsResponse> {
  try {
    const response = await axios.get(
      `${API_URL}/parts/fetch-outbounds/${partId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // console.log("Parts Outbounds Fetched: ", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while fetching parts. Check your internet connection and try again.",
    };
  }
}

export async function outboundPart(
  item: Part,
  formData: InboundOutboundType,
  setFormData: Dispatch<SetStateAction<InboundOutboundType>>,
  setOutboundShow: (value: boolean) => void,
  setModalShow: (value: boolean) => void,
  fetchTransactions: () => void,
  fetchAllParts: () => void,
  setData: Dispatch<SetStateAction<Part[]>>,
  setItemDetails: Dispatch<SetStateAction<deployItemType>>,
): Promise<InboundOutboundResponse> {
  try {
    const response = await axios.post(`${API_URL}/parts/outbound`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("creating user");
    if (response.status === 201) {
      setTimeout(
        () => {
          setOutboundShow(false);
          Swal.fire({
            icon: "success",
            title: "Outbound Successful",
            text: response.data.message,
            timer: 5000,
            showConfirmButton: false,
          }).then(() => {
            setModalShow(true);
          });

          fetchTransactions();
          fetchAllParts();
          // UPDATING THE QUANTITY OF THE INBOUNDED PART
          setData((prevParts) =>
            prevParts.map((p) =>
              p.id === formData.partId
                ? { ...p, quantity: p.quantity - Number(formData.quantity) }
                : p,
            ),
          );
          // RESETTING FORMDATA AFTER INBOUND
          setFormData((prev) => ({
            ...prev,
            partId: item.id!,
            currentQuantity: item.quantity + Number(formData.quantity),
            quantity: "1",
          }));
          setItemDetails((prev) => ({
            ...prev,
            partId: item.id!,
            currentQuantity: item.quantity + Number(formData.quantity),
            quantity: "1",
          }));
        },
        import.meta.env.VITE_TIME_OUT,
      );
    } else {
      setTimeout(
        () => {
          setOutboundShow(false);
          Swal.fire({
            icon: "error",
            title: "Outbound Failed",
            text: response.data.message,
          }).then(() => {
            setModalShow(true);
          });
        },
        import.meta.env.VITE_TIME_OUT,
      );
    }

    return {
      success: false,
      message: "Unexpected response status",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while outbounding item. Check your internet connection and try again.",
    };
  }
}

export async function fetchITStocks(
  partId: number,
): Promise<FetchingItemsResponse> {
  try {
    const response = await axios.get(`${API_URL}/parts/fetch-items/${partId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    // console.log("Parts Inbounds Fetched: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while fetching parts. Check your internet connection and try again.",
    };
  }
}

export async function addingItem(
  formData: addItemType,
): Promise<InboundOutboundResponse> {
  try {
    // console.log("data received at service: ", formData);
    const response = await axios.post(`${API_URL}/parts/add-item`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while fetching parts. Check your internet connection and try again.",
    };
  }
}

export async function updateItem(
  item: ITStocks,
): Promise<outboundItemResponse> {
  try {
    const response = await axios.put(`${API_URL}/parts/update-item`, item);
    // console.log("editing user details");
    if (response.status === 200) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while outbounding item. Check your internet connection and try again.",
    };
  }
}

export async function updateItemStatus(
  updateData: updateStatusType,
): Promise<outboundItemResponse> {
  try {
    const response = await axios.put(
      `${API_URL}/parts/update-status/${updateData.serialNumber}`,
      updateData,
    );
    // console.log("editing user details");
    if (response.status === 200) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while outbounding item. Check your internet connection and try again.",
    };
  }
}

export async function markItemAsAvailable(
  item: ITStocks,
): Promise<outboundItemResponse> {
  try {
    const response = await axios.put(
      `${API_URL}/parts/mark-item-available/${item.serialNumber}`,
      item,
    );
    // console.log("editing user details");
    if (response.status === 200) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while outbounding item. Check your internet connection and try again.",
    };
  }
}

export async function outboundItem(
  formData: deployItemType,
): Promise<outboundItemResponse> {
  try {
    const response = await axios.put(
      `${API_URL}/parts/outbound-item/${formData.serialNumber}`,
      formData,
    );
    // console.log("editing user details");
    if (response.status === 200) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Something went wrong while outbounding item. Check your internet connection and try again.",
    };
  }
}
