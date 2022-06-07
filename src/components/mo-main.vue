<template>
  <div v-html="html"></div>
</template>

<script>
import showdown from "../plugins/unpkg.com/showdown@2.1.0/dist/showdown.min.js";

const { defineComponent } = Vue;

export default defineComponent({
  data() {
    return {
      html: "",
    };
  },
  created() {
    fetch("https://markdown.mobingc.ml/static/README.md")
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        const converter = new showdown.Converter();
        this.html = converter.makeHtml(data);
      });
  },
});
</script>