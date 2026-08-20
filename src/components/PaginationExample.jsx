// import { useState, useEffect } from "react";

// const PaginationExample = () => {
//   const [data, setData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);

//   const itemsPerPage = 40;

//   // 1. Fetch your 200 items from the API
//   useEffect(() => {
//     fetch("https://dummyjson.com/products?limit=200")
//       .then((response) => response.json())
//       .then((apiData) => {
//         // FIX: Extract the "products" array from the API response object
//         const productsArray = apiData.products || [];
//         setData(productsArray.slice(0, 200));
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       });
//   }, []);

//   // 2. Calculate total number of pages
//   const totalPages = Math.ceil(data.length / itemsPerPage);

//   // 3. Calculate indices for slicing the data array
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;

//   // 4. Slice the array to get only the items for the current page
//   const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

//   // Navigation handlers
//   const goToNextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   const goToPreviousPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const handlePageClick = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Generate page numbers
//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   if (loading) return <p>Loading data...</p>;

//   return (
//     <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
//       <h2>Paginated Items (Total: {data.length})</h2>

//       {/* Render the sliced data for the current page */}
//       <ul style={{ listStyleType: "none", padding: 0 }}>
//         {currentItems.map((item) => (
//           <li
//             key={item.id}
//             style={{ padding: "10px", borderBottom: "1px solid #ccc" }}
//           >
//             <strong>{item.id}.</strong> {item.title} - ${item.price}
//           </li>
//         ))}
//       </ul>

//       {/* Pagination Controls */}
//       <div style={{ marginTop: "20px", display: "flex", gap: "5px", alignItems: "center" }}>
//         <button
//           onClick={goToPreviousPage}
//           disabled={currentPage === 1}
//           style={{ padding: "5px 10px", cursor: "pointer" }}
//         >
//           Previous
//         </button>

//         {pageNumbers.map((number) => (
//           <button
//             key={number}
//             onClick={() => handlePageClick(number)}
//             style={{
//               backgroundColor: currentPage === number ? "#007bff" : "#fff",
//               color: currentPage === number ? "#fff" : "#000",
//               border: "1px solid #ccc",
//               padding: "5px 10px",
//               cursor: "pointer",
//               borderRadius: "3px"
//             }}
//           >
//             {number}
//           </button>
//         ))}

//         <button
//           onClick={goToNextPage}
//           disabled={currentPage === totalPages || totalPages === 0}
//           style={{ padding: "5px 10px", cursor: "pointer" }}
//         >
//           Next
//         </button>
//       </div>

//       <p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
//         Page {currentPage} of {totalPages || 1}
//       </p>
//     </div>
//   );
// };

// export default PaginationExample;

import { useState, useEffect, useRef, useCallback } from 'react';

export default function PaginationExample() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Ref attached to the hidden "sentinel" div at the bottom of the list
  const observerTarget = useRef(null);

  // 1. Mock API fetch function (Replace with your actual fetch/axios call)
  const fetchMoreItems = useCallback(async (pageNum) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Example API call simulation
      // const response = await fetch(`https://typicode.com${pageNum}&_limit=10`);
      // const response = await fetch(`https://dummyjson.com/products${pageNum}&_limit=10`);
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false); // Stop observing if there is no more data
      } else {
        setItems((prevItems) => [...prevItems, ...data]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // 2. Fetch data whenever the page number changes
  useEffect(() => {
    fetchMoreItems(page);
  }, [page]);

  // 3. Setup the Intersection Observer
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // If the loader div enters the screen and we have more data, load next page
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 } // 100% of the element must be visible
    );

    observer.observe(target);

    // Clean up the observer on component unmount
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading]);

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Infinite Scroll Items</h1>

      {/* Render your list */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{ padding: '15px', border: '1px solid #ddd', margin: '10px 0', borderRadius: '5px' }}
          >
            <h3>{item.title}</h3>
          </li>
        ))}
      </ul>

      {/* The invisible observer target and loader state indicator */}
      <div ref={observerTarget} style={{ height: '20px', margin: '20px 0', textAlign: 'center' }}>
        {loading && <p>Loading more items...</p>}
        {!hasMore && <p>No more items to display.</p>}
      </div>
    </div>
  );
}

