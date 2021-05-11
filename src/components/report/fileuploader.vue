<template>
  <uploader ref="uploader" :options="options"
                :autoStart="autoStart"
                @file-added="onFileAdded"
                @file-success="onFileSuccess"
                @file-progress="onFileProgress"
                @file-error="onFileError" :fileStatusText="statusText" class="uploader-example">
    <uploader-unsupport></uploader-unsupport>
    <uploader-btn v-show="false" id="global-uploader-btn" :attrs="attrs" :directory="false">select files</uploader-btn>
    <!-- <uploader-drop>
      <p>Drop files here to upload or</p>
    </uploader-drop> -->
    <!-- <uploader-list></uploader-list> -->
  </uploader>
</template>

<script>
import Vue from "vue";
import uploader from "vue-simple-uploader";
import SparkMD5 from "spark-md5";
import config from "../../config";
Vue.use(uploader);

export default {
  components: {},
  data() {
    return {
      maxFileSize:400,
      options: {
        target: config.uploadApiPrefix + "/uploader/chunk",
        chunkSize: "2048000",
        fileParameterName: "file",
        singleFile: this.isSingleFile,
        simultaneousUploads: 5,
        maxChunkRetries: 60,
        chunkRetryInterval: 500,
        testChunks: true, //是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function(chunk, message) {
          let res = JSON.parse(message);
          if (res.code == 0 && res.data.skipUpload) {
            return true;
          }
          return (res.data.uploaded || []).indexOf(chunk.offset + 1) >= 0;
        },
        headers: {
          token: Vue.getData("token")
        },
        query() {}
      },
      statusText: {
        success: "成功",
        error: "错误",
        uploading: "上传中",
        paused: "暂停",
        waiting: "等待"
      },
      autoStart: false,
      startUpload: false,
      attrs: {
        accept: [
          ".csv",
          ".dbf",
          ".txt",
          ".xls",
          ".xlsx",
          ".rar",
          ".mdb",
          ".accdb",
          ".zip"
        ]
      }
    };
  },
  props: {
    isSingleFile: {
      // 是否单文件
      type: Boolean,
      default: false
    },
    selectedFileCount: {
      // 已选择的文件个数
      type: Number,
      default: 0
    }
  },
  computed: {
    //Uploader实例
    uploader() {
      return this.$refs.uploader.uploader;
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.uploader = this.$refs.uploader.uploader;
    });
    this.$setInterval(this.onFileStatus, 5000);
  },
  methods: {
    choose: function() {
      document.getElementById("global-uploader-btn").click();
    },
    upload: function() {
      this.startUpload = true;
      this.onFileStatus();
    },
    delFile: function(relativePath) {
      Vue.ajax.send({
        name: "home.delFile",
        data: {
          relativePath: relativePath
        },
        success: function(data) {
          
        }
      });
    },
    onFileStatus: function() {
      if (window.navigator.onLine && this.startUpload) {
        this.uploader.files.forEach(file => {
          if (!file.isComplete() && !file.isUploading()) {
            file.resume();
          }
        });
      }
    },
    onFileAdded: function(file) {
      console.warn("onFileAdded", file);
      this.computeMD5(file);
      this.$emit("onFileAdded", file);
    },
    onFileProgress: function(rootFile, file, chunk) {
      // console.warn("onFileProgress", rootFile, file, chunk);
    },
    onFileSuccess: function(rootFile, file, response, chunk) {
      console.warn("onFileSuccess", rootFile, file, response, chunk);
      var self = this;
      let res = JSON.parse(response);
      // 服务器自定义的错误，这种错误是Uploader无法拦截的
      if (res.code != 0) {
        console.error({ message: res.message, type: "error" });
        return;
      }
      // 如果服务端返回需要合并
      if (res.data.needMerge) {
        Vue.ajax.send({
          name: "home.mergeFile",
          data: {
            identifier: res.data.identifier,
            filename: res.data.filename
          },
          success: function(data) {
            console.log("completed", file, data)
            if(data.code==0){
              self.$emit("completed", file, data.data);
            }
            
          }
        });
      } else {
        self.$emit("completed", file,{filename:file.name});
      }
    },
    onFileError: function(rootFile, file, response, chunk) {
      console.error("onFileError", rootFile, file, response, chunk);
    },
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      let fileReader = new FileReader();
      let time = new Date().getTime();
      let md5 = "";
      file.pause();
      fileReader.readAsArrayBuffer(file.file);
      fileReader.onload = e => {
        if (file.size != e.target.result.byteLength) {
          console.error(
            "Browser reported success but could not read the file until the end."
          );
          return;
        }
        md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
        // 添加额外的参数
        this.uploader.opts.query = {};
        // console.log(
        //   `MD5计算完毕：${file.id} ${
        //     file.name
        //   } MD5：${md5} 用时：${new Date().getTime() - time} ms`
        // );
        file.uniqueIdentifier = md5;
      };
      fileReader.onerror = function() {
        console.error(
          "FileReader onerror was triggered, maybe the browser aborted due to high memory usage."
        );
      };
    }
  }
};
</script>

<style>
/* 隐藏上传按钮 */
#global-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>