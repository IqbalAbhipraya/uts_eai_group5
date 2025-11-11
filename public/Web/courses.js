// JavaScript for courses page - easy to understand for beginners

// Wait until page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Call function to load all courses
  loadCourses();
});

// Function to load all courses from API
async function loadCourses() {
  const loading = document.getElementById("loading");
  const coursesContainer = document.getElementById("courses-container");
  const errorMessage = document.getElementById("error-message");

  try {
    // Show loading
    loading.style.display = "block";
    coursesContainer.classList.add("hidden");
    errorMessage.classList.add("hidden");

    // Call API to get all courses
    const response = await fetch("/api/v1/course");

    // Check if response is successful
    if (!response.ok) {
      throw new Error("Failed to get course data");
    }

    // Get JSON data from response
    const courses = await response.json();

    // Display courses as cards
    displayCourseCards(courses);

    // Hide loading and show courses
    loading.style.display = "none";
    coursesContainer.classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error);

    // Hide loading and show error
    loading.style.display = "none";
    errorMessage.classList.remove("hidden");
  }
}

// Function to display courses as cards
function displayCourseCards(courses) {
  const coursesGrid = document.getElementById("courses-grid");

  // Clear existing content
  coursesGrid.innerHTML = "";

  // Check if there are courses
  if (courses.length === 0) {
    coursesGrid.innerHTML = `
      <div class="empty-state">
        <h3>No Courses Available</h3>
        <p>There are no courses to display at the moment.</p>
      </div>
    `;
    return;
  }

  // Create card for each course
  courses.forEach(function (course) {
    const courseCard = createCourseCard(course);
    coursesGrid.appendChild(courseCard);
  });
}

// Function to create a single course card
function createCourseCard(course) {
  // Create main card element
  const card = document.createElement("div");
  card.className = "course-card";
  card.setAttribute("data-course-id", course.id);

  // Get instructor initials for avatar
  const instructorInitials = getInitials(course.instructor || "Unknown");

  // Get enrollment count (we'll fetch this separately for each course)
  const enrollmentCount = "Loading...";

  // Format course creation date
  const courseDate = formatCourseDate(course.createdAt);

  // Create simple card HTML content based on MVC data only
  card.innerHTML = `
    <h3 class="course-title">${course.title || "Untitled Course"}</h3>
    <p class="course-description-short">${
      course.description || "No description available for this course."
    }</p>
    <div class="instructor-info">
      <div class="instructor-avatar">${instructorInitials}</div>
      <span class="instructor-name">${
        course.instructor || "Unknown Instructor"
      }</span>
    </div>
    <div class="course-date">
      <span class="date-icon">🕒</span>
      <span>Created: ${courseDate}</span>
    </div>
    <div class="enrollment-section">
      <div class="enrollment-header">
        <span class="enrollment-icon">👥</span>
        <span id="enrollment-text-${
          course.id
        }">${enrollmentCount} Enrolled</span>
      </div>
      <div id="enrolled-students-${course.id}" class="enrolled-students">
        Loading students...
      </div>
    </div>
  `;

  // Load enrollment data for this course (both count and student list)
  loadEnrollmentData(course.id);

  return card;
}

// Function to format course creation date
function formatCourseDate(dateString) {
  if (!dateString) {
    return "Unknown";
  }

  try {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  } catch (error) {
    return "Unknown";
  }
}

// Function to get initials from instructor name
function getInitials(name) {
  if (!name || name === "Unknown") return "?";

  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

// Function to load enrollment data (count and student list) for a specific course
async function loadEnrollmentData(courseId) {
  try {
    // Call API to get enrolled students for this course
    const response = await fetch(`/api/v1/course/${courseId}/students`);

    if (response.ok) {
      const enrolledStudents = await response.json();
      const count = enrolledStudents.length;

      // Update enrollment count display with proper spacing
      const countElement = document.getElementById(
        `enrollment-text-${courseId}`
      );
      if (countElement) {
        countElement.textContent = `${count} Enrolled`;
      }

      // Update enrolled students list
      const studentsElement = document.getElementById(
        `enrolled-students-${courseId}`
      );
      if (studentsElement) {
        studentsElement.innerHTML = createStudentsList(enrolledStudents);
      }
    } else {
      // If API fails, show 0 and no students
      const countElement = document.getElementById(
        `enrollment-text-${courseId}`
      );
      const studentsElement = document.getElementById(
        `enrolled-students-${courseId}`
      );

      if (countElement) {
        countElement.textContent = "0 Enrolled";
      }
      if (studentsElement) {
        studentsElement.innerHTML =
          '<span class="no-students">No students enrolled</span>';
      }
    }
  } catch (error) {
    console.error(`Error loading enrollment for course ${courseId}:`, error);

    // On error, show "N/A"
    const countElement = document.getElementById(`enrollment-text-${courseId}`);
    const studentsElement = document.getElementById(
      `enrolled-students-${courseId}`
    );

    if (countElement) {
      countElement.textContent = "N/A Enrolled";
    }
    if (studentsElement) {
      studentsElement.innerHTML =
        '<span class="error-students">Error loading students</span>';
    }
  }
}

// Function to create students list HTML (max 3 students + counter)
function createStudentsList(students) {
  if (students.length === 0) {
    return '<span class="no-students">No students enrolled</span>';
  }

  let html = '<div class="student-list">';

  // Show maximum 3 students
  const maxShow = 3;
  const studentsToShow = students.slice(0, maxShow);

  studentsToShow.forEach(function (enrollmentData) {
    // API returns enrollment data with nested Student object
    const studentName = enrollmentData.Student
      ? enrollmentData.Student.nama
      : enrollmentData.nama || enrollmentData.name || "Unknown Student";
    const initials = getInitials(studentName);

    html += `
      <div class="student-item">
        <div class="student-avatar">${initials}</div>
        <span class="student-name">${studentName}</span>
      </div>
    `;
  });

  // If there are more than 3 students, show counter
  if (students.length > maxShow) {
    const remaining = students.length - maxShow;
    html += `
      <div class="student-item extra-count">
        <div class="student-avatar">+</div>
        <span class="student-name">${remaining}+</span>
      </div>
    `;
  }

  html += "</div>";
  return html;
}

// Function to refresh courses (can be called from refresh button later)
function refreshCourses() {
  loadCourses();
}
