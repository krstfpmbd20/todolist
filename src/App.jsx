import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckSquare, faTrashAlt, faEdit, faSave, faSquare } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for showing delete confirmation
  const [showDeleteAllConfirmation, setShowDeleteAllConfirmation] = useState(false); // State for showing delete all confirmation
  const [deleteId, setDeleteId] = useState(null); // State to store the id of the todo to be deleted

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '' || description.trim() === '') return;
    if (editMode === null) {
      // Adding a new todo
      const newTodo = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        createdAt: new Date().toLocaleString(),
        done: false,
      };
      setTodos([...todos, newTodo]);
    } else {
      // Saving edit
      const updatedTodos = todos.map(todo =>
        todo.id === editMode ? { ...todo, title, description } : todo
      );
      setTodos(updatedTodos);
      setEditMode(null);
    }
    setTitle('');
    setDescription('');
  };

  const handleDelete = (id) => {
    setDeleteId(id); // Set the id of the todo to be deleted
    setShowDeleteConfirmation(true); // Show delete confirmation modal
  };

  const handleDeleteAll = () => {
    setShowDeleteAllConfirmation(true); // Show delete all confirmation modal
  };

  const handleToggleDone = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleDoneAll = () => {
    const allDone = todos.every(todo => todo.done);
    setTodos(
      todos.map(todo => ({
        ...todo,
        done: !allDone
      }))
    );
  };

  const handleEdit = (id) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    setTitle(todoToEdit.title);
    setDescription(todoToEdit.description);
    setEditMode(id);
  };

  const handleSaveEdit = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, title, description } : todo
    );
    setTodos(updatedTodos);
    setTitle('');
    setDescription('');
    setEditMode(null);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center mb-4">To-Do List App</h1>
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="mb-3">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="form-control"
                placeholder="Title"
              />
            </div>
            <div className="mb-3">
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                className="form-control"
                placeholder="Description"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: editMode !== null ? '#FF7F4D' : '#9D71BC' }}>
              {editMode !== null ? <><FontAwesomeIcon icon={faSave} /> Save Edit</> : <><FontAwesomeIcon icon={faPlus} /> Add To-Do</>}
            </button>
          </form>
          <button onClick={handleDoneAll} className="btn btn-success mr-2"><FontAwesomeIcon icon={faCheckSquare} /> Done All</button>
          <button onClick={handleDeleteAll} className="btn btn-danger mr-2"><FontAwesomeIcon icon={faTrashAlt} /> Delete All</button>
          <ul className="list-group">
            {todos.map(todo => (
              <li key={todo.id} className={`list-group-item ${todo.done ? 'text-decoration-line-through' : ''}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5>{todo.title}</h5>
                    <p>{todo.description}</p>
                    <small>Created At: {todo.createdAt}</small>
                  </div>
                  <div>
                    <button onClick={() => handleToggleDone(todo.id)} className={`btn ${todo.done ? 'btn-success' : 'btn-outline-success'} mr-2`}><FontAwesomeIcon icon={todo.done ? faCheckSquare : faSquare} /> {todo.done ? 'Undone' : 'Done'}</button>
                    <button onClick={() => handleEdit(todo.id)} className="btn btn-secondary mr-2"><FontAwesomeIcon icon={faEdit} /> Edit</button>
                    <button onClick={() => handleDelete(todo.id)} className="btn btn-danger mr-2"><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this to-do?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => {
            setTodos(todos.filter(todo => todo.id !== deleteId));
            setShowDeleteConfirmation(false);
          }}>Confirm</Button>
        </Modal.Footer>
      </Modal>
      {/* Delete All Confirmation Modal */}
      <Modal show={showDeleteAllConfirmation} onHide={() => setShowDeleteAllConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete All Todos</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete all to-dos?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllConfirmation(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => {
            setTodos([]);
            setShowDeleteAllConfirmation(false);
          }}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;