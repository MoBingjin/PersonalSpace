<template>
  <el-container>
    <el-header>
      <el-form>
        <el-form-item>
          <span>文件：</span>
          <input type="file" id="file" hidden />
          <el-input v-model="fileName" disabled placeholder="请选择文件">
            <template #append>
              <el-button title="文件" @click="fileElement.click()">
                <e-icon icon-name="el-icon-folder" />
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
    </el-header>
    <el-main>
      <div>
        <iframe :src="iframeSrc"></iframe>
      </div>
    </el-main>
  </el-container>
</template>

<script>
const { defineComponent } = Vue;

export default defineComponent({
  data() {
    return {
      fileElement: null,
      file: null,
      fileName: "",
      iframeSrc: "",
    };
  },
  mounted() {
    this.fileElement = document.querySelector("#file");
    this.fileElement.addEventListener("change", () => {
      if (this.fileElement.files[0] != undefined) {
        this.file = this.fileElement.files[0];
        this.fileName = this.file.name;
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = () => {
          const result = reader.result.toString();
          const fileType = result.substring(5, result.indexOf("/"));
          if (fileType == "text") {
            const split = result.indexOf(";");
            this.iframeSrc = result.substring(0, split + 1);
            this.iframeSrc += "charset=utf-8";
            this.iframeSrc += result.substring(split, result.length);
          } else if (fileType == "image") {
            this.iframeSrc = result;
          } else {
            this.iframeSrc = "";
          }
        };
      }
    });
  },
});
</script>

<style scoped>
.el-header,
.el-main {
  padding: 0;
}
iframe {
  width: 99%;
  height: 68vh;
}
.el-form-item {
  margin: 0;
}
.el-divider {
  height: 2px;
  margin: 10px 0;
}
.el-input {
  width: 300px;
}
span {
  font-size: 16px;
}
iframe {
  border: 2px solid #cfcfcf;
  border-radius: 5px;
}
</style>