import * as React from 'react'
import { useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom/client';
import tailwindConfig from './tailwind.config.cjs'
import useWindowDimensions from './hooks/useWindowDimensions.jsx';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Navigation() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { height, width } = useWindowDimensions();

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("/api/navigation/index.json")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.data);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])
  
  // Close the menu if we flip the view horizontally
  if(isMenuOpen && width > parseInt(tailwindConfig.theme.screens['mobile'], 10)){
    setIsMenuOpen(false);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <TopBar setMenuStatus={setIsMenuOpen} isMenuOpen={isMenuOpen} items={items} />
    )
  }
}

function TopBar({ setMenuStatus, isMenuOpen, items }) {
  return (
    <nav className="container tablet:flex tablet:justify-between">
      <div className="flex py-4 items-center justify-between">
        <div >
          <a href="/">
            <img className={classNames('h-12', 'tablet:h-12')} src="https://www.valewood.org/wp-content/uploads/2022/08/A-DevOoops-1-e1660773390219.png"></img>
          </a>
        </div>
        <div className="tablet:hidden">
          <button type="button" className="block hover:text-gray-500 focus:text-gray-500" onClick={() => { setMenuStatus(isMenuOpen ? false : true); }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                className={classNames((isMenuOpen ? "hidden" : "block"))}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <Nav setMenuStatus={setMenuStatus} isMenuOpen={isMenuOpen} items={items} />
    </nav>
  )
}

function Nav({ setMenuStatus, isMenuOpen, items }) {

  return (
    <div className={classNames(...(isMenuOpen ? ["fixed", "top-0", "left-0", "right-0", "z-50", 'w-full', 'overflow-x-hidden', 'overflow-y-auto', 'h-full', 'opacity-95', 'bg-black', 'text-white'] : ["hidden"]), "tablet:flex", "tablet:items-center")}>
      <button type="button" className="flex justify-between items-center w-full hover:text-gray-500 focus:text-gray-500 tablet:hidden" onClick={() => { setMenuStatus(isMenuOpen ? false : true); }}>
        <span></span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-right mr-8 mt-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <line className={classNames((isMenuOpen ? "block" : "hidden"))} x1="18" y1="6" x2="6" y2="18"></line>
          <line className={classNames((isMenuOpen ? "block" : "hidden"))} x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      {
        items.map((e, idx) => {
          return (<a key={"nav_item" + idx} className={classNames("block", "text-right", "p-4", "mr-8", "tablet:p-0", "tablet:mr-4")} href={e.href}>{e.text}</a>)
        })
      }
    </div>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('navigation')
);
root.render(<Navigation />)
