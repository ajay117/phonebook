const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
// app.use(morgan("tiny"));
// app.use(
//   morgan.token("type", (req, res) => {
//     return JSON.stringify(req.body);
//   })
// );

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time :body", {
    skip: (req, res) => req.method !== "POST", // Log only POST requests
  })
);

const PORT = process.env.PORT || 3001;

const generateRandomId = (maxNumber) => Math.floor(Math.random() * maxNumber);

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Body:", req.body);
  console.log("---");
  next();
};

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

// app.use(requestLogger);
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  // res.send("hello world");
  res.send();
});

app.get("/api/persons", (req, res) => {
  res.status(200).json(persons);
});

app.get("/info", (req, res) => {
  const totalContacts = persons.length;
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${totalContacts} people</p><p>${date}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  let person = persons.filter((obj) => obj.id === id);

  // console.log(person);
  if (!person.length) {
    res.status(404).json({
      error: "Sorry cannot found person. Try another id",
    });
    return;
  }

  res.status(200).json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((obj) => obj.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  console.log(name, number);

  if (persons.some((contact) => contact.name === name)) {
    res.status(400).json({ error: "name must be unique" });
  }
  if (!name || !number) {
    res.status(400).json({ error: "Please send all fields" });
    return;
  }

  const generateRandomId = (maxNumber) => Math.floor(Math.random() * maxNumber);
  const id = generateRandomId(1000000);
  const newContact = { id, ...req.body };

  persons.push(newContact);
  res.status(201).json(newContact);
});

app.use(unknownEndPoint);

app.listen(PORT, () => {
  console.log("Server has started in port " + PORT);
});
