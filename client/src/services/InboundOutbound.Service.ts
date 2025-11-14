import axios, { AxiosError } from "axios";

export interface Inbound {
  id?: number;
  partId: number;
  quantity: number;
  inboundDate: Date;
}

export interface Outbound {
  id?: number;
  partId: number;
  quantity: number;
  outboundDate: Date;
}

export interface InboundOutboundType {
  partId: number;
  currentQuantity: number;
  quantity: string;
  inboundDate?: string;
  outboundDate?: string;
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

export interface FetchingOutboundsResponse {
  success: boolean;
  message?: string;
  data?: Outbound[];
}

// Define the error response structure from your API
interface ApiErrorResponse {
  message?: string;
}
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchAllInbounds(): Promise<FetchingInboundsResponse> {
  try {
    const response = await axios.get(`${API_URL}/parts/fetchAllInbounds`, {
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
      message: "Something went wrong while fetching parts.",
    };
  }
}

export async function fetchInbounds(
  partId: number
): Promise<FetchingInboundsResponse> {
  try {
    const response = await axios.get(
      `${API_URL}/parts/fetchInbounds/${partId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    // console.log("Parts Inbounds Fetched: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong while fetching parts.",
    };
  }
}

export async function inboundPart(
  formData: InboundOutboundType
): Promise<InboundOutboundResponse> {
  try {
    const response = await axios.post(`${API_URL}/parts/inbound`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("creating user");
    if (response.status === 201) {
      return response.data;
    }

    return {
      success: false,
      message: "Unexpected response status",
    };
  } catch (error) {
    // Type guard for Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // console.error(
      //   "Error creating part:",
      //   axiosError.response?.data || axiosError.message
      // );

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
    // console.error("Error creating user:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function fetchAllOutbounds(): Promise<FetchingOutboundsResponse> {
  try {
    const response = await axios.get(`${API_URL}/parts/fetchAllOutbounds`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    // console.log("Parts Outbounds Fetched: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong while fetching parts.",
    };
  }
}

export async function fetchOutbounds(
  partId: number
): Promise<FetchingOutboundsResponse> {
  try {
    const response = await axios.get(
      `${API_URL}/parts/fetchOutbounds/${partId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    // console.log("Parts Outbounds Fetched: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong while fetching parts.",
    };
  }
}

export async function outboundPart(
  formData: InboundOutboundType
): Promise<InboundOutboundResponse> {
  try {
    const response = await axios.post(`${API_URL}/parts/outbound`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("creating user");
    if (response.status === 201) {
      return response.data;
    }

    return {
      success: false,
      message: "Unexpected response status",
    };
  } catch (error) {
    // Type guard for Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // console.error(
      //   "Error creating part:",
      //   axiosError.response?.data || axiosError.message
      // );

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
    // console.error("Error creating user:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
