const express = require("express");
const fs = require("fs");
const router = express.Router();
var articles = [];

const bcrypt = require("bcrypt");
const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  password: "ultrasecurepwd",
  database: "fruit-store",
});

client.connect();

/**
 * Dans ce fichier, vous trouverez des exemples de requêtes GET, POST, PUT et DELETE
 * Ces requêtes concernent l'ajout ou la suppression d'articles sur le site
 *
 */

/**
 * Recupérer articles du serveur
 */
router.use(async (req, res, next) => {
  const sql = "SELECT * FROM articles\nORDER BY id ASC";
  const result = await client.query({
    text: sql,
  });

  // mis à jour cache articles serveur
  articles = result.rows;
  next();
});

/**
 * Cette route envoie l'intégralité des articles du site
 */
router.get("/articles", async (req, res) => {
  const sql = "SELECT * FROM articles";
  const result = await client.query({
    text: sql,
  });
  res.json(result.rows);
});

/* ===========================================================================
   =============================== GESTION PESEES ============================
   =========================================================================== */

router.get("/pesees", async (req, res) => {
  // Si utilisateur pas authentifié, pas de commande
  const id = req.session.userId;

  if (typeof id === "undefined") {
    res.status(401).json({ message: "user not logged in!" });
    return;
  }

  // Verifier si user est un admin, si oui, accès à toutes les pesees
  if (req.session.admin) {
    const sql = "SELECT * FROM pesees\nORDER BY id ASC";
    const result = await client.query({
      text: sql,
    });

    var pesees = result.rows;
    res.json({ pesees });
  } else {
    res.status(403).json({ message: "forbidden" });
  }
});

/* ===========================================================================
   ============================= GESTION ARTICLES ============================
   =========================================================================== */

/**
 * Cette route crée un article.
 */
router.post("/article", async (req, res) => {
  if (req.session.admin) {
    const name = req.body.name;
    const description = req.body.description;
    const image = req.body.image;
    const price = parseFloat(req.body.price);
    console.log(price);

    // vérification de la validité des données d'entrée
    if (
      typeof name !== "string" ||
      name === "" ||
      typeof description !== "string" ||
      description === "" ||
      typeof image !== "string" ||
      image === "" ||
      isNaN(price) ||
      price <= 0
    ) {
      res.status(400).json({ message: "bad request" });
      return;
    }
    //éventuellemnt ajouter un test pour si un article similaire existe déja
    const sql =
      "INSERT INTO articles (name,description,image,price)\nVALUES ($1,$2,$3,$4)";
    await client.query({
      text: sql,
      values: [name, description, image, price],
    });

    const article = {
      id: articles.length + 1, // pour que vue-application récupère l'id
      name: name,
      description: description,
      image: image,
      price: price,
    };
    articles.push(article);
    // on envoie l'article ajouté à l'utilisateur
    res.json(article);
  } else {
    res.status(403).json({ message: "forbidden" });
  }
});

/**
 * Cette fonction fait en sorte de valider que l'article demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /article/:articleId
 * - PUT /article/:articleId
 * - DELETE /article/:articleId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */
function parseArticle(req, res, next) {
  const articleId = parseInt(req.params.articleId);

  // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
  if (isNaN(articleId)) {
    res.status(400).json({ message: "articleId should be a number" });
    return;
  }
  // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
  req.articleId = articleId;

  const article = articles.find((a) => a.id === req.articleId);
  if (!article) {
    res
      .status(404)
      .json({ message: "article " + articleId + " does not exist" });
    return;
  }
  // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
  req.article = article;
  next();
}

router
  .route("/article/:articleId")
  /**
   * Cette route envoie un article particulier
   */
  .get(parseArticle, async (req, res) => {
    // req.article existe grâce au middleware parseArticle
    const sql = "SELECT * FROM articles WHERE id=$1";
    const result = await client.query({
      text: sql,
      values: [req.articleId],
    });

    res.json(result.rows);
  })

  /**
   * Cette route modifie un article.
   */
  .put(parseArticle, async (req, res) => {
    if (req.session.admin) {
      const name = req.body.name;
      const description = req.body.description;
      const image = req.body.image;
      const price = parseFloat(req.body.price);

      const sql =
        "UPDATE articles SET name=$1, description=$2, image=$3, price=$4 WHERE id=$5";
      await client.query({
        text: sql,
        values: [name, description, image, price, req.articleId],
      });

      res.send({ message: "article mis à jour" });
    } else {
      res.status(403).json({ message: "forbidden" });
    }
  })

  .delete(parseArticle, async (req, res) => {
    if (req.session.admin) {
      const sql = "DELETE FROM articles WHERE id=$1";
      await client.query({
        text: sql,
        values: [req.articleId],
      });

      res.send({ message: "article supprimé" });
    } else {
      res.status(403).json({ message: "forbidden" });
    }
  });

