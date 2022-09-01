import NextHead from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Notification from '../../components/utils/Notification';
import useNotification from '../../hooks/useNotification';
import NotificationContext from '../../context/NotificationContext';
import logo from '../../public/img/aalto-logo.svg';
// components
import Connect from './Connect';

export default function Layout({children}) {
  // @ts-ignore
  const pageName = {pageName: children?.type?.name};

  const notification = useNotification();
  const notificationState = {
    ...notification
  }

  return (
    <>
      <NextHead>
        <title>Aalto - {pageName.pageName}</title>
      </NextHead>
      <NotificationContext.Provider value={notificationState}>
        <div className="h-full brand-backdrop min-h-screen relative flex flex-col app-bg">
          <div className="h-full grow flex flex-col">
            <div className="drawer drawer-end">
              <input id="nav-drawer" type="checkbox" className="drawer-toggle" /> 
              <div className="drawer-content flex flex-col">
                <div className="flex justify-center">
                  <div className="grow max-w-7xl justify-center">
                    <div className="w-full navbar">
                      <div className="px-2 mx-2">
                        <Link href="/">
                          <a className="mt-1">
                            <Image
                              src={logo}
                              height={26}
                              width={127}
                            />
                          </a>
                        </Link>
                      </div>
                      <div className="flex grow justify-center">
                        <div className="flex-none hidden lg:block">
                          <ul className="menu menu-horizontal flex items-center">
                            <li className="menu-item">
                              Dashboard
                            </li>
                            <li className="menu-item">
                              Bank
                            </li>
                            <li className="menu-item">
                              Calculator
                            </li>
                            <li className="btn-primary btn-sm rounded-3xl mx-2 cursor-pointer flex items-center">
                              Wrap
                            </li>
                            <li className="menu-item">
                              Analytics
                            </li>
                            <li className="menu-item">
                              Docs
                            </li>
                            <li className="menu-item">
                              Buy
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex grow justify-end">
                        <Connect />
                      </div>
                      <div className="flex-none lg:hidden">
                        <label htmlFor="nav-drawer" className="btn btn-square btn-ghost text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                      </div> 
                    </div>
                  </div>
                </div>
                <div>
                  <Notification />
                  {children}
                </div>
              </div> 
              <div className="drawer-side">
                <label htmlFor="nav-drawer" className="drawer-overlay"></label> 
                <ul className="menu p-4 overflow-y-auto w-80 bg-brand-dark-blue">
                  <li className="menu-item">
                    Dashboard
                  </li>
                  <li className="menu-item">
                    Bank
                  </li>
                  <li className="menu-item">
                    Calculator
                  </li>
                  <li className="btn-primary btn-sm rounded-3xl mx-2 cursor-pointer flex items-center justify-center">
                    Wrap
                  </li>
                  <li className="menu-item">
                    Analytics
                  </li>
                  <li className="menu-item">
                    Docs
                  </li>
                  <li className="menu-item">
                    Buy
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </NotificationContext.Provider>
    </>
  );
}