<template>
    <div class="bg-white p15">
        <h2>到达率统计</h2>
        <div class="mt20">
        	<Form :model="search" ref="formInline" inline>
		        <FormItem label="数据类型" :label-width="60">
		            <Select v-model="search.dataType" style="width: 120px;">
				        <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
		        </FormItem>
		        <FormItem label="数据年月" :label-width="60">
		            <DatePicker type="month" v-model="search.date"></DatePicker>
		        </FormItem>
                <FormItem label="样本标签" :label-width="60">		        	
		            <!-- <Cascader :data="sampleList" trigger="hover" v-model="search.sample" change-on-select></Cascader> -->
		        </FormItem>
		        <FormItem label="截止日期" :label-width="60">
		            <Select v-model="search.endDate" style="width: 120px;">
				        <Option v-for="item in dateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
		        </FormItem>
		        <FormItem>
		            <Button type="primary" >检索</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="mt5">
        	<Table border :columns="resourceCol" :data="resourceList" class="mt10"></Table>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'duplicateCheck',
    data(){
    	return{    		
    		search:{
    			dataType:'',
    			date:'',
    			sample:'',
    			endDate:''
    		}, 
            sampleList:[],
    		dataTypeList:[{
    			value:1,
    			label:'购药数据'
    		},{
    			value:2,
    			label:'门急诊数据'
    		},{
    			value:3,
    			label:'病案数据'
    		},{
    			value:4,
    			label:'医嘱数据'
    		}],
    		dateList:[{
    			value:'1',
    			label:'5日'
    		},{
    			value:'2',
    			label:'10日'
    		},{
    			value:'3',
    			label:'15日'
    		},{
    			value:'4',
    			label:'20日'
    		}],		
    		resourceCol: [
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '发布时间',
                        key: 'time',
                        align: 'center'
                    },
                    {
                        title: '内容简介',
                        key: 'content',
                        width: 400
                    },
                    {
                        title: '阅读量',
                        key: 'readNum',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        width:150,
                        align: 'center',
                        key: 'action',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        ghost:true
                                    },
                                    style:{
                                    	color:'gray'
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        ghost:true
                                    },
                                    style:{
                                        color:'blue'
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        ghost:true
                                    },
                                    style:{
                                        color:'red'
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                resourceList: [
                    {
                        title: '上报数据参考模板',
                        content: '上报数据参考模板上报数据参考模板上报数据参考模板上报数据参考模板',
                        time:'2018-05-05',
                        readNum:'1456465'
                    }
                ]
    	}
    }
};
</script>