function collectData() {
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const index = getNumberOfTasksInLocalStorage();
    return {
        index,
        description,
        date,
        time,
    };
}

function generateHTML(data, isNewTask = false) {
    // If new task, add fade in class and delete the class right after the animation
    const newHTML = `
        <div class="task ${isNewTask ? 'fadeIn' : ''}" data-index="${data.index}" ${isNewTask ? 'onanimationend="this.classList.remove(\'fadeIn\')"' : ''}>
            <div class="delete-btn" onclick="deleteTask(${data.index})">
                <span class="bi bi-x-circle text-danger"></span>
            </div>
            <div class="task-content">
                ${data.description}
                <br>${data.date}<br>${data.time}
            </div>
        </div>
    `;
    return newHTML;
}

function renderHTML(newHTML) {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML += newHTML;
}

function clearForm() {
    const tasksForm = document.getElementById('tasksForm');
    tasksForm.reset();
    const descriptionInput = document.getElementById('description');
    descriptionInput.focus();
}

function saveSingleTaskToStorage(taskObject) {
    const currentTasksInStorageJSON = localStorage.getItem('tasks');
    const currentTasksInStorage = JSON.parse(currentTasksInStorageJSON);
    currentTasksInStorage.push(taskObject);
    localStorage.setItem('tasks', JSON.stringify(currentTasksInStorage));
}

function loadTasksFromLocalStorage() {
    const tasksJSON = localStorage.getItem('tasks');
    if (tasksJSON) {
        const tasks = JSON.parse(tasksJSON);
        const validTasks = [];
        for (const task of tasks) {
            if (!isTaskExpired(task)) {
                task.index = validTasks.length;
                const newHTML = generateHTML(task);
                renderHTML(newHTML);
                validTasks.push(task);
            }
        }
        localStorage.setItem('tasks', JSON.stringify(validTasks));
    }
}

function isTaskExpired(task) {
    const now = new Date();
    const taskDateTime = new Date(task.date + 'T' + task.time);
    return taskDateTime <= now;
}

function deleteAllCurrentTasks() {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = '';
}

function initStorage() {
    const currentTasksInStorageJSON = localStorage.getItem('tasks');
    if (!currentTasksInStorageJSON) {
        localStorage.setItem('tasks', JSON.stringify([]));
    }
}

function getNumberOfTasksInLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')).length;
}

function addTask(event) {
    event.preventDefault();
    const data = collectData();
    const newHTML = generateHTML(data, true);
    renderHTML(newHTML);
    saveSingleTaskToStorage(data);
    clearForm();
}

function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const tasksArray = tasks.filter(task => task.index !== index);
    localStorage.setItem('tasks', JSON.stringify(tasksArray));
    deleteAllCurrentTasks();
    loadTasksFromLocalStorage();
}

function showDeleteButton(taskElement) {
    const deleteButton = taskElement.querySelector('.delete-btn');
    deleteButton.style.display = 'block';
}

function hideDeleteButton(taskElement) {
    const deleteButton = taskElement.querySelector('.delete-btn');
    deleteButton.style.display = 'none';
}

initStorage();
loadTasksFromLocalStorage();
