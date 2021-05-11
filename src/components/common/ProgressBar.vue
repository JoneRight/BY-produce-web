<template>
    <div class="custom-progress">
        <div class="custom-out custom-horizontal" v-if="type=='horizontal'">
            <div :class="['custom-bar',{'custom-default':status=='default'},{'custom-success':status=='success'},{'custom-error':status=='error'},{'custom-warn':status=='warn'},{'custom-active':active}]" 
            :style="'width:'+currentProgress+'%'"/>
            <label :class="['custom-label',{'custom-default':status=='default'},{'custom-success':status=='success'},{'custom-error':status=='error'},{'custom-warn':status=='warn'}]">{{label}}</label>
        </div>
        <div class="custom-out custom-block" v-if="type=='block'">
            <div :class="['custom-bar',{'custom-grey':(statuses[index] && statuses[index].status=='disabled')},{'custom-default':(!statuses[index] || statuses[index].status=='default')},{'custom-success':(statuses[index] && statuses[index].status=='success')},{'custom-error':(statuses[index] && statuses[index].status=='error')},{'custom-warn':(statuses[index] && statuses[index].status=='warn')}]"
             v-for="(item,index) in maxLength" :key="index"></div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        status:{
            type:String,
            default:"default"
        },
        progress:{
            type:Number,
            default:0
        },
        active:{
            type:Boolean,
            default:false
        },
        label:{
            type:String,
            default:""
        },
        type:{
            type:String,
            default:"horizontal",
            validator: function (value) {
                return ['horizontal', 'vertical', 'block','circle'].indexOf(value) !== -1
            }
        },
        statuses:{
            type:Array,
            default:function(){
                return [];
            }
        },
        maxLength:{
            type:Number,
            default:10
        }
    },
    mounted:function(){

    },
    computed:{
        currentProgress:function(){
            if(this.progress<0){
                return 0;
            }
            if(this.progress>100){
                return 100;
            }
            return this.progress;
        }
    },
    watch:{
         
    },
    methods:{
        
    }
}
</script>
<style scoped>
.custom-progress{
    width:100%;
    height:20px;
    border-radius:10px;
    position:relative;
}
.custom-progress .custom-bar.custom-success{
    background-color:#19be6b;
}
.custom-progress .custom-bar.custom-success.custom-active{
    /* background-color:#19be6b; */
    background-color: #19be6b;
  background-image: repeating-linear-gradient(-45deg, #19be6b, #19be6b 30px, #2bdd84 30px, #2bdd84 60px);
  background-size: 600px 100%;
  animation: barberpole 12s linear infinite;
}
.custom-progress .custom-bar.custom-default{
    background-color: #2d8cf0;
}
.custom-progress .custom-bar.custom-default.custom-active{
  background-color: #2d8cf0;
  background-image: repeating-linear-gradient(-45deg, #2d8cf0, #2d8cf0 30px, #2c73c0 30px, #2c73c0 60px);
  background-size: 600px 100%;
  animation: barberpole 12s linear infinite;
}
.custom-progress .custom-bar.custom-warn{
  background-color: #f7e330;
}
.custom-progress .custom-bar.custom-warn.custom-active{
  background-color: #f7e330;
  background-image: repeating-linear-gradient(-45deg, #ddc80c, #ddc80c 30px, #f7e330 30px, #f7e330 60px);
  background-size: 600px 100%;
  animation: barberpole 12s linear infinite;
}
.custom-progress .custom-bar.custom-error{
    background-color: #ed4014;
}
.custom-progress .custom-bar.custom-error.custom-active{
  background-color: #ed4014;
  background-image: repeating-linear-gradient(-45deg, #ed4014, #ed4014 30px, #a83316 30px, #a83316 60px);
  background-size: 600px 100%;
  animation: barberpole 12s linear infinite;
}
.custom-progress .custom-bar.custom-grey{
    background-color: #dfdfdf;
}
.custom-progress .custom-horizontal .custom-bar{
    height:100%;
    width:100%;
    border-radius:10px;
    float:left;
    transition: width 300ms;
    -moz-transition: width 300ms;	/* Firefox 4*/
    -webkit-transition: width 300ms;	/* Safari 和 Chrome */
    -o-transition: width 300ms;
}
.custom-progress .custom-block .custom-bar{
    height:100%;
    width:30px;
    margin-right:2px;
    border-radius:3px;
    float:left;
}

@keyframes barberpole {
  from {
    background-position: 0% 0%;
  }

  to {
    background-position: 600px 0%;
  }
}
 	  
.custom-progress .custom-horizontal .custom-label{
    position:absolute;
    float:left;
}
.custom-progress .custom-horizontal .custom-label.custom-success{
    color:#19be6b;
}
.custom-progress .custom-horizontal .custom-label.custom-active{
    color:#2d8cf0;
}
.custom-progress .custom-horizontal .custom-label.custom-error{
    color:#ed4014;
}
.custom-progress .custom-horizontal .custom-label.custom-warn{
    color:#ddc80c;
}

.custom-progress .custom-out.custom-horizontal{
     background-color:#ededed;
     height:100%;
     border-radius:10px;
}
.custom-progress .custom-block{
    height:20px;
    position:relative;
    padding:3px 0;
}
</style>
