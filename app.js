const taskNameInput = document.getElementById('taskName');
const dueDateInput = document.getElementById('dueDate');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAll');
const filterButtons = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'task completed' : 'task';
        li.innerHTML = `
            <span>${task.name} ${task.dueDate ? `- ${task.dueDate}` : ''}</span>
            <div>
                <button onclick="toggleTask('${task.id}')"><i class="fa fa-check"></i></button>
                <button onclick="editTask('${task.id}')"><i class="fa fa-edit"></i></button>
                <button onclick="deleteTask('${task.id}')"><i class="fa fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function addTask() {
    const name = taskNameInput.value.trim();
    const dueDate = dueDateInput.value;
    if (!name) return;

    const newTask = {
        id: Date.now().toString(),
        name,
        completed: false,
        dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: 'normal',
        category: 'general'
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskNameInput.value = '';
    dueDateInput.value = '';
}

function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveTasks();
    renderTasks();
}

function editTask(id) {
    const newName = prompt('Edit task name:');
    if (!newName) return;
    tasks = tasks.map(task => task.id === id ? { ...task, name: newName, updatedAt: new Date().toISOString() } : task);
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
clearAllBtn.addEventListener('click', () => {
    tasks = [];
    saveTasks();
    renderTasks();
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        renderTasks(btn.dataset.filter);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    fetchQuote();
});

async function fetchQuote() {
    try {
        const res = await fetch('https://api.quotable.io/random');
        const data = await res.json();
        document.getElementById('quote').textContent = `"${data.content}" — ${data.author}`;
    } catch {
        document.getElementById('quote').textContent = "Stay productive!";
    }
}
// time
