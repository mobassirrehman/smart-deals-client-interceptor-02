import axios from "axios";

const instance = axios.Axios.create({
  baseURL: "http://localhost:3000",
});
const useAxiosSecure = () => {
  //set token in the header for all the api call using axiosSecure hook

  return instance;
};

export default useAxiosSecure;
