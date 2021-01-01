<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" id="print">
          <div class="modal-header">
            <h3>{{ page.title }}</h3>
          </div>
          <div class="modal-body" v-html="page.extract"></div>
          <div class="modal-footer">
            Données issues de
            <a :href="`https://fr.wikibooks.org/wiki/${title}`">Wikibooks</a>
            <div class="modal-default-button">
              <button @click="print()">Imprimer</button>
              <button @click="$emit('close')">OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
module.exports = {
  props: {
    title: { type: String },
  },
  watch: {
    title: {
      immediate: true,
      deep: true,
      async handler(newVal, oldVal) {
        const result = await axios.get(
          "http://fr.wikibooks.org/w/api.php?action=query&prop=extracts" +
            "&titles=" +
            encodeURIComponent(newVal) +
            "&origin=*" +
            "&utf8=&format=json"
        );
        const contenuPage = result.data.query.pages;

        // prendre le premier résultat de la requête à wikibooks
        this.page = contenuPage[Object.keys(contenuPage)[0]];
      },
    },
  },
  data() {
    return {
      page: {
        title: "Loading...",
        extract: "<p>Please wait...</p>",
      },
    };
  },
  methods: {
    // https://stackoverflow.com/questions/52343006/how-to-print-a-part-of-a-vue-component-without-losing-the-style
    print() {
      // Get HTML to print from element
      const prtHtml = document.getElementById("print").innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style'),
      ]) {
        stylesHtml += node.outerHTML;
      }

      // Open the print window
      const WinPrint = window.open(
        "",
        "",
        "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
      );

      WinPrint.document.write(
        `<!DOCTYPE html>
        <html>
        <head>
            ${stylesHtml}
        </head>
        <body>
            ${prtHtml}
        </body>
        </html>`
      );

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },
  },
};
</script>

<style>
/* d'après https://vuejs.org/v2/examples/modal.html */
.modal-mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}

body {
  height: 100vh;
}

/* Centrage de la boîte de dialogue */
.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.modal-container {
  max-width: 500px;
  margin: 0px 1rem;
  padding: 0 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);

  max-height: 75vh;
  overflow: hidden auto;
}

.modal-header h3 {
  margin-top: 0;
}

.modal-header {
  position: sticky;
  padding: 10px 0;
  top: 0;
  background-color: white;
}

.modal-footer {
  position: sticky;
  padding: 10px 0;
  bottom: 0;
  background-color: white;
}

.modal-body {
  margin: 0.5rem 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
