<template>
	<div>
		<div class="right-top">
			<dl class="right-title  clearfix">
				<dt>学员管理<br /><span>系统中学员用户的添加、密码重置等</span></dt>
				<dd>
					<a class="btn btn-default" v-authorize="'STUDENTADD'" href="javascript:;" v-on:click="addStudent">+ 新增学员</a>
					<a class="btn btn-pass"  href="javascript:;" v-on:click="importStudent">导入学员</a>
					<a class="btn btn-default" href="">下载模版</a>
				</dd>
			</dl>
		</div>
		<div class="right-type">
			<div class="right-opration">
				班级：
				<select v-model="classId" class="form-control">
					<option value="0">请选择班级</option>
					<option v-for="option in clazzList" :key="option.classId" :value="option.classId">{{ option.className }}</option>
				</select>
				<input class="form-control" v-model="realName" placeholder="请输入要查询的学员姓名或学号" maxlength="20" />
				<a class="btn btn-default" href="javascript:;" v-on:click="loadStudentList(1)">查询</a>
			</div>
			<table class="common-table">
				<thead>
					<tr>
						<th></th>
						<th>学员学号</th>
						<th>学员姓名</th>
						<th>资源分配</th>
						<th>所属班级</th>
						<th>角色</th>
						<th>状态</th>
						<th width="370">操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in studentList" :key="item.studentId" v-if="studentList.length>0">
						<td>
							<div class="checkbox-con"><input type="checkbox" @change="changeItem(item)" v-model="item.isSelected" /><label></label></div>
						</td>
						<td>{{ item.studentNo }}</td>
						<td>{{ item.realName }}</td>
						<td>{{ getResourceStr(item) }}</td>
						<td>{{ item.className }}</td>
						<td>{{ item.roleNames }}</td>
						<td>{{ item.isGraduate ? '已结业':'未结业' }}</td>
						<td style="width:335px;">
							<a  v-authorize="'STUDENTEDIT'" class="btn btn-pass btn-sm" href="javascript:;" v-on:click="editStudent(item)">编辑</a>
							<a v-authorize="'STUDENTDELETE'" class="btn btn-del btn-sm" href="javascript:;" v-if="!item.isGraduate" @click="graduateStudent(item)">结业</a>
							<a v-authorize="'STUDENTDELETE'" class="btn btn-gray btn-sm" href="javascript:;" v-if="item.isGraduate ">结业</a>
							<a v-authorize="'STUDENTPASSWORD'" class="btn btn-default btn-sm" href="javascript:;" v-on:click="resetPass(item.userId,item.realName)">密码重置</a>
							<a v-authorize="'STUDENTROLE'" class="btn btn-default btn-sm" href="javascript:;" v-on:click="assignRoles(item)">角色分配</a>
							<a v-authorize="'STUDENTDELETE'" class="btn btn-del btn-sm" href="javascript:;" v-on:click="deleteStudent(item)">删除</a>
						</td>
					</tr>
					<tr v-if="studentList.length==0">
						<td colspan="8">暂无数据</td>
					</tr>
				</tbody>
			</table>
			<div class="form-group">
				<div class="checkbox-con">
					<input type="checkbox" v-model="isSelectAll" @change="changeAll" /><label></label>
				</div>全选
				<a v-authorize="'STUDENTALLDELETE'" :class="['btn', 'btn-sm', selectedCount?'btn-del':'btn-gray']" href="javascript:;" v-on:click="deleteStudent(null)">批量删除</a>
				<a v-authorize="'STUDENTALLDELETE'" :class="['btn', 'btn-sm', selectedCount?'btn-del':'btn-gray']" href="javascript:;" v-on:click="graduateStudent(null)">批量结业</a>
				<a v-authorize="'STUDENTALLROLE'" :class="['btn', 'btn-sm', selectedCount?'btn-default':'btn-gray']" href="javascript:;" v-on:click="assignRoles(null)">角色分配</a>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from "vue";
	export default {
		data() {
			return {
				realName: '',
				classId: 0,
				clazzList: [],
				studentList: [],
				pageConfig: {
					pageNum: 1,
					pageSize: 10,
					totalPageCount: 1
				},
				isSelectAll: false,
				selectedIdDic: {},
				templatePath:"template/Students-Template.xls",
				templateName:"学员导入模版"
			}
		},
		computed: {
			selectedCount() {
				return this.studentList.filterProperty("isSelected", true).length;
			}
		},
		mounted: function() {
			this.loadStudentList();
			this.loadClazzList();
		},
		methods: {
			/* 加载学生列表 */
			loadStudentList: function(clicked) {
				var self = this;
				self.isSelectAll = false;
				if (clicked) {
					//点击按钮搜索时，页码重置为1
					self.pageConfig.pageNum = 1;
				}
				Vue.ajax.send({
					name: 'student.list',
					data: {
						realName: self.realName,
						classId: self.classId,
						pageNum: self.pageConfig.pageNum,
						pageSize: self.pageConfig.pageSize
					},
					success: function(data) {
						console.error(data);
						self.studentList = [];
						if (!!data && data.isSuccess) {
							self.studentList = data.result.dataList;
							self.pageConfig.totalPageCount = data.result.totalPageCount;
							console.error(self.studentList);
						}
					}
				});
				this.isSelectAll = false;
				this.changeAll();
			},
			/* 加载班级列表 */
			loadClazzList: function() {
				var self = this;
				Vue.ajax.send({
					name: 'student.clazzlist',
					data: {
						method: "",
						pageNum: -1,
						pageSie: 1
					},
					success: function(data) {
						if (data != undefined && data != "" && data.code == 200 &&
							data.result && data.result.dataList) {
							self.clazzList = data.result.dataList;
						}
					}
				});
			},
			/* 删除学生 */
			deleteStudent: function(student) {
				if (!this.selectedCount && !student) return;
				var self = this;
				var userList = student ? [student] : this.studentList.filterProperty("isSelected");
				var userIdList = userList.mapProperty("userId");
				var name = userList.mapProperty("realName").join(",");
				Vue.showConfirmPopup("删除学生", '确定要删除学员“' + name + '”以及相关信息吗？', function() {
					Vue.ajax.send({
						name: 'student.delete',
						data: userIdList,
						success: function(data) {
							if (!!data && data.isSuccess) {
								Vue.showAlertPopup("删除成功");
								self.loadStudentList(1);
							} else {
								Vue.showErrorPopup("删除失败");
							}
						}
					});
				})
			},
			/* 学生结业 */
			graduateStudent: function(student) {
				if (!this.selectedCount && !student) return;
				var self = this;
				var userList = student ? [student] : this.studentList.filterProperty("isSelected");
				userList = userList.filter(function(user){
					return !user.isGraduate;
				});
				if(userList.length==0){
					Vue.showAlertPopup("暂无可结业的学员");
					return;
				}
				var userIdList = userList.mapProperty("userId");
				var name = userList.mapProperty("realName").join(",");
				Vue.showConfirmPopup("结业学生", '确定学员“' + name + '”是否能够结业？', function() {
					Vue.ajax.send({
						name: 'student.graduate',
						data: userIdList,
						success: function(data) {
							if (!!data && data.isSuccess) {
								Vue.showAlertPopup("结业成功");
								self.loadStudentList(1);
							} else {
								Vue.showErrorPopup("结业失败");
							}
						}
					});
				})
			},
			/* 密码重置 */
			resetPass: function(userId, name) {
				Vue.showConfirmPopup("重置密码", '确定要重置“' + name + '”的密码吗？', function() {
					Vue.ajax.send({
						name: 'student.resetpass',
						data: {
							userId: userId
						},
						success: function(data) {
							if (data != undefined && data != "" &&
								data.code == 200) {
								Vue.showAlertPopup("重置成功！重置后的密码为：" +
									data.result);
							} else {
								Vue.showErrorPopup("重置失败");
							}
						}
					});
				})
			},
			/**
			 * 弹出学员编辑
			 */
			editStudent(student) {
				var self = this;
				Vue.showModalPopup({
					header: "编辑学员",
					modal_type: "studentEdit",
					student,
					showFooter: false,
					onPrimary: function() {
						self.loadStudentList();
						this.hide();
					}
				});
			},
			/**
			 * 弹出学员编辑
			 */
			addStudent(userId) {
				var self = this;
				Vue.showModalPopup({
					header: "新增学员",
					modal_type: "studentAdd",
					showFooter: false,
					onPrimary: function() {
						self.loadStudentList();
						this.hide();
					}
				});
			},
			/**
			 * 弹出批量导入上传学员列表信息页面
			 */
			importStudent(userId) {
				var self = this;
				Vue.showModalPopup({
					header: "导入学员",
					modal_type: "studentImport",
					showFooter: false,
					onPrimary: function() {
						self.loadStudentList();
						this.hide();
					}
				});
			},
			/**
			 * 全选/反选
			 */
			changeAll() {
				var isSelectAll = this.isSelectAll;
				var self = this;
				this.studentList.forEach(item => {
					self.$set(item, "isSelected", isSelectAll);
				})
			},
			/**
			 * 分配角色（单人或多人）
			 */
			assignRoles(student) {
				if (this.selectedCount == 0 && !student) return;
				var self = this;
				var userList = [student];
				var selectedRoleIds = [];
				if (!student) {
					userList = this.studentList.filterProperty("isSelected");
				} else {
					selectedRoleIds = (student.roleIds || "").split(",").map(i => +i);
				}
				var userIdList = userList.mapProperty("userId");
				var userNameList = userList.map(user => {
					var studentNo = "";
					if (user.studentNo) {
						studentNo = "(" + user.studentNo + ")";
					}
					return user.realName + studentNo;
				});
	
				Vue.showModalPopup({
					header: "学员角色分配",
					modal_type: "roleAssign",
					userIdList,
					userNameList,
					selectedRoleIds,
					showFooter: false,
					onPrimary: function() {
						self.loadStudentList();
						this.hide();
					}
				});
			},
			/**
			 * 改变单项选中状态
			 */
			changeItem(item) {
				if (this.selectedCount == this.studentList.length) {
					this.isSelectAll = true;
				} else {
					this.isSelectAll = false;
				}
			},
			/**
			 * 展示资源占用
			 */
			getResourceStr(item) {
				if (!item.cpuTotal) return "未分配";
				return "CPU：{0}核；内存：{1}G；磁盘：{2}G".format(item.cpuTotal, Math.floor(item.memoryTotal / 1024), item.diskTotal);
			}
		}
	};
</script>

<style scoped>
	
</style>