function createTodoElement(todo) {
  if (!todo) return null;

  // find template
  const todoTemplate = document.getElementById('todoTemplate');
  if (!todoTemplate) return;

  // clone li element
  const todoElement = todoTemplate.content.firstElementChild.cloneNode(true);
  todoElement.dataset.id = todo.id;
  todoElement.dataset.status = todo.status;

  // render todo status
  const divElement = todoElement.querySelector('div.todo');
  if (!divElement) return;
  const alertClass = todo.status === 'completed' ? 'alert-success' : 'alert-secondary';
  divElement.classList.remove('alert-secondary');
  divElement.classList.add(alertClass);

  // update content where needed
  const titleElement = todoElement.querySelector('.todo__title');
  if (titleElement) titleElement.textContent = todo.title;

  // attach events for buttons
  // add click event for mask-as-done button
  const markAsDoneButton = todoElement.querySelector('button.mark-as-done');
  if (markAsDoneButton) {
    markAsDoneButton.addEventListener('click', () => {
      const currentStatus = todoElement.dataset.status;
      todoElement.dataset.status = currentStatus === 'pending' ? 'completed' : 'pending';

      const newAlerClass = currentStatus === 'pending' ? 'alert-success' : 'alert-secondary';
      divElement.classList.remove('alert-success', 'alert-secondary');
      divElement.classList.add(newAlerClass);

      // find todo selected from storage
      const todoList = getTodoList();
      const index = todoList.findIndex((x) => x.id.toString() === todoElement.dataset.id);
      if (index < 0) return;

      // update status
      todoList[index].status = todoElement.dataset.status;

      // save
      localStorage.setItem('todo_list', JSON.stringify(todoList));
    });
  }

  // add click event for mask-as-done button
  const removeButton = todoElement.querySelector('button.remove');
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      // save to local storange
      const todoList = getTodoList();
      const newTodoList = todoList.filter((x) => x.id !== todo.id);
      localStorage.setItem('todo_list', JSON.stringify(newTodoList));

      // remove from DOM
      todoElement.remove();
    });
  }

  // add click event for edit button
  const editButton = todoElement.querySelector('button.edit');
  if (editButton) {
    editButton.addEventListener('click', () => {
      // TODO: latest todo data - get from local storage
      // need to get todo from local storage
      // as todo data can be outdated
      const todoList = getTodoList();
      const latestTodo = todoList.find((x) => x.id === todo.id);
      if (!latestTodo) return;

      //populate data to todo form
      populateTodoForm(latestTodo);
    });
  }

  return todoElement;
}

function populateTodoForm(todo) {
  // query todo form
  // dataset.id = todo.id
  const todoForm = document.getElementById('todoFormId');
  if (todoForm) todoForm.dataset.id = todo.id;

  // set values for form controls
  // set todoText input
  const todoInput = document.getElementById('todoText');
  if (!todoInput) return;
  todoInput.value = todo.title;
}

function renderTodoList(todoList, ulElementId) {
  if (!Array.isArray(todoList) || todoList.length === 0) return;

  // find ul element
  // loop through todoList
  // each todo --> create li element --> append to ul
  const ulElement = document.getElementById(ulElementId);
  if (!ulElement) return;

  for (const todo of todoList) {
    const liElement = createTodoElement(todo);
    ulElement.appendChild(liElement);
  }
}

function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem('todo_list'));
  } catch {
    return [];
  }
}

function handleTodoFormSubmit(event) {
  event.preventDefault();

  const todoForm = document.getElementById('todoFormId');
  if (!todoForm) return;

  // get form values
  // validate form values
  const todoInput = document.getElementById('todoText');
  if (!todoInput) return;

  // determine add or edit mode
  const isEdit = Boolean(todoForm.dataset.id);

  if (isEdit) {
    // find current todo
    const todoList = getTodoList();
    const index = todoList.findIndex((x) => x.id.toString() === todoForm.dataset.id);
    if (index < 0) return;

    // update content
    todoList[index].title = todoInput.value;

    // save
    localStorage.setItem('todo_list', JSON.stringify(todoList));

    // apply DOM changes
    // find li element having id = todoForm.dataset.id
    const liElement = document.querySelector(`ul#todoList > li[data-id='${todoForm.dataset.id}']`);
    if (liElement) {
      //liElement.textContent = todoInput.value;
      const titleElement = liElement.querySelector('.todo__title');
      if (titleElement) titleElement.textContent = todoInput.value;
    }

  } else {
    const newTodo = {
      id: Date.now(),
      title: todoInput.value,
      status: 'pending',
    };

    // save
    const todoList = getTodoList();
    todoList.push(newTodo);
    localStorage.setItem('todo_list', JSON.stringify(todoList));

    // apply DOM changes
    const newLiElement = createTodoElement(newTodo);
    const ulElement = document.getElementById('todoList');
    if (!ulElement) return;
    ulElement.appendChild(newLiElement);
  }

  // reset form
  if (todoForm) todoForm.reset();
}

// main
(() => {
  //const todoList = [
  //  { id: 1, title: 'Learn Javascript', status: 'pending' },
  //  { id: 2, title: 'Learn ReactJS', status: 'completed' },
  //  { id: 3, title: 'Learn NextJS', status: 'pending' },
  //];

  const todoList = getTodoList();
  renderTodoList(todoList, 'todoList');

  // register submit event for todo form
  const todoForm = document.getElementById('todoFormId');
  if (todoForm) {
    todoForm.addEventListener('submit', handleTodoFormSubmit);
  }
})();
