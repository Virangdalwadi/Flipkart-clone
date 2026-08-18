import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import PaginationExample from '../components/PaginationExample'

const Profile = () => {
  return (
    <>
      <Navbar />
      <div className="flex h-[90vh] text-3xl items-center justify-center">
        <h1>Profile page</h1>
      </div>

      <PaginationExample />
      <Footer />
    </>
  )
}

export default Profile
