// import React, { useState } from 'react';

// // 1. Mock Dataset
// const MOCK_DATA = [
//   { id: 1, name: "Alpha", status: "Active" },
//   { id: 2, name: "Beta", status: "Pending" },
//   { id: 3, name: "Gamma", status: "Completed" },
//   { id: 4, name: "Delta", status: "Active" },
//   { id: 5, name: "Epsilon", status: "Pending" },
//   { id: 6, name: "Zeta", status: "Completed" },
//   { id: 7, name: "Eta", status: "Active" },
//   { id: 8, name: "Theta", status: "Pending" },
// ];

// export default function PaginationExample() {
//   // 2. Pagination States
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 3;

//   // 3. Mathematical Calculations
//   const totalPages = Math.ceil(MOCK_DATA.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;

//   // Extracting only the current page's slice of data
//   const currentItems = MOCK_DATA.slice(indexOfFirstItem, indexOfLastItem);

//   // 4. Navigation Handlers
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Helper function to style statuses conditionally
//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'Active': return 'bg-green-100 text-green-800';
//       case 'Pending': return 'bg-yellow-100 text-yellow-800';
//       case 'Completed': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md border border-gray-100 font-sans">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">Paginated Item List</h2>

//       {/* Data Presentation */}
//       <ul className="space-y-3 divide-y divide-gray-100">
//         {currentItems.map((item) => (
//           <li key={item.id} className="flex justify-between items-center pt-3 first:pt-0">
//             <strong className="text-gray-700 font-medium">{item.name}</strong>
//             <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusClass(item.status)}`}>
//               {item.status}
//             </span>
//           </li>
//         ))}
//       </ul>

//       {/* Pagination Element UI Controls */}
//       <div className="mt-8 flex justify-center items-center gap-2">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
//         >
//           Prev
//         </button>

//         {Array.from({ length: totalPages }, (_, index) => {
//           const pageNum = index + 1;
//           const isActive = currentPage === pageNum;
//           return (
//             <button
//               key={pageNum}
//               onClick={() => handlePageChange(pageNum)}
//               className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition duration-150 ease-in-out ${isActive
//                 ? 'bg-blue-600 text-white shadow-sm border border-blue-600'
//                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                 }`}
//             >
//               {pageNum}
//             </button>
//           );
//         })}

//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";

export default function PaginationExample() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;
  const totalItems = 200;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://typicode.com${currentPage}&_limit=${itemsPerPage}`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          API Pagination Example <span className="text-sm font-normal text-gray-500">(Total: {totalItems})</span>
        </h2>

        {/* Data List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 min-h-[400px]">
            {data.map((item) => (
              <li key={item.id} className="py-3.5 hover:bg-gray-50 transition-colors px-2 rounded-lg">
                <span className="inline-flex items-center justify-center bg-indigo-50 text-indigo-700 font-semibold text-sm rounded-md px-2 py-1 mr-3 w-8">
                  {item.id}
                </span>
                <span className="text-gray-700 capitalize text-sm sm:text-base">{item.title}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Tailwind Pagination Control Bar */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-4 mt-6 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>

            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium text-gray-700">Prev</span>
                </button>

                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 bg-indigo-50/50">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium text-gray-700">Next</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
