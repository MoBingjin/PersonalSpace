if (window['alasql'] === undefined) {
    window.location.reload();
}
var MoAlasqlBuffer = (function (exports) {
    'use strict';

    exports.name = "modb";
    exports.handle = null;
    exports.json = null;
    exports.db = null;

    /**
     * 初始化数据库
     * 
     * @param {String} dataBaseName 数据库名
     */
    function init(dataBaseName) {
        return new Promise(async (resolved, rejected) => {
            exports.name = dataBaseName || "modb";
            const dirHandle = await showDirectoryPicker();
            if (dirHandle) {
                exports.handle = await dirHandle.getFileHandle(`${exports.name}.json`, { create: true });
                if (!exports.handle) {
                    alert("数据库设置失败，请重新选择并给定必要的读写权限！");
                    rejected();
                } else {
                    const file = await exports.handle.getFile();
                    const reader = new FileReader();
                    reader.onload = () => {
                        const modbJsonStr = reader.result === "" ? `{init:'CREATE DATABASE ${exports.name}',tables:{}}` : reader.result;
                        exports.json = eval('(' + modbJsonStr + ')');
                        if (window.alasql.databases[exports.name]) {
                            window.alasql(`DROP DATABASE ${exports.name}`);
                        }
                        // 创建数据库
                        window.alasql(exports.json.init);
                        window.alasql(`USE ${exports.name}`);
                        exports.db = window.alasql.databases[exports.name];
                        // 导入表
                        const tables = exports.json.tables;
                        for (const tableName in tables) {
                            // 创建表
                            window.alasql(tables[tableName].init);
                            // 导入数据
                            const columns = exports.db.tables[tableName].columns;
                            for (const row of tables[tableName].data) {
                                let keys = "";
                                let vals = "";
                                for (const column of columns) {
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
                                window.alasql(`INSERT INTO ${tableName}(${keys}) VALUES(${vals})`);
                            }
                        }
                        resolved();
                    };
                    reader.readAsText(file);
                }
            } else {
                alert("数据库设置失败，请重新选择并给定必要的读写权限！");
                rejected();
            }
        });
    }

    /**
     * 导出数据库
     */
    async function dumpDataBase() {
        const tables = {};
        const alaTables = window.alasql.databases[exports.name].tables
        for (const tableName in alaTables) {
            const table = {
                init: "",
                data: [],
            };
            // 导出数据
            table.init = dumpTableStructure(alaTables[tableName], tableName);
            window.alasql(`SELECT * INTO ? FROM ${tableName}`, [table.data]);
            tables[tableName] = table;
        }
        exports.json.tables = tables;
        const writable = await exports.handle.createWritable();
        writable.write(JSON.stringify(exports.json));
        writable.close();
    }

    /**
     * 导出表结构
     * 
     * @param {Object} table 表
     * @param {String} tableName 表名
     * @returns {String} 表创建sql
     */
    function dumpTableStructure(table, tableName) {
        let structure = `CREATE TABLE ${tableName}(`;
        // 字段
        const columns = table.columns;
        const defaultfns = eval('({' + table.defaultfns + '})');
        for (const column of columns.values()) {
            // 字段ID
            structure += column.columnid;
            // 字段类型
            structure += " " + column.dbtypeid;
            if (column.dbsize) {
                structure += "(" + column.dbsize + ")";
            }
            // 是否不为空
            if (column.notnull) {
                structure += " NOT NULL";
            }
            // 默认值
            const defaultValue = defaultfns[column.columnid];
            if (defaultValue) {
                if (typeof (defaultValue) === "number") {
                    structure += " DEFAULT " + defaultfns[column.columnid];
                } else {
                    structure += " DEFAULT '" + defaultfns[column.columnid] + "'";
                }
            }
            structure += ",";
        }
        // 主键
        const pk = table.pk;
        if (pk) {
            structure += `CONSTRAINT pk_${pk.columns.join('_')} PRIMARY KEY(${pk.columns.join(',')}),`;
        }
        // 唯一性约束
        const uks = table.uk;
        if (uks) {
            for (const uk of uks.values()) {
                structure += `CONSTRAINT uk_${uk.columns.join('_')} UNIQUE(${uk.columns.join(',')}),`;
            }
        }
        structure = structure.substring(0, structure.length - 1) + ")";
        return structure;
    }

    Object.defineProperty(exports, "init", { value: init });
    Object.defineProperty(exports, "dump", { value: dumpDataBase });

    Object.defineProperty(exports, "__esModule", { value: true });

    return exports;
})({});