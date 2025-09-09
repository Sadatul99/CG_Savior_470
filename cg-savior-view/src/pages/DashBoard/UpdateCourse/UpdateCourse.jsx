import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useLoaderData, useNavigate } from 'react-router-dom';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import useAuth from '../../../hooks/useAuth';

const UpdateCourse = () => {
  const course = useLoaderData();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      course_code: course.course_code,
      course_title: course.course_title,
      pre_requisite: course.pre_requisite || '',
      soft_pre_requisite: course.soft_pre_requisite || '',
      lab: course.lab ? 'true' : 'false',
      credit: course.credit.toString(),
      course_description: course.course_description
    }
  });

  const onSubmit = async (data) => {
    try {
      const updatedCourse = {
        course_title: data.course_title,
        pre_requisite: data.pre_requisite || "N/A",
        soft_pre_requisite: data.soft_pre_requisite || "N/A",
        lab: data.lab === 'true',
        credit: parseFloat(data.credit),
        course_description: data.course_description
      };

      console.log('Sending update:', updatedCourse); // Debug log

      const response = await fetch(`http://localhost:5000/courses/${course.course_code}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        },
        body: JSON.stringify(updatedCourse)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update course');
      }

      const updatedCourseData = await response.json();
      console.log('Update response:', updatedCourseData); // Debug log

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Course updated successfully",
        showConfirmButton: false,
        timer: 1500
      });
      
      // Navigate back after successful update
      setTimeout(() => {
        navigate(-1);
      }, 1600);

    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: error.message || 'Failed to update course. Please check console for details.'
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-xl shadow-md">
      <SectionTitle heading="Update Course" subHeading="Refresh info" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Course code */}
        <div>
          <label className="block font-medium mb-1">Course Code</label>
          <input
            type="text"
            {...register("course_code")}
            className="input input-bordered w-full bg-gray-100"
            readOnly
          />
        </div>

        {/* course title */}
        <div>
          <label className="block font-medium mb-1">Course Title</label>
          <input
            type="text"
            {...register("course_title", { required: "Course Title is required" })}
            className="input input-bordered w-full"
          />
          {errors.course_title && <p className="text-red-500 text-sm mt-1">{errors.course_title.message}</p>}
        </div>

        {/* pre_requisite */}
        <div>
          <label className="block font-medium mb-1">Pre-requisite</label>
          <input
            type="text"
            {...register("pre_requisite")}
            className="input input-bordered w-full"
            placeholder="Enter N/A if no prerequisite"
          />
        </div>

        {/* soft_pre_requisite */}
        <div>
          <label className="block font-medium mb-1">Soft Pre-requisite</label>
          <input
            type="text"
            {...register("soft_pre_requisite")}
            className="input input-bordered w-full"
            placeholder="Enter N/A if no soft prerequisite"
          />
        </div>

        {/* lab */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Lab</label>
            <select
              {...register("lab")} 
              className="select select-bordered w-full"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* credit */}
          <div>
            <label className="block font-medium mb-1">Credit</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="6"
              {...register("credit", { 
                required: "Credit is required",
                min: { value: 0.5, message: "Credit must be at least 0.5" },
                max: { value: 6, message: "Credit cannot exceed 6" }
              })}
              className="input input-bordered w-full"
            />
            {errors.credit && <p className="text-red-500 text-sm mt-1">{errors.credit.message}</p>}
          </div>
        </div>

        {/* course_description */}
        <div>
          <label className="block font-medium mb-1">Course Description</label>
          <textarea
            {...register("course_description", { required: "Description is required" })}
            rows="5"
            className="textarea textarea-bordered w-full"
          ></textarea>
          {errors.course_description && <p className="text-red-500 text-sm mt-1">{errors.course_description.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Course
        </button>
      </form>
    </div>
  );
};

export default UpdateCourse;