import axios from "axios"
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_END_KEY
});

instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        // console.log("-----")
        return Promise.reject(error);
        // return <ErrorComponent/>
    }
);

// Add a response interceptor: được chạy trước khi response
instance.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response?.data;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.clear()
        return error.response?.data
    }
);
export default instance
