<template>
  <el-container>
    <el-header>
      <el-form>
        <el-form-item class="mo-main-header">
          <span>文件：</span>
          <el-input
            class="mo-file-input"
            v-model="fileName"
            disabled
            placeholder="请选择文件"
          >
            <template #append>
              <el-button title="文件" @click="selectFile">
                <e-icon icon-name="el-icon-folder" />
              </el-button>
            </template>
          </el-input>
          <el-button type="primary" @click="openDialog" plain>新建</el-button>
          <el-button type="warning" @click="reset" plain>重置</el-button>
          <el-button type="danger" @click="clear" plain>清空</el-button>
          <el-button type="success" @click="save" plain>保存</el-button>
        </el-form-item>
      </el-form>
      <!-- 对话框 -->
      <el-dialog
        v-model="dialogFormVisible"
        @close="resetForm"
        :title="dialogTitle"
        width="500px"
      >
        <el-form :model="form">
          <el-form-item label="目录" :label-width="formLabelWidth">
            <el-input
              v-model="form.dirName"
              disabled
              placeholder="请选择目录"
              autocomplete="off"
            >
              <template #append>
                <el-button title="选择目录" @click="selectDirectory">
                  <e-icon icon-name="el-icon-folder" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="文件名" :label-width="formLabelWidth">
            <el-input
              v-model="form.fileName"
              autocomplete="off"
              placeholder="请输入文件名"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="create">确定</el-button>
          </span>
        </template>
      </el-dialog>
      <el-divider></el-divider>
    </el-header>
    <el-main>
      <el-input
        v-model="text"
        type="textarea"
        clearable
        input-style="height: calc(100vh - 201px); white-space: nowrap; border-width: 2px;"
      />
    </el-main>
  </el-container>
</template>

<script>
const { defineComponent } = Vue;
const { ElMessage, ElMessageBox } = ElementPlus;
const {
  openFilePicker,
  openDirectoryPicker,
  getFileHandleBuffer,
  getDirectoryHandleBuffer,
} = MoFileSystem;

export default defineComponent({
  data() {
    return {
      fileHandleBuffer: null,
      textOld: "",
      text: "",
      dialogTitle: "新建",
      dialogFormVisible: false,
      formLabelWidth: "60px",
      form: {
        dirHandleBuffer: null,
        dirName: "",
        fileName: "",
      },
    };
  },
  computed: {
    fileName() {
      if (this.fileHandleBuffer) {
        const fileHandle = this.fileHandleBuffer.getFileHandle();
        return fileHandle.name;
      }
      return "";
    },
    canSave() {
      if (this.fileHandleBuffer === null) {
        return this.text !== "";
      }
      return this.text !== this.textOld;
    },
  },
  methods: {
    // 选择文本文件
    selectFile() {
      this.checkContent().then(async () => {
        const fileHandle = await openFilePicker();
        if (fileHandle) {
          this.fileHandleBuffer = getFileHandleBuffer(fileHandle);
          this.text = await this.fileHandleBuffer.readFileHandle();
          this.textOld = this.text;
        }
      });
    },
    // 选择目录
    async selectDirectory() {
      const dirHandle = await openDirectoryPicker();
      if (dirHandle) {
        this.form.dirHandleBuffer = getDirectoryHandleBuffer(dirHandle);
        this.form.dirName = dirHandle.name;
      }
    },
    // 创建新文本文件
    async create() {
      if (!this.form.dirHandleBuffer) {
        ElMessage({ message: "目录不能为空", type: "error", grouping: true });
      } else if (this.form.fileName === "") {
        ElMessage({ message: "文件名不能为空", type: "error", grouping: true });
      } else {
        const fileHandle = await this.form.dirHandleBuffer.createFile(
          `${this.form.fileName}.txt`
        );
        this.fileHandleBuffer = getFileHandleBuffer(fileHandle);
        if (this.dialogTitle === "保存文件") {
          this.save();
        } else {
          this.text = "";
          this.textOld = this.text;
        }
        this.dialogFormVisible = false;
      }
    },
    // 重置
    reset() {
      ElMessageBox.confirm("确定要重置文本域内容?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        this.text = this.textOld;
      });
    },
    // 清空
    clear() {
      ElMessageBox.confirm("确定要清空文本域内容?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        this.text = "";
      });
    },
    // 保存文本文件
    async save() {
      let message = "保存成功！";
      let type = "success";
      if (!this.canSave) {
        message = "没有要保存的新内容！";
        type = undefined;
      } else if (this.fileHandleBuffer === null) {
        this.dialogTitle = "保存文件";
        this.dialogFormVisible = true;
        return;
      } else if (!(await this.fileHandleBuffer.verifyPermission(true))) {
        message = "没有保存权限！";
        type = "warning";
      } else if (!(await this.fileHandleBuffer.write(this.text, false))) {
        message = "保存失败！";
        type = "error";
      } else {
        this.textOld = this.text;
      }
      ElMessage({ message, type, grouping: true });
    },
    // 打开对话框
    openDialog() {
      this.checkContent().then(() => {
        this.dialogFormVisible = true;
      });
    },
    // 文本域内容检查
    checkContent() {
      return new Promise((resolved, rejected) => {
        if (this.canSave) {
          ElMessageBox.confirm("当前内容未保存，是否保存?", "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            callback: (action) => {
              if (action === "confirm") {
                this.save().then(() => rejected());
              } else {
                resolved();
              }
            },
          });
        } else {
          resolved();
        }
      });
    },
    // 重置form
    resetForm() {
      this.form.dirHandleBuffer = null;
      this.form.dirName = "";
      this.form.fileName = "";
      this.dialogTitle = "新建";
    },
  },
});
</script>

<style scoped>
.el-header,
.el-main {
  padding: 0;
}
.mo-main-header {
  margin: 0;
}
.el-divider {
  height: 2px;
  margin: 10px 0;
}
.mo-file-input {
  width: 300px;
  margin-right: 10px;
}
span {
  font-size: 16px;
}
</style>