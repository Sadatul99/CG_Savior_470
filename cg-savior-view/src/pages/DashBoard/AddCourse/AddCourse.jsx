import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const AddCourse = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const { user } = useAuth();

  const onSubmit = async (data) => {
    try {
      const course = {
        course_code: data.course_code.toUpperCase(), // Convert to uppercase
        course_title: data.course_title,
        pre_requisite: data.pre_requisite || "N/A",
        soft_pre_requisite: data.soft_pre_requisite || "N/A",
        lab: data.lab === 'true', 
        credit: parseFloat(data.credit), 
        course_description: data.course_description,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const response = await fetch('http://localhost:5000/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        },
        body: JSON.stringify(course)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add course');
      }

      const result = await response.json();

      if (result.insertedId) {
        reset();
        // show success popup
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Course added successfully.`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Add course error:', error);
      Swal.fire({
        icon: "error",
        title: "Failed to add course",
        text: error.message || 'Please try again'
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-xl shadow-md">
      <SectionTitle heading="Add Course" subHeading="What's new" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Course code */}
        <div>
          <label className="block font-medium mb-1">Course Code</label>
          <input
            type="text"
            {...register("course_code", { 
              required: "Course Code is required",
              pattern: {
                value: /^[A-Za-z]{2,4}\s?\d{3,4}$/,
                message: "Course code should be in format like CSE101, MATH 202"
              }
            })}
            className="input input-bordered w-full"
            placeholder="e.g., CSE101, MATH 202"
          />
          {errors.course_code && <p className="text-red-500 text-sm mt-1">{errors.course_code.message}</p>}
        </div>

        {/* course title */}
        <div>
          <label className="block font-medium mb-1">Course Title</label>
          <input
            type="text"
            {...register("course_title", { required: "Course Title is required" })}
            className="input input-bordered w-full"
            placeholder="e.g., Introduction to Programming"
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
            placeholder="Enter course codes or N/A if none"
          />
        </div>

        {/* soft_pre_requisite */}
        <div>
          <label className="block font-medium mb-1">Soft Pre-requisite</label>
          <input
            type="text"
            {...register("soft_pre_requisite")}
            className="input input-bordered w-full"
            placeholder="Enter course codes or N/A if none"
          />
        </div>

        {/* lab */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Lab</label>
            <select 
              {...register("lab")} 
              className="select select-bordered w-full"
              defaultValue="true"
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
              placeholder="e.g., 3.0"
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
            placeholder="Describe the course content, objectives, and learning outcomes..."
          ></textarea>
          {errors.course_description && <p className="text-red-500 text-sm mt-1">{errors.course_description.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;