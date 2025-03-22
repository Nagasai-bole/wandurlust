const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connected succesful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initdb = async () => {
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "67b1728a1dd0e198dd18f750",
  }));
  await listing
    .insertMany(initdata.data)
    .then((err) => {
      console.log("data initialize");
    })
    .catch((err) => {
      console.log(err);
    });
};
initdb();
