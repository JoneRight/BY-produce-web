<template>
    <div class="bg-white p15">
        <h2 class="common-title">新增进口药品信息</h2>
        <div class="mt20">
                <Form  ref="drugsImport" :model="drugsImport" :rules="ruleValidate" :label-width="120">
                    <FormItem label="记录号" prop="recordId">
                        <Input v-model="drugsImport.recordId" />
                    </FormItem>
                    <FormItem label="国家" prop="country">
                        <Input v-model="drugsImport.country" />
                    </FormItem>
                    <FormItem label="公司名称" prop="companyName">
                        <Input v-model="drugsImport.companyName" />
                    </FormItem>
                    <FormItem label="公司地址" prop="companyAddress">
                        <Input v-model="drugsImport.companyAddress" />
                    </FormItem>
                    <FormItem label="注册号" prop="registerNumber">
                        <Input v-model="drugsImport.registerNumber" />
                    </FormItem>
                    <FormItem label="发证日期" prop="certificationDate">
                        <Input v-model="drugsImport.certificationDate" />
                    </FormItem>
                    <FormItem label="分包装批准文号" prop="subpackApproval">
                        <Input v-model="drugsImport.subpackApproval" />
                    </FormItem>
                    <FormItem label="分包装文号批准日期" prop="subpackApprovalDate">
                        <Input v-model="drugsImport.subpackApprovalDate" />
                    </FormItem>
                    <FormItem label="分包装文号有效期截止日" prop="subpackExpirationDate">
                        <Input v-model="drugsImport.subpackExpirationDate" />
                    </FormItem>
                    <FormItem label="分包装企业编码" prop="subpackCompany">
                        <Input v-model="drugsImport.subpackCompany" />
                    </FormItem>
                    <FormItem label="分包装企业地址" prop="subpackCompanyAddress">
                        <Input v-model="drugsImport.subpackCompanyAddress" />
                    </FormItem>
                    <FormItem label="进口检验标准中文" prop="importTestChinese">
                        <Input v-model="drugsImport.importTestChinese" />
                    </FormItem>
                    <FormItem label="备注" prop="remark">
                        <Input v-model="drugsImport.remark" type="textarea" :rows="4" />
                    </FormItem>
                    <FormItem>
                        <Button @click="cancel()">取消</Button>
                        <Button type="primary" @click="saveDrugsInfo()">保存</Button>
                    </FormItem>
                </Form>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
    export default {
        name: 'drugsImport',
        data () {
            return {
                drugsImport: {
                    companyName: '',
                    recordId: '',
                    country: ''
                },
                ruleValidate: {
                    companyName: [
                        { required: true, message: '公司名称不能为空', trigger: 'blur' }
                    ],
                    recordId: [
                        { required: true, message: '记录号不能为空', trigger: 'blur' }
                    ],
                    country: [
                        { required: true, message: '国家不能为空', trigger: 'blur'  }
                    ]
                }
            }
        },
        methods: {
            saveDrugsInfo () {
                this.$refs['drugsImport'].validate((valid) => {
                    if (valid) {
                        // this.$Message.success('Success!');
                        this.$router.push("/standard/dictionary/drugsImport/list");
                    } else {
                        this.$Message.error('请完善信息!');
                    }
                })
            },
            cancel () {
                this.$router.push("/standard/dictionary/drugsImport/list");
            }
        }
    }
</script>