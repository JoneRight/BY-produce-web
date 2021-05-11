<template>
    <div style=" text-align:right;">
      <Button type="primary" size="large" @click="addRole">添加</Button>
      <Table border :columns="columns7" :data="data6"></Table>
      <Page :total="totalItemCount" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
      <Modal
          v-model="modal"
          title="编辑角色">
          <Form label-position="left" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="名称：" prop="roleName">
                <Input v-model="formValidate.roleName"></Input>
            </FormItem>
            <FormItem label="备注：" prop="roleMemo">
                <Input v-model="formValidate.roleMemo"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="default" @click="cancel">取消</Button>
            <Button type="primary" :loading="modalLoading" @click="submit">编辑</Button>
          </div>
      </Modal>
    </div>
</template>
<script>
import Vue from "vue";
export default {
  data() {
    return {
      columns7: [
        {
          title: "名称",
          key: "roleName"
        },
        {
          title: "备注",
          key: "roleMemo"
        },
        {
          title: "Action",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.modal = true;
                      this.formValidate = Object.assign({}, params.row);
                      this.modalTile = "编辑角色";
                      this.modalButton = "编辑";
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除这条数据吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.roleDelete(params.row.roleId);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      style: {
                        margin: "0 5px"
                      },
                      props: {
                        type: "error",
                        placement: "top",
                        size: "small"
                      }
                    },
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ],
      data6: [],
      totalItemCount: 0,
      pageSize: 10,
      pageIndex: 1,
      pageSizeOpts: [5, 10, 15, 20],
      modalLoading: false,
      modal: false,
      modalTile: "",
      modalButton: "",
      formValidate: {
        roleName: "",
        roleMemo: ""
      },
      ruleValidate: {
        roleName: [
          {
            required: true,
            message: "角色名称必须填写",
            trigger: "blur"
          }
        ],
        roleMemo: []
      }
    };
  },
  created() {
    this.roleList(this.pageIndex, this.pageSize);
  },
  methods: {
    addRole: function() {
      this.modal = true;
      this.formValidate = {
        roleName: "",
        roleMemo: ""
      };
      this.modalTile = "添加角色";
      this.modalButton = "添加";
    },
    submit: function() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          this.modalLoading = true;
          if (this.formValidate.roleId) {
            this.roleUpdate();
          } else {
            this.roleAdd();
          }
        }
      });
    },
    cancel: function() {
      this.modal = false;
    },
    changePage: function(index) {
      this.pageIndex = index;
      this.roleList(this.pageIndex, this.pageSize);
    },
    changePageSize: function(size) {
      this.pageSize = size;
      this.roleList(this.pageIndex, this.pageSize);
    },
    roleDelete: function(roleId) {
      Vue.ajax.send({
        name: "role.delete",
        data: {
          roleId: roleId
        },
        success: response => {
          if (response.data.success) {
            this.$Message.success("删除成功!");
            this.roleList(this.pageIndex, this.pageSize);
          }
        }
      });
    },
    roleUpdate: function() {
      Vue.ajax.send({
        name: "role.update",
        data: {
          roleId: this.formValidate.roleId,
          roleName: this.formValidate.roleName,
          roleMemo: this.formValidate.roleMemo
        },
        success: response => {
          this.modalLoading = false;
          this.modal = false;
          if (response.data.success) {
            this.$Message.success("修改成功!");
            this.roleList(this.pageIndex, this.pageSize);
          }
        }
      });
    },
    roleAdd: function() {
      Vue.ajax.send({
        name: "role.add",
        data: {
          roleName: this.formValidate.roleName,
          roleMemo: this.formValidate.roleMemo
        },
        success: response => {
          this.modalLoading = false;
          this.modal = false;
          if (response.data.success) {
            this.$Message.success("添加成功!");
            this.roleList(this.pageIndex, this.pageSize);
          }
        }
      });
    },
    roleList: function(index, size) {
      var self = this;
      Vue.ajax.send({
        name: "role.list",
        data: {
          pageIndex: index,
          pageSize: size,
          keyWord: ""
        },
        success: function(response) {
          if (response.data.success) {
            self.data6 = response.data.result.dataList;
            self.totalItemCount = response.data.result.totalItemCount;
          }
        },
        error: function(error) {
          console.error("error:", error);
        }
      });
    },
    remove(index) {
      this.data6.splice(index, 1);
    }
  }
};
</script>