/* ===========================================================================
   ============================== GESTION CLIENT =============================
   =========================================================================== */

/**
 *  router permettant d'obtenir tous les utilisateurs
 */
router.get("/all_users", async function (req, res) {
  if (req.session.admin) {
    const sql = "SELECT id,email FROM users";
    const result = await client.query({
      text: sql,
    });

    var users;

    res.json({ users: result.rows });
  } else {
    res.status(403).json({ message: "forbidden" });
  }
});

/**
 * route POST /register dont l’objectif d’inscrire un utilisateur
 */
router.post("/register", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  // Vérifier si un utilisateur avec cet email n’existe pas déjà dans la table users
  const sql = "SELECT * FROM users WHERE email=$1";
  const result = await client.query({
    text: sql,
    values: [email],
  });

  if (result.rows.length != 0) {
    res.status(401).json({ message: `user ${email} already exist!` });
    return;
  }

  // Si tout est bon, hasher le mot de passe grâce à la fonction bcrypt.hash
  const hash = await bcrypt.hash(password, 10);

  // Stocker enfin l’utilisateur avec son mot de passe hashé
  const sql2 = "INSERT INTO users (email, password, panier)\nVALUES ($1,$2,$3)";
  await client.query({
    text: sql2,
    values: [email, hash, []],
  });

  res.json({ message: `${email} added!` });
});

/**
 * route POST /login permettant à l'utilisateur de se connecter à son espace client
 */
router.post("/login", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  // Vérifier que l’utilisateur existe...
  const sql = "SELECT * FROM users WHERE email=$1";
  const result = await client.query({
    text: sql,
    values: [email],
  });

  if (result.rows.length === 0) {
    res.status(401).json({ message: `cannot found user ${email}!` });
    return;
  }

  // stocker id trouvé
  const id = result.rows[0]["id"];
  const admin = result.rows[0]["admin"] ? true : false;
  req.session.admin = admin;

  // ... et que la forme hashée du mot de passe correspond à ce qui est base avec bcrypt.compare
  if (await bcrypt.compare(password, result.rows[0].password)) {
    // congrats

    // vérifier si l'utilisateur ne sait pas connecté
    if (req.session.userId === id) {
      // à modifier si necessaire
      res.status(401).json({
        message: `${result.rows[0]["email"]} already connected!`,
        admin: admin,
      });
      return;
    } else {
      req.session.userId = result.rows[0]["id"];
    }
  } else {
    // go out !
    res.status(401).json({ message: "bad password!" });
    return;
  }

  res.json({ message: `${email} logged`, admin: admin });
});

router.post("/logout", async (req, res) => {
  req.session.destroy();

  res.json({ message: "user déconnecté" });
});

/**
 * route GET /me, qui retourne simplement l’utilisateur actuellement connecté
 */
router.get("/me", async function (req, res) {
  const id = req.session.userId;

  // Si l’utilisateur n’est pas connecté, lui retourner une erreur 401
  if (typeof id === "undefined") {
    res.status(401).json({ message: "user not logged in!" });
    return;
  }

  const sql = "SELECT * FROM users WHERE id=$1";
  const result = await client.query({
    text: sql,
    values: [id],
  });

  const email = result.rows[0]["email"];
  const admin = result.rows[0]["admin"] ? true : false;
  res.json({ message: email, admin: admin });
});

/* ===========================================================================
   ============================== GESTION IMAGE  =============================
   =========================================================================== */
router.post("/classify", async (req, res) => {
  const imageBase64 = req.body.imageBase64;
  const now = Number(Date.now()).toString();
  const fileName = `matlab/images/image_${now}.jpg`;

  // sauver image dans un fichier jpg pour Matlab
  fs.writeFileSync(fileName, imageBase64, { encoding: "base64" });
  console.log(`${fileName} saved!`);

  // classifier image

  res.json({ message: "File saved!" });
});

module.exports = router;
