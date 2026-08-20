import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const SearchBar = ({ value, onChange, onSubmitSuccess, onClear }) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitSuccess(value);
  }

  return (
    <>
      <div className='flex items-center'>
        <div className="flex h-10 justify-center items-center">
          <div className="flex items-center w-200 border-2 border-blue-500 p-1 rounded-xl">
            <span className="mr-1 ">
              <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" className="stroke-[0.1px] stroke-current" />
            </span>
            <form className="flex-1" onSubmit={handleSubmit}>
              <input
                type="text"
                value={value}
                className='flex items-center w-full outline-none'
                onChange={(e) => onChange(e.target.value)}
                placeholder='Search for Products, Brands and More' />
            </form>
            {value.trim() && (
              <button
                type="button"
                className="px-2 text-xl font-bold leading-none"
                onClick={onClear}
                aria-label="Clear search"
              >
                X
              </button>
            )}
          </div>
        </div>
      </div>
    </ >
  )
}

export default SearchBar
