const Home = window.httpVueLoader("./components/Home.vue");
const AdminSettings = window.httpVueLoader("./components/admin/AdminSettings.vue");
const Register = window.httpVueLoader("./components/user/Register.vue");
//const Login = window.httpVueLoader("./components/user/Login.vue");
const ArticleEdit = window.httpVueLoader("./components/admin/ArticleEdit.vue");
const ArticleDetail = window.httpVueLoader(
  "./components/card/ArticleDetail.vue"
);
const Account = window.httpVueLoader("./components/user/Account.vue");
const ArticleCommandeTable = window.httpVueLoader(
  "./components/admin/AllCommandeTable.vue"
);
const AllArticles = window.httpVueLoader("./components/AllArticles.vue");

const routes = [
  { path: "/", component: Home },
  { path: "/settings", component: AdminSettings },
  { path: "/register", component: Register },
  //{ path: "/login", component: Login },
  { path: "/edit", component: ArticleEdit },
  { path: "/p/:id", component: ArticleDetail },
  { path: "/account", component: Account },
  { path: "/orders", component: ArticleCommandeTable },
  { path: "/correct_suggestion", component: AllArticles },
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
      nom: "Fraise",
      description:
        "Petit fruit très parfumé, de forme conique, dont les akènes forment \
          des aspérités sur la chair rouge vif, qui mûrit en été sur une \
          plante à tige très basse.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Fraises_2_Luc_Viatour.jpg/781px-Fraises_2_Luc_Viatour.jpg",
      prix: 3,
    },

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

    // capturer photos des fruits toutes les 1 sec
    window.setInterval(this.takepicture, 1000);
  },
  methods: {
    /*
    ===============================================================
    GESTION BALANCE
    ===============================================================
    */
    getCorrection(articleId) {
      console.log("get " + articleId);
      var article = this.articles.find((a) => a.id === articleId);

      this.articleBalance = {
        id: article.id,
        nom: article.name,
        description: article.description,
        image: article.image,
        prix: article.price,
      };

      console.log(this.articleBalance.nom);
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

      location.href = "/#/";
      location.reload();
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

    /* Capturer image du flux video et l'encoder en base64
     https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
     https://x-team.com/blog/webcam-capture-vue/ */
    takepicture() {
      // obtenir piste vidéo...
      var tracks = null;
      if (this.stream) {
        tracks = this.stream.getVideoTracks();
      }

      // définir propriétés du canvas
      var canvas = this.$refs.canvas;
      var context = canvas.getContext("2d");

      if (tracks) {
        var videoTrack = tracks[0];
        // obtenir taille vidéo
        var videoTrackSettings = videoTrack.getSettings();
        var height = videoTrackSettings.height;
        var width = videoTrackSettings.width;

        canvas.width = width;
        canvas.height = height;
        context.drawImage(this.$refs.video, 0, 0, width, height);

        var data = canvas.toDataURL("image/png");
        this.pictureBase64 = data;
        console.log(data.slice(0,30));
      } else {
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, 640, 480);
        var data = canvas.toDataURL("image/png");
        this.pictureBase64 = data;
      }
    },
  },
});
