const express = require("express");

const app = express();
const port = 3000;
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const Comments = sequelize.define("Comments", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

(async () => {
  await Comments.sync({ force: true });
  console.log("The table for the Comments model was just (re)created!");
})();

let comments = [];

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", async (req, res) => {
  const comments = await Comments.findAll();
  res.render("index", { comments });
});

app.post("/create", async (req, res) => {
  const { content } = req.body;
  comments.push(content);
  const comment = await Comments.create({ content: content });
  console.log(comment.id);
  res.redirect("/");
});

app.post("/update/:id", async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const { id } = req.params;
  const { content } = req.body;

  await Comments.update({ content: content }, { where: { id: id } });
  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  await Comments.destroy({ where: { id: id } });
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
