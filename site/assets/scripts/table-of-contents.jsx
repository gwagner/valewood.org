import * as React from 'react'
import * as ReactDOM from 'react-dom/client';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function TableOfContents() {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    if (!isLoaded) {
        setIsMenuOpen(true);
        if (window.innerWidth < 480) {
            setIsMenuOpen(false);
        }
        setIsLoaded(true);
    }

    return (
        <TOC setMenuStatus={setIsMenuOpen} isMenuOpen={isMenuOpen} />
    )
}

function TOC({ setMenuStatus, isMenuOpen }) {
    return (
        <div className={classNames("my-4")}>
            <div>
                <div className={classNames("bg-gray-100")}>
                    <button type="button" className={classNames("flex", "items-center", "justify-between", "w-full", "p-5", "text-left")} onClick={() => { setMenuStatus(isMenuOpen ? false : true); }}>
                        <span>Table Of Contents</span>
                        <svg data-accordion-icon className={classNames("w-6", "h-6", "rotate-180", "shrink-0")} fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd">
                            </path>
                        </svg>
                    </button>
                </div>
                <div className={classNames((isMenuOpen ? "block" : "hidden"))}>
                    <div className={classNames("p-5", "font-light", "border", "border-gray-200", "dark:border-gray-700", "dark:bg-gray-900")} >
                        {
                            tableOfContentsData.map((e, idx) => {
                                return (<a key={"nav_item" + idx} className={classNames("block", "tablet:mr-4")} href={e.href}>{idx +1 }. {e.text}</a>)
                            })
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}


const root = ReactDOM.createRoot(
    document.getElementById('table_of_contents')
);
root.render(<TableOfContents />)