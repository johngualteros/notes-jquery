const COLORS = [
    'bg-red-200',
    'bg-blue-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-pink-200',
    'bg-indigo-200',
    'bg-cyan-200',
    'bg-teal-200',
    'bg-sky-200',
    'bg-lime-200',
    'bg-amber-200',
    'bg-orange-200',
    'bg-emerald-200',
]

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

function htmlTask(title, description, color, id) {
    return `
    <div class="rounded-xl ${color} max-w-xs p-3 relative" style="height: 180px;" id="${id}">
        <h2 class="text-md font-bold">${title}</h2>
        <p class="text-sm">
            ${description}
        </p>    
        <button class="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-2 rounded-full absolute bottom-3 right-3"
            onclick="markAsDone('${id}')">
            Mark as done
        </button>
    </div>
    `;
}

function htmlTaskDone(title, description, color, id) {
    return `
    <div class="rounded-xl ${color} max-w-xs p-3 relative" style="height: 180px;" id="${id}">
        <h2 class="text-md font-bold">${title}</h2>
        <p class="text-sm">
            ${description}
        </p>    
        <button class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-1 px-2 rounded-full absolute bottom-3 right-3"
            onclick="moveToTodo('${id}')">
            Move To todo
        </button>
    </div>
    `;
}

function markAsDone(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.map(task => {
        if(task.id === id) {
            task.done = true;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    loadTasks($('#todo-list'), $('#todo-done'));
}

function moveToTodo (id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.map(task => {
        if(task.id === id) {
            task.done = false;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    loadTasks($('#todo-list'), $('#todo-done'));
}

function createNewTask(title, description) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const todo_tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    id = generateUUID();
    const currentTask = {
        id,
        title,
        description,
        color,
        done: false,
    }
    const updatedTasks = [...todo_tasks, currentTask];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return htmlTask(title, description, color, id);
} 

function loadTasks(parentTodo, parentDone) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    parentTodo.empty();
    parentDone.empty();
    tasks.forEach(task => {
        if(task.done) {
            parentDone.append(htmlTaskDone(task.title, task.description, task.color, task.id));
        } else {
            parentTodo.append(htmlTask(task.title, task.description, task.color, task.id));
        }
    });
}

$(function() {
    const $TODO_LIST   = $('#todo-list');
    const $DONE_LIST   = $('#todo-done');
    const $ADD_NOTE    = $('#add-note');

    const $FORM        = $('#form-add');
    const $TITLE       = $('#title');
    const $DESCRIPTION = $('#description');

    const $SEARCH_INPUT = $('#search-input');

    loadTasks($TODO_LIST, $DONE_LIST);

    $ADD_NOTE.on('click', function() {
        $ADD_NOTE.hide();
        $FORM.removeClass('hidden');
        $FORM.addClass('flex');
    });

    $SEARCH_INPUT.on('keyup', function() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const value = $SEARCH_INPUT.val();
        const filteredTasks = tasks.filter(task => {
            return task.title.toLowerCase().includes(value.toLowerCase()) || task.description.toLowerCase().includes(value.toLowerCase());
        });
        $TODO_LIST.empty();
        $DONE_LIST.empty();
        filteredTasks.forEach(task => {
            if(task.done) {
                $DONE_LIST.append(htmlTaskDone(task.title, task.description, task.color, task.id));
            } else {
                $TODO_LIST.append(htmlTask(task.title, task.description, task.color, task.id));
            }
        });
    });

    $FORM.on('submit', function(event) {
        event.preventDefault();
        const title       = $TITLE.val();
        const description = $DESCRIPTION.val();
        const newTask     = createNewTask(title, description);
        $TODO_LIST.append(newTask);
        $FORM.removeClass('flex');
        $FORM.addClass('hidden');
        $ADD_NOTE.show();
        $TITLE.val('');
        $DESCRIPTION.val('');
    });
});