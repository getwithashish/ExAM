import ChartHandlers from './chartHandlers/ChartHandlers';

export const Statistics = () => {
  return (
    <div className='bg-white'>
      <nav className="flex mb-4 mx-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
          <li className="inline-flex items-center font-display">
            <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
              </svg>
                Dashboard
            </a>
          </li>
        </ol>
      </nav>
      <div className="rounded-lg bg-white shadow-xl dark:bg-gray-800 xl:p-5 mx-10 my-2">
        <div className="mb-3 flex items-center justify-between">
          <div className="shrink-0 my-3 mx-1">
            <span className="font-medium font-display mx-3 leading-none text-gray-900 dark:text-white text-3xl">
              Asset Status Overview
            </span>
          </div>
        </div>
        <div className="mx-3">
          <ChartHandlers/>
        </div>        
      </div>
    </div>
  )
}
  
