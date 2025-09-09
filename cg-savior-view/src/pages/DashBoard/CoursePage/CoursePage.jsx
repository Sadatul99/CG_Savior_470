import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Resources from '../Resources/Resources';
import ClassroomResources from '../ClassroomResources/ClassroomResources';

const CoursePage = () => {
  const { course_code } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!course_code) return;

    fetch(`http://localhost:5000/courses/${course_code}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Course not found');
        }
        return res.json();
      })
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [course_code]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading course details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!course) return <p className="text-center mt-10 text-red-500">Course not found</p>;

  const {
    course_title,
    course_description,
    credit,
    pre_requisite,
    soft_pre_requisite,
    lab,
  } = course;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition duration-200"
        >
          ← Go Back
        </button>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{course_code} - {course_title}</h1>
          <p className="text-gray-600 text-lg mb-4">{credit} Credit Hour{credit > 1 ? 's' : ''}</p>
          <p className={`mb-2 text-sm font-semibold ${lab ? 'text-green-600' : 'text-red-500'}`}>
            {lab ? 'Lab Included' : 'No Lab'}
          </p>

          <div className="text-gray-700 space-y-1 mb-4">
            <p><span className="font-medium">Pre-requisite:</span> {pre_requisite === "N/A" ? "None" : pre_requisite}</p>
            <p><span className="font-medium">Soft Pre-requisite:</span> {soft_pre_requisite === "N/A" ? "None" : soft_pre_requisite}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Course Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{course_description}</p>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <Resources course_code={course_code} />
      <ClassroomResources course_code={course_code} />
    </>
  );
};

export default CoursePage;