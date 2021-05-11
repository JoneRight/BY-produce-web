<template>
<div class="main" :class="{'main-hide-text': shrink}">        
      <div class="navicon-con" :style="{left: shrink?'50px':'190px',lineHeight:'46px'}">
        <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
          <Icon type="md-menu" size="32" style="color:white"></Icon>
        </Button>
      </div>
        <leftnav :shrink="shrink"></leftnav>
        <topheader :shrink="shrink"></topheader>
        <div class="single-page-con" :style="{marginLeft: shrink?'60px':'200px'}">
          <router-view></router-view>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
import LeftMenu from "@/components/LeftMenu";
import Header from "@/components/Header";
export default {
  components: {
    topheader: Header,
    leftnav: LeftMenu
  },
        data () {
            return {
                shrink: false
            }
        },
        computed: {
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        methods: {
            toggleClick () {
                this.shrink = !this.shrink;
            }
        }
    }
/*import Vue from "vue";
import LeftMenu from "@/components/LeftMenu";
import Header from "@/components/Header";
export default {
  components: {
    topheader: Header,
    leftnav: LeftMenu
  },
  data() {
    return {
      loaded: false,
      defaultImgUrl: ''
    };
  },
  computed: {
    isFull: function() {
      return this.$route.path == "/cluster/terminal";
    }
  },
  mounted() {
    this.loaded = false;
  },
  methods: {}
};*/
</script>