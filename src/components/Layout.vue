<template>
<div style="height: calc(100% - 15px);">
    <keep-alive>
            <router-view v-if="$store.getters.getHistory.some(m => m.path == ($route.meta.baseUrl || $route.path))" ref="childNode"></router-view>
    </keep-alive>
    <router-view v-if="!$store.getters.getHistory.some(m => m.path == ($route.meta.baseUrl || $route.path))"></router-view>
    <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
  </div>
</template>
<script>
import Vue from "vue";
export default {
  watch: {
    $route(to, from) {
      if (!to.meta.keepAlive) {
        var key = Vue.getData(to.path);
        if (key) {
          var cache = this.$vnode.componentInstance.$children[0].$vnode.parent
            .componentInstance.cache;
          var keys = this.$vnode.componentInstance.$children[0].$vnode.parent
            .componentInstance.keys;
          if (cache[key]) {
            if (keys.length) {
              var index = keys.indexOf(key);
              if (index > -1) {
                keys.splice(index, 1);
              }
            }
            delete cache[key];
          }
        }
      }
    }
  },

  updated() {
    if (this.$refs.childNode) {
      var vnode = this.$refs.childNode.$vnode;
      var key =
        vnode.key == null
          ? vnode.componentOptions.Ctor.cid +
            (vnode.componentOptions.tag
              ? `::${vnode.componentOptions.tag}`
              : "")
          : vnode.key;
      Vue.setData(this.$route.path, key);
    }
  }
};
</script>

