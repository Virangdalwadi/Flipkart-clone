import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
};

export default Loader;

// import React from "react";

// const Loader = () => {
//   return (
//     <div className="flex justify-center items-center space-x-2">
//       <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
//       <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
//       <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce"></div>
//     </div>
//   );
// };

// export default Loader;
