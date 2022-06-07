<template>
  <el-container>
    <el-aside>
      <div class="mo-dataset-head">
        <span>数据库:&nbsp;&nbsp;</span>
        <input type="text" v-model="dbName" placeholder="未连接" disabled />
        <span>&nbsp;</span>
        <e-icon
          class="mo-table-tools"
          icon-name="el-icon-plus"
          title="连接"
          @click="handleConnectedClick"
        />
      </div>
      <div>
        <el-tree
          ref="tree"
          :data="tableList"
          :props="defaultProps"
          show-checkbox
          @node-click="handleNodeClick"
        />
      </div>
      <div class="mo-dataset-foot">
        <span>&nbsp;</span>
        <e-icon
          class="mo-table-tools"
          icon-name="el-icon-plus"
          title="新建"
          @click="handleTableAddClick"
        />
        <span>&nbsp;</span>
        <e-icon
          class="mo-table-tools"
          icon-name="el-icon-minus"
          title="删除"
          @click="handleTableDeleteClick"
        />
      </div>
    </el-aside>
    <el-main>
      <div :hidden="tableColumns.length === 0">
        <div class="mo-table-body">
          <el-table
            ref="multipleTable"
            :data="tableData"
            border
            :header-cell-style="headerCellStyle"
            :cell-style="cellStyle"
            style="width: 100%"
            @current-change="(cur) => (currentRow = cur)"
          >
            <el-table-column type="selection" width="40" />
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column
              v-for="tableColumn in tableColumns"
              :key="tableColumn.columnid"
              :prop="tableColumn.columnid"
              :label="
                tableColumn.columnname
                  ? tableColumn.columnname
                  : tableColumn.columnid
              "
              sortable
              :width="tableColumn.width ? tableColumn.width : 150"
            >
              <template #default="scope">
                <input
                  v-if="
                    !tableColumn.edittype || tableColumn.edittype === 'text'
                  "
                  class="mo-edit-input-text"
                  type="text"
                  v-model="scope.row[tableColumn.columnid]"
                />
                <input
                  v-if="tableColumn.edittype === 'number'"
                  class="mo-edit-input-text"
                  type="number"
                  v-model="scope.row[tableColumn.columnid]"
                />
                <input
                  v-if="tableColumn.edittype === 'checkbox'"
                  type="checkbox"
                  v-model="scope.row[tableColumn.columnid]"
                />
                <select
                  v-if="tableColumn.edittype === 'select'"
                  class="mo-edit-input-select"
                  v-model="scope.row[tableColumn.columnid]"
                >
                  <option value="VARCHAR">字符串</option>
                  <option value="INT">整数</option>
                  <option value="DOUBLE">数值</option>
                </select>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mo-table-edit-foot">
          <span>&nbsp;</span>
          <e-icon
            class="mo-table-tools"
            icon-name="el-icon-plus"
            title="添加"
            @click="handleTableDataAddClick"
          />
          <span>&nbsp;</span>
          <e-icon
            class="mo-table-tools"
            icon-name="el-icon-minus"
            title="删除"
            @click="handleTableDataDeleteClick"
          />
          <span>&nbsp;</span>
          <e-icon
            class="mo-table-tools"
            icon-name="el-icon-check"
            title="保存"
            @click="handleTableDataSaveClick"
          />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
const { defineComponent } = Vue;
const { ElMessage, ElMessageBox } = ElementPlus;
const modb = MoAlasqlBuffer;

