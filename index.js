var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Entry point
document.addEventListener("DOMContentLoaded", function () {
    var listElement = document.getElementById("todoList");
    TodoApp(listElement);
});
var updateStateEvent = new CustomEvent("updateState", {});
// Exemplo de generics
var initialState = /** @class */ (function () {
    function initialState(state) {
        this.state = state;
    }
    initialState.prototype.getState = function () {
        return this.state;
    };
    initialState.prototype.setState = function (x) {
        this.state = x;
        document.dispatchEvent(updateStateEvent);
    };
    return initialState;
}());
// Application
function TodoApp(listElement) {
    var _a = new initialState([]), getState = _a.getState, setState = _a.setState;
    var dataSet = new Set(["home", "work", "school"]);
    var nextId = 0;
    listElement.innerHTML = "\n    <ul></ul>\n    <span class=\"text-muted\">0 Done</span>\n    <a href=\"#\">Mark all done</a>\n    <form class=\"d-flex gap-1\">\n      <input class=\"form-control\" type=\"text\" name=\"text\" id=\"inputText\" placeholder=\"Text\" required />\n      \n      <input class=\"form-control\" list=\"tagOptions\" id=\"tagList\" placeholder=\"Tag\" />\n      <datalist id=\"tagOptions\">\n        ".concat(Array.from(dataSet)
        .map(function (el) { return "\n          <option value=\"".concat(el, "\">"); })
        .join("\n"), "\n      </datalist>\n\n      <button class=\"btn btn-outline-success\" type=\"submit\">Add</button>\n    </form>\n  ");
    var formElement = listElement.querySelector("form");
    //texto do todo
    var inputTextElement = listElement.querySelector("#inputText");
    //tag do todo
    var inputTagElement = listElement.querySelector("#tagList");
    var btnElement = listElement.querySelector("button");
    btnElement.addEventListener("click", function (ev) {
        ev.preventDefault();
        // Validação
        formElement.classList.add("was-validated");
        if (!formElement.checkValidity())
            return;
        setState(__spreadArray(__spreadArray([], getState(), true), [
            createTodo(inputTextElement.value, inputTagElement.value),
        ], false));
        // Resetar o form
        formElement.reset();
        formElement.classList.remove("was-validated");
    });
    var aElement = listElement.querySelector("a");
    aElement.addEventListener("click", function (ev) {
        ev.preventDefault();
        setState(completeAll(getState()));
    });
    function todoDivElement(todo) {
        var id = todo.id, text = todo.text, done = todo.done, tag = todo.tag;
        var todoDiv = document.createElement("div");
        todoDiv.classList.add("form-check");
        todoDiv.innerHTML = "\n    <input class=\"form-check-input\" type=\"checkbox\" id=\"".concat(id, "\">\n    <label class=\"form-check-label\" for=\"").concat(id, "\">\n      ").concat(text, "\n    </label>");
        if (tag) {
            var _a = createTodoTagTuple(tag), el1 = _a[0], el2 = _a[1];
            todoDiv.appendChild(el1);
            todoDiv.appendChild(el2);
        }
        var input = todoDiv.querySelector("input");
        if (done)
            input.setAttribute("checked", "");
        input.addEventListener("change", function (_) { return handleToggleTodo(todo); });
        return todoDiv;
    }
    function handleToggleTodo(todo) {
        var id = todo.id;
        var newTodo = toggleTodo(todo);
        var data = getState().filter(function (el) { return el.id != id; });
        data.push(newTodo);
        data.sort(function (a, b) { return a.id - b.id; });
        setState(data);
    }
    //complete
    function toggleTodo(todo) {
        return {
            id: todo.id,
            text: todo.text,
            done: todo.done,
            tag: todo.tag
        };
    }
    function createTodo(text, rawTag) {
        if (rawTag === void 0) { rawTag = ""; }
        return {
            id: nextId++,
            text: text,
            done: false,
            tag: getTodoTag(rawTag)
        };
    }
    function getTodoTag(tag) {
        return tag === "home" || tag === "work" || tag === "school" ? tag : { custom: tag };
    }
    function createTodoTagTuple(tag) {
        var label = document.createElement("span");
        var icon = document.createElement("i");
        icon.classList.add("mx-1");
        icon.classList.add("bi");
        if (tag === "home") {
            icon.classList.add("bi-house");
            label.textContent = "Home";
        }
        else if (tag === "work") {
            icon.classList.add("bi-briefcase");
            label.textContent = "Work";
        }
        else if (tag === "school") {
            icon.classList.add("bi bi-mortarboard");
            label.textContent = "School";
        }
        else {
            icon.classList.add("bi-pin");
            label.textContent = tag.custom;
        }
        return [icon, label];
    }
    //complete
    function completeAll(todos) {
        //let i: number;
        for (var _i = 0, todos_1 = todos; _i < todos_1.length; _i++) {
            var i = todos_1[_i];
            if (i.done === false) {
                i.done = true;
            }
        }
        return todos;
    }
    //complete
    function getTotalDone(todos) {
        var total = 0;
        for (var _i = 0, todos_2 = todos; _i < todos_2.length; _i++) {
            var i = todos_2[_i];
            if (i.done === true) {
                total++;
            }
        }
        return total;
    }
    function render() {
        var todos = getState();
        var total = getTotalDone(todos);
        var ulElement = listElement.querySelector("ul");
        ulElement.innerHTML = "";
        var spanElement = listElement.querySelector("span");
        spanElement.innerText = "".concat(total, " Done");
        var todoDivs = todos.map(todoDivElement);
        todoDivs.forEach(function (el) { return ulElement.appendChild(el); });
    }
    document.addEventListener("updateState", function (_) {
        render();
    });
    setState([createTodo("First todo"), createTodo("Second todo")]);
}
