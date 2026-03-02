import axios, { AxiosError } from "axios";
import type { Inbound, Outbound } from "./InboundOutbound.Service";
import Swal from "sweetalert2";

export interface Part {
  id: number;
  image?: File | string | null;
  type: string;
  partNumber: string;
  specs: string;
  category: string;
  unitPrice: number;
  company: string;
  quantity: number;
  inbounds?: Inbound[] | null;
  outbounds?: Outbound[] | null;
}

export interface AddingPartType {
  image?: File | null;
  type: string;
  partNumber: string;
  specs: string;
  category: string;
  unitPrice: string;
  company: string;
}

export interface PartResponse {
  success: boolean;
  message?: string;
  data?: Part;
}

export interface FetchingPartsResponse {
  success: boolean;
  message?: string;
  data?: Part[];
}

// Define the error response structure from your API
interface ApiErrorResponse {
  message?: string;
}
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchParts(): Promise<FetchingPartsResponse> {
  try {
    const response = await axios.get(`${API_URL}/parts/fetch-parts`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      // console.log("Parts Fetched: ", response.data);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong while fetching parts.",
    };
  }
}

export async function createPart(
  formData: AddingPartType,
): Promise<PartResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/parts/create-part`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    // console.log("creating user");
    if (response.status === 201) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    // Type guard for Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error(
        "Error creating part:",
        axiosError.response?.data || axiosError.message,
      );

      // Check if it's a connection error
      if (
        axiosError.code === "ERR_NETWORK" ||
        axiosError.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        return {
          success: false,
          message:
            "Cannot connect to server. Please check if the server is running.",
        };
      }

      return {
        success: false,
        message: axiosError.response?.data?.message || axiosError.message,
      };
    }

    // Handle non-Axios errors
    console.error("Error creating user:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function editPart(
  id: number,
  formData: FormData | AddingPartType,
): Promise<PartResponse> {
  try {
    const response = await axios.put(
      `${API_URL}/parts/update-part/${id}`,
      formData,
    );
    // console.log("editing user details");
    if (response.status === 200) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    // Handle non-Axios errors
    console.error("Error updating user:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function removePart(id: number): Promise<PartResponse> {
  try {
    const response = await axios.delete(`${API_URL}/parts/delete-part/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    // Type guard for Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error(
        "Error creating user:",
        axiosError.response?.data || axiosError.message,
      );

      // Check if it's a connection error
      if (
        axiosError.code === "ERR_NETWORK" ||
        axiosError.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        return {
          success: false,
          message:
            "Cannot connect to server. Please check if the server is running.",
        };
      }

      return {
        success: false,
        message: axiosError.response?.data?.message || axiosError.message,
      };
    }

    // Handle non-Axios errors
    console.error("Error updating user:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function removeStockItem(
  stockID: number,
  partID: number,
  fetchAllParts: () => void,
) {
  try {
    const response = await axios.delete(
      `${API_URL}/parts/delete-item/${stockID}/${partID}`,
    );

    if (response.status === 200) {
      fetchAllParts();
      await Swal.fire({
        title: "Deleted!",
        text: "Item removed successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } else {
      await Swal.fire({
        title: "Error!",
        text: "Error removing item.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";

    await Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonColor: "#d33",
    });
  }
}
