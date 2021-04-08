/**
 * 功能：手写Vuex
 * 作者：cuicui
 * 日期： 2021/4/2
 */

class Store {
    constructor(options) {
        this.vm = new Vue({
            data:{
                state:options.state
            }
        })

        let getters = options.getter || {}
        this.getters = {}
        Object.keys(getters).forEach(getterName=>{
            Object.defineProperty(this.getters,getterName,{
                get:()=>{
                    return getters[getterName](this.state)
                }
            })
        })

        let mutations = options.mutations || {}
        this.mutations = {}
        Object.keys(mutations).forEach(mutationName=>{
            this.mutations[mutationName] =  (arg)=> {
                mutations[mutationName](this.state,arg)
            }
        })
        //新增代码
        let actions = options.actions
        this.actions = {}
        Object.keys(actions).forEach(actionName=>{
            this.actions[actionName] = (arg)=>{
                actions[actionName](this,arg)
            }
        })

    }
    // 新增代码
    dispatch(method,arg){
        this.actions[method](arg)
    }
    commit(method,arg){
        console.log(this);
        this.mutations[method](arg)
    }
    get state(){
        return this.vm.state
    }
}

const install = function (Vue) {
    Vue.mixin({
        beforeCreate(){
            if(this.$options && this.$options.store){
                this.$store = this.$options.store
            }else {
                this.$store = this.$parent && this.$parent.$store
            }
        }
    })
}

export default {
    Store,
    install
}
