import { useState, useEffect } from "react";
import { FaTrashAlt, FaUsers, FaChalkboardTeacher, FaArrowDown } from "react-icons/fa";
import Swal from "sweetalert2";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load users"
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmAndChangeRole = async (user, newRole) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `You want to make ${user.name} a ${newRole === "user" ? "Normal User" : newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, do it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/users/role/${user._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access-token')}`
            },
            body: JSON.stringify({ role: newRole })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update role');
          }

          const updatedUser = await response.json();
          
          // Update local state
          setUsers(prevUsers => 
            prevUsers.map(u => u._id === user._id ? updatedUser : u)
          );

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${user.name} is now a ${newRole === "user" ? "Normal User" : newRole}!`,
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error('Error updating role:', error);
          Swal.fire({
            icon: "error",
            title: "Update failed",
            text: error.message || 'Failed to update user role'
          });
        }
      }
    });
  };

  const handleDeleteUser = async (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/users/${user._id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access-token')}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete user');
          }

          const resultData = await response.json();
          
          if (resultData.deleted) {
            // Update local state
            setUsers(prevUsers => prevUsers.filter(u => u._id !== user._id));
            
            Swal.fire({
              title: "Deleted!",
              text: "User has been removed.",
              icon: "success",
            });
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          Swal.fire({
            icon: "error",
            title: "Delete failed",
            text: error.message || 'Failed to delete user'
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">All Users</h2>
        <h2 className="text-lg">Total Users: {users.length}</h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full border-collapse bg-white text-gray-800">
          {/* Table Head */}
          <thead className="bg-gray-200 text-gray-900">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="border-b hover:bg-gray-100 transition">
                <td className="p-4 font-medium">{index + 1}</td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>

                <td className="p-4">
                  {user.role === "admin" && (
                    <span className="text-green-600 font-semibold">Admin</span>
                  )}
                  {user.role === "faculty" && (
                    <span className="text-blue-600 font-semibold">Faculty</span>
                  )}
                  {user.role === "user" && (
                    <span className="text-gray-700 font-medium">User</span>
                  )}
                </td>

                <td className="p-4 flex justify-center gap-2 flex-wrap">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => confirmAndChangeRole(user, "admin")}
                      className="p-2 bg-orange-500 hover:bg-orange-600 rounded text-white transition"
                      title="Make Admin"
                    >
                      <FaUsers className="text-lg" />
                    </button>
                  )}

                  {user.role !== "faculty" && (
                    <button
                      onClick={() => confirmAndChangeRole(user, "faculty")}
                      className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition"
                      title="Make Faculty"
                    >
                      <FaChalkboardTeacher className="text-lg" />
                    </button>
                  )}

                  {user.role !== "user" && (
                    <button
                      onClick={() => confirmAndChangeRole(user, "user")}
                      className="p-2 bg-gray-500 hover:bg-gray-600 rounded text-white transition"
                      title="Demote to User"
                    >
                      <FaArrowDown className="text-lg" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="p-2 bg-red-500 hover:bg-red-600 rounded text-white transition"
                    title="Delete User"
                  >
                    <FaTrashAlt className="text-lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;