import React, { useState, useEffect, createContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../Input/IconButton";
import "./HeaderButton.css";

const HeaderButtonContext = createContext();

/**
 * @name HeaderButton
 * @description 헤더 버튼
 * 
 * @param {string} title 제목
 * @param {string} status 상태태
 * @returns 
 */
const HeaderButton = ({
  title,
  status,
  buttons = [],
  popupItems = [],
  titleIcon,
}) => {
  const [isPopupBoxVisible, setIsPopupBoxVisible] = useState(false);
  const togglePopupBox = () => setIsPopupBoxVisible(!isPopupBoxVisible);
  const handlePopupBoxItemClick = (item) => {
    console.log(`HeaderButton > handlePopupBoxItemClick ... item: ${item}`)
    if (item.disabled) 
      return; // disabled 상태면 클릭 이벤트 무시
    if (item.onClick)
      item.onClick();
    console.log(`Clicked on ${item.label}`);
    setIsPopupBoxVisible(false);
  };

  // 팝업 외부 클릭 시 닫히도록 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log("HeaderButton > handleClickOutside ...")
      const popupBox = document.querySelector(".popup-box");
      const popupBtn = document.querySelector(".popup-btn");
      if (
        popupBox &&
        !popupBox.contains(event.target) &&
        popupBtn &&
        !popupBtn.contains(event.target)
      ) {
        setIsPopupBoxVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log("...")
  return (
    <div className="section-header center">
      <div className="flex text-(--color-primary-h) section-header-left">
        <div className="flex justify-center align-center">
          {/* {titleIcon && (
            <FontAwesomeIcon
              icon={titleIcon}
              className="title_icon"
              style={{ marginRight: "12px" }}
            />
          )} */}
          <p className="mr-2">{title}</p>
          <div
            className={`flex justify-center mr-1 status-label ${
              status === "실행중" ? "running" : status === "중지" ? "stopped" : "default"
            }`}
          >
            {status}
          </div>
        </div>
      </div>
      <div className="section-header-buttons">
        <div className="flex justify-end article-nav">
          {buttons.map((button, index) => (
            <IconButton
              id={button.id}
              key={index}
              label={button.label}
              icon={button.icon}
              onClick={button.onClick}
              disabled={button.disabled}
            />
          ))}
          {popupItems && popupItems.length > 0 && (
            <button className="popup-btn" onClick={togglePopupBox}>
              <FontAwesomeIcon icon={faEllipsisV} fixedWidth />
              <div
                className="popup-box"
                style={{ display: isPopupBoxVisible ? "block" : "none" }}
              >
                {popupItems.map((item, index) => (
                  <div
                    key={index}
                    className={`popup_item ${item.disabled ? "disabled" : ""}`}
                    onClick={(e) => {
                      if (!item.disabled) {
                        e.stopPropagation();
                        handlePopupBoxItemClick(item);
                      }
                    }}
                    disabled={item.disabled} // 실제 disabled 속성 반영
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

HeaderButton.CREATE = ({

}) => {

}

HeaderButton.UPDATE = ({
  
}) => {

}

export default HeaderButton;
