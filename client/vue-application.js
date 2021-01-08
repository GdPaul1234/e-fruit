const Home = window.httpVueLoader("./components/Home.vue");
const AdminSettings = window.httpVueLoader("./components/admin/AdminSettings.vue");
const UserEditTable = window.httpVueLoader("./components/admin/UserEditTable.vue");
const ArticleEdit = window.httpVueLoader("./components/admin/ArticleEdit.vue");
const ArticleDetail = window.httpVueLoader("./components/card/ArticleDetail.vue");
const Account = window.httpVueLoader("./components/user/Account.vue");
const PeseeTable = window.httpVueLoader("./components/admin/PeseeTable.vue");
const AllArticles = window.httpVueLoader("./components/AllArticles.vue");

const routes = [
  { path: "/", component: Home },
  { path: "/settings", component: AdminSettings },
  { path: "/users", component: UserEditTable },
  { path: "/edit", component: ArticleEdit },
  { path: "/p/:id", component: ArticleDetail },
  { path: "/account", component: Account },
  { path: "/pesees", component: PeseeTable },
  { path: "/correct_suggestion", component: AllArticles }
];

const router = new VueRouter({
  routes,
});

var app = new Vue({
  router,
  el: "#app",
  data: {
    articles: [],

    articleBalance: {
      id: 5,
      name: "Fraise",
      description:
        "Petit fruit très parfumé, de forme conique, dont les akènes forment \
          des aspérités sur la chair rouge vif, qui mûrit en été sur une \
          plante à tige très basse.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Fraises_2_Luc_Viatour.jpg/781px-Fraises_2_Luc_Viatour.jpg",
      price: 3,
    },

    suggestionsBalance: [],

    registerSuccess: false,
    registerError: false,
    registerErrorReason: "",

    loginSuccess: false,
    loginError: false,
    loginErrorReason: "",

    connectedUser: "",
    isAdmin: false,

    // stream du flux video de la camera
    stream: null,
    pictureBase64: "",
    userCorrectingSuggestion: false,
  },
  async mounted() {
    const res = await axios.get("/api/articles");
    this.articles = res.data;

    // savoir si l'utilisateur est déjà connecté
    try {
      const res3 = await axios.get("/api/me");
      this.connectedUser = res3.data.message;
      this.isAdmin = res3.data.admin;
    } catch (error) {
      this.connectedUser = "";
    }

    // capturer photos des fruits toutes les 2 sec
    window.setInterval(this.takepicture, 2000);
  },
  methods: {
    /*
    ===============================================================
    GESTION BALANCE
    ===============================================================
    */
    getCorrection(articleId) {
      // Bloquer la reconnaissance de fruit pour laisser le temps 
      // au client de prendre son ticket
      this.userCorrectingSuggestion = true;
      // On se donne 5s pour reprendre la reconnaissance de fruits
      window.setTimeout(this.unlockClassify, 5000);

      console.log("get " + articleId);
      var article = this.articles.find((a) => a.id === articleId);

      this.articleBalance = {
        id: article.id,
        name: article.name,
        description: article.description,
        image: article.image,
        price: article.price,
      };

      console.log(this.articleBalance.name);
    },

    unlockClassify() {
      this.userCorrectingSuggestion = false;
    },

    /*
    ===============================================================
    GESTION CLIENTS
    ===============================================================
    */

    // Gestion register
    async registerUser(newUser) {
      try {
        await axios.post("api/register", newUser);
      } catch (error) {
        this.registerError = true;
        this.registerSuccess = false;
        this.registerErrorReason = `error ${error.response.status}: ${error.response.data["message"]}`;
        return;
      }

      this.registerSuccess = true;
      this.registerError = false;

      window.setTimeout(this.resetRegister, 1000);
    },

    resetRegister() {
      this.registerSuccess = false;
      this.registerError = false;
    },

    // Gestion login
    async loginUser(user) {
      try {
        const result = await axios.post("api/login", user);
        this.isAdmin = result.data.admin;
      } catch (error) {
        this.loginError = true;
        this.loginSuccess = false;
        this.loginErrorReason = `error ${error.response.status}: ${error.response.data["message"]}`;
        return;
      }

      this.loginSuccess = true;
      this.loginError = false;
      this.connectedUser = user.email;
    },

    // Gestion disconnect
    async logoutUser() {
      console.log("try logout");
      try {
        await axios.post("api/logout");
      } catch (error) {
        this.loginErrorReason = `error ${error.response.status}: ${error.response.data["message"]}`;
        return;
      }

      this.connectedUser = "";
      this.loginSuccess = false;
      this.loginError = false;
      this.isAdmin = false;
    },

    /*
    ===============================================================
    GESTION ARTICLES
    ===============================================================
    */
    async addArticle(article) {
      const res = await axios.post("/api/article", article);
      this.articles.push(res.data);
    },

    async updateArticle(newArticle) {
      await axios.put("/api/article/" + newArticle.id, newArticle);
      const article = this.articles.find((a) => a.id === newArticle.id);
      article.name = newArticle.name;
      article.description = newArticle.description;
      article.image = newArticle.image;
      article.price = newArticle.price;
    },

    async deleteArticle(articleId) {
      await axios.delete("/api/article/" + articleId);
      const index = this.articles.findIndex((a) => a.id === articleId);
      this.articles.splice(index, 1);
    },

    /*
    ===============================================================
    GESTION CAMERA
    ===============================================================
    */

    /* activer aperçu caméra
    https://www.kirupa.com/html5/accessing_your_webcam_in_html5.htm
    https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos */
    async getCameraPreview() {
      let stream = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log(stream);
        // use the stream
        this.stream = stream;
      } catch (err) {
        // handle the error
        console.log("An error occurred: " + err);
      }
    },

    /* Capturer image du flux video et l'encoder en base64 pour l'envoyer au serveur
     https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
     https://x-team.com/blog/webcam-capture-vue/ */
    async takepicture() {
      // obtenir piste vidéo...
      var tracks = null;
      if (this.stream) {
        tracks = this.stream.getVideoTracks();
      }

      // définir propriétés du canvas
      var canvas = this.$refs.canvas;
      var context = canvas.getContext("2d");

      if (tracks && tracks[0].enabled && !this.userCorrectingSuggestion) {
        var videoTrack = tracks[0];
        // obtenir taille vidéo
        var videoTrackSettings = videoTrack.getSettings();
        var height = videoTrackSettings.height;
        var width = videoTrackSettings.width;

        canvas.width = width;
        canvas.height = height;
        context.drawImage(this.$refs.video, 0, 0, width, height);

        var data = canvas.toDataURL("image/jpeg");
        this.pictureBase64 = data;

        // envoyer image au serveur
        try {
          const result = await axios.post("/api/classify", {
            imageBase64: data,
          });
          this.suggestionsBalance = result.data;
          console.log(result);
          // chercher le fruit en top score
          this.articleBalance = this.articles.find((a) =>
            a.name
              .toUpperCase()
              .includes(this.suggestionsBalance[0].categorie.toUpperCase())
          );
        } catch (error) {
          console.log(error.response);
          try {
            this.suggestionsBalance = [
              { message: error.response.data[0]["message"] },
            ];
          } catch (unknownError) {
            this.suggestionsBalance = [
              { message: "Erreur inconnue" },
            ];
            console.log(error);
          }
          
        }
      } else {
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, 640, 480);
        var data = canvas.toDataURL("image/jpeg");
        this.pictureBase64 = data;
      }
    },
  },
});
