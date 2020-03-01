const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonData = require("./data.json");

app.set("view engine", "ejs");
app.use(express.static("./assets"));

const data = jsonData;

// Home Route
app.get("/", (req, res) => {
  data.sort(function(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  res.render("index", { data });
});

// Contact View Route
app.get("/contact/:id/view", (req, res) => {
  const newData = data.find(person => person.id === Number(req.params.id));
  if (newData) return res.render("view", { person: newData });
  return res.status(400).render("error", {
    Error: { code: 400, status: "Bad Request", message: "Contact not found!" }
  });
});

// Delete Contact Route
app.post("/contact/:id/delete", (req, res) => {
  data.splice(
    data.findIndex(person => person.id === Number(req.params.id)),
    1
  );
  res.redirect("/");
});

// Create Contact Route
app.get("/contact/create", (req, res) => {
  let id = 1;
  data.forEach(person => {
    if (person.id >= id) {
      id = person.id + 1;
    }
  });
  res.render("create", { id });
});

// Save Contact Route
app.post("/contact/save", urlencodedParser, (req, res) => {
  let { id, avatar, name, mobile, tel, email, address } = req.body;
  let newContact = {
    id: Number(id),
    avatar,
    name,
    mobile,
    tel,
    email,
    address
  };
  data.push(newContact);
  res.redirect("/");
});

// Edit Contact Route
app.get("/contact/:id/edit", (req, res) => {
  const newData = data.find(person => person.id === Number(req.params.id));
  if (newData) return res.render("update", { person: newData });
  return res.status(400).render("error", {
    Error: { code: 400, status: "Bad Request", message: "Contact not found!" }
  });
});

// Update Contact Route
app.post("/contact/update", urlencodedParser, (req, res) => {
  let { id, avatar, name, mobile, tel, email, address } = req.body;
  let newContact = {
    id: Number(id),
    avatar,
    name,
    mobile,
    tel,
    email,
    address
  };
  data[data.findIndex(person => person.id === newContact.id)] = newContact;
  res.redirect("/");
});

// Search Contact Route
app.post("/contact/search", urlencodedParser, (req, res) => {
  const searched = data.filter(person => {
    const personLC = person.name.toLowerCase();
    const searchLC = req.body.search.toLowerCase();
    return personLC.includes(searchLC);
  });
  if (req.body.search === "") {
    res.redirect("/");
  } else {
    res.render("index", { data: searched });
  }
});

app.get("*", (req, res) => {
  res.status(404).render("error", {
    Error: { code: 404, status: "Not Found", message: "Page Not Found!" }
  });
});

// Listen to Port 3000
app.listen(3000, () => {
  console.log("Listening on Port 3000...");
});
