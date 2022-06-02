import { createRoot } from "react-dom/client";
import App from "@/components/App";
import "./styles/index.scss";

const container = document.getElementById("root");
const root = createRoot(container!)

root.render(<App />)
