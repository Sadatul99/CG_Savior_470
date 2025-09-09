import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ClassPage = () => {
  const { code: class_code } = useParams();
  const [classData, setClassData] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await fetch(`http://localhost:5000/classroom/${class_code}`);
        if (!response.ok) throw new Error('Failed to fetch class');
        
        const data = await response.json();
        setClassData(data);
      } catch (err) {
        console.error('Error fetching class:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [class_code]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:5000/classResources');
        if (!response.ok) throw new Error('Failed to fetch resources');
        
        const allResources = await response.json();
        const filtered = allResources.filter(resource => resource.class_code === class_code);
        setResources(filtered);
      } catch (err) {
        console.error('Error fetching resources:', err);
      }
    };

    fetchResources();
  }, [class_code]);

  const handleDeleteResource = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This resource will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/classResources/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete resource');
        
        setResources(prev => prev.filter(resource => resource._id !== id));
        Swal.fire('Deleted!', 'Resource has been deleted.', 'success');
      } catch (err) {
        console.error('Failed to delete resource:', err);
        Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
      }
    }
  };

  const deleteClass = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This class will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/classroom/delete-with-resources/${class_code}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete class');
        
        Swal.fire('Deleted!', 'Class has been deleted.', 'success');
        navigate('/dashboard/myclasses');
      } catch (err) {
        console.error('Failed to delete class:', err);
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading class details...</div>;
  if (!classData) return <div className="text-center py-10 text-red-500">Class not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-600">{classData.class_code.toUpperCase()}</h2>
        <button
          onClick={deleteClass}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Class
        </button>
      </div>
      
      <p className="mb-2"><strong>Course:</strong> {classData.course_code}</p>
      <p className="mb-2"><strong>Faculty:</strong> {classData.faculty_initial}</p>
      <p className="mb-2"><strong>Semester:</strong> {classData.semester}</p>
      <p className="mb-2"><strong>Section:</strong> {classData.section}</p>

      <div className="mt-10">
        <div className='flex justify-between'>
          <h3 className="text-2xl font-semibold mb-4">Class Resources</h3>
          <Link
            to={`/dashboard/uploadmaterial/${class_code}`}
            state={{
              class_code: classData.class_code,
              course_code: classData.course_code,
            }}
          >
            <button className='btn'>Upload Materials</button>
          </Link>
        </div>

        {resources.length === 0 ? (
          <p className="text-gray-500">No resources added for this class.</p>
        ) : (
          <ul className="space-y-4">
            {resources.map((resource) => (
              <li
                key={resource._id}
                className="border p-4 rounded-md shadow hover:shadow-md flex justify-between items-start"
              >
                <div>
                  <p className="font-medium text-gray-800">{resource.description}</p>
                  <p className="text-sm text-gray-500">Type: {resource.type}</p>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Visit Resource
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteResource(resource._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ClassPage;