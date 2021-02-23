/**
 * 功能：如何把真实的dom转化为虚拟dom
 * 作者：cuicui
 * 日期： 2020/6/5
 */
function Element(tagName, props, children) {
    this.tagName = tagName;
    this.props = props;
    this.children = children
}

export default function (tagName, props, children) {
    return new Element(tagNamem, props, children)
}
