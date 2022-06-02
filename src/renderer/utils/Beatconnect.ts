import axios from "axios";

export default axios.create({
    baseURL: "https://beatconnect.io/api",
    headers: {
        "Token": <string>process.env.BEATCONNECT_API_KEY
    }
});
