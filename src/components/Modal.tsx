import React from 'react'

type ModalProps = {
    type: string,
    closeModal: () => void,
    scInput: string,
    setScInput: React.Dispatch<React.SetStateAction<string>>,
    scUrlInput: string,
    setScUrlInput: React.Dispatch<React.SetStateAction<string>>,
    editShortcut: () => void,
    createShortcut: () => Promise<void>,
    darkMode: boolean
}

const Modal = ({ type, closeModal, scInput, setScInput, scUrlInput, setScUrlInput, editShortcut, createShortcut, darkMode }: ModalProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    type === 'edit' ? editShortcut() : createShortcut()
  }

  return (
    <div id="modal" className='w-screen h-screen bg-black/30 absolute top-0 left-0 z-10 flex justify-center items-center' onClick={closeModal}>
        <form action="" onSubmit={handleSubmit}>
          <div className={`relative z-20 ${darkMode ? 'bg-dark-200' : 'bg-main-100'} w-[300px] flex flex-col gap-1 rounded-xl justify-center px-4 py-4`} onClick={e => e.stopPropagation()}>
            <label className={`text-base ${darkMode ? 'text-textDark-100' : 'text-black'}`} htmlFor="">Name</label>
            <input className={`p-1 text-base focus:outline-none rounded-sm ${darkMode ? 'bg-dark-300 text-textDark-100' : 'bg-main-300 text-black'}`} type="text" required value={scInput} onChange={e => setScInput(e.target.value)}/>
            <label className={`text-base ${darkMode ? 'text-textDark-100' : 'text-black'}`} htmlFor="">Url</label>
            <input className={`p-1 mb-2 text-base focus:outline-none rounded-sm ${darkMode ? 'bg-dark-300 text-textDark-100' : 'bg-main-300 text-black'}`} type="text" required value={scUrlInput} onChange={e => setScUrlInput(e.target.value)}/>
            <button className={`w-1/4 mx-auto grow-0 text-base mt-1 py-1 rounded-md  ${darkMode ? 'bg-dark-300 text-textDark-100' : 'bg-main-300 text-black'}`} type='submit'>Save</button>
          </div>
        </form>
    </div>
  )
}

export default Modal