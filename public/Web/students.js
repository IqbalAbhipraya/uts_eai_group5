// JavaScript for students page - easy to understand for beginners

// Wait until page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Call function to load student data
  loadStudents();
});

// Function to load student data from API
async function loadStudents() {
  const loading = document.getElementById("loading");
  const studentsContainer = document.getElementById("students-container");
  const errorMessage = document.getElementById("error-message");

  try {
    // Show loading
    loading.style.display = "block";
    studentsContainer.classList.add("hidden");
    errorMessage.classList.add("hidden");

    // Call API to get student data
    const response = await fetch("/api/v1/student");

    // Check if response is successful
    if (!response.ok) {
      throw new Error("Failed to get student data");
    }

    // Get JSON data from response
    const students = await response.json();

    // Display data in table
    displayStudents(students);

    // Hide loading and show table
    loading.style.display = "none";
    studentsContainer.classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error);

    // Hide loading and show error
    loading.style.display = "none";
    errorMessage.classList.remove("hidden");
  }
}

// Function to display student data in table
function displayStudents(students) {
  const tbody = document.getElementById("students-tbody");

  // Clear table content first
  tbody.innerHTML = "";

  // Check if there is student data
  if (students.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align: center;">No student data available</td></tr>';
    return;
  }

  // Loop for each student
  students.forEach(function (student, index) {
    // Create new row
    const row = document.createElement("tr");

    // Format birth date to be more readable
    const birthDate = formatDate(student.tanggalLahir);

    // Fill row content with student data
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.nama || "-"}</td>
            <td>${student.email || "-"}</td>
            <td>${birthDate}</td>
            <td>${student.jurusan || "-"}</td>
            <td>${student.enrollmentYear || "-"}</td>
        `;

    // Add row to table
    tbody.appendChild(row);
  });
}

// Function to format date to be more readable
function formatDate(dateString) {
  if (!dateString) {
    return "-";
  }

  try {
    // Create Date object from string
    const date = new Date(dateString);

    // Format date to DD/MM/YYYY format
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return "-";
  }
}

// Function to refresh data (can be called from refresh button later)
function refreshStudents() {
  loadStudents();
}
