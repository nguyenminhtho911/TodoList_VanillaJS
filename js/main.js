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

  return todoElement;
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

  // get form values
  // validate form values
  const todoInput = document.getElementById('todoText');
  if (!todoInput) return;

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

  // reset form
  const todoForm = document.getElementById('todoFormId');
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
