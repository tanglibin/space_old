import Vue from 'vue'
import axios from 'axios';

const Common = {
    /**
     * Confirm 确认框
     * @Param msg {String} 消息内容
     * @Param callback {Function} 选择'确定'按钮回调
     */
    confirm: (msg, callback) => {
        Vue.prototype.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(callback).catch(() => {});
    },
    /**
     * 消息提示
     * @Param msg {String} 消息内容
     */
    message: (msg) => Vue.prototype.$message(msg),

    /**
     * 服务端请求
     * @param op {Object} 请求配置参数
     */
    sendRequest:(op) => {
        let loading;
        let axiosParam = {
            url: op.url,
            method: op.type || 'get',
            headers: {'X-Requested-With':'XMLHttpRequest'},
            //响应之前
            transformResponse: [function (data) {
                // 对 data 进行任意转换处理
                loading.close();
                return data;
            }]
        }

        //请求参数添加
        if(op.data){
            if(axiosParam.method == 'get'){
                axiosParam.params = JSON.stringify(op.data);
            }else{
                var params = new URLSearchParams();
                for (let key in op.data) {
                    params.append(key, op.data[key]);
                }
                axiosParam.data = params;
            }
        }

        new Promise(function(resolve, reject){
            //显示loading
            loading = Vue.prototype.$loading.service({background:"rgba(0,0,0,0.6)"});
            //请求发送
            axios(axiosParam).then(result =>{
                result = JSON.parse(result.data);
                result.status ? resolve(result) : reject(result.msg);
            }).catch(reject);

        }).then(({data, msg})=>{
            msg && Common.message(msg);
            op.success(data);
        }).catch((msg='网络异常，请稍后再试~！') =>{
            Common.message(msg);
        });
    }
};

export default Common;