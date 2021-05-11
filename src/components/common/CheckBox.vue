<template>
  <label :for="id" :class="['container',size,color]">
    
    <input type="checkbox" :id="id"  :value="value" v-on:change="changeEvent($event)" :checked="userChecked || value===modelValue || parentSelected"/>
    <span class="checkbox"></span>
    <slot><span class="label ellipsis">{{label}}</span></slot>
  </label>
</template>
<script>
import Vue from "vue";

export default {
  name: "checkbox",
  model: {
    prop: "modelValue",
    event: "change"
  },
  props: {
    label: {
      type: [String, Number],
      default: ""
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "medium"
    },
    color: {
      type: String,
      default: "blue"
    },
    value: {
      type: [String, Number, Boolean, Array],
      default: null
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: false
    }
  },
  data() {
    return {
      id: "",
      parent: undefined,
      parentSelected: false,
      isCheckBoxChildren: true,
      userChecked: false
    };
  },
  mounted() {
    this.id =
      Vue.getRandomString(6) + Vue.getRandomString(6) + Vue.getRandomString(6);
    this.userChecked = this.checked;
    this.parent = this.$parent.groupChangeEvent;
    // if(this.parent){
    //     this.parent(this.value,true,true)
    //     // console.log(this.value==this.checked,this.$parent.current)
    //     if(this.$parent.current.length>0 && this.$parent.current.indexOf(this.value)>-1){
    //         this.parentSelected=true;
    //     }
    //     else{
    //         this.parentSelected=false;
    //     }
    // }
  },
  watch: {
    checked: function() {
      this.userChecked = this.checked;
    }
  },
  methods: {
    parentChangeThis: function(parentData) {
      this.userChecked = false;
      if (parentData.indexOf(this.value) > -1) {
        this.parentSelected = true;
      } else {
        this.parentSelected = false;
      }
    },
    changeEvent: function(event) {
      // console.log("event",event.target.checked)
      if (event.target.checked) {
        this.userChecked = true;
        this.$emit("change", event.target.value);
        if (this.parent) {
          if(Object.prototype.toString.call(this.value) === '[object Number]'){
            this.parent(parseInt(event.target.value), true);
          }
          else{
            this.parent(event.target.value, true);
          }
        }
      } else {
        this.userChecked = false;
        this.$emit("change", this.falseValue);
        if (this.parent) {
          if(Object.prototype.toString.call(this.value) === '[object Number]'){
            this.parent(parseInt(event.target.value), false);
          }
          else{
            this.parent(event.target.value, false);
          }
          
        }
      }
      if (this._events.onChange) {
        this.$emit("onChange");
      }
      // console.log("changed",event.target.checked?event.target.value:this.falseValue)
    }
  }
};
</script>
<style scoped>
.container {
  width: 100%;
  display: block;
  z-index: 0;
  user-select: none;
}
.container label {
  display: block;
  position: relative;
  width: 100%;
}
.container input {
  display: none;
}
.container span.label {
  display: inline-block;
  z-index: 1;
}
.container span.checkbox {
  z-index: 1;
  border: 1px solid #c6c7c7;
  display: inline-block;
  position: relative;
  transition: 0.3s;
  -webkit-transition: 0.3s;
}
.container span.checkbox:after {
  position: absolute;
}
.container input:checked ~ span.checkbox:after {
  content: "\2713";
}

.container.blue-outline input:checked ~ span.checkbox {
  border-color: #0ca3db;
}
.container.blue-outline input:checked ~ span.checkbox:after {
  content: "\2713";
  color:#0ca3db;
}
.container.blue input:checked ~ span.checkbox {
  border-color: #0ca3db;
  background-color:#0ca3db;
}
.container.blue input:checked ~ span.checkbox:after {
  content: "\2713";
  color:white;
}
.container.red-outline input:checked ~ span.checkbox {
  border-color: #ec3f48;
}
.container.red-outline input:checked ~ span.checkbox:after {
  content: "\2713";
  color:#ec3f48;
}
.container.red input:checked ~ span.checkbox {
  border-color: #ec3f48;
  background-color:#ec3f48;
}
.container.red input:checked ~ span.checkbox:after {
  content: "\2713";
  color:white;
}
.container.orange-outline input:checked ~ span.checkbox {
  border-color: #ff9900;
}
.container.orange-outline input:checked ~ span.checkbox:after {
  content: "\2713";
  color:#ff9900;
}
.container.orange input:checked ~ span.checkbox {
  border-color: #ff9900;
  background-color:#ff9900;
}
.container.orange input:checked ~ span.checkbox:after {
  content: "\2713";
  color:white;
}
.container.green-outline input:checked ~ span.checkbox {
  border-color: #19be6b;
}
.container.green-outline input:checked ~ span.checkbox:after {
  content: "\2713";
  color:#19be6b;
}
.container.green input:checked ~ span.checkbox {
  border-color: #19be6b;
  background-color:#19be6b;
}
.container.green input:checked ~ span.checkbox:after {
  content: "\2713";
  color:white;
}
.container.medium {
  height: 22px;
}
.container.medium label {
  height: 28px;
}
.container.medium span.label {
  width: calc(100% - 24px);
  height: 25px;
  font-size:18px;
}
.container.medium span.checkbox {
  border-radius: 3px;
  width: 20px;
  height: 20px;
}
.container.medium span.checkbox:after {
  width: 0;
  height: 2px;
  top: 15px;
  left: 6px;
  margin-top: -2px;
}
.container.medium input:checked ~ span.checkbox:after {
  top:-3px;
  left:2px;
  font-size:19px;
}

.container.small {
  height: 16px;
}
.container.small label {
  height: 17px;
}
.container.small span.label {
  width: calc(100% - 17px);
  height: 17px;
  font-size:12px;
  text-align:left;
}
.container.small span.checkbox {
  border-radius: 2px;
  width: 13px;
  height: 13px;
  top:-2px;
}
.container.small span.checkbox:after {
  width: 0;
  height: 1px;
  top: 9px;
  left: 5px;
  margin-top: -2px;
}
.container.small input:checked ~ span.checkbox:after {
  top:-2px;
  left:1px;
  font-size:12px;
}

.container.large {
  height: 40px;
}
.container.large label {
  height: 44px;
}
.container.large span.label {
  width: calc(100% - 43px);
  height: 35px;
  font-size:30px;
  line-height:35px;
}
.container.large span.checkbox {
  border-radius: 3px;
  width: 30px;
  height: 30px;
}
.container.large span.checkbox:after {
  width: 0;
  height: 3px;
  top: 21px;
  left: 10px;
  margin-top: -2px;
}
.container.large input:checked ~ span.checkbox:after {
  top:-9px;
  left:2px;
  font-size:33px;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
</style>
