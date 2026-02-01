const BASE_URL = "http://localhost:8080";

const AdminAPI = {
  config: {
    latency: 500,
    currency: "USD",
    version: "1.0.2",
  },

  _simulateDelay: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), AdminAPI.config.latency);
    });
  },

  // --- DASHBOARD (Mocked) ---
  getStats: async () => {
    const data = {
      students: 12450,
      staff: 342,
      revenue: 2450000.0,
      activeCourses: 128,
      serverHealth: "98.5%",
      alerts: [
        {
          type: "danger",
          title: "High CPU Usage",
          desc: "Cluster B at 92%",
          time: "5m ago",
        },
        {
          type: "warning",
          title: "Payment Gateway",
          desc: "High failure rate",
          time: "1h ago",
        },
      ],
    };
    return AdminAPI._simulateDelay(data);
  },

 getStudents: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/students`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Fetch failed. Detailed Error:", err);
      console.error("Using fallback mock users");
      return [
        { id: 1, name: "Alex Doe" },
        { id: 2, name: "John Wick" },
      ];
    }
  },
  getCourses: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/courses`);
      if (!res.ok) throw new Error("Failed to fetch courses");
      return await res.json();
    } catch (err) {
      console.error("Using fallback mock courses");
      return [
        {
          id: 101,
          code: "CS101",
          name: "Intro to Computer Science",
          students: 45,
          capacity: 50,
          price: 150.0,
          img: "fa-laptop-code",
          color: "indigo",
        },
        {
          id: 102,
          code: "MATH201",
          name: "Advanced Calculus",
          students: 32,
          capacity: 40,
          price: 120.0,
          img: "fa-calculator",
          color: "blue",
        },
      ];
    }
  },

  connectStudentWithCourse: async (studentId, courseId) => {
    const response = await fetch(
      `${BASE_URL}/api/students/connect?studentId=${studentId}&courseId=${courseId}`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    return await response.json();
  },
};

// --- GLOBAL HANDLERS ---
window.handleEnroll = async (event) => {
  event.preventDefault();

  const studentId = document.getElementById("enrollStudentId").value;
  const courseId = document.getElementById("enrollCourseCode").value;

  if (!studentId || !courseId) {
    alert("Please select both a student and a course.");
    return;
  }

  const btn = event.target.querySelector("button");
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Connecting...';

  try {
    await AdminAPI.connectStudentWithCourse(studentId, courseId);
    alert("✅ Success: Student linked to Course!");

    if (typeof renderCourses === "function") {
      const mainContent = document.getElementById("mainContent");
      mainContent.innerHTML = await renderCourses();
    }
  } catch (error) {
    console.error("Enrollment failed:", error);
    alert("❌ Error: " + error.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
};

// Assign API to window for global access
window.AdminAPI = AdminAPI;
