import React from 'react'

type ModalProps = {
    type: string,
    closeModal: () => void,
    scInput: string,
    setScInput: React.Dispatch<React.SetStateAction<string>>,
    scUrlInput: string,
    setScUrlInput: React.Dispatch<React.SetStateAction<string>>,
    editShortcut: () => void,
    createShortcut: (e: React.FormEvent) => Promise<void>
}

const Modal = ({type, closeModal, scInput, setScInput, scUrlInput, setScUrlInput, editShortcut, createShortcut}: ModalProps) => {
  return (
    <div id="modal" className='w-screen h-screen bg-black/30 absolute top-0 left-0 z-10 flex justify-center items-center' onClick={closeModal}>
        <div className='relative z-20 bg-main-100 w-[300px] h-[200px] flex flex-col gap-1 rounded-xl justify-center px-4' onClick={e => e.stopPropagation()}>
        <label className='text-base' htmlFor="">Name</label>
        <input className='p-1 text-base' type="text" value={scInput} onChange={e => setScInput(e.target.value)}/>
        <label className='text-base' htmlFor="">Url</label>
        <input className='p-1 mb-2 text-base' type="text" value={scUrlInput} onChange={e => setScUrlInput(e.target.value)}/>
        <button className='grow-0 text-base' onClick={type === 'edit' ? editShortcut : createShortcut}>Save</button>
        </div>
    </div>
  )
}

export default Modal