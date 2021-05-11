export default {
	200: function () {
		// console.log("Status code 200: Success.");
	},
	202: function () {
		// console.log("Status code 202: Success for creation.");
	},
	400: function () {
		console.log("Error code 400: Bad Request.");
	},
	401: function () {
		console.log("Error code 401: 未认证.");
	},
	402: function () {
		// console.log("Error code 402: Payment Required.");
	},
	403: function () {
		console.log("Error code 403: 请求被禁止.");
	},
	404: function () {
		console.log("Error code 404: 链接不存在.");
	},
	500: function () {
		console.log("Error code 500: 服务器错误.");
	},
	501: function () {
		console.log("Error code 501: 暂未实现.");
	},
	502: function () {
		console.log("Error code 502: 服务临时被重载.");
	},
	503: function () {
		console.log("Error code 503: 网关超时.");
	}
};