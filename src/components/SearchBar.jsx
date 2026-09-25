// import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

// const SearchBar = ({ value, onChange, onSubmitSuccess, onClear }) => {

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     onSubmitSuccess(value);
//   }

//   return (
//     <>
//       <div className='flex items-center w-full sm:min-w-90'>
//         <div className="flex h-9 sm:h-10 md:h-11 justify-center items-center w-full min-w-0">
//           <div className="flex items-center w-full min-w-0 border-2 border-blue-500 p-1 sm:p-1.5 rounded-lg sm:rounded-xl gap-1 sm:gap-2">
//             {/* Search Icon - Responsive Size */}
//             <span className="shrink-0 text-blue-500">
//               <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" className="sm:text-base md:text-lg stroke-[0.1px] stroke-current" />
//             </span>

//             {/* Search Input - Responsive */}
//             <form className="flex-1 min-w-0" onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 value={value}
//                 className='w-full outline-none text-xs sm:text-sm md:text-base bg-transparent'
//                 onChange={(e) => onChange(e.target.value)}
//                 placeholder='Search for products, brands and more'
//               />
//             </form>

//             {/* Clear Button - Responsive */}
//             {value.trim() && (
//               <button
//                 type="button"
//                 className="shrink-0 text-sm sm:text-base md:text-lg font-bold leading-none text-gray-600 hover:text-gray-900 transition-colors px-1"
//                 onClick={onClear}
//                 aria-label="Clear search"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default SearchBar


import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const SearchBar = ({ value = "", onChange, onSubmitSuccess, onClear, suggestions = [] }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    setShowDropdown(false)
    onSubmitSuccess(value)
  }

  const handleSelect = (item) => {
    onChange(item.title)        // was item.name
    setShowDropdown(false)
    onSubmitSuccess(item.title) // was item.name
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className='relative flex items-center w-full sm:min-w-90'>
      <div className="flex h-9 sm:h-10 md:h-11 justify-center items-center w-full min-w-0">
        <div className="flex items-center w-full min-w-0 border-2 border-blue-500 p-1 sm:p-1.5 rounded-lg sm:rounded-xl gap-1 sm:gap-2">
          <span className="shrink-0 text-blue-500">
            <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" className="sm:text-base md:text-lg stroke-[0.1px] stroke-current" />
          </span>

          <form className="flex-1 min-w-0" onSubmit={handleSubmit}>
            <input
              type="text"
              value={value}
              className='w-full outline-none text-xs sm:text-sm md:text-base bg-transparent'
              onChange={(e) => {
                onChange(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => value.trim() && setShowDropdown(true)}
              placeholder='Search for products, brands and more'
            />
          </form>

          {value.trim() && (
            <button
              type="button"
              className="shrink-0 text-sm sm:text-base md:text-lg font-bold leading-none text-gray-600 hover:text-gray-900 transition-colors px-1"
              onClick={() => {
                onClear()
                setShowDropdown(false)
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showDropdown && value.trim() && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onMouseDown={(e) => e.preventDefault()} // prevent input blur before click
              onClick={() => handleSelect(item)}
              className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" className="text-gray-400" />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
