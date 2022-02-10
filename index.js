const personDetailForm = document.querySelector("#personal-details");
const errorElement = document.querySelector(".error");
const showDataParentElement = document.querySelector("#data");
const removeCardBtn = document.querySelector("#remove-card-btn");
let updateUserIndex = -1;
const submitBtn = document.querySelector(".submit-btn");
const setErrorMsg = (errorFlag, msg) => {
  if (errorFlag) {
    errorElement.style.backgroundColor = "#fff";
    errorElement.innerText = msg;
  } else {
    errorElement.style.backgroundColor = "#f94892";
    errorElement.innerText = msg;
  }
};

const checkEmptyFields = (details) => {
  const isAnyFieldEmpty = details.some((field) => field === "");
  isAnyFieldEmpty
    ? setErrorMsg(isAnyFieldEmpty, "All fields are mandatory")
    : setErrorMsg(isAnyFieldEmpty, "");
  return isAnyFieldEmpty;
};
const fnameLnameCannotStartWithNumber = (fname, lname) => {
  const isFnameAndLnameIsValid =
    ((fname[0] >= "a" && fname[0] <= "z") ||
      (fname[0] >= "A" && fname[0] <= "Z")) &&
    ((lname[0] >= "a" && lname[0] <= "z") ||
      (lname[0] >= "A" && lname[0] <= "Z"))
      ? true
      : false;
  isFnameAndLnameIsValid
    ? setErrorMsg(isFnameAndLnameIsValid, "")
    : setErrorMsg(
        isFnameAndLnameIsValid,
        "fname/lname can't start with number"
      );
  return isFnameAndLnameIsValid;
};

const validatePhone = (phone) => {
  let phoneValidateStatus;
  if (phone.match(/^[6-9]\d{9}$/)) {
    phoneValidateStatus = true;
    setErrorMsg(false, "");
  } else {
    phoneValidateStatus = false;
    setErrorMsg(true, "Invalid phone number");
  }
  return phoneValidateStatus;
};

const setDataInLocalStorage = (data) => {
  localStorage.setItem("users", JSON.stringify(data));
};
const getDataFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const createTag = (tagName) => document.createElement(tagName);
const addClassInTag = (tagName, className) => {
  tagName.classList.add(className);
};
const genRowContent = (col1Data, col2Data, card, i) => {
  const row = createTag("div");
  const col1 = createTag("div");
  const col2 = createTag("div");
  addClassInTag(row, "row");
  addClassInTag(col1, "col-lg-6");
  addClassInTag(col2, "col-lg-6");
  col1.innerText = col1Data;
  col2.innerText = col2Data;
  row.appendChild(col1);
  row.appendChild(col2);
  card.appendChild(row);
};

const createUpdateAndDeleteBtn = (card, id) => {
  const btnStyle = ["btn", "add-dlt-btn"];
  const updateBtn = createTag("button");
  updateBtn.classList.add(...btnStyle);
  updateBtn.innerText = "Update";
  const deleteBtn = createTag("button");
  deleteBtn.classList.add(...btnStyle);
  deleteBtn.innerText = "Delete";
  updateBtn.setAttribute("onclick", `handleUpdateClick(${id})`);
  removeCardBtn.setAttribute("onclick", `handleDeleteClick(${id})`);
  deleteBtn.setAttribute("data-bs-toggle", "modal");
  deleteBtn.setAttribute("data-bs-target", "#staticBackdrop");
  const row = createTag("div");
  addClassInTag(row, "row");
  const col1 = createTag("div");
  addClassInTag(col1, "col-lg-6");
  const col2 = createTag("div");
  addClassInTag(col2, "col-lg-6");
  col1.appendChild(updateBtn);
  col2.appendChild(deleteBtn);
  row.appendChild(col1);
  row.appendChild(col2);
  card.appendChild(row);
};
const genRow = (rowData, card) => {
  const titles = ["First name", "Last name", "Email", "Phone", "Address"];
  const { fname, lname, email, phone, address } = rowData;
  const values = [fname, lname, email, phone, address];
  let titleIndex = 0;
  let valueIndex = 0;
  for (let i = 0; i < 6; i++) {
    if (i % 2 === 0) {
      if (titleIndex + 1 === titles.length) {
        genRowContent(titles[titleIndex], "", card, i);
      } else {
        genRowContent(titles[titleIndex], titles[titleIndex + 1], card, i);
      }

      titleIndex += 2;
    } else {
      if (valueIndex + 1 === values.length) {
        genRowContent(values[valueIndex], "", card, i);
      } else {
        genRowContent(values[valueIndex], values[valueIndex + 1], card, i);
      }

      valueIndex += 2;
    }
  }
  const showTimeTag = createTag("div");
  addClassInTag(showTimeTag, "time-element");
  showTimeTag.innerText = `Created at ${new Date().toDateString()}`;
  card.appendChild(showTimeTag);
  createUpdateAndDeleteBtn(card, rowData.id);
};
const showData = () => {
  const users = getDataFromLocalStorage("users");
  showDataParentElement.innerHTML = "";
  const data = users.length >=0 && users.map((user) => {
    const card = createTag("div");
    card.setAttribute("id", user.id);
    addClassInTag(card, "card");
    genRow(user, card);
    showDataParentElement.appendChild(card);
    return card;
  });
};
const handleUpdateClick = (id) => {
  submitBtn.innerText = "Update";
  const users = getDataFromLocalStorage("users");
  const updatedUser = users.filter((user) => user.id === id);
  personDetailForm["fname"].value = updatedUser[0].fname;
  personDetailForm["lname"].value = updatedUser[0].lname;
  personDetailForm["email"].value = updatedUser[0].email;
  personDetailForm["phone"].value = updatedUser[0].phone;
  personDetailForm["address"].value = updatedUser[0].address;
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      updateUserIndex = i;
      break;
    }
  }
};
const handleDeleteClick = (id) => {
  let users = getDataFromLocalStorage("users");
  users = users.filter((user) => user.id !== id);
  setDataInLocalStorage(users);
  showData();
};
personDetailForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const targetElement = e.target;
  const fname = targetElement["fname"].value;
  const lname = targetElement["lname"].value;
  const email = targetElement["email"].value;
  const phone = targetElement["phone"].value;
  const address = targetElement["address"].value;
  let details = [fname, lname, email, phone, address];

  // Checking for empty fields
  // fname and lname can't start with number
  // check phoneNumber
  if (
    !checkEmptyFields(details) &&
    fnameLnameCannotStartWithNumber(fname, lname) &&
    validatePhone(phone)
  ) {
    details = { fname, lname, email, phone, address };
    targetElement.reset();
    let users = getDataFromLocalStorage("users");
    if (updateUserIndex !== -1) {
      submitBtn.innerText = "Add";
      users[updateUserIndex] = { ...details, id: new Date().getTime() };
    } else {
      if (users) {
        users = [...users, { ...details, id: new Date().getTime() }];
      } else {
        users = [{ ...details, id: new Date().getTime() }];
      }
    }
    setDataInLocalStorage(users);
    showDataParentElement.innerHTML = "";
    showData();
  }
});
showData();
