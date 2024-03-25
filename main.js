$(document).ready(function () {
    const LOCAL_STORAGE_TASKS_KEY = "tasks.key";
    let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS_KEY)) || [];

    function save() {
        localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
    }

    function saveAndRender() {
        save();
        renderTasks();
    }

    function renderTasks() {
        $("div.Tasks").empty(); // Clear existing tasks before rendering

        tasks.forEach(function (task) {
            const taskElement = document.createElement("div");
            taskElement.classList.add("task");

            const divFormResult = document.createElement("div");
            divFormResult.classList.add("formResult");

            const inputTitle = document.createElement("input");
            inputTitle.type = "text";
            inputTitle.readOnly = true;
            inputTitle.value = "Title: " + task.title;
            inputTitle.classList = task.inputClass;

            const inputDescription = document.createElement("input");
            inputDescription.type = "text";
            inputDescription.readOnly = true;
            inputDescription.value = "Description: " + task.description;
            inputDescription.classList = task.inputClass;

            const inputPriority = document.createElement("input");
            inputPriority.type = "text";
            inputPriority.readOnly = true;
            inputPriority.value = "Priority: " + task.priority;
            inputPriority.classList = task.inputClass;

            const inputDueDate = document.createElement("input");
            inputDueDate.type = "text";
            inputDueDate.readOnly = true;
            inputDueDate.value = "Due Date: " + task.dueDate;
            inputDueDate.classList = task.inputClass;
            const buttons = document.createElement("div");
            buttons.classList.add("buttons");

            const divForCheckbox = document.createElement("div");
            divForCheckbox.classList.add("divForCheckbox");

            const label = document.createElement("label");
            label.textContent = "pending: "
            label.textContent = "status: " + task.pending;
            label.classList.add("labelCompleted");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            const edit = document.createElement("button");
            edit.classList.add("edit");

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete");

            edit.textContent = "Edit";
            deleteButton.textContent = "Delete";

            $('div.Tasks').append(taskElement);
            taskElement.append(divFormResult);
            divFormResult.append(inputTitle);
            divFormResult.append(inputDescription);
            divFormResult.append(inputPriority);
            divFormResult.append(inputDueDate);

            taskElement.append(buttons);
            buttons.append(divForCheckbox);
            divForCheckbox.append(label);
            divForCheckbox.append(checkbox);
            buttons.append(edit);
            buttons.append(deleteButton);

            deleteButton.addEventListener('click', () => {
                taskElement.remove();
                tasks = tasks.filter(t => t !== task); // Remove the deleted task from the tasks array
                saveAndRender();
            });

            edit.addEventListener('click', () => {
                if (inputTitle.readOnly && inputDescription.readOnly && inputPriority.readOnly && inputDueDate.readOnly && !checkbox.checked) {
                    inputTitle.readOnly = false;
                    inputDescription.readOnly = false;
                    inputPriority.readOnly = false;
                    inputDueDate.readOnly = false;
                    edit.textContent = "Save";
                    edit.style.color = "#60A5FA";
                    inputDescription.style.color = "#60A5FA";
                    inputPriority.style.color = "#60A5FA";
                    inputDueDate.style.color = "#60A5FA";
                    inputTitle.style.color = "#60A5FA";
                }
                else if (checkbox.checked) {
                    inputTitle.readOnly = true;
                    inputDescription.readOnly = true;
                    inputPriority.readOnly = true;
                    inputDueDate.readOnly = true;
                    edit.textContent = "Edit";
                    edit.style.color = "#EEE";
                }

                else {
                    // Save the edited task back to the tasks array
                    const editedTask = {
                        title: inputTitle.value.replace("Title: ", ""),
                        description: inputDescription.value.replace("Description: ", ""),
                        priority: inputPriority.value.replace("Priority: ", ""),
                        dueDate: inputDueDate.value.replace("Due Date: ", ""),
                        pending: label.textContent = checkbox.checked ? "completed" : "pending"
                    };
                    const index = tasks.findIndex(t => t === task);
                    tasks[index] = editedTask;
                    saveAndRender();
                    edit.textContent = "Edit";
                }
            });

            $("select#filter").change(function () {
                const filter = $(this).val();
                $(".task").each(function () {
                    const taskCompleted = $(this).find("input[type='checkbox']").prop("checked");
                    if ((filter === "completed" && taskCompleted) || (filter === "pending" && !taskCompleted) || filter === "all") {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
                        

            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                task.pending = label.textContent = checkbox.checked ? "completed" : "pending";

                if (checkbox.checked) {
                    task.pending = label.textContent = "completed";
                    task.inputClass = inputDescription.classList = inputPriority.classList = inputDueDate.classList = "inputCompleted";
                    inputDescription.readOnly = true;
                    inputPriority.readOnly = true;
                    inputDueDate.readOnly = true;
                    inputTitle.readOnly = true;
                } else {
                    task.inputClass = inputDescription.classList = inputPriority.classList = inputDueDate.classList.remove("inputCompleted")
                    inputDescription.readOnly = false;
                    inputPriority.readOnly = false;
                    inputDueDate.readOnly = false;
                    inputTitle.readOnly = false;
                }
                console.log(task);
                saveAndRender();
            });
            
        });
    }

    $("button#new-task").click(function () {
        $('dialog').show();
    });

    $('button#cancel').click(function () {
        $('dialog').hide();
    });

    $("form").submit(function (e) {
        e.preventDefault();
        let task = {
            title: $("#title").val(),
            description: $("#description").val(),
            priority: $("#priority").val(),
            dueDate: $("#due-date").val(),
            pending: "pending", // Assign default status to new task
            completed: false
        };
        tasks.push(task);
        saveAndRender();
        $('form')[0].reset(); // Reset form fields
        $('dialog').hide();
    });

    saveAndRender();
});
