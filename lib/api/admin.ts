import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL


export const createClinic = async (payload: {
  name: string;
  email: string;
  phone: string;
  isDoctorClinic: boolean;
  address: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}clinic`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating clinic:", error);
    throw error;
  }
};


export const getClinics = async () => {
  try {
    const response = await axios.get(`${BASE_URL}clinic`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clinics:", error);
    throw error;
  }
};


export const getDoctors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}doctor-profile?role=doctor`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const getIndividualDoctors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}doctor-profile/individual/doctor`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw error;
  }
}

export const createIndividualDoctorProfile = async (payload: FormData) => {
  try {
    const response = await axios.post(`${BASE_URL}doctor-profile/individual/doctor`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    throw error;
  }
};


export const getReceptionist = async () => {
  try {
    const response = await axios.get(`${BASE_URL}users?role=receptionist`);
    return response.data;
  } catch (error) {
    console.error("Error fetching receptionist:", error);
    throw error;
  }
}


export const getPatients = async () => {
  try {
    const response = await axios.get(`${BASE_URL}users?role=patient`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
}

export const createPatient = async (payload: any) => {
  try {
    const response = await axios.post(`${BASE_URL}users`, { ...payload, role: "patient" });
    return response.data;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
};


export const getAppointments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}appointments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}