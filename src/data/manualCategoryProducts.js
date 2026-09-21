const manualCategoryProducts = [
  {
    id: 195,
    title: "Building Blocks Set",
    category: "toys",
    price: 24.99,
    rating: 4.5,
    images: [
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTCTaU1spLlvV2fT1KupgJ17i1kbExHDkVN-ReiTPk7oGlAFRa4gfLZOjux5Bwq7NJPESkME4LAKVkU1l3-7qF2nDQBBRh_n7Vx3BKI91i4C3sthycagy40ew",
    ],
  },
  {
    id: 196,
    title: "Remote Control Car",
    category: "toys",
    price: 39.99,
    rating: 4.2,
    images: [
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS-DzU7u5xbSkxcDRuEyf9dmsUHdFh-vUMnVUxRhDTwbTm_ZHL9xa8OtLcvni8bM8s6Mus3OsjBrnk2HCdrlR2tZdxnEqQ3Af_i_OFIwkTHX3Xb1EfgmaFxdg",
    ],
  },
  {
    id: 197,
    title: "The Modern JavaScript Guide",
    category: "books",
    price: 18.99,
    rating: 4.7,
    images: [
      "https://m.media-amazon.com/images/I/815aQJHeMbL._AC_UF1000,1000_QL80_.jpg",
    ],
  },
  {
    id: 198,
    title: "Design Thinking Handbook",
    category: "books",
    price: 22.99,
    rating: 4.4,
    images: [
      "https://substackcdn.com/image/fetch/$s_!Fg6L!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fef1b9f8f-de52-40a0-b18b-e65852022070_1024x1024.png",
    ],
  },
  {
    id: 199,
    title: "American Football",
    category: "sports-accessories",
    price: 19.99,
    rating: 4.91,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/american-football/thumbnail.webp",
    ],
  },
  {
    id: 200,
    title: "Baseball Ball",
    category: "sports-accessories",
    price: 8.99,
    rating: 2.57,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-ball/thumbnail.webp",
    ],
  },
  {
    id: 201,
    title: "Baseball Glove",
    category: "sports-accessories",
    price: 24.99,
    rating: 3.96,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-glove/thumbnail.webp",
    ],
  },
  {
    id: 202,
    title: "Basketball",
    category: "sports-accessories",
    price: 14.99,
    rating: 4.66,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/basketball/thumbnail.webp",
    ],
  },
  {
    id: 203,
    title: "Basketball Rim",
    category: "sports-accessories",
    price: 39.99,
    rating: 4.6,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/basketball-rim/thumbnail.webp",
    ],
  },
  {
    id: 204,
    title: "Cricket Ball",
    category: "sports-accessories",
    price: 12.99,
    rating: 3.53,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-ball/thumbnail.webp",
    ],
  },
  {
    id: 205,
    title: "Cricket Bat",
    category: "sports-accessories",
    price: 29.99,
    rating: 3.17,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-bat/thumbnail.webp",
    ],
  },
  {
    id: 206,
    title: "Cricket Helmet",
    category: "sports-accessories",
    price: 44.99,
    rating: 4.69,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-helmet/thumbnail.webp",
    ],
  },
  {
    id: 207,
    title: "Cricket Wicket",
    category: "sports-accessories",
    price: 29.99,
    rating: 4.73,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-wicket/thumbnail.webp",
    ],
  },
  {
    id: 208,
    title: "Feather Shuttlecock",
    category: "sports-accessories",
    price: 5.99,
    rating: 2.85,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/feather-shuttlecock/thumbnail.webp",
    ],
  },
  {
    id: 209,
    title: "Football",
    category: "sports-accessories",
    price: 17.99,
    rating: 3.28,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/football/thumbnail.webp",
    ],
  },
  {
    id: 210,
    title: "Golf Ball",
    category: "sports-accessories",
    price: 9.99,
    rating: 4.3,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/golf-ball/thumbnail.webp",
    ],
  },
  {
    id: 211,
    title: "Iron Golf",
    category: "sports-accessories",
    price: 49.99,
    rating: 4.41,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/iron-golf/thumbnail.webp",
    ],
  },
  {
    id: 212,
    title: "Metal Baseball Bat",
    category: "sports-accessories",
    price: 29.99,
    rating: 4.66,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/metal-baseball-bat/thumbnail.webp",
    ],
  },
  {
    id: 213,
    title: "Tennis Ball",
    category: "sports-accessories",
    price: 6.99,
    rating: 4.06,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/tennis-ball/thumbnail.webp",
    ],
  },
  {
    id: 214,
    title: "Tennis Racket",
    category: "sports-accessories",
    price: 49.99,
    rating: 4.03,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/tennis-racket/thumbnail.webp",
    ],
  },
  {
    id: 215,
    title: "Volleyball",
    category: "sports-accessories",
    price: 11.99,
    rating: 3.84,
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/volleyball/thumbnail.webp",
    ],
  },
];

export default manualCategoryProducts;
