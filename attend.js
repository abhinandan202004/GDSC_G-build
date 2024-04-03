// Sample data for courses and attendance
const courses = [
    { name: 'Mathematics', id: 1 },
    { name: 'Physics', id: 2 },
    { name: 'Computer Science', id: 3 }
  ];
  
  const attendance = [
    { courseId: 1, attended: 12, total: 15 },
    { courseId: 2, attended: 10, total: 15 },
    { courseId: 3, attended: 13, total: 15 }
  ];
  
  // Function to render courses
  function renderCourses() {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';
    courses.forEach(course => {
      const li = document.createElement('li');
      li.textContent = course.name;
      li.dataset.id = course.id;
      courseList.appendChild(li);
    });
  }
  
  // Function to render attendance details
  function renderAttendance(courseId) {
    const courseAttendance = attendance.find(a => a.courseId === courseId);
    const attendanceDetails = document.getElementById('attendance-details');
    const existingAttendance = document.querySelector(`.course-attendance[data-id="${courseId}"]`);
    if (existingAttendance) {
      existingAttendance.textContent = `${courseAttendance.attended}/${courseAttendance.total}`;
    } else {
      const div = document.createElement('div');
      div.classList.add('course-attendance');
      div.textContent = `${courseAttendance.attended}/${courseAttendance.total}`;
      div.dataset.id = courseId;
      attendanceDetails.appendChild(div);
    }
  }
  
  // Initial rendering
  renderCourses();
  courses.forEach(course => renderAttendance(course.id));
  
  // Event listener for course selection
  document.getElementById('course-list').addEventListener('click', event => {
    if (event.target.tagName === 'LI') {
      const courseId = parseInt(event.target.dataset.id);
      renderAttendance(courseId);
    }
  });
  