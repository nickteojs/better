import { Bars3Icon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import GoogleApp from './GoogleApp'

type NavProps = {
    darkMode: boolean,
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
}

const Nav = ({ darkMode, setDarkMode }: NavProps) => {
    const [appsActive, setAppsActive] = useState(false);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && appsActive) {
            setAppsActive(false);
        }
    }

    const handleClick = (e: MouseEvent) => {
        const targetEl = e.target as HTMLElement;
        const tagName = targetEl.tagName;
        if (e.detail !== 0) {
            if (appsActive) {
                if (tagName !== 'svg' && tagName !== 'path') {
                    if (!targetEl.classList.contains('gapp')) {
                        setAppsActive(false);
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (appsActive) {
            window.addEventListener("keydown", handleKeyDown)
            window.addEventListener("click", handleClick)
        } 
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("click", handleClick)
        }
    }, [appsActive])

    return (
        <div className='absolute top-0 right-0 m-5 flex items-center gap-3'>
            <a className={`text-base ${darkMode ? 'visited:text-textDark-100 text-textDark-100' : 'visited:text-text-300 text-text-300'}`} href="https://mail.google.com/mail/u/0/">Gmail</a>
            <button onClick={() => setAppsActive(prev => !prev)} className='gappbutton'>
                <Bars3Icon className={`w-[24px] h-[24px] ${darkMode ? 'text-textDark-100' : 'text-black'}`}/>
            </button>
            {appsActive && <GoogleApp darkMode={darkMode} />}
            <button className={`w-[56px] h-[29px] transition ease-in-out duration-500 ${darkMode ? 'bg-neutral-800' : 'bg-main-300'} rounded-full shadow-inner`} onClick={() => setDarkMode(prev => !prev)}>
                <div className={`bg-white rounded-full w-[21px] h-[21px] mx-1 drop-shadow-sm transition ease-in-out duration-500 ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </button>
        </div>
    )
}

export default Nav