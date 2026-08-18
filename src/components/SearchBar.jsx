import React, { useState } from 'react'

const SearchBar = ({ onSubmitSuccess }) => {

  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitSuccess(inputValue);
  }

  return (
    <div>
      <div className="flex h-10 justify-center">
        <div className="flex items-center w-200 border-2 border-blue-500 p-1 rounded-xl">
          <span className="mr-1 ">
            {/* Fixed: Use the imported icon object directly */}
            {/* <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" /> */}
          </span>
          <form onSubmit={handleSubmit}>
            <input
              type="search"
              value={inputValue}
              className='flex items-center w-195 outline-none'
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='Search for Products, Brands and More' />
          </form>
        </div>
      </div>
    </div >
  )
}

export default SearchBar
