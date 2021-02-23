function Vue(options) {
    this._init(options);
}

/**
 * 初始化
 * @param options
 * @private
 */
Vue.prototype._init = function (options) {
    this.$options = options;
    this.$el = document.querySelector(options.el);
    this.$data = options.data;
    this.$methods = options.methods;
    this._bindings = {};
    this._observe(this.$data)
    this._complie(this.$el)
}

/**
 * 通过使用Object.defineObject()方法，重写属性的get和set方法，以及观察者模式(订阅发布模式)，在set方法中发布消息，更新dom节点中的数据，实现数据的双向绑定
 * @param obj
 * @private
 */
Vue.prototype._observe = function (obj) {
    for (let key in obj) {
        let value;
        if (obj.hasOwnProperty(key)) {
            value = obj[key];
            if (typeof value === 'object') {
                this._observe(value)
            }
            this._bindings[key] = {
                _directives: []
            }
            let binding = this._bindings[key];
            Object.defineProperty(obj, key , {
                configurable: true,
                enumerable: true,
                get: function () {
                    return value;
                },
                set: function (newValue) {
                    if (value !== newValue) {
                        value = newValue;
                        binding._directives.forEach(item=>{
                            item.update();
                        })
                    }
                }
            })
        }
    }
}

/**
 * 解析dom节点中使用的指令，比如v-bind,v-model,v-click
 * @private
 */
Vue.prototype._complie = function (root) {
    let _this = this;
    let nodes = root.children;
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.children.length) {
            _this._complie(node)
        }

        if (node.hasAttribute('v-click')) {
            let attrValue = node.getAttribute('v-click');
            node.onclick = _this.$methods[attrValue].bind(_this.$data)
        }

        if (node.hasAttribute('v-model') && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
            let attrValue = node.getAttribute('v-model');
            _this._bindings[attrValue]._directives.push(new Watcher('input', node, _this, attrValue, 'value'))
            node.addEventListener('input',function () {
                _this.$data[attrValue] = node.value
            },false)
        }

        if (node.hasAttribute('v-bind')) {
            let attrValue = node.getAttribute('v-bind');
            _this._bindings[attrValue]._directives.push(new Watcher('text', node, _this, attrValue, 'innerHTML'))
        }
    }
}

/**
 * 观察者（订阅者）构造函数，当data属性值变化时，更新dom节点的值
 * @param vm
 * @constructor
 */
function Watcher(name, el, vm, exp, attr) {
    this.name = name;         //指令名称，例如文本节点，该值设为"text"
    this.el = el;             //指令对应的DOM元素
    this.vm = vm;             //指令所属myVue实例
    this.exp = exp;           //指令对应的值，本例如"number"
    this.attr = attr;         //绑定的属性值，本例为"innerHTML"

    this.update();//初始化时就执行update方法，是为了用vue实例中的$data默认值初始化dom元素
}

Watcher.prototype.update = function () {
    this.el[this.attr] = this.vm.$data[this.exp];
}
