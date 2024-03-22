import React, { useEffect, useRef, useState } from 'react'
import useDebounce from './hooks/useDebounce'
import { MagnifyingGlassIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import './App.css'
import { Todo, Shortcut } from './types/types'
import TodoComponent from './components/TodoComponent'
import Modal from './components/Modal'
import Button from './components/Button'
import { fetchTodos, fetchFavIcon, fetchUsername, trapFocus, fetchTheme } from './utility/utilities'
import Nav from './components/Nav'

function App() {
  const googleSearchRef = useRef<HTMLInputElement | null>(null);
  const usernameInputRef = useRef<HTMLInputElement | null>(null);
  // Todo States
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<Todo[]>(fetchTodos('todo'));
  const [dailies, setDailies] = useState<Todo[]>(fetchTodos('daily'));
  const [editedTodos, setEditedTodos] = useState<Todo[]>([]);
  const [editedDailies, setEditedDailies] = useState<Todo[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [createMode, setCreateMode] = useState<boolean>(false);
  const todoInputRef = useRef<HTMLInputElement | null>(null);

  // Shortcut States
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(fetchTodos('shortcuts'));
  const [scInput, setScInput] = useState("");
  const [scUrlInput, setScUrlInput] = useState("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [currentSCId, setCurrentSCId] = useState<number | null>(null);
  const [currentHoverSc, setCurrentHoverSc] = useState<number | null>(null);
  const [tooltipActive, setTooltipActive] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(fetchTheme);

  // Search States
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debouncedSearchValue = useDebounce(searchInput);

  // Username States
  const [username, setUsername] = useState(fetchUsername());
  const [editedUsername, setEditedUsername] = useState('');

  const setName = (e:React.FormEvent) => {
    e.preventDefault();
    setUsername(editedUsername)
  }

  const prepareEditUsername = () => {
    setUsername('')
    setEditedUsername('')
  }

  const resetSCActives = () => {
    const updatedShortcuts = shortcuts.map((sc: Shortcut) => {
      return {...sc, isActive: false};
    })
    setShortcuts(updatedShortcuts);
  }

  // Creating a new todo
  const handleSubmit = (e: React.FormEvent) => {  
    e.preventDefault();
    const newDate = new Date();
    const newTodo: Todo = {
      id: Date.now(),
      description: input,
      completed: false,
      daily: false,
      day: newDate.getDate(),
      month: newDate.getMonth() + 1,
      dateNow: Date.now()
    }
    // Reset inputs
    setTodos([newTodo, ...todos]);
    setInput('');
    setCreateMode(false);
  } 

  // Creating new shortcut
  const createShortcut = async () => {
    const favIcoUrl = await fetchFavIcon(scUrlInput);
    const newShortcut: Shortcut = {
      id: Date.now(),
      name: scInput,
      url: scUrlInput.includes('http') ? scUrlInput : `https://${scUrlInput}`,
      image: favIcoUrl ? favIcoUrl : scInput.slice(0, 1).toUpperCase(),
      isActive: false,
    }
    setShortcuts([...shortcuts, newShortcut]);
    // Reset inputs
    setScInput('');
    setScUrlInput('');
    closeModal();
  }

  // Edit Shortcut
  const editShortcut = async () => {
    const updatedShortcuts = await Promise.all(shortcuts.map(async (sc: Shortcut) => {
      if (sc.id === currentSCId) {
        // If URL changes
        if (sc.url !== scUrlInput) {
          const updatedFavIcon = await fetchFavIcon(scUrlInput);
          return {
            ...sc, 
            name: scInput, 
            url: scUrlInput.includes('http') ? scUrlInput : `https://${scUrlInput}`, 
            image: updatedFavIcon ? updatedFavIcon : scInput.slice(0, 1).toUpperCase(), 
            isActive: false
          }
        } else {
          return {...sc, name: scInput, url: scUrlInput, isActive: false}
        }
      } else {
        return sc;
      }
    }))
    setShortcuts(updatedShortcuts);
    closeModal();
  }

  // Sets shortcut active state
  const setActive = (id: number) => {
    setTooltipActive(true);
    const updatedShortcuts = shortcuts.map((sc: Shortcut) => {
      if (sc.id === id) {
        return {...sc, isActive: !sc.isActive}
      } else {
        // Close all other active states
        return {...sc, isActive: false};
      }
    })
    setShortcuts(updatedShortcuts);
  }

  // Prepares editing
  const prepareEdit = (type: string, shortcut?: Shortcut) => {
    setModalOpen(prev => !prev);
    if (type === 'edit') {
      setModalType('edit');
      setScInput(shortcut!.name);
      setScUrlInput(shortcut!.url);
      setCurrentSCId(shortcut!.id);
    } else if (type === 'add') {
      setModalType('add');
    }
  }

  // Delete Shortcut
  const deleteShortcut = (id: number) => {
    const updatedShortcuts = shortcuts.filter((shortcut: Shortcut) => shortcut.id !== id);  
    setShortcuts(updatedShortcuts);
  }

  // Close Modal
  const closeModal = () => {
    setModalOpen(prev => !prev);
    setScInput("");
    setScUrlInput("");
    setCurrentSCId(null);
  }

  const toggleEditMode = () => {
    // Creates copies of tasks
    setEditedDailies(dailies);
    setEditedTodos(todos)
    // Toggles edit mode
    setEditMode(prev => !prev);
  }

  const toggleCreateMode = () => {
    setInput('');
    setCreateMode(prev => !prev);
  }

  const clearCopies = () => {
    setEditedTodos([]);
    setEditedDailies([]);
  }

  const saveEdit = () => {
    // Transfer changes
    setTodos(editedTodos);
    setDailies(editedDailies);
    // Clears saved changes
    clearCopies();
    setEditMode(prev => !prev);
  }

  const cancelEdits = () => { 
    // Empty copies
    clearCopies();
    setEditMode(prev => !prev);
  }

  // Handles completion & daily toggle
  const handleToggle = (type: string, id?:number, isDaily?: boolean, task?: Todo) => {
    if (type === 'complete') {
      const arrayToEdit: Todo[] = isDaily ? dailies : todos;
      const updatedArray = arrayToEdit.map((todo: Todo) => {
        if (todo.id === id) {
          return {...todo, completed: !todo.completed}
        } else {
          return todo;
        }
      })
      isDaily ? setDailies(updatedArray) : setTodos(updatedArray);
    } else if (type === 'daily' && task) {
        // Toggles task's daily status
        const taskToUse = {...task, daily: !task.daily}
        if (task.daily) {
          // Removing a daily
          const updatedDailies = dailies.filter((daily: Todo) => daily.id !== task.id);
          setDailies(updatedDailies);
          // Add it back to todos
          const updatedTodos = [taskToUse, ...todos];
          setTodos(updatedTodos)
        } else {
            const taskWithDateCheck = {...taskToUse, cycleStamp: new Date().getDate()}
            // Adding a new daily 
            const updatedDailies = [...dailies, taskWithDateCheck];
            setDailies(updatedDailies);
            // Filter it out from normal todos
            const updatedTodos = todos.filter((todo: Todo) => todo.id !== task.id);
            setTodos(updatedTodos);
        }
    }
  }

  // Handles deletion and editing of task descriptions
  const handleEdit = (id: number, type: string, isDaily: boolean, e?: React.ChangeEvent<HTMLInputElement>) => {
    const arrayToEdit: Todo[] = isDaily ? editedDailies : editedTodos;
    let updatedArray;
    if (type === 'delete') {
      updatedArray = arrayToEdit.filter((todo: Todo) => todo.id !== id);
    } else {
      updatedArray = arrayToEdit.map((todo: Todo) => {
        if (todo.id === id) {
          return {...todo, description: e!.target.value};
        } else {
          return todo;
        }
      })
    }
    isDaily ? setEditedDailies(updatedArray) : setEditedTodos(updatedArray);
  }

  const generateSuggestions = async () => {
    const baseUrl = 'http://suggestqueries.google.com/complete/search?client=chrome&limit=5&q=';
    try {
      const response = await fetch(`${baseUrl}${debouncedSearchValue.replace(" ", "+")}`);
      const data = await response.json();
      const suggestions = data[1];
      setSuggestions(suggestions.splice(0, 8));
    } catch (error) {
      console.log(error)
    }
  }

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const defaultUrl = 'https://www.google.com/search?q=';
    const updatedSearchInput = searchInput.replace(" ", "+");
    window.location.replace(`${defaultUrl}${updatedSearchInput}`)
  }

  const closeTooltip = (e: React.MouseEvent) => {
    if (tooltipActive) {
      const target = e.target;
      if (target instanceof HTMLElement) {
        if (!target.classList.contains('tooltip')) {
          if (!target.classList.contains('tooltip-delete')) {
            resetSCActives();
            setTooltipActive(false);
          }
        }
      }
    }
  }

  useEffect(() => {
    if (username) {
      googleSearchRef.current?.focus();
    } else if (username === '') {
      usernameInputRef.current?.focus();
    }
  }, [])

  useEffect(() => {
    if (todoInputRef) {
      todoInputRef.current?.focus();
    }
  }, [createMode])

  // Save theme on toggle
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(darkMode));
  }, [darkMode])

  // Save todo changes to localStorage
  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(todos));
    localStorage.setItem("dailies", JSON.stringify(dailies));
  }, [todos, dailies])

  // Save username changes to localStorage
  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username])

  useEffect(() => {
    // ***
    // if (shortcuts.length > 0) {
    localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
    // }
  }, [shortcuts])

  useEffect(() => {
    // Reset active states of shortcuts when component mounts
      resetSCActives();
  }, [])

  useEffect(() => {
    if (debouncedSearchValue.length > 0) {
      generateSuggestions();
    } else if (debouncedSearchValue.length === 0) {
      // Clears it if all input is removed
      setSuggestions([]);
    }
  }, [debouncedSearchValue])

  useEffect(() => {
    if (modalOpen) {
      trapFocus(closeModal);
    }
  }, [modalOpen])

  return (
    <div className={`w-screen h-screen flex justify-center items-center transition-all ${darkMode ? 'bg-dark-300' : 'bg-main-100'}`} onClick={closeTooltip}>
      <Nav darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className='w-3/4 md:w-full md:max-w-[627px] mx-auto'>
        <img src='/logo.svg' alt="" className='w-[100px] mx-auto'/>
        {/* Welcome Section */}
        <div className='flex justify-center items-center mb-5 gap-3'>
          <h1 className={`${darkMode ? 'text-textDark-100' : 'text-black'} font-bold text-center`}>Welcome back, {username.length ? 
            <span className={`cursor-pointer ${darkMode ? 'border-text-textDark-100' : 'border-black'} hover:border-b`} onClick={prepareEditUsername}>{username}!</span> : null}
          </h1>
          {username.length === 0 ? <form action="" onSubmit={setName} className='w-1/3'>
            <input ref={usernameInputRef} id="titleInput" value={editedUsername} onChange={e => setEditedUsername(e.target.value)} type="text" className={`font-bold w-full bg-transparent h-auto ${darkMode ? 'text-textDark-100 border-text-textDark-100' : 'border-black text-black'}  border-b focus:outline-none`} maxLength={15}/>
          </form> : null}
        </div> 
        {/* Search Bar */}
        <form action="" onSubmit={submitSearch} className='relative'>
          <div className={`flex items-center`}>
            <div className={`${darkMode ? 'bg-dark-200' : 'bg-main-300'} pl-6 py-4 ${suggestions.length > 0 ? 'rounded-ss-3xl' : 'rounded-s-3xl'}`}>
              <MagnifyingGlassIcon className={`w-5 h-5 ${darkMode ? 'text-textDark-100' : 'text-black'}`}/>
            </div>
            <input ref={googleSearchRef} className={`${darkMode ? 'bg-dark-200 text-textDark-100 placeholder:text-textDark-100' : 'bg-main-300 text-black placeholder:text-text-200'} w-full text-sm py-4 px-2 text-text-300 focus:outline-none ${suggestions.length > 0 ? 'rounded-se-3xl' : 'rounded-e-3xl'}`} placeholder='Search on Google' type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}/>
            {/* <button type='submit'>Search</button> */}
          </div>
          {suggestions.length > 0 && <div className={`absolute z-30 w-full ${darkMode ? 'bg-dark-200' : 'bg-main-300'} rounded-b-2xl flex flex-col`}>
            {suggestions.length > 0 && suggestions.map((suggestion, index) => {
              return (
                <a className={`text-base pl-6 pr-4 py-2 ${index === suggestions.length - 1 ? 'rounded-b-2xl mb-0' : 'mb-2'} ${darkMode ? 'hover:bg-dark-100 text-textDark-100 hover:text-textDark-100 visited:text-textDark-100' : 'hover:bg-main-200 text-black visited:text-black hover:text-black'}`} href={`https://www.google.com/search?q=${suggestion.replace(" ", "+")}`}>
                  {suggestion}
                </a>
              )
            })}
          </div>}
        </form>
        <div className='relative my-5'>
          {/* Button Group */}
          <div className='flex flex-col absolute -right-12 top-4 gap-2'>
            {/* Create Mode */}
            {!editMode && <button onClick={toggleCreateMode}>
              <Button type='create' activeColor={createMode ? 'text-green-500' : undefined} size='lg' darkMode={darkMode} />
            </button>}
            {/* Edit Button */}
            {(todos.length || dailies.length) && (!editMode && !createMode) ? 
              <button onClick={toggleEditMode}>
                <Button type='edit' size='lg' darkMode={darkMode} />
              </button> 
            : null}
            {/* Save Button */}
            {editMode && <button onClick={saveEdit}>
              <Button type='save' size='lg' darkMode={darkMode} />
            </button>}
            {/* Cancel Button */}
            {editMode && <button onClick={cancelEdits}>
              <Button type='cancel' size='lg' darkMode={darkMode} />
            </button>}
          </div>
          {/* Render Dailies */}
          {/* (!todos.length && !dailies.length && createMode) || (todos.length || dailies.length) */}
          {(!todos.length && !dailies.length && !createMode) || (!editedTodos.length && !editedDailies.length && editMode) ? null : <div className={`${darkMode ? 'bg-dark-200' : 'bg-main-300'} rounded-3xl pt-4 pb-1 max-h-[200px] overflow-y-auto`}>
            {/* Create todo input */}
            {createMode && <form action="" className='mx-5 mb-3 flex justify-between items-center' onSubmit={handleSubmit}>
              <input ref={todoInputRef} value={input} required maxLength={57} type="text" className={`text-base p-3 rounded-2xl w-5/6 ${darkMode ? 'bg-dark-100 text-textDark-100' : 'bg-main-100 text-black'} focus:outline-none`} onChange={e => setInput(e.target.value)}/>
              <button type='submit'>
                <Button type='check' activeColor='text-green-500' darkMode={darkMode} />
              </button>
            </form>}
            {(dailies && !editMode) && dailies.map(daily => {
              return (
                <TodoComponent key={daily.id} type={'daily'} todo={daily} editMode={editMode} handleEdit={handleEdit} handleToggle={handleToggle} darkMode={darkMode}/>
              )
            })}
            {(dailies && editMode) && editedDailies.map(daily => {
              return (
                <TodoComponent key={daily.id} type={'daily'} todo={daily} editMode={editMode} handleEdit={handleEdit} handleToggle={handleToggle} darkMode={darkMode}/>
              )
            })}
            {/* Render normal todos */}
            {(todos && !editMode) && todos.map(todo => {
              return (
                <TodoComponent key={todo.id} type={'normal'} todo={todo} editMode={editMode} handleEdit={handleEdit} handleToggle={handleToggle} darkMode={darkMode}/>
              )
            })}
            {(todos && editMode) && editedTodos.map(todo => {
              return (
                <TodoComponent key={todo.id} type={'normal'} todo={todo} editMode={editMode} handleEdit={handleEdit} handleToggle={handleToggle} darkMode={darkMode}/>
              )
            })}
          </div>}
        </div>
        {(!todos.length && !dailies.length) && 
          <div className={`${darkMode ? 'bg-dark-200' : 'bg-main-300'} rounded-3xl p-4 text-base mb-5`}>
            <span className={`${darkMode ? 'text-textDark-100' : 'text-black'}`}>Add a task!</span>
          </div>
        }
        {/* Edit/Create Shortcut Modal */}
        {modalOpen &&
          <Modal
            type={modalType} 
            closeModal={closeModal} 
            scInput={scInput} 
            setScInput={setScInput} 
            scUrlInput={scUrlInput} 
            setScUrlInput={setScUrlInput} 
            editShortcut={editShortcut} 
            createShortcut={createShortcut}
            darkMode={darkMode}
          />
        }
        {/* Render Shortcuts */}
        <div className='flex justify-center flex-wrap'>
          {shortcuts && shortcuts.map((shortcut: Shortcut) => {
            return (
              // Shortcut Card
              <div key={shortcut.url} className={`relative ${darkMode ? 'hover:bg-dark-100' : 'hover:bg-main-200'} hover:rounded-lg`} onMouseOver={() => setCurrentHoverSc(shortcut.id)} onMouseLeave={() => setCurrentHoverSc(null)}>
                {currentHoverSc === shortcut.id && <button className='absolute p-1 top-0 right-0 cursor-pointer' onClick={() => setActive(shortcut.id)}><EllipsisVerticalIcon className={`w-4 h-4 ${darkMode ? 'text-textDark-100' : 'text-black'}`}/></button>}
                {shortcut.isActive && <div className={`tooltip absolute top-0 right-0 w-full h-full ${darkMode ? 'bg-dark-200' : 'bg-main-300' } rounded-lg text-black flex flex-col justify-center gap-2`}>
                  <button className={`absolute top-0 right-0 p-2 ${darkMode ? 'text-textDark-100' : 'text-black'}`} onClick={() => setActive(shortcut.id)}>X</button>
                  <button className={`px-2 py-1 rounded-xl text-sm drop-shadow-sm ${darkMode ? 'bg-dark-100 text-textDark-100' : 'bg-main-200 text-black'} mx-auto`} onClick={() => prepareEdit('edit', shortcut)}>Edit</button>
                  <button className={`tooltip-delete px-2 py-1 rounded-xl text-sm drop-shadow-sm ${darkMode ? 'bg-dark-100 text-textDark-100' : 'bg-main-200 text-black'} mx-auto`} onClick={() => deleteShortcut(shortcut.id)}>Delete</button>
                </div>}
                <a href={shortcut.url} className='rounded-2xl w-[112px] h-[112px] flex flex-col justify-center items-center text-text-300 visited:text-text-300 hover:text-text-300'>
                  {/* Image/Favicon */}
                  <div className={`w-[50px] h-[50px] ${darkMode ? 'bg-dark-200 text-textDark-100' : 'bg-main-300 text-black'} rounded-full flex justify-center items-center mb-2`}>
                    {shortcut.image.length === 1 ?
                      <p className='text-base'>{shortcut.image}</p> :
                      <img src={shortcut.image} alt="" className='w-4 mx-auto'/>
                    }
                  </div>
                  <p className={`text-base truncate max-w-[70px] ${darkMode ? 'text-textDark-100' : 'text-black'}`}>{shortcut.name}</p>
                </a>
              </div>
            )
          })}
          {/* Create Shortcut Button */}
          <div>
            {shortcuts.length < 10 &&
              <div className='w-[112px] h-[112px] flex flex-col justify-center items-center'>
                <button onClick={() => prepareEdit('add')} className={`w-[50px] h-[50px] ${darkMode ? 'bg-dark-200 text-textDark-100' : 'bg-main-300 text-black'} rounded-full mb-2 text-2xl`}>+</button>
                <p className={`text-base ${darkMode ? 'text-textDark-100' : 'text-black'}`}>New</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
