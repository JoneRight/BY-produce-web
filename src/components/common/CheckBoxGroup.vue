<template>
<div>
    <slot></slot>
</div>
</template>
<script>
import Vue from "vue";

export default {
  name: "checkboxgroup",
  model: {
    prop: "selected",
    event: "change"
  },
  props: {
    selected: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      current: []
    };
  },
  mounted() {
    this.current = [].concat(this.selected);
    this.changeChild();
  },
  computed: {
    //   current:function(){
    //       console.log(this.selected)
    //       return [].concat(this.selected);
    //   }
  },
  watch: {
    selected: {
      handler: function() {
        this.current = [].concat(this.selected);
        this.changeChild();
      },
      deep: true
    }
  },
  methods: {
    changeChild: function() {
      var self = this;
      this.current = [].concat(this.selected);
      if (this.$children != undefined) {
        this.$children.forEach(child => {
          if (child.isCheckBoxChildren) {
            child.parentChangeThis(self.current);
          }
        });
      }
    },
    groupChangeEvent: function(data, add, init) {
      if (add) {
        if(data===""){
          this.current.push(null);
        }
        else{
          this.current.push(data);
        }
        
        if (!init) {
          this.$emit("change", this.current);
        }
      } else {
        
        var index = this.current.indexOf(data===""?null:data);
        if (index > -1) {
          this.current.splice(index, 1);
        }
        if (!init) {
          this.$emit("change", this.current);
        }
      }

      // console.log("changed",event.target.checked?event.target.value:this.falseValue)
    }
  }
};
</script>
<style scoped>
input[type="checkbox"] + label::before {
  content: "\a0"; /*不换行空格*/
  display: inline-block;
  vertical-align: 0.2em;
  width: 10px;
  height: 10px;
  margin-right: 0.2em;
  border-radius: 0.2em;
  background-color: silver;
  text-indent: 0.15em;
  line-height: 0.65; /*行高不加单位，子元素将继承数字乘以自身字体尺寸而非父元素行高*/
}
input[type="checkbox"]:checked + label::before {
  content: "\2713";
  background-color: yellowgreen;
}
input[type="checkbox"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
input[type="checkbox"]:focus + label::before {
  /* box-shadow: 0 0 .1em .1em #58a; */
}
input[type="checkbox"]:disabled + label::before {
  background-color: gray;
  box-shadow: none;
  color: #555;
}
</style>
