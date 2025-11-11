// JavaScript for grades page - easy to understand for beginners

// Wait until page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Call function to load course list first
  loadCourses();

  // Add event listener to load grades button
  const loadBtn = document.getElementById("load-grades-btn");
  loadBtn.addEventListener("click", loadGradesForSelectedCourse);
});

// Function to load all courses for selection
async function loadCourses() {
  try {
    // Call API to get all courses
    const response = await fetch("/api/v1/course");

    // Check if response is successful
    if (!response.ok) {
      throw new Error("Failed to get course data");
    }

    // Get JSON data from response
    const courses = await response.json();

    // Fill course dropdown with options
    fillCourseDropdown(courses);
  } catch (error) {
    console.error("Error loading courses:", error);
    showError("Failed to load courses. Please refresh the page.");
  }
}

// Function to fill course dropdown with course options
function fillCourseDropdown(courses) {
  const courseSelect = document.getElementById("course-select");

  // Clear existing options except the first one
  courseSelect.innerHTML = '<option value="">-- Choose a Course --</option>';

  // Add each course as an option
  courses.forEach(function (course) {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = `${course.title} - ${course.instructor}`;
    courseSelect.appendChild(option);
  });
}

// Function to load grades for the selected course
async function loadGradesForSelectedCourse() {
  const courseSelect = document.getElementById("course-select");
  const courseId = courseSelect.value;

  // Check if a course is selected
  if (!courseId) {
    alert("Please select a course first!");
    return;
  }

  // Show loading and hide other elements
  showLoading();

  try {
    // Get both enrolled students and grades data
    const [enrolledResponse, gradesResponse] = await Promise.all([
      fetch(`/api/v1/course/${courseId}/students`),
      fetch(`/api/v1/grade/${courseId}`),
    ]);

    // Check if responses are successful
    if (!enrolledResponse.ok) {
      throw new Error("Failed to get enrolled students data");
    }

    const enrolledStudents = await enrolledResponse.json();

    // Grades might not exist yet, so handle gracefully
    let grades = [];
    if (gradesResponse.ok) {
      grades = await gradesResponse.json();
    }

    // Combine enrolled students with their grades
    const studentsWithGrades = combineStudentsAndGrades(
      enrolledStudents,
      grades
    );

    // Display combined data in table
    displayGrades(studentsWithGrades);

    // Hide loading and show table
    hideLoading();
    showGradesTable();
  } catch (error) {
    console.error("Error:", error);
    hideLoading();
    showError("Failed to load grade data. Please try again.");
  }
}

// Function to combine enrolled students with their grades
function combineStudentsAndGrades(enrolledStudents, grades) {
  // Create a map of grades by studentId for quick lookup
  const gradesByStudent = {};
  grades.forEach(function (gradeRecord) {
    gradesByStudent[gradeRecord.studentId] = gradeRecord.grade;
  });

  // Map enrolled students to include grade info
  return enrolledStudents.map(function (enrollment) {
    const student = enrollment.Student;
    const studentId = enrollment.studentId;

    return {
      studentId: studentId,
      courseId: enrollment.courseId,
      Student: student,
      grade: gradesByStudent[studentId] || null, // null if no grade yet
    };
  });
}

// Function to display grade data in table
function displayGrades(grades) {
  const tbody = document.getElementById("grades-tbody");

  // Clear table content first
  tbody.innerHTML = "";

  // Check if there are students enrolled
  if (grades.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center;">No students enrolled in this course</td></tr>';
    return;
  }

  // Loop for each grade record
  grades.forEach(function (gradeRecord, index) {
    // Create new row
    const row = document.createElement("tr");

    // Get student info (from the included Student model)
    const studentName = gradeRecord.Student
      ? gradeRecord.Student.nama
      : "Unknown";
    const studentEmail = gradeRecord.Student
      ? gradeRecord.Student.email
      : "Unknown";

    // Format grade with color
    const gradeValue = gradeRecord.grade || "-";
    const gradeClass = getGradeClass(gradeValue);

    // Fill row content with grade data
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${studentName}</td>
      <td>${studentEmail}</td>
      <td><span class="${gradeClass}">${gradeValue}</span></td>
      <td>${gradeRecord.courseId}</td>
    `;

    // Add row to table
    tbody.appendChild(row);
  });
}

// Function to get CSS class based on grade value
function getGradeClass(grade) {
  if (!grade || grade === "-") return "";

  const upperGrade = grade.toString().toUpperCase();

  if (upperGrade.includes("A")) return "grade-a";
  if (upperGrade.includes("B")) return "grade-b";
  if (upperGrade.includes("C")) return "grade-c";
  if (upperGrade.includes("D")) return "grade-d";
  if (upperGrade.includes("F")) return "grade-f";

  return ""; // Default no class
}

// Helper functions to show/hide different sections
function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("grades-container").classList.add("hidden");
  document.getElementById("no-course-message").classList.add("hidden");
  document.getElementById("error-message").classList.add("hidden");
}

function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
}

function showGradesTable() {
  document.getElementById("grades-container").classList.remove("hidden");
  document.getElementById("no-course-message").classList.add("hidden");
  document.getElementById("error-message").classList.add("hidden");
}

function showError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.querySelector("p").textContent = message;
  errorDiv.classList.remove("hidden");
  document.getElementById("grades-container").classList.add("hidden");
  document.getElementById("no-course-message").classList.add("hidden");
}

// Function to refresh grades (can be called from refresh button later)
function refreshGrades() {
  loadGradesForSelectedCourse();
}
