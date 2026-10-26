import React, { useState, useRef, useEffect } from 'react'

const SearchBar = ({
  value = "",
  onChange,
  onSubmitSuccess,
  onClear,
  onSuggestionClick,
  suggestions = [],
  suggestionsLoading = false,
  suggestionsError = "",
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (showDropdown && activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex])
      return
    }
    setShowDropdown(false)
    setActiveIndex(-1)
    onSubmitSuccess(value)
  }

  const handleSelect = (item) => {
    setShowDropdown(false)
    setActiveIndex(-1)
    if (onSuggestionClick) {
      onSuggestionClick(item)
      return
    }

    onChange(item.title)
    onSubmitSuccess(item.title)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && showDropdown) {
      event.preventDefault()
      setShowDropdown(false)
      setActiveIndex(-1)
      return
    }

    if (!showDropdown || suggestions.length === 0) return

    if (event.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault()
      handleSelect(suggestions[activeIndex])
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % suggestions.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      )
    }
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

  useEffect(() => {
    setActiveIndex(-1)
  }, [suggestions])

  return (
    <div ref={wrapperRef} className='relative flex items-center w-full sm:min-w-90'>
      <div className="flex h-9 sm:h-10 md:h-11 justify-center items-center w-full min-w-0">
        <div className="flex items-center w-full min-w-0 border-2 border-blue-500 p-1 sm:p-1.5 rounded-lg sm:rounded-xl gap-1 sm:gap-2">
          <span className="shrink-0 text-blue-500">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-4 sm:size-5 md:size-6"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" strokeLinecap="round" />
            </svg>
          </span>

          <form className="flex-1 min-w-0" onSubmit={handleSubmit}>
            <input
              role="combobox"
              type="text"
              value={value}
              aria-autocomplete="list"
              aria-expanded={showDropdown && value.trim() && suggestions.length > 0}
              aria-controls="product-search-suggestions"
              aria-activedescendant={
                activeIndex >= 0 ? `product-suggestion-${activeIndex}` : undefined
              }
              className='w-full outline-none text-xs sm:text-sm md:text-base bg-transparent'
              onChange={(e) => {
                onChange(e.target.value)
                setShowDropdown(true)
                setActiveIndex(-1)
              }}
              onFocus={() => value.trim() && setShowDropdown(true)}
              onKeyDown={handleKeyDown}
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
                setActiveIndex(-1)
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
        <ul
          id="product-search-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
        >
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              id={`product-suggestion-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              onMouseDown={(e) => e.preventDefault()} // prevent input blur before click
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => handleSelect(item)}
              className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2 ${
                activeIndex === index ? "bg-blue-50" : "hover:bg-blue-50"
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-3 text-gray-400"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" strokeLinecap="round" />
              </svg>
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      )}
      {showDropdown && value.trim() && suggestionsLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-3 py-2 text-sm text-gray-500">
          Searching products...
        </div>
      )}
      {showDropdown && value.trim() && !suggestionsLoading && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-3 py-2 text-sm text-gray-500">
          {suggestionsError || "No suggestions found"}
        </div>
      )}
    </div>
  )
}

export default SearchBar
