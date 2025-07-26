const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
window.addEventListener('DOMContentLoaded', fetchTasks);
async function fetchTasks() {
    try {
        const res = await fetch('/api/tasks');
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const tasks = await res.json();
        taskList.innerHTML = '';
        tasks.forEach(task => addTaskToDOM(task));
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        taskList.innerHTML = `<p style="text-align: center; color: #9ca3af;">Could not load tasks.</p>`;
    }
}
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText) return;
    try {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: taskText })
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const newTask = await res.json();
        addTaskToDOM(newTask);
        taskInput.value = '';
    } catch (err) {
        console.error('Error adding task:', err.message);
    }
});
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.dataset.id = task._id;
    li.className = 'task-item';
    const leftGroup = document.createElement('div');
    leftGroup.className = 'task-content';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'custom-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleComplete(task._id, checkbox.checked));
    const span = document.createElement('span');
    span.textContent = task.text;
    span.className = 'task-text';
    if (task.completed) {
        span.classList.add('completed');
    }
    leftGroup.append(checkbox, span);
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'task-buttons';
    const editBtn = document.createElement('button');
    editBtn.innerHTML = `<i class="fas fa-pencil-alt"></i>`;
    editBtn.title = 'Edit task';
    editBtn.onclick = () => editTask(li, span, task._id);
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    deleteBtn.title = 'Delete task';
    deleteBtn.onclick = () => deleteTask(li, task._id);
    buttonGroup.append(editBtn, deleteBtn);
    li.append(leftGroup, buttonGroup);
    taskList.appendChild(li);
}
async function deleteTask(li, id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Failed to delete task' }));
            throw new Error(errorData.error);
        }
        li.remove();
    } catch (err) {
        console.error('Error deleting task:', err.message);
    }
}
function editTask(li, span, id) {
    const currentText = span.textContent;
    const leftGroup = li.querySelector('.task-content');
    const buttons = li.querySelector('.task-buttons');
    span.style.display = 'none';
    buttons.style.display = 'none';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    const editForm = document.createElement('form');
    editForm.className = 'edit-form';
    editForm.append(input, saveBtn);
    leftGroup.appendChild(editForm);
    input.focus();
    editForm.onsubmit = async (e) => {
        e.preventDefault();
        const updatedText = input.value.trim();
        if (!updatedText || updatedText === currentText) {
            editForm.remove();
            span.style.display = '';
            buttons.style.display = '';
            return;
        }
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: updatedText })
            });
            if (!res.ok) throw new Error(`Failed to update task: ${res.status}`);
            const updatedTask = await res.json();
            span.textContent = updatedTask.text;
        } catch (err) {
            console.error('Error updating task:', err.message);
        }
        editForm.remove();
        span.style.display = '';
        buttons.style.display = '';
    };
}
async function toggleComplete(id, completed) {
    try {
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        if (!res.ok) throw new Error(`Failed to toggle task: ${res.status}`);
        const li = document.querySelector(`[data-id='${id}']`);
        const span = li.querySelector('.task-text');
        span.classList.toggle('completed', completed);
    } catch (err) {
        console.error('Error toggling task:', err.message);
    }
}