export default defineComponent({
  data() {
    return {
      db: null,
      dbName: "",
      tableList: [],
      defaultProps: {
        label: "label",
        children: "children",
      },
      tableName: "",
      tableAction: "",
      tableColumns: [],
      tableDataNextID: 0,
      tableData: [],
      oldTableData: [],
      insertTableDataCache: [],
      removeTableDataCache: [],
      updateTableDataCache: [],
      currentRow: null,
      headerCellStyle: {
        padding: "0",
        "text-align": "center",
        "padding-top": "4px",
        "padding-bottom": "4px",
        "border-right": "1px solid #000000",
        "border-bottom": "1px solid #000000",
        "background-color": "#dddddd",
      },
      cellStyle: {
        padding: "0",
        "text-align": "center",
        "border-right": "1px solid #000000",
        "border-bottom": "1px solid #000000",
        "background-color": "#ededed",
      },
    };
  },
  watch: {
    currentRow: {
      handler(newVal, oldVal) {
        if (newVal === oldVal) {
          let index;
          index = this.insertTableDataCache.findIndex(
            (item) => item["__ID"] === newVal["__ID"]
          );
          if (index > -1) {
            return;
          }
          index = this.oldTableData.findIndex(
            (item) => item["__ID"] === newVal["__ID"]
          );
          const oldRow = this.oldTableData[index];
          let isUpdate = false;
          for (const column of this.tableColumns) {
            const columnId = column.columnid;
            if (oldRow[columnId] !== newVal[columnId]) {
              isUpdate = true;
              break;
            }
          }
          index = this.updateTableDataCache.findIndex(
            (item) => item["__ID"] === newVal["__ID"]
          );
          if (isUpdate) {
            if (index === -1) {
              this.updateTableDataCache.push(newVal);
            }
          } else if (index > -1) {
            this.updateTableDataCache.splice(index, 1);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    /**
     * 连接按钮点击事件
     */
    handleConnectedClick() {
      modb.init().then(() => {
        this.db = modb.db;
        this.dbName = modb.name;
        const list = [];
        for (const tableName in this.db.tables) {
          list.push({ label: tableName });
        }
        this.tableList = list;
      });
    },
    /**
     * 数据库表添加点击事件
     */
    handleTableAddClick() {
      if (!this.db) {
        ElMessage({
          message: "未连接数据库！",
          type: "warning",
          grouping: true,
        });
        return;
      }
      this.tableColumns = [
        {
          columnname: "字段ID",
          columnid: "ID",
        },
        {
          columnname: "字段类型",
          columnid: "TYPE",
          edittype: "select",
          width: 100,
        },
        {
          columnname: "字段长度",
          columnid: "LENGTH",
          edittype: "number",
          width: 100,
        },
        {
          columnname: "允许为空",
          columnid: "IS_NULL",
          edittype: "checkbox",
          width: 100,
        },
        {
          columnname: "是否唯一",
          columnid: "IS_UNIQ",
          edittype: "checkbox",
          width: 100,
        },
        {
          columnname: "主键",
          columnid: "IS_PRIMARY",
          edittype: "checkbox",
          width: 100,
        },
        {
          columnname: "默认值",
          columnid: "DEFAULT_VALUE",
        },
      ];
      this.tableData = [];
      this.tableAction = "createTable";
    },
    /**
     * 数据库表删除点击事件
     */
    handleTableDeleteClick() {
      if (!this.db) {
        ElMessage({
          message: "未连接数据库！",
          type: "warning",
          grouping: true,
        });
        return;
      }
      const deleteTables = [];
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      for (let i = checkedNodes.length - 1; i >= 0; --i) {
        const checkedNode = checkedNodes[i];
        deleteTables.push({
          index: checkedNode.$treeNodeId - 1,
          name: checkedNode.label,
        });
      }
      if (deleteTables.length === 0) {
        ElMessage({
          message: "请勾选需要删除的表！",
          type: "warning",
          grouping: true,
        });
        return;
      }
      ElMessageBox.confirm("确定要删除所选表吗?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          deleteTables.forEach((table) => {
            this.db.exec(`DROP TABLE ${table.name}`);
            this.tableList.splice(table.index, 1);
          });
          modb.dump();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 数据库表节点点击事件
     */
    handleNodeClick(table) {
      this.tableName = table.label;
      this.tableData = this.db.exec(`SELECT * FROM ${this.tableName}`);
      this.tableDataNextID = 0;
      this.tableData.forEach((data) => (data["__ID"] = this.tableDataNextID++));
      this.oldTableData = JSON.parse(JSON.stringify(this.tableData));
      this.tableColumns = this.db.tables[this.tableName].columns;
      this.tableAction = "editTableData";
      this.insertTableDataCache = [];
      this.removeTableDataCache = [];
      this.updateTableDataCache = [];
    },
    /**
     * 表数据添加点击事件
     */
    handleTableDataAddClick() {
      let insertRow = { __ID: this.tableDataNextID++ };
      if (this.tableAction === "editTableData") {
        const defaultfns = eval(
          "({" + this.db.tables[this.tableName].defaultfns + "})"
        );
        insertRow = Object.assign(insertRow, defaultfns);
      }
      this.insertTableDataCache.push(insertRow);
      this.tableData.push(insertRow);
    },
    /**
     * 表数据删除事件
     */
    handleTableDataDeleteClick() {
      const store = this.$refs.multipleTable.store;
      const deleteRowIndexs = [];
      for (let i = this.tableData.length - 1; i >= 0; --i) {
        if (store.isSelected(this.tableData[i])) {
          deleteRowIndexs.push(i);
        }
      }
      if (deleteRowIndexs.length === 0) {
        ElMessage({
          message: "请勾选需要删除的行！",
          type: "warning",
          grouping: true,
        });
        return;
      }
      ElMessageBox.confirm("确定要删除所选行吗?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          deleteRowIndexs.forEach((i) => {
            const deleteRow = this.tableData[i];
            const index = this.insertTableDataCache.findIndex(
              (item) => item["__ID"] === deleteRow["__ID"]
            );
            if (index > -1) {
              this.insertTableDataCache.splice(index, 1);
            } else {
              this.removeTableDataCache.push(deleteRow);
            }
            this.tableData.splice(i, 1);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 表数据保存事件
     */
    handleTableDataSaveClick() {
      if (this.tableAction === "editTableData") {
        this.updateTableData();
      } else if (this.tableAction === "createTable") {
        this.addTable();
      }
    },
    /**
     * 更新表数据
     */
    updateTableData() {
      if (
        this.insertTableDataCache.length === 0 &&
        this.removeTableDataCache.length === 0 &&
        this.updateTableDataCache.length === 0
      ) {
        ElMessage({
          message: "没有需要保存的数据！",
          type: "warning",
          grouping: true,
        });
        return;
      }
      ElMessageBox.confirm("确定要保存数据吗?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          for (const row of this.insertTableDataCache) {
            let keys = "";
            let vals = "";
            for (const column of this.tableColumns) {
              const value = row[column.columnid];
              if (value !== null && value !== undefined) {
                keys += column.columnid + ",";
                if (column.dbtypeid === "VARCHAR") {
                  vals += "'" + value + "'";
                } else {
                  vals += value;
                }
                vals += ",";
              }
            }
            keys = keys.substring(0, keys.length - 1);
            vals = vals.substring(0, vals.length - 1);
            this.db.exec(
              `INSERT INTO ${this.tableName}(${keys}) VALUES(${vals})`
            );
          }
          for (const row of this.removeTableDataCache) {
            let where = "1=1";
            for (const column of this.tableColumns) {
              const value = row[column.columnid];
              if (value !== null && value !== undefined) {
                if (column.dbtypeid === "VARCHAR") {
                  where += ` AND ${column.columnid}='${value}'`;
                } else {
                  where += ` AND ${column.columnid}=${value}`;
                }
              } else {
                where += ` AND ${column.columnid} IS NULL`;
              }
            }
            this.db.exec(`DELETE FROM ${this.tableName} WHERE ${where}`);
          }
          for (const row of this.updateTableDataCache) {
            const index = this.oldTableData.findIndex(
              (item) => item["__ID"] === row["__ID"]
            );
            const oldRow = this.oldTableData[index];
            let set = "";
            let where = "1=1";
            for (const column of this.tableColumns) {
              const value = row[column.columnid];
              if (value !== null && value !== undefined) {
                if (column.dbtypeid === "VARCHAR") {
                  set += `${column.columnid}='${value}'`;
                } else {
                  set += `${column.columnid}=${value}`;
                }
                set += ",";
              }
              const oldValue = oldRow[column.columnid];
              if (oldValue !== null && oldValue !== undefined) {
                if (column.dbtypeid === "VARCHAR") {
                  where += ` AND ${column.columnid}='${oldValue}'`;
                } else {
                  where += ` AND ${column.columnid}=${oldValue}`;
                }
              } else {
                where += ` AND ${column.columnid} IS NULL`;
              }
            }
            set = set.substring(0, set.length - 1);
            this.db.exec(`UPDATE ${this.tableName} SET ${set} WHERE ${where}`);
          }
          await modb.dump();
          this.insertTableDataCache = [];
          this.removeTableDataCache = [];
          this.updateTableDataCache = [];
          this.oldTableData = JSON.parse(JSON.stringify(this.tableData));
          ElMessageBox.alert("保存成功", "系统提示", {
            confirmButtonText: "确定",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 添加表
     */
    addTable() {
      if (this.tableData.length === 0) {
        ElMessage({
          message: "表字段为空！",
          type: "warning",
          grouping: true,
        });
        return;
      }
      const columnNameArray = [];
      let msg = "";
      let hasError = false;
      for (let i = 0; i < this.tableData.length; ++i) {
        const column = this.tableData[i];
        if (!column["ID"] || column["ID"].trim() === "") {
          msg = `第【${i + 1}】行：字段ID不能为空！`;
          hasError = true;
          break;
        }
        if (columnNameArray.includes(column["ID"])) {
          msg = `第【${i + 1}】行：字段ID与前面存在重复！`;
          hasError = true;
          break;
        }
        if (
          !/(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/.test(
            column["ID"]
          )
        ) {
          msg = `第【${i + 1}】行：字段ID命名有误！`;
          hasError = true;
          break;
        }
        if (!column["TYPE"] || column["TYPE"].trim() === "") {
          msg = `第【${i + 1}】行：字段类型不能为空！`;
          hasError = true;
          break;
        }
        columnNameArray.push(column["ID"]);
      }
      if (hasError) {
        ElMessage({
          message: msg,
          type: "warning",
          grouping: true,
        });
        return;
      }
      ElMessageBox.prompt("请输入表名", "表名", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/,
        inputErrorMessage: "表名有误",
      })
        .then(({ value }) => {
          if (this.tableList.includes(value)) {
            ElMessage({
              message: "当前表名已存在！",
              type: "error",
              grouping: true,
            });
            return;
          }
          let createTableSQL = `CREATE TABLE ${value}(`;
          // 主键
          const pk = { columns: [] };
          // 唯一性约束
          const uks = [];
          this.tableData.forEach((column) => {
            // 字段ID
            createTableSQL += column["ID"];
            // 字段类型
            createTableSQL += " " + column["TYPE"];
            if (column["LENGTH"] && column["LENGTH"] > 0) {
              createTableSQL += "(" + column["LENGTH"] + ")";
            }
            // 是否不为空
            if (!column["IS_NULL"]) {
              createTableSQL += " NOT NULL";
            }
            // 是否唯一
            if (column["IS_UNIQ"]) {
              uks.push({ columns: [column["ID"]] });
            }
            // 主键
            if (column["IS_PRIMARY"]) {
              pk.columns.push(column["ID"]);
            }
            // 默认值
            const defaultValue = column["DEFAULT_VALUE"];
            if (defaultValue) {
              if (column["TYPE"] === "INT" || column["TYPE"] === "DOUBLE") {
                createTableSQL += " DEFAULT " + defaultValue;
              } else {
                createTableSQL += " DEFAULT '" + defaultValue + "'";
              }
            }
            createTableSQL += ",";
          });
          if (pk.columns.length > 0) {
            createTableSQL += `CONSTRAINT pk_${pk.columns.join(
              "_"
            )} PRIMARY KEY(${pk.columns.join(",")}),`;
          }
          for (const uk of uks.values()) {
            createTableSQL += `CONSTRAINT uk_${uk.columns.join(
              "_"
            )} UNIQUE(${uk.columns.join(",")}),`;
          }
          createTableSQL =
            createTableSQL.substring(0, createTableSQL.length - 1) + ")";
          this.db.exec(createTableSQL);
          modb.dump();
          this.tableList.push({ label: value });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
</script>

<style>
.el-checkbox {
  height: 27px;
}
.el-table__cell .cell {
  padding: 0;
}
.el-table::before {
  height: 0;
}
</style>
<style scoped>
.el-aside {
  width: 250px;
  border: 1px solid #000000;
  border-radius: 5px;
}
.el-main {
  padding: 0;
  margin-left: 5px;
  border: 1px solid #000000;
  border-radius: 5px;
  background-color: #efefef;
}
.el-tree {
  height: calc(100vh - 196px);
  background-color: #efefef;
}
.mo-dataset-head {
  padding: 5px;
  font-size: 13px;
  color: #606266;
  background-color: #dddddd;
}
.mo-dataset-head > input {
  width: 161px;
  height: 16px;
  font-size: 12px;
}
.mo-dataset-foot {
  background-color: #dddddd;
  user-select: none;
}
.mo-table-body {
  height: calc(100vh - 165px);
}
.mo-table-tools {
  border: 1px solid #000000;
  border-radius: 50%;
  cursor: pointer;
}
.mo-table-edit-foot {
  margin-bottom: 0;
  background-color: #dddddd;
  user-select: none;
}
.el-table {
  border-top: 0;
  border-left: 0;
  border-right: 0;
  background-color: #ededed;
}
.mo-edit-input-text,
.mo-edit-input-select {
  padding: 5px;
  border: 0;
  background-color: #ededed;
}
.mo-edit-input-text {
  width: calc(100% - 10px);
}
.mo-edit-input-select {
  width: 100%;
  text-align: center;
}
</style>