import { FaArrowRight, FaTrash, FaEdit } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAdmin from '../../../hooks/useAdmin';

const CourseCard = ({ course, refetch }) => {
  const { course_code, course_title, lab, pre_requisite } = course;
  const { user } = useAuth();
  const [isAdmin] = useAdmin();

  const handleDelete = async () => {
    if (!isAdmin) return;

    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete course: ${course_code}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await fetch(`http://localhost:5000/courses/${course_code}`, {
          method: 'DELETE'
        });
        refetch();
        Swal.fire('Deleted!', 'Course has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error!', 'Failed to delete course.', 'error');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition duration-300 ease-in-out flex flex-col justify-between relative">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-3">
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
            title="Delete Course"
          >
            <FaTrash />
          </button>
          <Link to={`/dashboard/courses/updateCourse/${course_code}`}>
            <button className="text-blue-600 hover:text-blue-800" title="Edit Course">
              <FaEdit />
            </button>
          </Link>
        </div>
      )}

      {/* Course Info */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{course_code}</h2>
      <p className="text-lg text-gray-700 mb-2">{course_title}</p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Pre-requisite:</span>{" "}
        {pre_requisite && pre_requisite !== "N/A" ? pre_requisite : "None"}
      </p>
      <p className={`text-sm font-semibold mb-4 ${lab ? 'text-green-600' : 'text-red-500'}`}>
        {lab ? 'Lab Included' : 'No Lab'}
      </p>

      {/* View Button */}
      <Link
        to={`/dashboard/courses/${course_code}`}
        className="mt-auto inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
      >
        View
        <FaArrowRight className="text-sm" />
      </Link>
    </div>
  );
};

export default CourseCard;