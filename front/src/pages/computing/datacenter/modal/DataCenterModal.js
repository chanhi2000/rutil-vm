import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-hot-toast';
import '../css/MDatacenter.css'
import { useAddDataCenter,  useEditDataCenter, useDataCenter } from '../../../../api/RQHook'
import { CheckKoreanName, CheckName } from '../../../../utils/CheckName';
import LabelInput from '../../../../utils/LabelInput';
import LabelSelectOptions from '../../../../utils/LabelSelectOptions';
import { xButton } from '../../../../utils/Icon';

const initialFormState = {
  id: '',
  name: '',
  comment: '',
  description: '',
  storageType: false,
  version: '4.7',
  quotaMode: 'DISABLED',
};

const storageTypes = [
  { value: 'false', label: '공유됨' },
  { value: 'true', label: '로컬' },
];

const quotaModes = [
  { value: 'DISABLED', label: '비활성화됨' },
  { value: 'AUDIT', label: '감사' },
  { value: 'ENABLED', label: '활성화됨' },
];

const versions = [
  { value: '4.7', label: 4.7 },
];

const DataCenterModal = ({ isOpen, editMode = false, dcId, onClose }) => {
  const dcLabel = editMode ? '편집' : '생성';
  const [formState, setFormState] = useState(initialFormState);

  const { mutate: addDataCenter } = useAddDataCenter();
  const { mutate: editDataCenter } = useEditDataCenter();
  const { data: datacenter } = useDataCenter(dcId);

  // 모달 열릴때 초기화, 편집 정보넣기
  useEffect(() => {
    if (!isOpen)
      return setFormState(initialFormState);
    if (editMode && datacenter) {
      setFormState({
        id: datacenter.id,
        name: datacenter.name,
        comment: datacenter.comment,
        description: datacenter.description,
        storageType: String(datacenter.storageType),
        version: datacenter.version,
        quotaMode: datacenter.quotaMode,
      });
    }
  }, [isOpen, editMode, datacenter]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // 값 검증
  const validateForm = () => {
    if (!CheckKoreanName(formState.name) || !CheckName(formState.name)) return '이름이 유효하지 않습니다.';
    if (!CheckKoreanName(formState.description)) return '영어만 입력가능.';
    return null;
  };

  // 제출
  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const dataToSubmit = { ...formState };
    const onSuccess = () => {
      onClose();
      toast.success(`데이터센터 ${dcLabel} 완료`);
    };
    const onError = (err) => toast.error(`Error ${dcLabel} data center: ${err}`);

    editMode
      ? editDataCenter({ dataCenterId: formState.id, dataCenterData: dataToSubmit }, { onSuccess, onError })
      : addDataCenter(dataToSubmit, { onSuccess, onError });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel={dcLabel} className="Modal" overlayClassName="Overlay" shouldCloseOnOverlayClick={false}>
      <div className="datacenter-new-popup modal">
        <div className="popup-header">
          <h1>데이터센터 {dcLabel}</h1>
          <button onClick={onClose}>{ xButton() }</button>
        </div>

        <div className="datacenter-new-content modal-content">
          <LabelInput label="이름" id="name" value={formState.name} onChange={handleInputChange('name')} autoFocus />
          <LabelInput label="설명" id="description" value={formState.description} onChange={handleInputChange('description')} />
          <LabelInput label="코멘트" id="comment" value={formState.comment} onChange={handleInputChange('comment')} />
          <LabelSelectOptions label="스토리지 타입" value={String(formState.storageType)} onChange={handleInputChange('storageType')} options={storageTypes} />
          <LabelSelectOptions label="쿼터 모드" value={formState.quotaMode} onChange={handleInputChange('quotaMode')} options={quotaModes} />
          <LabelSelectOptions label="호환버전" value={formState.version} onChange={handleInputChange('version')} options={versions} />
        </div>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={ handleFormSubmit }>{dcLabel}</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default DataCenterModal;
