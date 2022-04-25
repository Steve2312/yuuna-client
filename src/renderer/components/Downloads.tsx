import React, {useState} from "react";
import styles from "@/styles/downloads.module.scss";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import List from "@/components/List";

const Downloads: React.FC = () => {

    const [visibility, setVisibility] = useState<boolean>(true);

    const toggle = () => {
        setVisibility(visibility => !visibility);
    }

    return (
        <div className={styles.downloads + (!visibility ? " " + styles.hidden : "")}>
            <div className={styles.header}>
                <span className={styles.icon} onClick={toggle}>
                    {
                        visibility
                        ?
                            <FaArrowRight/>
                            :
                            <FaArrowLeft />
                    }
                </span>

                <div className={styles.content}>
                    <h1>Downloads</h1>
                    <p>Active downloads: 0</p>
                </div>
            </div>
        </div>
    );
}

export default Downloads;