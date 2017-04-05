/*
    命令，封装 document.execCommand
*/

// 构造函数
function Command(editor) {
    this.editor = editor
}

// 修改原型
Command.prototype = {
    constructor: Command,

    // 执行命令
    do: function (name, value) {
        const editor = this.editor

        // 如果无选区，忽略
        if (!editor.selection.getRange()) {
            return
        }

        // 恢复选取
        editor.selection.restoreSelection()

        // 执行
        const _name = '_' + name
        if (this[_name]) {
            // 有自定义事件
            this[_name](value)
        } else {
            // 默认 command
            this.execCommand(name, value)
        }

        // 修改菜单状态
        editor.menus.changeActive()

        // 最后，恢复选取保证光标在原来的位置闪烁
        editor.selection.saveRange()
        editor.selection.restoreSelection()
    },

    // 自定义 insertHTML 事件
    _insertHTML: function (html) {
        const editor = this.editor
        const range = editor.selection.getRange()

        if (range.pasteHTML) {
            range.pasteHTML(html)
        } else {
            this.execCommand('insertHTML', html)
        }
    },

    // 封装 execCommand
    execCommand: function (name, value) {
        document.execCommand(name, false, value)
    }
}

export default Command