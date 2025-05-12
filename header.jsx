"use client";

import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { showToast } from "./notify";

export default function Header() {
  const {
    checkUserLogin,
    userTkn,
    userNm,
    userImg,
    logoutUser,
    userLink,
    getUserImg,
  } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [usrImg, setUsrImg] = useState<string | undefined>(undefined);
  const path = usePathname();

  useEffect(() => {
    checkUserLogin();
  }, [userTkn]);

  useEffect(() => {
    const fetchUserImg = async () => {
      const img = await getUserImg();
      setUsrImg(img);
    };
    fetchUserImg();
  }, [userTkn, userImg]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("success", "Copied to clipboard!");
      })
      .catch(() => {
        showToast("error", "Failed to copy!");
      });
  };

  // Update the click handler for the copy icon to:
  // onClick={() => copyToClipboard(`meetig.io/${userLink}`)}

  return (
    <header className="bg-primary-900 text-white flex justify-between items-center py-4 px-3 sticky top-0 z-50">
      <Link href="/">
        <svg
          width="131"
          height="32"
          viewBox="0 0 131 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-32 h-8 fill-white hidden md:block"
        >
          <path d="M13.1913 8.33803C14.6718 9.37213 15.4182 10.8449 16.2126 12.3796C16.3173 12.5797 16.4221 12.7799 16.527 12.98C16.7451 13.3967 16.9625 13.8139 17.1793 14.2313C17.4571 14.7664 17.7362 15.3008 18.0158 15.8349C18.2832 16.3459 18.5501 16.8572 18.8168 17.3685C18.8676 17.4657 18.9184 17.563 18.9707 17.6632C19.114 17.9378 19.2569 18.2127 19.3996 18.4876C19.4808 18.6439 19.5621 18.8001 19.6458 18.9611C20.1153 19.908 20.1831 20.9344 19.8634 21.9419C19.3494 23.0131 18.5549 23.8216 17.416 24.3018C16.1776 24.6689 15.087 24.5443 13.9381 24.0008C12.495 22.9633 11.8561 21.446 11.0969 19.9331C10.9177 19.5778 10.738 19.2228 10.5568 18.8685C10.4448 18.6494 10.334 18.4299 10.2248 18.2096C9.35534 16.505 8.10087 15.3201 6.21509 14.6472C5.16141 14.393 4.06802 14.3271 2.9873 14.2419C3.32776 13.5534 3.66929 12.8654 4.01297 12.1783C4.20762 11.7891 4.39903 11.3995 4.58504 11.0064C5.38892 9.34807 6.64104 8.3055 8.40643 7.62036C10.0775 7.34591 11.71 7.50367 13.1913 8.33803Z" />
          <path d="M24.7786 7.81195C26.0801 8.54235 26.847 9.63915 27.4403 10.9312C28.3856 12.9001 29.4096 14.8298 30.4313 16.7634C30.5816 17.048 30.7318 17.3325 30.8818 17.6172C31.0206 17.8805 31.1596 18.1436 31.299 18.4066C31.3611 18.5244 31.4231 18.6422 31.4871 18.7635C31.5415 18.8665 31.596 18.9695 31.6521 19.0756C32.1307 20.046 32.0786 21.1467 31.7201 22.1494C31.2478 23.1514 30.4081 23.7549 29.4414 24.311C28.1608 24.6418 27.0666 24.5683 25.8815 24.0009C24.5856 23.0558 23.9356 21.7314 23.2342 20.3698C23.1232 20.1575 23.0122 19.9453 22.9009 19.7332C22.6695 19.291 22.4393 18.8482 22.21 18.4049C21.9169 17.8382 21.6217 17.2726 21.3257 16.7073C21.0419 16.1652 20.7593 15.6225 20.4767 15.0799C20.4232 14.9773 20.3697 14.8748 20.3145 14.7691C20.1625 14.4776 20.0114 14.1856 19.8605 13.8935C19.7746 13.7279 19.6887 13.5623 19.6002 13.3916C19.0728 12.2892 18.8121 11.241 19.2009 10.0556C19.7218 8.95959 20.4901 8.29277 21.5616 7.68426C22.6633 7.38691 23.7197 7.36276 24.7786 7.81195Z" />
          <path d="M6.05164 17.2595C7.04963 17.8884 7.72282 18.6794 8.04252 19.7871C8.20352 20.8937 8.00894 21.9352 7.36753 22.8755C6.62027 23.772 5.72167 24.3427 4.52571 24.5263C3.24669 24.5857 2.25238 24.2699 1.29135 23.4598C0.4438 22.6034 0.0674781 21.7798 0 20.6079C0.0382661 19.5537 0.423524 18.7587 1.17347 17.9875C2.55751 16.7659 4.30572 16.3868 6.05164 17.2595Z" />
          <path d="M53.84 22H51.936V13.648L48.4 22H46.736L43.232 13.68V22H41.36V10.656H43.92L47.6 19.312L51.232 10.656H53.84V22ZM66.4511 22H59.4431V10.656H66.4511V12.448H61.3631V15.456H65.9711V17.2H61.3631V20.208H66.4511V22ZM78.6436 22H71.6356V10.656H78.6436V12.448H73.5556V15.456H78.1636V17.2H73.5556V20.208H78.6436V22ZM92.0815 12.464H88.3855V22H86.4655V12.464H82.7855V10.656H92.0815V12.464ZM98.4883 22H96.5363V10.656H98.4883V22ZM114.152 22H112.6L112.456 20.56C112.179 21.0293 111.741 21.4293 111.144 21.76C110.547 22.08 109.827 22.24 108.984 22.24C107.437 22.24 106.12 21.7067 105.032 20.64C103.944 19.5627 103.4 18.1227 103.4 16.32C103.4 15.1253 103.672 14.0693 104.216 13.152C104.771 12.2347 105.475 11.552 106.328 11.104C107.181 10.6453 108.109 10.416 109.112 10.416C110.424 10.416 111.523 10.7413 112.408 11.392C113.304 12.0427 113.912 12.8693 114.232 13.872L112.424 14.56C112.221 13.8773 111.832 13.312 111.256 12.864C110.68 12.416 109.965 12.192 109.112 12.192C108.099 12.192 107.219 12.5493 106.472 13.264C105.725 13.9787 105.352 14.9973 105.352 16.32C105.352 17.632 105.715 18.656 106.44 19.392C107.165 20.1173 108.051 20.48 109.096 20.48C110.12 20.48 110.899 20.2133 111.432 19.68C111.976 19.136 112.28 18.5547 112.344 17.936H108.6V16.256H114.152V22ZM121.759 13.312C121.012 14.0267 120.639 15.0293 120.639 16.32C120.639 17.6107 121.012 18.6187 121.759 19.344C122.505 20.0587 123.396 20.416 124.431 20.416C125.465 20.416 126.356 20.0587 127.103 19.344C127.86 18.6187 128.239 17.6107 128.239 16.32C128.239 15.0293 127.86 14.0267 127.103 13.312C126.356 12.5867 125.465 12.224 124.431 12.224C123.396 12.224 122.505 12.5867 121.759 13.312ZM119.487 19.488C118.943 18.5707 118.671 17.5147 118.671 16.32C118.671 15.1253 118.943 14.0747 119.487 13.168C120.041 12.2507 120.751 11.5627 121.615 11.104C122.479 10.6453 123.417 10.416 124.431 10.416C125.444 10.416 126.383 10.6453 127.247 11.104C128.111 11.5627 128.82 12.2507 129.375 13.168C129.929 14.0747 130.207 15.1253 130.207 16.32C130.207 17.5147 129.929 18.5707 129.375 19.488C128.82 20.4053 128.111 21.0933 127.247 21.552C126.383 22.0107 125.444 22.24 124.431 22.24C123.417 22.24 122.479 22.0107 121.615 21.552C120.751 21.0933 120.041 20.4053 119.487 19.488Z" />
        </svg>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 fill-white md:hidden block"
        >
          <path
            d="M13.1903 8.33797C14.6708 9.37207 15.4173 10.8449 16.2116 12.3795C16.3163 12.5797 16.4211 12.7798 16.526 12.9799C16.7442 13.3967 16.9616 13.8138 17.1783 14.2313C17.4561 14.7663 17.7352 15.3007 18.0148 15.8349C18.2823 16.3458 18.5491 16.8571 18.8159 17.3684C18.8666 17.4657 18.9174 17.5629 18.9698 17.6631C19.113 17.9378 19.2559 18.2126 19.3986 18.4876C19.4798 18.6438 19.5611 18.8 19.6448 18.961C20.1144 19.908 20.1821 20.9344 19.8625 21.9418C19.3485 23.0131 18.554 23.8215 17.415 24.3017C16.1766 24.6688 15.086 24.5442 13.9371 24.0007C12.494 22.9633 11.8551 21.4459 11.0959 19.933C10.9168 19.5777 10.7371 19.2227 10.5558 18.8684C10.4438 18.6494 10.333 18.4298 10.2238 18.2096C9.35436 16.5049 8.09989 15.32 6.21411 14.6471C5.16043 14.393 4.06704 14.327 2.98633 14.2418C3.32678 13.5533 3.66831 12.8653 4.01199 12.1783C4.20664 11.789 4.39805 11.3994 4.58406 11.0063C5.38794 9.34801 6.64007 8.30544 8.40546 7.6203C10.0765 7.34585 11.709 7.50361 13.1903 8.33797Z"
            fill="#FAFAFB"
          />
          <path
            d="M24.7779 7.81182C26.0794 8.54222 26.8463 9.63902 27.4396 10.931C28.3848 12.9 29.4089 14.8296 30.4306 16.7633C30.5809 17.0478 30.7311 17.3324 30.8811 17.6171C31.0199 17.8803 31.1589 18.1435 31.2982 18.4065C31.3603 18.5243 31.4224 18.6421 31.4864 18.7634C31.5408 18.8664 31.5953 18.9694 31.6514 19.0754C32.1299 20.0459 32.0778 21.1466 31.7194 22.1493C31.247 23.1513 30.4074 23.7548 29.4407 24.3108C28.16 24.6417 27.0659 24.5681 25.8808 24.0007C24.5849 23.0557 23.9349 21.7312 23.2334 20.3696C23.1225 20.1574 23.0114 19.9452 22.9002 19.7331C22.6688 19.2909 22.4386 18.8481 22.2093 18.4048C21.9162 17.8381 21.621 17.2724 21.3249 16.7071C21.0412 16.165 20.7586 15.6224 20.476 15.0797C20.4225 14.9772 20.3689 14.8746 20.3138 14.769C20.1618 14.4774 20.0106 14.1855 19.8598 13.8934C19.7739 13.7278 19.688 13.5622 19.5995 13.3915C19.072 12.289 18.8113 11.2408 19.2002 10.0555C19.7211 8.95946 20.4894 8.29264 21.5609 7.68413C22.6626 7.38678 23.719 7.36263 24.7779 7.81182Z"
            fill="#FAFAFB"
          />
          <path
            d="M6.05164 17.2596C7.04963 17.8884 7.72282 18.6795 8.04252 19.7871C8.20352 20.8937 8.00894 21.9353 7.36753 22.8755C6.62027 23.772 5.72167 24.3427 4.52571 24.5263C3.24669 24.5858 2.25238 24.2699 1.29135 23.4598C0.4438 22.6035 0.0674781 21.7798 0 20.6079C0.0382661 19.5537 0.423524 18.7587 1.17347 17.9875C2.55751 16.7659 4.30572 16.3868 6.05164 17.2596Z"
            fill="#FAFAFB"
          />
        </svg>
      </Link>

      <nav
  className={`absolute lg:relative z-10 lg:z-auto top-16 lg:top-auto left-0 right-0 lg:right-auto bg-primary-900 px-6 py-4 lg:p-0 
  ${toggleMenu ? "flex" : "hidden lg:flex"}
  lg:flex-row flex-col space-y-6 lg:space-y-0 lg:space-x-6 tracking-widest
  transition-all duration-300 ease-in-out
  ${toggleMenu ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 lg:translate-y-0 lg:opacity-100"}`}
>
  <Link
    href="/event"
    className={`${
      path == "/event" ? "text-white" : "text-primary-500"
    } hover:text-white transition-all ease-in-out py-2`}
  >
    EVENT TYPES
  </Link>
  <Link
    href="/meetings"
    className={`${
      path == "/meetings" || path == "/meetings/past"
        ? "text-white"
        : "text-primary-500"
    } hover:text-white transition-all ease-in-out py-2`}
  >
    MEETINGS
  </Link>
  <Link
    href="/availability"
    className={`${
      path == "/availability" || path == "/availability/calendar"
        ? "text-white"
        : "text-primary-500"
    } hover:text-white transition-all ease-in-out py-2`}
  >
    AVAILABILITY
  </Link>
</nav>
      {toggleMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setToggleMenu(false)}
        />
      )}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {userLink && (
          <div className="bg-primary-800 text-primary-300 px-3 sm:px-6 py-2 rounded-full flex items-center space-x-2">
            <span className="text-base w-full text-nowrap">
              meetig.io/{userLink}
            </span>

            <button
              type="button"
              className="cursor-pointer"
              onClick={() => copyToClipboard(`https://meetig.io/${userLink}`)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 fill-primary-400 hover:fill-primary-100 transition-all ease-in-out"
              >
                <path d="M14.875 0.5H4.875C4.70924 0.5 4.55027 0.565848 4.43306 0.683058C4.31585 0.800269 4.25 0.95924 4.25 1.125V4.25H1.125C0.95924 4.25 0.800269 4.31585 0.683058 4.43306C0.565848 4.55027 0.5 4.70924 0.5 4.875V14.875C0.5 15.0408 0.565848 15.1997 0.683058 15.3169C0.800269 15.4342 0.95924 15.5 1.125 15.5H11.125C11.2908 15.5 11.4497 15.4342 11.5669 15.3169C11.6842 15.1997 11.75 15.0408 11.75 14.875V11.75H14.875C15.0408 11.75 15.1997 11.6842 15.3169 11.5669C15.4342 11.4497 15.5 11.2908 15.5 11.125V1.125C15.5 0.95924 15.4342 0.800269 15.3169 0.683058C15.1997 0.565848 15.0408 0.5 14.875 0.5ZM10.5 14.25H1.75V5.5H10.5V14.25ZM14.25 10.5H11.75V4.875C11.75 4.70924 11.6842 4.55027 11.5669 4.43306C11.4497 4.31585 11.2908 4.25 11.125 4.25H5.5V1.75H14.25V10.5Z" />
              </svg>
            </button>
          </div>
        )}
        <button
          className="outline-none cursor-pointer rounded-full w-9 h-9 sm:w-10 sm:h-10 overflow-hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {usrImg ? (
            <Image
              src={usrImg}
              alt="Profile Image"
              className="w-10 h-10 rounded-full object-cover object-center"
              width={40}
              height={40}
            />
          ) : (
            userNm?.charAt(0).toUpperCase()
          )}
        </button>
        {isOpen && (
          <div className="absolute right-0 top-16 w-48 bg-primary-900 border border-primary-800 rounded-lg shadow-lg py-1 z-10">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-primary-200 hover:bg-primary-300 transition-all ease-in-out"
            >
              Profile
            </Link>
            <Link
              href="/profile/my-link"
              className="block px-4 py-2 text-sm text-primary-200 hover:bg-primary-300 transition-all ease-in-out"
            >
              My Link
            </Link>
            <Link
              href="/profile/account"
              className="block px-4 py-2 text-sm text-primary-200 hover:bg-primary-300 transition-all ease-in-out"
            >
              Account
            </Link>
            <div className="border-t border-primary-800 my-1"></div>
            <button
              className="w-full cursor-pointer text-left px-4 py-2 text-sm text-primary-200 hover:bg-primary-300 transition-all ease-in-out"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
        )}
        {isOpen && (
          <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
        )}
        <button
          type="button"
          className="lg:hidden rounded-full p-2 sm:p-2.5 text-xl bg-primary-800 text-primary-400 hover:text-primary-100 transition-all ease-in-out cursor-pointer"
          onClick={() => setToggleMenu(!toggleMenu)}
        >
          <FiMenu />
        </button>
      </div>
    </header>
  );
}
