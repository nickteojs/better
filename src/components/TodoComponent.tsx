import React from 'react'
import { Todo } from '../types/types';
import Button from './Button';

type TodoProps = {
    type: string,
    todo: Todo,
    editMode: boolean,
    handleEdit: (id: number, type: string, isDaily: boolean, e?: React.ChangeEvent<HTMLInputElement>) => void,
    handleToggle: (type: string, id?:number, isDaily?: boolean, task?: Todo) => void
}

const TodoComponent = ({type, todo, editMode, handleEdit, handleToggle}: TodoProps) => {
  return (
    <div className='flex justify-between items-center mx-5 mb-3 rounded-2xl'>
        {!editMode && <p className='p-3 w-4/5 md:w-5/6 break-all bg-main-100 rounded-2xl text-base'>{todo.description}</p>}
        {editMode && 
          <input className='text-base p-3 rounded-2xl w-4/5 md:w-5/6 bg-main-100 focus:outline-none' 
            maxLength={57} 
            type="text" 
            value={todo.description} 
            onChange={e => handleEdit(todo.id, 'edit', type === 'daily' ? true : false, e)}/>
        }
        <div className='flex gap-2'>
          {editMode && <button onClick={() => handleEdit(todo.id, 'delete', type === 'daily' ? true : false)}>
            <Button type='delete'/>
          </button>}
          {!editMode && <button onClick={() => handleToggle('complete', todo.id, type === 'daily' ? true : false)}>
            <Button type='check' activeColor={todo.completed ? 'text-green-500' : undefined} />
          </button>}
          {!editMode && <button onClick={() => handleToggle('daily', undefined, undefined, todo)}>
            <Button type='daily' activeColor={todo.daily ? 'text-blue-500' : undefined}/>
          </button>}
        </div>
    </div>
  )
}

export default TodoComponent;