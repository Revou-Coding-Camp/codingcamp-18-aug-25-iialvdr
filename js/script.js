document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const todoList = document.getElementById('todo-list');
    const filterSelect = document.getElementById('filter-select');
    const deleteCompletedBtn = document.getElementById('delete-completed-btn');
    const noTaskMessage = document.getElementById('no-task-message');
    const validationMessage = document.getElementById('validation-message');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = (filter = 'all') => {
        todoList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true;
        });

        if (filteredTasks.length === 0) {
            noTaskMessage.style.display = 'block';
        } else {
            noTaskMessage.style.display = 'none';
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.classList.add('todo-item');
                if (task.completed) {
                    li.classList.add('completed');
                }

                li.innerHTML = `
                    <div class="todo-details">
                        <span class="todo-text">${task.text}</span>
                        <span class="todo-date">Batas: ${task.date}</span>
                    </div>
                    <div class="actions">
                        <button class="action-btn complete-btn" data-id="${task.id}">
                            <i class="fas ${task.completed ? 'fa-check-circle completed-icon' : 'fa-circle'}"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${task.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                todoList.appendChild(li);
            });
        }
    };

    const validateForm = () => {
        if (!taskInput.value.trim() || !dateInput.value) {
            validationMessage.textContent = 'Harap isi semua kolom.';
            return false;
        }
        validationMessage.textContent = '';
        return true;
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newTask = {
            id: Date.now(),
            text: taskInput.value.trim(),
            date: dateInput.value,
            completed: false,
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks(filterSelect.value);
        todoForm.reset();
    };

    const toggleComplete = (id) => {
        const task = tasks.find(t => t.id.toString() === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(filterSelect.value);
        }
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(t => t.id.toString() !== id);
        saveTasks();
        renderTasks(filterSelect.value);
    };

    const deleteCompletedTasks = () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks(filterSelect.value);
    };

    todoForm.addEventListener('submit', addTask);
    filterSelect.addEventListener('change', () => renderTasks(filterSelect.value));
    deleteCompletedBtn.addEventListener('click', deleteCompletedTasks);

    todoList.addEventListener('click', (e) => {
        const target = e.target.closest('.action-btn');
        if (!target) return;

        const taskId = target.dataset.id;
        if (target.classList.contains('complete-btn')) {
            toggleComplete(taskId);
        } else if (target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        }
    });

    renderTasks();
});