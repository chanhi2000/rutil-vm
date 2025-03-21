import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useDeleteVnicProfile } from "../../../api/RQHook";

const VnicProfileDeleteModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const [ids, setIds] = useState([]);
  const [names, setNames] = useState([]);
  const { mutate: deleteVnicProfile } = useDeleteVnicProfile();

  useEffect(() => {
    if (Array.isArray(data)) {
      const ids = data.map((item) => item.id);
      const names = data.map((item) => item.name); // name이 없는 경우 처리
      setIds(ids);
      setNames(names);
    } else if (data) {
      setIds([data.id]);
      setNames([data.name]);
    }
  }, [data]);

  const handleFormSubmit = async () => {
    if (!ids.length) {
      toast.error("삭제할 vnicProfile ID가 없습니다.");
      return;
    }

    const deletePromises = ids.map(
      (vnicId, index) =>
        new Promise((resolve, reject) => {
          deleteVnicProfile(vnicId, {
            onSuccess: () => {
              toast.success(`vnicProfile ID ${vnicId} 삭제 성공`);
              resolve(); // 성공 시 resolve
            },
            onError: (error) => {
              toast.error(
                `vnicProfile ID ${vnicId} 삭제 오류: ${error.message || "알 수 없는 오류"}`
              );
              reject(error); // 에러 시 reject
            },
          });
        })
    );

    try {
      await Promise.all(deletePromises); // 모든 삭제 요청 완료
      onClose(); // Modal 닫기
      navigate("/vnicProfiles"); // 성공 시 페이지 이동
    } catch (error) {
      console.error("삭제 중 오류 발생:", error); // 상세 에러 로그
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={"vNic 프로필"}
      submitTitle={"삭제"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="storage-delete-popup modal"> */}
      <div className="disk-delete-box">
        <div>
          <FontAwesomeIcon
            style={{ marginRight: "0.3rem" }}
            icon={faExclamationTriangle}
          />
          <span> {names.join(", ")} 를(을) 삭제하시겠습니까? </span>
        </div>
      </div>
    </BaseModal>
  );
};

export default VnicProfileDeleteModal;
