/* global window, document, fetch */
(function () {
  "use strict";

  const BASE_URL = "http://localhost:3000";
  const API = {
    student: `${BASE_URL}/api/v1/student`,

    course: `${BASE_URL}/api/v1/course`,
    grade: `${BASE_URL}/api/v1/grade`,
  };

  function qs(sel) {
    return document.querySelector(sel);
  }
  function qsa(sel) {
    return Array.from(document.querySelectorAll(sel));
  }

  const toastEl = (() => {
    const t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
    return t;
  })();
  function toast(msg, type = "info") {
    toastEl.textContent = msg;
    toastEl.className = "toast show";
    if (type === "error") toastEl.style.borderColor = "#ff6a6a";
    if (type === "success") toastEl.style.borderColor = "#6aa3ff";
    setTimeout(() => {
      toastEl.className = "toast";
    }, 2500);
  }

  async function http(url, options = {}) {
    console.log("HTTP", url, options);
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      const maybeJson = await res.text().catch(() => "");
      let message = maybeJson;
      try {
        message = JSON.parse(maybeJson).message || maybeJson;
      } catch (_) {
        /* ignore */
      }
      throw new Error(message || `Request failed (${res.status})`);
    }
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch (_) {
      return text;
    }
  }

  // STUDENTS
  async function listStudents() {
    const data = await http(`${API.student}/`);
    renderStudents(data || []);
  }

  async function listGrades(id) {
    const data = await http(`${API.grade}/${encodeURIComponent(id)}`);
    renderGrades(data || []);
  }

  async function getStudent(id) {
    return http(`${API.student}/${encodeURIComponent(id)}`);
  }

  async function createStudent(payload) {
    return http(`${API.student}/add-student`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async function updateStudent(id, payload) {
    return http(`${API.student}/update-student/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async function deleteStudent(id) {
    return http(`${API.student}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  // COURSES
  async function listCourses() {
    const data = await http(`${API.course}/`);
    renderCourses(data || []);
  }

  async function createCourse(payload) {
    return http(`${API.course}/add-course`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async function updateCourse(id, payload) {
    return http(`${API.course}/update-course/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async function deleteCourse(id) {
    return http(`${API.course}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  async function enrollStudent(courseId, studentId) {
    return http(
      `${API.course}/${encodeURIComponent(courseId)}/enroll-student`,
      {
        method: "POST",
        body: JSON.stringify({ studentId }),
      }
    );
  }

  async function getEnrolled(courseId) {
    return http(`${API.course}/${encodeURIComponent(courseId)}/students`);
  }

  // GRADES
  async function gradeStudent(courseId, studentId, grade) {
    const url = `${API.grade}/${encodeURIComponent(
      courseId
    )}?studentId=${encodeURIComponent(studentId)}`;
    return http(url, {
      method: "POST",
      body: JSON.stringify({ grade }),
    });
  }

  // RENDERERS
  function renderStudents(students) {
    const tbody = qs("#students-table tbody");
    tbody.innerHTML = "";
    for (const s of students) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
				<td>${s.id ?? ""}</td>
				<td>${s.nama ?? ""}</td>
				<td>${s.email ?? ""}</td>
				<td>
					<button data-action="edit-student" data-id="${s.id}">Edit</button>
					<button class="danger" data-action="delete-student" data-id="${
            s.id
          }">Delete</button>
				</td>
			`;
      tbody.appendChild(tr);
    }
    populateStudentSelects(students);
  }

  function renderCourses(courses) {
    const tbody = qs("#courses-table tbody");
    tbody.innerHTML = "";
    for (const c of courses) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
				<td>${c.id ?? ""}</td>
				<td>${c.title ?? ""}</td>
				<td>${c.instructor ?? ""}</td>
				<td>
					<button data-action="edit-course" data-id="${c.id}">Edit</button>
					<button class="danger" data-action="delete-course" data-id="${
            c.id
          }">Delete</button>
				</td>
			`;
      tbody.appendChild(tr);
    }
    populateCourseSelects(courses);
  }

  function populateStudentSelects(students) {
    const selects = ["#enroll-student", "#grade-student"];
    for (const sel of selects) {
      const el = qs(sel);
      const prev = el.value;
      el.innerHTML = students
        .map(
          (s) =>
            `<option value="${s.id}">${s.nama ?? "Student " + s.id}</option>`
        )
        .join("");
      if (prev) el.value = prev;
    }
  }

  function populateGradeStudentSelects(students) {
    const selects = ["#grade-student"];
    for (const sel of selects) {
      const el = qs(sel);
      const prev = el.value;
      el.innerHTML = students
        .map(
          (s) =>
            `<option value="${s.id}">${s.nama ?? "Student " + s.id}</option>`
        )
        .join("");
      if (prev) el.value = prev;
    }
  }

  function populateCourseSelects(courses) {
    const selects = ["#enroll-course", "#enrolled-course", "#grade-course"];
    for (const sel of selects) {
      const el = qs(sel);
      const prev = el.value;
      el.innerHTML = courses
        .map(
          (c) =>
            `<option value="${c.id}">${c.title ?? "Course " + c.id} (${
              c.instructor ?? ""
            })</option>`
        )
        .join("");
      if (prev) el.value = prev;
    }
  }

  function renderEnrolled(enrollments, nama) {
    const tbody = qs("#enrolled-table tbody");
    tbody.innerHTML = "";
    for (const e of enrollments) {
      // Expecting service to include student and grade info if available
      const id = e.id ?? e.enrollmentId ?? "";
      const sid = e.studentId ?? e.student_id ?? "";
      const tr = document.createElement("tr");
      tr.innerHTML = `
				<td>${id}</td>
				<td>${sid}</td>
			`;
      tbody.appendChild(tr);
    }

    populateGradeStudentSelects(
      enrollments.map((e) => ({
        id: e.studentId ?? e.student_id,
        nama: e.Student ? e.Student.nama : nama,
      }))
    );
  }

  function renderGrades(grades) {
    const tbody = qs("#grade-table tbody");
    tbody.innerHTML = "";
    for (const g of grades) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
				<td>${g.Student.nama ?? ""}</td>
				<td>${g.Student.email ?? ""}</td>
				<td>${g.grade ?? ""}</td>
			`;
      tbody.appendChild(tr);
    }
  }

  // EVENT WIRING
  function wireStudents() {
    const form = qs("#student-form");
    const submitBtn = qs("#student-submit");
    const cancelBtn = qs("#student-cancel");
    const table = qs("#students-table");
    const refreshBtn = qs("#refresh-students");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = qs("#student-id").value.trim();
      const payload = {
        nama: qs("#student-name").value.trim(),
        email: qs("#student-email").value.trim(),
        password: qs("#student-password").value.trim(),
      };
      try {
        if (id) {
          await updateStudent(id, payload);
          toast("Student updated", "success");
        } else {
          await createStudent(payload);
          toast("Student created", "success");
        }
        form.reset();
        qs("#student-id").value = "";
        submitBtn.textContent = "Add Student";
        await listStudents();
      } catch (err) {
        toast(err.message || "Failed to save student", "error");
      }
    });

    cancelBtn.addEventListener("click", () => {
      form.reset();
      qs("#student-id").value = "";
      submitBtn.textContent = "Add Student";
    });

    table.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      if (action === "edit-student") {
        try {
          const s = await getStudent(id);
          qs("#student-id").value = s.id;
          qs("#student-name").value = s.nama ?? "";
          qs("#student-email").value = s.email ?? "";
          qs("#student-password").value = s.password ?? "";
          submitBtn.textContent = "Update Student";
        } catch (err) {
          toast(err.message || "Failed to load student", "error");
        }
      } else if (action === "delete-student") {
        if (!confirm("Delete this student?")) return;
        try {
          await deleteStudent(id);
          toast("Student deleted", "success");
          await listStudents();
        } catch (err) {
          toast(err.message || "Failed to delete student", "error");
        }
      }
    });

    refreshBtn.addEventListener("click", listStudents);
  }

  function wireCourses() {
    const form = qs("#course-form");
    const submitBtn = qs("#course-submit");
    const cancelBtn = qs("#course-cancel");
    const table = qs("#courses-table");
    const refreshBtn = qs("#refresh-courses");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = qs("#course-id").value.trim();
      const payload = {
        title: qs("#course-title").value.trim(),
        instructor: qs("#course-instructor").value.trim(),
      };
      try {
        if (id) {
          await updateCourse(id, payload);
          toast("Course updated", "success");
        } else {
          await createCourse(payload);
          toast("Course created", "success");
        }
        form.reset();
        qs("#course-id").value = "";
        submitBtn.textContent = "Add Course";
        await listCourses();
      } catch (err) {
        toast(err.message || "Failed to save course", "error");
      }
    });

    cancelBtn.addEventListener("click", () => {
      form.reset();
      qs("#course-id").value = "";
      submitBtn.textContent = "Add Course";
    });

    table.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      if (action === "edit-course") {
        try {
          const c = await http(`${API.course}/${encodeURIComponent(id)}`);
          qs("#course-id").value = c.id;
          qs("#course-title").value = c.title ?? "";
          qs("#course-instructor").value = c.instructor ?? "";
          submitBtn.textContent = "Update Course";
        } catch (err) {
          toast(err.message || "Failed to load course", "error");
        }
      } else if (action === "delete-course") {
        if (!confirm("Delete this course?")) return;
        try {
          await deleteCourse(id);
          toast("Course deleted", "success");
          await listCourses();
        } catch (err) {
          toast(err.message || "Failed to delete course", "error");
        }
      }
    });

    refreshBtn.addEventListener("click", listCourses);
  }

  function wireEnrollmentAndGrades() {
    const gradeCourseSelect = qs("#grade-course");
    const gradeStudentSelect = qs("#grade-student");
    const gradeForm = qs("#grade-form");

    gradeCourseSelect.addEventListener("change", async (e) => {
        const courseId = e.target.value;
        if (!courseId) return;

        try {
            const enrolled = await getEnrolled(courseId);

            gradeStudentSelect.innerHTML = "";

            if (!enrolled || enrolled.length === 0) {
                const opt = document.createElement("option");
                opt.textContent = "No students enrolled";
                opt.disabled = true;
                opt.selected = true;
                gradeStudentSelect.appendChild(opt);
            } else {
                enrolled.forEach((item) => {
                    const opt = document.createElement("option");
                    opt.value = item.studentId ?? item.student_id;
                    opt.textContent = item.Student?.nama ?? `Student ${opt.value}`;
                    gradeStudentSelect.appendChild(opt);
                });
            }

            await listGrades(courseId);
            
            toast("Student list and grades updated", "info");
        } catch (err) {
            toast(err.message || "Failed to load course data", "error");
        }
    });

    gradeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const courseId = gradeCourseSelect.value;
        const studentId = gradeStudentSelect.value;
        const grade = qs("#grade-value").value.trim();

        try {
            await gradeStudent(courseId, studentId, grade);
            toast("Grade submitted successfully", "success");

            await listGrades(courseId);

            qs("#grade-value").value = "";
        } catch (err) {
            toast(err.message || "Failed to submit grade", "error");
        }
    });
}

  function wireEnrollmentButtons() {
    const loadEnrolledBtn = qs("#load-enrolled");
    const enrolledCourseSelect = qs("#enrolled-course");
    const enrolledTable = qs("#enrolled-table tbody");

    loadEnrolledBtn.addEventListener("click", async () => {
      const courseId = enrolledCourseSelect.value;
      if (!courseId) {
        toast("Please select a course first", "warning");
        return;
      }

      try {
        const enrolled = await getEnrolled(courseId);

        enrolledTable.innerHTML = "";

        if (!enrolled || enrolled.length === 0) {
          enrolledTable.innerHTML = `<tr><td colspan="2">No students enrolled for this course</td></tr>`;
          return;
        }

        enrolled.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
				<td>${item.id || item.enrollment_id}</td>
				<td>${item.studentId || item.student_id}</td>
				`;
          enrolledTable.appendChild(row);
        });

        toast("Enrolled students loaded successfully", "success");
      } catch (err) {
        toast(err.message || "Failed to load enrolled students", "error");
      }
    });
  }

  function wireEnrollmentForm() {
    const form = qs("#enroll-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const courseId = qs("#enroll-course").value;
      const studentId = qs("#enroll-student").value;

      if (!courseId || !studentId) {
        toast("Please select both course and student", "error");
        return;
      }

      try {
        await enrollStudent(courseId, studentId);
        toast("Student enrolled successfully", "success");
        form.reset();
      } catch (err) {
        toast(err.message || "Failed to enroll student", "error");
      }
    });
  }

  async function bootstrap() {
    try {
      await Promise.all([listStudents(), listCourses()]);
      const firstCourse = qs("#grade-course").value;
      if (firstCourse) await listGrades(firstCourse);
    } catch (err) {
      toast("Unable to load initial data. Check backend/CORS.", "error");
    }
  }

  function init() {
    wireStudents();
    wireCourses();
    wireEnrollmentForm();
    wireEnrollmentAndGrades();
    bootstrap();
    wireEnrollmentButtons();
  }

  window.Frontend = { init };
})();