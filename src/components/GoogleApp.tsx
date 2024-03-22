import { useState } from 'react';
import { GoogleApps1, GoogleApps2 } from '../utility/GoogleApps'

const GoogleApp = ({ darkMode }: { darkMode: boolean }) => {
  const [currentHover, setCurrentHover] = useState<null | number>(null);

  return (
    <div className={`text-base p-4 absolute z-40 top-10 right-0 rounded-3xl w-[370px] h-[470px] grid grid-cols-3 overflow-y-scroll gapp ${darkMode ? 'bg-neutral-800' : 'bg-main-300'}`}>
          {GoogleApps1.map(app => (
              <a key={app.appName} className={`transition-all rounded-2xl m-3 px-3 py-1 flex flex-col mx-auto items-center ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-main-100'}`} href={app.appUrl}>
                  <div className='w-[53px] h-[53px]' style={{
                      backgroundImage: 'url(https://ssl.gstatic.com/gb/images/sprites/p_2x_a6cad964874d.png)',
                      backgroundPosition: `0px -${app.index * 58}px`,
                      backgroundSize: '53px'                       
                      }}></div>
                  <span className={`${darkMode ? 'text-textDark-100' : 'text-black'}`}>{app.appName}</span>
              </a>
          ))}
          <div className={`w-5/6 border-t mx-auto my-6 col-span-3 ${darkMode ? 'border-white' : 'border-neutral-500'}`}></div>
          {GoogleApps2.map((app, index) => (
              <a onMouseEnter={() => setCurrentHover(index)} onMouseLeave={() => setCurrentHover(null)} key={app.appName} className={`transition-all rounded-2xl m-3 px-3 py-1 flex flex-col mx-auto items-center ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-main-100'}`} href={app.appUrl}>
                  <div className='w-[53px] h-[53px]' style={{
                      backgroundImage: 'url(https://ssl.gstatic.com/gb/images/sprites/p_2x_a6cad964874d.png)',
                      backgroundPosition: `0px -${app.index * 58}px`,
                      backgroundSize: '53px'                       
                      }}></div>
                  <span className={`${darkMode ? 'text-textDark-100' : 'text-black'} text-center ${index === currentHover ? 'text-wrap' : 'truncate'} max-w-20`}>{app.appName}</span>
              </a>
          ))}
          <div className='col-span-3 flex justify-center my-4'>
              <a href="https://about.google/products/" className={`text-center w-1/2 py-2 border rounded-3xl ${darkMode ? 'border-neutral-300 text-white visited:text-white hover:bg-neutral-700' : 'border-neutral-500 text-black visited:text-black hover:bg-main-100'}`}>
                More from Google
              </a>
          </div>
      </div>
  )
}

export default GoogleApp