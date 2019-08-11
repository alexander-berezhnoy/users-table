const modal = document.getElementById("infoModal");
const span = document.getElementsByClassName("close")[0];
const info = document.getElementById("info");
const tableContainer = document.getElementById("table-container");
const isSortedAsc = {
  name: false,
  username: false,
  email: false,
  website: false
};

const handleRowClick = e => {
  getUserInfo(e.target.parentElement.dataset.id);
  modal.style.display = "block";
};

span.onclick = () => {
  modal.style.display = "none";
};

window.onclick = event => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const drawTable = users => {
  const table = document.createElement("table");
  table.setAttribute("cellspacing", "0");
  table.className = "table-fill";
  table.appendChild(createHeader());

  table.appendChild(createTableBody(users));

  tableContainer.appendChild(table);
  addRowListeners();
  addHeaderListeners();
};

const createHeader = () => {
  const thead = document.createElement("thead");

  thead.innerHTML = `<tr>
  <th class="headerSortUp">Name</th>
  <th class="headerSortUp">Username</th>
  <th class="headerSortUp">Email</th>
  <th class="headerSortUp">Website</th>
  </tr>`;
  return thead;
};

const createTableBody = users => {
  const tbody = document.createElement("tbody");

  users.forEach(user => {
    appendUser(tbody, user);
  });

  return tbody;
};

const appendUser = (parent, user) => {
  const tableRow = document.createElement("tr");
  tableRow.className = "user-row";
  tableRow.innerHTML = `<td>${user.name}</td>
  <td>${user.username}</td>
  <td>${user.email}</td>
  <td>${user.website}</td>`;
  tableRow.setAttribute("data-id", user.id);
  parent.appendChild(tableRow);
};

const addRowListeners = () => {
  const rows = document.getElementsByClassName("user-row");
  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener("click", handleRowClick);
  }
};

const addHeaderListeners = () => {
  const headers = document.getElementsByTagName("th");
  for (let i = 0; i < headers.length; i++) {
    headers[i].addEventListener("click", sortTableByColumn);
  }
};

const getUsersFromTable = () => {
  return Array.from(document.getElementsByClassName("user-row")).map(row => ({
    id: row.dataset.id,
    name: row.children[0].innerText,
    username: row.children[1].innerText,
    email: row.children[2].innerText,
    website: row.children[3].innerText
  }));
};

const sortTableByColumn = event => {
  const column = event.target.innerHTML.toLowerCase();
  isSortedAsc[column] = !isSortedAsc[column];
  if (isSortedAsc[column]) {
    event.target.classList.remove("headerSortUp");
    event.target.classList.add("headerSortDown");
  } else {
    event.target.classList.remove("headerSortDown");
    event.target.classList.add("headerSortUp");
  }

  const sortedUsers = getUsersFromTable().sort((a, b) => {
    const colA = a[column].toLowerCase();
    const colB = b[column].toLowerCase();
    if (isSortedAsc[column]) {
      //ascending
      if (colA < colB) return -1;
      if (colA > colB) return 1;
      return 0;
    } else {
      //descending
      if (colA > colB) return -1;
      if (colA < colB) return 1;
      return 0;
    }
  });
  const table = document.getElementsByTagName("table")[0];
  const tbody = document.getElementsByTagName("tbody")[0];
  table.removeChild(tbody);
  table.appendChild(createTableBody(sortedUsers));
  addRowListeners();
};

const getUserInfo = userId => {
  info.innerText = "Loading...";
  fetch(`https://jsonplaceholder.typicode.com/users?id=${userId}`)
    .then(response => response.json())
    .then(usersData => {
      return usersData[0];
    })
    .then(user => {
      const {
        address: { street, suite, city, zipcode },
        company: { name: companyName },
        phone,
        email,
        name,
        username,
        website
      } = user;

      const infoString = `
Name: ${name} (${username})
Email: ${email}
Phone: ${phone}
Address: ${street}, ${suite}, ${city}, ${zipcode}
Website: ${website}
Company: ${companyName}`;
      info.innerText = infoString;
    })
    .catch(error => {
      info.innerText = "App can't find data about this user :(";
      console.log(error);
    });
};

(() => {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => response.json())
    .then(usersData => {
      return usersData.map(user => {
        const { id, name, username, email, website } = user;
        return { id, name, username, email, website };
      });
    })
    .then(users => drawTable(users))
    .catch(error => {
      console.log(error);
    });
})();
