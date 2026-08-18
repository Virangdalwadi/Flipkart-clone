import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';


const Cart = () => {

  const [items, setItems] = useState(JSON.parse(localStorage.getItem('Products')) || [])
  const originalIndex = items.indexOf(items);

  const handleRemovefromCart = (indexToRemove, productName) => {
    console.log(productName);
    const remove = confirm(`Are you sure you want to remove this Item`)
    if (!remove) {
      return;
    }

    const updatedarray = items.filter((_, index) => index !== indexToRemove);
    setItems(updatedarray);
    localStorage.setItem("Products", JSON.stringify(updatedarray));
  }


  return (
    <>
      <div className=''>
        <Navbar />
        {items.length === 0 ? (<p className='flex justify-center items-center text-4xl text-center h-[80vh] max-h-[80vh] font-semibold text-gray-800 mb-2'>Cart is Empty</p>) :
          (<div className='flex items-start max-w-7xl m-auto p-auto'>
            <div className="flex flex-wrap gap-x-4 gap-y-4 py-2 px-2 items-center" >
              {
                items.map((product, originalIndex) => (
                  <div key={originalIndex} className="w-60  bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden group">
                    <div className="relative overflow-hidden aspect-square bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-in-out"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">
                        {product.category}
                      </p>

                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </h3>

                      <div className="flex   items-center mt-2.5 mb-4">
                        <div className="flex text-amber-400 space-x-0.5">
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span className="text-gray-300">★</span>
                        </div>
                        <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded ml-3">
                          4.0
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xl font-extrabold text-gray-900">
                            ${product.price}
                          </span>
                          <span className="text-sm text-gray-400 line-through">${(product.price + ((2 / 5) * 10)).toFixed(2)}</span>
                        </div>
                        <button className="text-white bg-red-600 hover:bg-red-700 focus:ring-4  font-medium rounded-xl text-sm px-3 py-2 transition-colors focus:outline-none" onClick={() => handleRemovefromCart(originalIndex, product.name)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>)}

      </div>
      <Footer />
    </>
  )
}

export default Cart
