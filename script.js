const pageNames = {
  dashboard: "Tableau de bord", students: "Élèves", teachers: "Enseignants",
  attendance: "Présences", grades: "Notes & résultats", schedule: "Emploi du temps",
  reports: "Rapports & statistiques", messages: "Messages", settings: "Paramètres"
};

const modalBackdrop = document.getElementById("modalBackdrop");
const toast = document.getElementById("toast");
let toastTimer;

function showBackendNotice() {
  modalBackdrop.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeBackendNotice() {
  modalBackdrop.classList.remove("show");
  document.body.style.overflow = "";
}
document.querySelectorAll("[data-backend='true']").forEach(button => {
  button.addEventListener("click", showBackendNotice);
});
document.getElementById("modalClose").addEventListener("click", closeBackendNotice);
document.getElementById("modalOk").addEventListener("click", closeBackendNotice);
modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeBackendNotice();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeBackendNotice();
});

function navigateTo(page) {
  if (!pageNames[page]) return;
  document.querySelectorAll(".page-view").forEach(view => view.classList.remove("active"));
  document.getElementById(`page-${page}`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.page === page));
  document.getElementById("breadcrumbCurrent").textContent = pageNames[page];
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({top: 0, behavior: "smooth"});
}
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => navigateTo(item.dataset.page));
});
document.querySelectorAll("[data-page-link]").forEach(button => {
  button.addEventListener("click", () => navigateTo(button.dataset.pageLink));
});

const mobileMenu = document.getElementById("mobileMenu");
mobileMenu.addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
document.addEventListener("click", event => {
  const sidebar = document.getElementById("sidebar");
  if (window.innerWidth <= 900 && sidebar.classList.contains("open") &&
      !sidebar.contains(event.target) && !mobileMenu.contains(event.target)) {
    sidebar.classList.remove("open");
  }
});

document.getElementById("closeToast").addEventListener("click", () => toast.classList.remove("show"));
document.getElementById("notificationsBtn").addEventListener("click", () => {
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 6500);
});

const studentSearch = document.getElementById("studentSearch");
if (studentSearch) {
  studentSearch.addEventListener("input", () => {
    const term = studentSearch.value.trim().toLocaleLowerCase("fr");
    document.querySelectorAll("#studentsTable tbody tr").forEach(row => {
      row.hidden = !row.textContent.toLocaleLowerCase("fr").includes(term);
    });
  });
}

const globalSearch = document.getElementById("globalSearch");
globalSearch.addEventListener("keydown", event => {
  if (event.key === "Enter" && globalSearch.value.trim()) {
    const query = globalSearch.value.trim().toLocaleLowerCase("fr");
    const match = Object.entries(pageNames).find(([key, label]) =>
      label.toLocaleLowerCase("fr").includes(query) || key.includes(query)
    );
    if (match) navigateTo(match[0]);
    else showBackendNotice();
  }
});

document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    globalSearch.focus();
  }
});

const dateNode = document.getElementById("todayDate");
if (dateNode) {
  const now = new Date();
  dateNode.textContent = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(now).replace(/^./, char => char.toLocaleUpperCase("fr"));
}
