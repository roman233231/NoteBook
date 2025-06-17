 let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
  const noteList = document.getElementById("noteList");
  const filterType = document.getElementById("filterType").value;
  noteList.innerHTML = "";

  const typeCounts = {};
  
  notes.forEach(note => {
    const type = note.type || "Невідомо";
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const tbody = document.querySelector("#typeStats tbody");
  tbody.innerHTML = "";
  for (const [type, count] of Object.entries(typeCounts)) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${type}</td><td>${count}</td>`;
    tbody.appendChild(row);
  }

  notes.forEach((note, index) => {
    if (filterType !== "Усе" && note.type !== filterType) return; 

    const li = document.createElement("li");
    if (note.archived) li.classList.add("archived");

    let noteClass = "note-type-none";
    switch (note.type) {
      case "Терміново":
        noteClass = "note-type-urgent"; break;
      case "Домашня робота":
        noteClass = "note-type-homework"; break;
      case "Список купівлі":
        noteClass = "note-type-shopping"; break;
      case "Домашні справи":
        noteClass = "note-type-house"; break;
    }
    li.classList.add(noteClass);

    const typeEl = document.createElement("div");
    typeEl.textContent = `Тип: ${note.type}`;
    typeEl.style.fontFamily = "cursive";
    typeEl.style.fontWeight = "bold";
    li.appendChild(typeEl);

    const titleEl = document.createElement("div");
    titleEl.textContent = note.title;
    titleEl.style.fontWeight = "bold";
    titleEl.contentEditable = true;
    titleEl.oninput = () => {
      if (titleEl.textContent.length > 50) {
        titleEl.textContent = titleEl.textContent.slice(0, 50);
      }
      notes[index].title = titleEl.textContent;
      saveNotes();
    };
    li.appendChild(titleEl);

    const textEl = document.createElement("div");
    textEl.textContent = note.text;
    textEl.contentEditable = true;
    textEl.oninput = () => {
      if (textEl.textContent.length > 200) {
        textEl.textContent = textEl.textContent.slice(0, 200);
      }
      notes[index].text = textEl.textContent;
      saveNotes();
    };
    li.appendChild(textEl);

    const date = document.createElement("div");
    date.className = "note-date";
    date.textContent = note.date;
    li.appendChild(date);

    const dell = document.createElement("button");
    dell.textContent = "Видалити";
    dell.className = "delete";
    dell.onclick = () => {
      notes.splice(index, 1);
      saveNotes();
      renderNotes();
    };
    li.appendChild(dell);

    const archivet = document.createElement("button");
    archivet.textContent = "Архівувати";
    archivet.className = "archive";
    archivet.onclick = () => {
      notes[index].archived = !notes[index].archived;
      saveNotes();
      renderNotes();
    };
    li.appendChild(archivet);

    noteList.appendChild(li);
  });
}


function addNote() {
  const title = document.getElementById("noteInput").value.trim();
  const text = document.getElementById("textInput").value.trim();
  const type = document.getElementById("noteType").value;

  if (title === "" && text === "") return;

  const newNote = {
    title,
    text,
    type,
    date: new Date().toLocaleString(),
    archived: false,
  };

  notes.push(newNote);
  saveNotes();
  renderNotes();

  document.getElementById("noteInput").value = "";
  document.getElementById("textInput").value = "";
}

function clearNotes() {
  if (confirm("Ви впевнені, що хочете видалити всі нотатки?")) {
    notes = [];
    saveNotes();
    renderNotes();
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

window.onload = function () {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
};



renderNotes();
