<template>
    <div class="error-con">
        <img src="" alt=""><br>
        哎呀，出错了！！<br>
        <router-link class="btn btn-primary mt30" to="/login">返回首页</router-link>
    </div>
</template>
<style>
.error-con{
	position: absolute;
	top:60px;
	left: 20px;
	right: 20px;
	bottom: 20px;
	background: #fff;
	padding-top: 10%;
	text-align: center;
	font-size: 18px;
	color: #727272;
}
.error-con img{
	width: 50%;
	margin-bottom: 50px;
}
</style>