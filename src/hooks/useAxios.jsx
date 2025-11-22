import axios from "axios";

const axiosInstances = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxios = () => {
  return axiosInstances;
};
export default useAxios;
