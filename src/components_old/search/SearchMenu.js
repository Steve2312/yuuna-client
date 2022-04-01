import React, { createRef } from 'react';
import SearchHandler from '../../helpers/SearchHandler';

function SearchMenu(props) {
    const inputRef = createRef();
    const categoryRef = createRef();

    function handleInput() {
        var input = inputRef.current.value;
        var category = categoryRef.current.value;
        SearchHandler.find(input, category);
    }
    return (
        <div className="searchMenu">
                <input ref={inputRef} onChange={handleInput} id="searchInput" type="search" placeholder="Search for name, artist, creator, ID, etc." />
                <select ref={categoryRef} onChange={handleInput} id="searchCategory">
                    <option value="ranked">Ranked</option>
                    <option value="all">All</option>
                    <option value="approved">Approved</option>
                    <option value="qualified">Qualified</option>
                    <option value="loved">Loved</option>
                    <option value="unranked">Unranked</option>
                </select>
        </div>
    );
}

export default SearchMenu;