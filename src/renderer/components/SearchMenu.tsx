import React, {useRef} from "react";
import styles from "@/styles/searchmenu.module.scss";
import SearchService from "@/services/SearchService";

const SearchMenu: React.FC = () => {

    const inputRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    const handleChange = () => {
        const inputValue = inputRef.current?.value || "";
        const selectValue = selectRef.current?.value || "ranked";

        SearchService.search(inputValue, selectValue);
    };

    return (
        <div className={styles.searchMenu}>
            <input ref={inputRef} onChange={handleChange} type="search" placeholder="Search for name, artist, creator, ID, etc."/>
            <select ref={selectRef} onChange={handleChange} >
                <option value="ranked">Ranked</option>
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="qualified">Qualified</option>
                <option value="loved">Loved</option>
                <option value="unranked">Unranked</option>
            </select>
        </div>
    );
};

export default SearchMenu;