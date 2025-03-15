import  { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { RootState } from '../redux/store';
import { fetchStudents } from '../redux/dataSlice';
import { Student } from '@/interfaces/student.interface';


const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading, error } = useSelector((state: RootState) => state.data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  

  if (loading) return <div className="p-4">Loading students...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (students.length === 0) return <div className="p-4">No students found.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">Student Directory</h1>
      </header>
      <div className="flex-grow p-4 mt-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-2 mb-4">
            {currentStudents.map((student: Student) => (
              <div key={student.id} className="p-2 border border-gray-300 rounded-md shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-base font-semibold">{student.firstName} {student.lastName}</h2>
                <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                  <p>Email: {student.email}</p>
                  <p>Enrollment: {student.enrollmentNumber}</p>
                  <p>Department: {student.department}</p>
                  <p>CGPA: {student.cgpa}</p>
                  <p className="col-span-2">Year of Study: {student.yearOfStudy}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-25 bg-white py-3 border-t">
            <div className="flex justify-center items-center space-x-4 mb-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            </div>
            <div className="flex justify-center items-center space-x-2">
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${currentPage === number 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Home;
