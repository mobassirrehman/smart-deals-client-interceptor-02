import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const MyProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/products?email=${user.email}`)
        .then(res => {
          setProducts(res.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
          setLoading(false);
        });
    }
  }, [user, axiosSecure]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/products/${id}`)
          .then(res => {
            if (res.data.deletedCount) {
              Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
              setProducts(products.filter(product => product._id !== id));
            }
          })
          .catch(error => {
            console.error('Error deleting product:', error);
            Swal.fire('Error!', 'Failed to delete product.', 'error');
          });
      }
    });
  };

  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'sold' : 'pending';
    
    axiosSecure.patch(`/products/status/${id}`, { status: newStatus })
      .then(res => {
        if (res.data.modifiedCount) {
          Swal.fire({
            icon: 'success',
            title: `Product marked as ${newStatus}`,
            showConfirmButton: false,
            timer: 1500
          });
          setProducts(products.map(product => 
            product._id === id ? { ...product, status: newStatus } : product
          ));
        }
      })
      .catch(error => {
        console.error('Error updating status:', error);
        Swal.fire('Error!', 'Failed to update status.', 'error');
      });
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
  };
  

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="skeleton h-12 w-64 mb-8"></div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>SL No.</th>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price Range</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td><div className="skeleton h-4 w-8"></div></td>
                  <td><div className="skeleton h-16 w-16"></div></td>
                  <td><div className="skeleton h-4 w-32"></div></td>
                  <td><div className="skeleton h-4 w-20"></div></td>
                  <td><div className="skeleton h-4 w-24"></div></td>
                  <td><div className="skeleton h-6 w-16"></div></td>
                  <td><div className="skeleton h-8 w-32"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">
          My Products: <span className="text-primary">{products.length}</span>
        </h2>
        <Link to="/createAProduct" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">No products yet</h3>
          <p className="text-gray-500 mb-6">Start selling by adding your first product</p>
          <Link to="/createAProduct" className="btn btn-primary">Add Your First Product</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>SL No.</th>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price Range</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-16 h-16">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          onError={handleImageError}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold">{product.title}</div>
                    <div className="text-sm opacity-50">{product.condition}</div>
                  </td>
                  <td>{product.category}</td>
                  <td className="font-semibold text-primary">
                    ${product.price_min} - ${product.price_max}
                  </td>
                  <td>
                    {product.status === 'pending' ? (
                      <div className="badge badge-warning">Pending</div>
                    ) : (
                      <div className="badge badge-success">Sold</div>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link 
                        to={`/productDetails/${product._id}`}
                        className="btn btn-ghost btn-xs"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/editProduct/${product._id}`}
                        className="btn btn-primary btn-xs"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleStatusToggle(product._id, product.status)}
                        className="btn btn-secondary btn-xs"
                      >
                        {product.status === 'pending' ? 'Mark Sold' : 'Mark Pending'}
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-error btn-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyProducts;