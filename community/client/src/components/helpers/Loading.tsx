import { RotatingLines } from 'react-loader-spinner'

export default function Loading() {
    return (
        <div className='bg-slate-600/80 w-full h-full fixed flex-col z-50 top-0 left-0 flex items-center justify-center'>
            <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="30"
                visible={true}
            />
        </div>
    )
}
