import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import { useEditTemplate, useTemplate } from "../../../api/RQHook";
import "./MTemplate.css";
import ModalNavButton from "../../navigation/ModalNavButton";

const TemplateEditModal = ({
  isOpen,
  editMode = false,
  templateId,
  onClose,
}) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const [osSystem, setOsSystem] = useState(""); // 운영체제 string
  const [chipsetFirmwareType, setChipsetFirmwareType] = useState(""); // string
  const [stateless, setStateless] = useState(false); // 상태비저장
  const [startPaused, setStartPaused] = useState(false); // 일시정지상태에서시작
  const [deleteProtected, setDeleteProtected] = useState(false); // 일시정지상태에서시작
  const [clsuterVoId, setClsuterVoId] = useState("");
  const [clsuterVoName, setClsuterVoName] = useState("");

  const { mutate: editTemplate } = useEditTemplate();

  
  // 최적화옵션(영어로 값바꿔야됨)
  const [optimizeOption, setOptimizeOption] = useState([
    { value: "desktop", label: "데스크톱" },
    { value: "high_performance", label: "고성능" },
    { value: "server", label: "서버" },
  ]);

  const tabs = [
    { id: "general", label: "일반" },
    { id: "console", label: "콘솔" },
  ];
  useEffect(() => {
    if (isOpen) {
      setActiveTab("general"); // 모달이 열릴 때 기본적으로 "general" 설정
    }
  }, [isOpen]);
  const [activeTab, setActiveTab] = useState("general");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  //해당데이터 상세정보 가져오기
  const { data: templateData } = useTemplate(templateId);
  const [selectedOptimizeOption, setSelectedOptimizeOption] =
    useState("server"); // 칩셋 선택
  const [selectedChipset, setSelectedChipset] = useState("Q35_OVMF"); // 칩셋 선택

  // 초기값설정
  useEffect(() => {
    if (isOpen) {
      const template = templateData;
      if (template) {
        setId(template?.id || "");
        setName(template?.name || ""); // 이름안뜸
        setDescription(template?.description || "");
        setComment(template?.comment || "");
        setOsSystem(template?.osSystem || "");
        setStateless(template?.stateless || false);
        setClsuterVoId(template.clusterVo?.id || "");
        setClsuterVoName(template.clusterVo?.name || "");
        setStartPaused(template?.startPaused || false);
        setDeleteProtected(template?.deleteProtected || false);
        setSelectedOptimizeOption(template?.optimizeOption || "server");
        setSelectedChipset(template?.chipsetFirmwareType || "Q35_OVMF");
      }
    }
  }, [isOpen, templateData]);

  const handleFormSubmit = () => {
    if (name === "") {
      toast.error("이름을 입력해주세요.");
      return;
    }
    const dataToSubmit = {
      clusterVo: {
        id: clsuterVoId || "",
        name: clsuterVoName || "",
      },
      id,
      name,
      description,
      comment,
      optimizeOption: selectedOptimizeOption,
      osSystem,
    };
    console.log("템플릿 Data:", dataToSubmit);
    if (editMode) {
      dataToSubmit.id = id;
      editTemplate(
        {
          templateId: id,
          templateData: dataToSubmit,
        },
        {
          onSuccess: () => {
            onClose();
            toast.success("템플릿 편집 완료");
          },
          onError: (error) => {
            toast.error("Error editing cluster:", error);
          },
        }
      );
    }
  };

  return (
    
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"템플릿"}
      submitTitle={editMode ? "수정" : "생성"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "800px", height: "470px" }} 
    >
      {/* <div className="template-eidt-popup modal"> */}
      <div className="flex">
        {/* 왼쪽 네비게이션 */}
        <ModalNavButton tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />

        <div className="backup-edit-content">
          <div
            className="template-option-box center"
            style={{
              borderBottom: "1px solid #a7a6a6",
              paddingBottom: "0.3rem",
            }}
          >
            <label htmlFor="optimization">최적화 옵션</label>
            <select
              id="optimization"
              value={selectedOptimizeOption} // 선택된 값과 동기화
              onChange={(e) => setSelectedOptimizeOption(e.target.value)} // 값 변경 핸들러
            >
              {optimizeOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} {/* UI에 표시되는 값 */}
                </option>
              ))}
            </select>
            {/* <span>선택된 최적화 옵션: {optimizeOption.find(opt => opt.value === selectedOptimizeOption)?.value || ''}</span> */}
          </div>
          {activeTab  === "general" && (
            <>
              <div className="template-edit-texts">
                <div className="host-textbox">
                  <label htmlFor="template_name">이름</label>
                  <input
                    type="text"
                    id="template_name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="host-textbox">
                  <label htmlFor="description">설명</label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="host-textbox">
                  <label htmlFor="comment">코멘트</label>
                  <input
                    type="text"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex">
                <div className="t-new-checkbox">
                  <input
                    type="checkbox"
                    id="stateless"
                    checked={stateless} // 상태에 따라 체크 상태 설정
                    onChange={(e) => setStateless(e.target.checked)} // 값 변경 핸들러
                  />
                  <label htmlFor="stateless">상태 비저장</label>
                </div>
                <div className="t-new-checkbox">
                  <input
                    type="checkbox"
                    id="start_in_pause_mode"
                    checked={startPaused} // 상태에 따라 체크 상태 설정
                    onChange={(e) => setStartPaused(e.target.checked)} // 값 변경 핸들러
                  />
                  <label htmlFor="start_in_pause_mode">
                    일시정지 모드에서 시작
                  </label>
                </div>
                <div className="t-new-checkbox">
                  <input
                    type="checkbox"
                    id="prevent_deletion"
                    checked={deleteProtected} // 상태에 따라 체크 상태 설정
                    onChange={(e) => setDeleteProtected(e.target.checked)} // 값 변경 핸들러
                  />
                  <label htmlFor="prevent_deletion">삭제 방지</label>
                </div>
              </div>
            </>
          )}
          {activeTab  === "console" && (
            <>
              <div className="p-1.5">
                <div className="font-bold">그래픽 콘솔</div>
                <div className="monitor center">
                  <label htmlFor="monitor-select">모니터</label>
                  <select id="monitor-select">
                    <option value="1">1</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default TemplateEditModal;
