import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const Fetchpatients = async (role: string) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await axios.get(`${BASE_URL}users?role=${role}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetchpatients error", error);
    throw error;
  }
};
