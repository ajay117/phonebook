const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://meajay:${password}@phonebook.gnok3og.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

// Mongoose Schema

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 3) {
  console.log("phonebook");
  Contact.find({}).then((contacts) => {
    contacts.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  console.log("two");
  const name = process.argv[3];
  const number = process.argv[4];

  const contact = new Contact({
    name: name,
    number: number,
  });

  contact.save().then((obj) => {
    console.log(`added ${obj.name} number ${obj.number} to phonebook`);
    mongoose.connection.close();
  });
}
