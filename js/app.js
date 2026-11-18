(() => {
  const STORAGE_KEY = "seeka_english_club_sessions_v1";

  // State
  let sessions = loadSessions();
  let activeCategory = "ALL";
  let searchQuery = "";

  // DOM Elements
  const sessionForm = document.getElementById("sessionForm");
  const formTitle = document.getElementById("formTitle");
  const btnCancelEdit = document.getElementById("btnCancelEdit");
  const sessionIdInput = document.getElementById("sessionId");
  const sessionDateInput = document.getElementById("sessionDate");
  const sessionCategoryInput = document.getElementById("sessionCategory");
  const sessionTopicInput = document.getElementById("sessionTopic");
  const sessionSpeakerInput = document.getElementById("sessionSpeaker");
  const sessionNotesInput = document.getElementById("sessionNotes");
  const vocabList = document.getElementById("vocabList");
  const btnAddVocab = document.getElementById("btnAddVocab");
  const btnSubmit = document.getElementById("btnSubmit");

  const searchInput = document.getElementById("searchInput");
  const filterPills = document.getElementById("filterPills");
  const sessionsContainer = document.getElementById("sessionsContainer");

  const statSessions = document.getElementById("statSessions");
  const statVocab = document.getElementById("statVocab");
  const statTopCategory = document.getElementById("statTopCategory");
  const statLastDate = document.getElementById("statLastDate");

  const btnExportCSV = document.getElementById("btnExportCSV");
  const btnExportJSON = document.getElementById("btnExportJSON");
  const inputImportJSON = document.getElementById("inputImportJSON");
  const toastEl = document.getElementById("toast");

  // Initialization
  init();

  function init() {
    setTodayDate();
    addVocabRow();
    renderAll();
    bindEvents();
  }

  function loadSessions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Erreur de lecture localStorage:", e);
      return [];
    }
  }

  function saveSessions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  function setTodayDate() {
    const today = new Date().toISOString().split("T")[0];
    sessionDateInput.value = today;
  }

  function bindEvents() {
    btnAddVocab.addEventListener("click", () => addVocabRow());

    sessionForm.addEventListener("submit", handleFormSubmit);
    btnCancelEdit.addEventListener("click", resetForm);

    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderSessions();
    });

    filterPills.addEventListener("click", (e) => {
      const pill = e.target.closest(".pill");
      if (!pill) return;
      document.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.dataset.category;
      renderSessions();
    });

    btnExportCSV.addEventListener("click", exportCSV);
    btnExportJSON.addEventListener("click", exportJSON);
    inputImportJSON.addEventListener("change", importJSON);
  }

  function addVocabRow(en = "", fr = "") {
    const row = document.createElement("div");
    row.className = "vocab-item-row";
    row.innerHTML = `
      <input type="text" class="vocab-en" placeholder="Anglais (ex: Break the ice)" value="${escapeHtml(en)}" />
      <input type="text" class="vocab-fr" placeholder="Français (ex: Briser la glace)" value="${escapeHtml(fr)}" />
      <button type="button" class="btn-remove-vocab" title="Supprimer cette ligne">&times;</button>
    `;
    row.querySelector(".btn-remove-vocab").addEventListener("click", () => {
      row.remove();
    });
    vocabList.appendChild(row);
  }

  function getVocabFromForm() {
    const rows = vocabList.querySelectorAll(".vocab-item-row");
    const items = [];
    rows.forEach((row) => {
      const en = row.querySelector(".vocab-en").value.trim();
      const fr = row.querySelector(".vocab-fr").value.trim();
      if (en || fr) {
        items.push({ en, fr });
      }
    });
    return items;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const id = sessionIdInput.value;
    const payload = {
      id: id || "sec_" + Date.now(),
      date: sessionDateInput.value,
      category: sessionCategoryInput.value,
      topic: sessionTopicInput.value.trim(),
      speaker: sessionSpeakerInput.value.trim(),
      notes: sessionNotesInput.value.trim(),
      vocab: getVocabFromForm(),
      updatedAt: new Date().toISOString()
    };

    if (id) {
      const idx = sessions.findIndex((s) => s.id === id);
      if (idx !== -1) {
        sessions[idx] = payload;
        showToast("Séance mise à jour avec succès.");
      }
    } else {
      sessions.unshift(payload);
      showToast("Nouvelle séance enregistrée !");
    }

    saveSessions();
    resetForm();
    renderAll();
  }

  function resetForm() {
    sessionForm.reset();
    sessionIdInput.value = "";
    formTitle.textContent = "Nouvelle séance";
    btnSubmit.textContent = "Enregistrer la séance";
    btnCancelEdit.classList.add("hidden");
    vocabList.innerHTML = "";
    setTodayDate();
    addVocabRow();
  }

  function editSession(id) {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;

    sessionIdInput.value = session.id;
    sessionDateInput.value = session.date;
    sessionCategoryInput.value = session.category;
    sessionTopicInput.value = session.topic;
    sessionSpeakerInput.value = session.speaker || "";
    sessionNotesInput.value = session.notes || "";

    vocabList.innerHTML = "";
    if (session.vocab && session.vocab.length > 0) {
      session.vocab.forEach((v) => addVocabRow(v.en, v.fr));
    } else {
      addVocabRow();
    }

    formTitle.textContent = "Modifier la séance";
    btnSubmit.textContent = "Mettre à jour la séance";
    btnCancelEdit.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteSession(id) {
    if (!confirm("Voulez-vous vraiment supprimer cette séance ?")) return;
    sessions = sessions.filter((s) => s.id !== id);
    saveSessions();
    if (sessionIdInput.value === id) resetForm();
    renderAll();
    showToast("Séance supprimée.");
  }

  function copySession(id) {
    const s = sessions.find((item) => item.id === id);
    if (!s) return;

    let text = `🎓 SEEKA UNIVERSITY — ENGLISH CLUB\n`;
    text += `📅 Date : ${formatDateFR(s.date)} | 📂 ${s.category}\n`;
    text += `📌 Thème : ${s.topic}\n`;
    if (s.speaker) text += `🎙️ Intervenant : ${s.speaker}\n`;
    if (s.notes) text += `\n📝 Notes :\n${s.notes}\n`;
    if (s.vocab && s.vocab.length > 0) {
      text += `\n📖 Vocabulaire & Expressions :\n`;
      s.vocab.forEach((v) => {
        text += `• ${v.en} — ${v.fr}\n`;
      });
    }

    navigator.clipboard.writeText(text).then(() => {
      showToast("Compte-rendu copié dans le presse-papiers !");
    });
  }

  function renderAll() {
    renderStats();
    renderSessions();
  }

  function renderStats() {
    statSessions.textContent = sessions.length;

    const totalVocab = sessions.reduce((acc, s) => acc + (s.vocab ? s.vocab.length : 0), 0);
    statVocab.textContent = totalVocab;

    if (sessions.length === 0) {
      statTopCategory.textContent = "—";
      statLastDate.textContent = "—";
      return;
    }

    const counts = {};
    sessions.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    const topCat = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    statTopCategory.textContent = topCat;

    const sortedByDate = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
    statLastDate.textContent = formatDateFR(sortedByDate[0].date);
  }

  function renderSessions() {
    const filtered = sessions.filter((s) => {
      const matchCat = activeCategory === "ALL" || s.category === activeCategory;
      if (!matchCat) return false;
      if (!searchQuery) return true;

      const inVocab = (s.vocab || []).some(
        (v) => v.en.toLowerCase().includes(searchQuery) || v.fr.toLowerCase().includes(searchQuery)
      );
      return (
        s.topic.toLowerCase().includes(searchQuery) ||
        (s.speaker && s.speaker.toLowerCase().includes(searchQuery)) ||
        (s.notes && s.notes.toLowerCase().includes(searchQuery)) ||
        s.category.toLowerCase().includes(searchQuery) ||
        inVocab
      );
    });

    if (filtered.length === 0) {
      sessionsContainer.innerHTML = `
        <div class="empty-state">
          <img src="assets/logo.svg" alt="Blason Seeka University" />
          <h3>${sessions.length === 0 ? "Bienvenue au Seeka University English Club !" : "Aucun résultat trouvé"}</h3>
          <p>${
            sessions.length === 0
              ? "Votre espace est prêt. Utilisez le formulaire à gauche pour enregistrer votre première séance, vos notes et vos expressions anglaises."
              : "Aucune séance ne correspond à vos critères de recherche ou de filtre."
          }</p>
        </div>
      `;
      return;
    }

    sessionsContainer.innerHTML = filtered
      .map((s) => {
        const vocabTable =
          s.vocab && s.vocab.length > 0
            ? `
          <table class="session-vocab-table">
            <thead>
              <tr>
                <th>English (Word / Idiom)</th>
                <th>Français (Traduction / Sens)</th>
              </tr>
            </thead>
            <tbody>
              ${s.vocab
                .map(
                  (v) => `
                <tr>
                  <td class="en-term">${escapeHtml(v.en)}</td>
                  <td>${escapeHtml(v.fr)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>`
            : "";

        return `
        <article class="session-card">
          <div class="session-top">
            <span class="badge-category">${escapeHtml(s.category)}</span>
            <div class="session-meta">
              ${s.speaker ? `<span>🎙️ ${escapeHtml(s.speaker)}</span>` : ""}
              <span>📅 ${formatDateFR(s.date)}</span>
            </div>
          </div>
          <h3 class="session-title">${escapeHtml(s.topic)}</h3>
          ${s.notes ? `<div class="session-notes">${escapeHtml(s.notes)}</div>` : ""}
          ${vocabTable}
          <div class="session-actions">
            <button type="button" class="btn-action" data-action="copy" data-id="${s.id}">📋 Copier</button>
            <button type="button" class="btn-action" data-action="edit" data-id="${s.id}">✏️ Modifier</button>
            <button type="button" class="btn-action delete" data-action="delete" data-id="${s.id}">🗑️ Supprimer</button>
          </div>
        </article>`;
      })
      .join("");

    sessionsContainer.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const { action, id } = btn.dataset;
        if (action === "copy") copySession(id);
        if (action === "edit") editSession(id);
        if (action === "delete") deleteSession(id);
      });
    });
  }

  function exportCSV() {
    if (sessions.length === 0) {
      showToast("Aucune donnée à exporter.");
      return;
    }
    const headers = ["Date", "Catégorie", "Thème", "Intervenant", "Notes", "Vocabulaire (EN -> FR)"];
    const rows = sessions.map((s) => {
      const vocabStr = (s.vocab || []).map((v) => `${v.en} -> ${v.fr}`).join(" | ");
      return [s.date, s.category, s.topic, s.speaker || "", s.notes || "", vocabStr]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(";");
    });

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n");
    downloadFile(csvContent, "seeka-english-club-sessions.csv", "text/csv;charset=utf-8;");
    showToast("Export CSV téléchargé !");
  }

  function exportJSON() {
    if (sessions.length === 0) {
      showToast("Aucune donnée à sauvegarder.");
      return;
    }
    const jsonContent = JSON.stringify(sessions, null, 2);
    downloadFile(jsonContent, "seeka-english-club-backup.json", "application/json");
    showToast("Sauvegarde JSON téléchargée !");
  }

  function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) throw new Error("Format invalide");
        sessions = imported;
        saveSessions();
        renderAll();
        showToast(`${imported.length} séance(s) importée(s) avec succès !`);
      } catch (err) {
        alert("Le fichier JSON sélectionné n'est pas valide.");
      }
      inputImportJSON.value = "";
    };
    reader.readAsText(file);
  }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function formatDateFR(isoDate) {
    if (!isoDate) return "";
    const [y, m, d] = isoDate.split("-");
    return `${d}/${m}/${y}`;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  let toastTimer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3000);
  }
})();
