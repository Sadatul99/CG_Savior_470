// components/ClassroomResources/ClassroomResources.jsx

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';

const ClassroomResources = ({ course_code }) => {
const [classes, setClasses] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [selectedSection, setSelectedSection] = useState('Default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, resourcesRes] = await Promise.all([
          fetch('http://localhost:5000/classroom'),
          fetch('http://localhost:5000/classResources')
        ]);

        if (!classesRes.ok || !resourcesRes.ok) throw new Error('Failed to fetch data');

        const classesData = await classesRes.json();
        const resourcesData = await resourcesRes.json();

        setClasses(classesData.filter(cls => cls.course_code === course_code));
        setAllResources(resourcesData.filter(res => res.course_code === course_code));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [course_code]);
  const filteredResources =
    selectedSection === 'Default'
      ? []
      : allResources.filter((res) => {
          const cls = classes.find(
            (cls) =>
              `${cls.semester}-${cls.faculty_initial}-section-${cls.section}` === selectedSection &&
              cls.class_code === res.class_code
          );
          return cls !== undefined;
        });

  // Group sections by semester and sort
  const semesterOrder = { Spring: 1, Summer: 2, Fall: 3 };

  const parseSemester = (semesterStr) => {
    const [_, season, year] = semesterStr.match(/([a-zA-Z]+)(\d+)/) || [];
    return {
      season,
      year: parseInt(year),
      order: semesterOrder[season] || 0,
    };
  };

  const groupedSections = {};

  classes.forEach((cls) => {
    const semesterKey = cls.semester;
    const sectionName = `${cls.semester}-${cls.faculty_initial}-section-${cls.section}`;
    if (!groupedSections[semesterKey]) groupedSections[semesterKey] = [];

    groupedSections[semesterKey].push({
      name: sectionName,
      sectionNum: parseInt(cls.section),
      facultyInitial: cls.faculty_initial,
    });
  });

  const sortedGroupedSections = Object.entries(groupedSections)
    .map(([semester, sections]) => {
      const { year, order } = parseSemester(semester);
      return {
        semester,
        sortKey: year * 10 + order,
        sections: sections.sort((a, b) => a.sectionNum - b.sectionNum),
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey);

  return (
    <><SectionTitle
    heading="Faculty Resources"
    >
    </SectionTitle>
    <div className="max-w-6xl mx-auto mt-8 px-4 py-6 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-4">Faculty Sections</h2>
      <div className="flex gap-6">
        {/* Left: Sections List */}
        <div className="w-1/3 border-r pr-4">
          <ul className="space-y-2">
            <li
              onClick={() => setSelectedSection('Default')}
              className={`cursor-pointer px-3 py-2 rounded ${
                selectedSection === 'Default'
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              Default
            </li>

            {sortedGroupedSections.map(({ semester, sections }) => (
              <li key={semester}>
                <div className="font-semibold text-gray-600 mt-2 mb-1">{semester}</div>
                <ul className="pl-4 space-y-1">
                  {sections.map((sec) => (
                    <li
                      key={sec.name}
                      onClick={() => setSelectedSection(sec.name)}
                      className={`cursor-pointer px-3 py-2 rounded ${
                        selectedSection === sec.name
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Section-{sec.name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Resource Table */}
        <div className="w-2/3">
          <h3 className="text-lg font-semibold mb-2">Resources</h3>
          <table className="w-full border table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border">Title</th>
                <th className="py-2 px-4 border">Resource Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan="2" className="py-4 px-4 text-center">
                    {selectedSection === 'Default'
                      ? 'Select a section to view resources.'
                      : 'No resources found for this section.'}
                  </td>
                </tr>
              ) : (
                filteredResources.map((res, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border">{res.description}</td>
                    <td className="py-2 px-4 border text-blue-600 underline">
                      <a href={res.link} target="_blank" rel="noopener noreferrer">
                        Visit Link
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default ClassroomResources;
