const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Contact = require("./models/contact");

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time :body", {
    skip: (req) => req.method !== "POST", // Log only POST requests
  })
);

const PORT = process.env.PORT || 3001;

// const generateRandomId = (maxNumber) => Math.floor(Math.random() * maxNumber);

// const requestLogger = (req, res, next) => {
//   console.log("Method:", req.method);
//   console.log("Path:", req.path);
//   console.log("Body:", req.body);
//   console.log("---");
//   next();
// };

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

// app.use(requestLogger);

app.get("/", (req, res) => {
  res.send();
});

app.get("/api/persons", (req, res, next) => {
  Contact.find({})
    .then((allContacts) => {
      res.status(200).json(allContacts);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  Contact.find({}).then((allContacts) => {
    const totalContacts = allContacts.length;
    const date = new Date();
    res.send(
      `<p>Phonebook has info for ${totalContacts} people</p><p>${date}</p>`
    );
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Contact.findById(id)
    .then((contact) => {
      res.status(200).json(contact);
    })
    .catch((error) => next(error));

  // res.status(200).json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  // persons = persons.filter((obj) => obj.id !== id);

  Contact.findByIdAndRemove(id).then(() => {
    res.status(204).end();
  });
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;
  if (!name || !number) {
    res.status(400).json({ error: "Please send all fields" });
    return;
  }

  const contact = new Contact({
    name,
    number,
  });

  contact
    .save()
    .then((savedContact) => {
      res.status(200).json(savedContact);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  let { name, number } = req.body;
  let { id } = req.params;
  if (!name || !number) {
    res.status(400).json({ error: "Please send all fields" });
    return;
  }
  let newContact = {
    name,
    number,
  };

  Contact.findByIdAndUpdate({ _id: id }, newContact, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedContact) => {
      res.status(200).json(updatedContact);
    })
    .catch((error) => next(error));
});

app.use(unknownEndPoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  console.log("Error name :", error.name);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if ((error.name === "ValidationError")) {
    return res.status(400).json({
      error: error.message,
    });
  }
  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server has started in port " + PORT);
});
