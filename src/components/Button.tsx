import { CheckIcon, ArrowPathIcon, MinusIcon, PlusIcon, PencilIcon, BookmarkIcon, XMarkIcon } from '@heroicons/react/24/outline';

type ButtonProps = {
    type: string,
    activeColor?: string,
    size?: string
}

const Button = ({type, activeColor, size}: ButtonProps) => {
    const defaultStyles = `rounded-full bg-main-100 shadow-md flex justify-center items-center ${size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'}`
    const defaultInnerStyles = 'w-3/5'
    switch(type) {
        case 'check':
            return (
                <div className={defaultStyles}>
                    <CheckIcon className={`${defaultInnerStyles} ${activeColor ? activeColor : 'text-gray-600'}`}/>
                </div> 
            )
        case 'daily':
            return (
                <div className={defaultStyles}>
                    <ArrowPathIcon className={`${defaultInnerStyles} ${activeColor ? activeColor : 'text-gray-600'}`}/>
                </div> 
            )
        case 'delete':
            return (
                <div className={defaultStyles}>
                    <MinusIcon className={`${defaultInnerStyles} text-red-500`}/>
                </div> 
            )
        case 'create':
            return (
                <div className={defaultStyles}>
                    <PlusIcon className={`${defaultInnerStyles} ${activeColor ? activeColor : 'text-gray-600'}`}/>
                </div> 
            )
        case 'edit':
            return (
                <div className={defaultStyles}>
                    <PencilIcon className={`w-1/2 text-${activeColor ? activeColor : 'gray-600'}`}/>
                </div> 
            )
        case 'save':
            return (
                <div className={defaultStyles}>
                    <BookmarkIcon className={`${defaultInnerStyles} text-${activeColor ? activeColor : 'gray-600'}`}/>
                </div> 
            )
        case 'cancel':
            return (
                <div className={defaultStyles}>
                    <XMarkIcon className={`${defaultInnerStyles} text-${activeColor ? activeColor : 'gray-600'}`}/>
                </div> 
            )
        default:
            break;
    }
}

export default Button