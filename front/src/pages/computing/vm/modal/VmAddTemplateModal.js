import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../css/MVm.css';
import { 
  useAddTemplate, 
  useAllDiskProfileFromDomain, 
  useClustersFromDataCenter, 
  useCpuProfilesFromCluster, 
  useDiskById, 
  useDisksFromVM, 
  useDomainsFromDataCenter 
} from '../../../../api/RQHook'; // 클러스터 가져오는 훅
import toast from 'react-hot-toast';

const VmAddTemplateModal = ({ 
  isOpen, 
  onRequestClose, 
  selectedVm,
  vmId
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');
  const [isSubtemplate, setIsSubtemplate] = useState(false); 
  const [rootTemplate, setRootTemplate] = useState('');
  const [subVersionName, setSubVersionName] = useState(''); // 서브템플릿 버전 생성
  const [allowAllAccess, setAllowAllAccess] = useState(true); // 모든 사용자에게 허용
  const [copyVmPermissions, setCopyVmPermissions] = useState(false); // 권한 복사
  const [sealTemplate, setSealTemplate] = useState(false); // 템플릿봉인

  const [dataCenterId, setDataCenterId] = useState('');
  const [clusters, setClusters] = useState([]); // 클러스터 목록 상태
  const [selectedCluster, setSelectedCluster] = useState(''); // 선택된 클러스터 ID
  const [forceRender, setForceRender] = useState(false);// 선택된 대상
  const [selectedCpuProfile, setSelectedCpuProfile] = useState(''); // 선택된 CPU 프로파일 ID
  
  useEffect(() => {
    console.log('VM ID아아아:', vmId); //잘찍힘
  }, [vmId]);
  console.log('vmId:', vmId);
  console.log('vmVo:', {
    id: selectedVm?.id || '',
    name: selectedVm?.name || '',
  });
  // 데이터센터 ID 가져오기
  useEffect(() => {
    if (selectedVm?.dataCenterId) {
      setDataCenterId(selectedVm.dataCenterId);
    }
  }, [selectedVm]);

  // 데이터센터 ID 기반으로 클러스터 목록 가져오기
  const { data: clustersFromDataCenter } = useClustersFromDataCenter(dataCenterId, (cluster) => ({
    id: cluster.id,
    name: cluster.name,
  }));
  useEffect(() => {
    if (clustersFromDataCenter) {
      setClusters(clustersFromDataCenter);
      if (selectedVm?.clusterVo?.id) {
        setSelectedCluster(selectedVm.clusterVo.id);
      } else if (clustersFromDataCenter.length > 0) {
        // 선택된 VM에 클러스터가 없을 경우, 첫 번째 클러스터를 기본값으로 설정
        setSelectedCluster(clustersFromDataCenter[0].id);
      }
    }
  }, [clustersFromDataCenter]);


  // 디스크할당
  // 가상머신에 연결되어있는 디스크
  const { data: disks } = useDisksFromVM(selectedVm?.id || '', (e) => ({
    ...e,
  }));
  useEffect(() => {
    if (disks) {
      console.log("가상머신에 연결된 디스크 데이터:", disks);
      console.log("가상머신 id:", selectedVm.id);
    }
  }, [disks]);




 // 데이터센터 ID 기반으로 스토리지목록 가져오기
  const {  data: storageFromDataCenter, } = useDomainsFromDataCenter(dataCenterId , (e) =>({
    ...e,
  })); 
  useEffect(() => {
    console.log("Storage from Data Center:", storageFromDataCenter);
    console.log("Data Center ID:", dataCenterId);
  }, [storageFromDataCenter]);

  // 선택한 스토리지 ID에 따라 디스크 프로파일 가져오기
  const [selectedStorageId, setSelectedStorageId] = useState('');
  const { data: diskProfiles, refetch: fetchDiskProfiles } = useAllDiskProfileFromDomain(selectedStorageId, (e) =>({
    ...e,
  })); 
  useEffect(() => {
    if (selectedStorageId) {
      console.log('Fetching disk profiles for storage ID:', selectedStorageId);
      console.log("diskProfiles정보:", diskProfiles);
      fetchDiskProfiles(); // 선택된 스토리지 ID에 따라 훅 실행
    }
  }, [selectedStorageId]);
// 스토리지 도메인 첫 번째 값 기본 설정
useEffect(() => {
  if (isOpen && storageFromDataCenter && storageFromDataCenter.length > 0) {
    setSelectedStorageId(storageFromDataCenter[0].id);
  }
}, [isOpen, storageFromDataCenter]);

// 디스크 프로파일 첫 번째 값 기본 설정
useEffect(() => {
  if (isOpen && selectedStorageId && diskProfiles && diskProfiles.length > 0) {
    // 모든 디스크의 디스크 프로파일을 첫 번째 값으로 설정
    if (disks) {
      disks.forEach((disk, index) => {
        if (!disk.diskImageVo?.diskProfileVo?.id) {
          disks[index].diskImageVo.diskProfileVo = {
            id: diskProfiles[0].id,
            name: diskProfiles[0].name,
          };
        }
      });
      setForceRender((prev) => !prev); // 강제로 상태 업데이트
    }
  }
}, [isOpen, selectedStorageId, diskProfiles, disks]);

  // 클러스터 ID 기반으로 CPU 프로파일 목록 가져오기
  const { data: cpuProfiles } = useCpuProfilesFromCluster(
    selectedCluster,
    (profile) => ({
      id: profile.id,
      name: profile.name,
    })
  );
  // CPU 프로파일 첫 번째 값 기본 선택
  useEffect(() => {
    if (cpuProfiles && cpuProfiles.length > 0) {
      setSelectedCpuProfile(cpuProfiles[0].id); // 첫 번째 프로파일 ID를 기본값으로 설정
    }
  }, [cpuProfiles]);

const { mutate: addTemplate} = useAddTemplate();

// 포맷옵션
const format = [
  { value: 'RAW', label: 'Raw' },
  { value: 'COW', label: 'cow' },
];
const [selectedFormat, setSelectedFormat] = useState('RAW');

const handleFormSubmit = () => {
  if (!name) {
    toast.error('이름을 입력하세요.');
    return;
  }
  if (!selectedCluster) {
    toast.error('클러스터를 선택하세요.');
    return;
  }

  // 모든 디스크 데이터를 수집
  const disksToSubmit = disks.map((disk) => ({
    id: disk.diskImageVo?.id || '',
    size: disk.diskImageVo?.size || 0,
    alias: disk.diskImageVo?.alias || '',
    description: disk.diskImageVo?.description || '',
    format: disk.diskImageVo?.format || 'RAW',
    sparse: disk.diskImageVo?.sparse || false,
    storageDomainVo: {
      id: disk.diskImageVo?.storageDomainVo?.id || '',
      name: disk.diskImageVo?.storageDomainVo?.name || '',
    },
    diskProfileVo: {
      id: disk.diskImageVo?.diskProfileVo?.id || '',
      name: disk.diskImageVo?.diskProfileVo?.name || '',
    },
  }));

  const dataToSubmit = {
    name,
    description,
    comment,
    clusterVo: {
      id: selectedCluster || '', // 기본값 설정
      name: clusters.find((cluster) => cluster.id === selectedCluster)?.name || '',
    },
    cpuProfileVo: {
      id: selectedCpuProfile,
      name: cpuProfiles?.find((profile) => profile.id === selectedCpuProfile)?.name || '',
    },
    vmVo: {
      id: vmId || '', // 가상머신 ID 추가
      name: selectedVm?.name || '',
    },
    disks: disksToSubmit, // 모든 디스크 데이터를 포함
  };

  console.log('템플릿 생성데이터:', dataToSubmit);
  addTemplate(
    {vmId, templateData: dataToSubmit},
    {
    onSuccess: () => {
      onRequestClose();
      toast.success('템플릿 생성 완료');
    },
    onError: (error) => {
      toast.error('Error adding Template:', error);
    },
  });
};

  


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="새 템플릿"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="new-template-popup" style={{ height: isSubtemplate ? '88vh' : '77vh' }}>
        <div className="popup-header">
          <h1>새 템플릿</h1>
          <button onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="edit-first-content">
          <div className="host_textbox">
            <label htmlFor="user_name">이름</label>
            <input
              type="text"
              id="user_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="host_textbox">
            <label htmlFor="description">설명</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="host_textbox">
            <label htmlFor="comment">코멘트</label>
            <input
              type="text"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="edit_fourth_content_select flex">
            <label htmlFor="cluster_select">클러스터</label>
            <select
              id="cluster_select"
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
            >
              {clusters.length > 0 ? (
                clusters.map((cluster) => (
                  <option key={cluster.id} value={cluster.id}>
                    {cluster.name}
                  </option>
                ))
              ) : (
                <option value="">클러스터 없음</option>
              )}
            </select>
          </div>
          <div className="edit_fourth_content_select flex">
            <label htmlFor="cpu_profile_select">CPU 프로파일</label>
            <select
              id="cpu_profile_select"
              value={selectedCpuProfile}
              onChange={(e) => setSelectedCpuProfile(e.target.value)}
            >
              {cpuProfiles?.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div>
          <div className="vnic-new-checkbox">
            <input
              type="checkbox"
              id="create_as_subtemplate"
              checked={isSubtemplate}
              onChange={() => setIsSubtemplate(!isSubtemplate)}
            />
            <label htmlFor="create_as_subtemplate">서브 템플릿 버전으로 생성</label>
          </div>
        </div>

        {isSubtemplate && (
          <div className="subtemplate_fields">
            <div className="network-form-group">
              <label htmlFor="root_template">Root 템플릿</label>
              <select
                id="root_template"
                value={rootTemplate}
                onChange={(e) => setRootTemplate(e.target.value)}
              >
                <option value="">선택하세요</option>
                <option value="template-1">template-1</option>
                <option value="template-2">template-2</option>
              </select>
            </div>

            <div className="network_form_group mb-1.5">
              <label htmlFor="sub_version_name">하위 버전 이름</label>
              <input
                type="text"
                id="sub_version_name"
                value={subVersionName}
                onChange={(e) => setSubVersionName(e.target.value)}
              />
            </div>
          </div>
        )}

        {disks && disks.length > 0 && (
          <>
            <div className="font-bold">디스크 할당:</div>
            <div className="section-table-outer py-1">
              <table>
                <thead>
                  <tr>
                    <th>별칭</th>
                    <th>가상 크기</th>
                    <th>포맷</th>
                    <th>대상</th>
                    <th>디스크 프로파일</th>
                  </tr>
                </thead>
                <tbody>
                  {disks.map((disk,index) => (
                    <tr key={disk.id}>
                      <td>{disk.diskImageVo?.alias || "없음"}</td>
                      <td>{(disk.diskImageVo?.virtualSize / (1024 ** 3) || 0).toFixed(0)} GiB</td>
                      <td>
                      <select
                        id={`format-${index}`}
                        value={disk.diskImageVo?.format || "RAW"} // 기본값 설정
                        onChange={(e) => {
                          const newFormat = e.target.value;
                          disks[index].diskImageVo.format = newFormat; // 디스크 데이터 업데이트
                          setSelectedFormat(newFormat); // 상태 업데이트 (선택적)
                        }}
                      >
                        {format.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} {/* 화면에 표시될 한글 */}
                          </option>
                        ))}
                      </select>
                      <span> 선택된 포맷: {disk.diskImageVo?.format || "RAW"}</span>
                    </td>
                    <td>
                        <select
                          value={disk.diskImageVo?.storageDomainVo?.id || ""}
                          onChange={(e) => {
                            const selectedStorage = storageFromDataCenter.find(
                              (storage) => storage.id === e.target.value
                            );
                            if (selectedStorage) {
                              disk.diskImageVo.storageDomainVo = {
                                id: selectedStorage.id,
                                name: selectedStorage.name,
                              };
                              setSelectedStorageId(selectedStorage.id);
                              setForceRender((prev) => !prev);
                            }
                          }}
                        >
                          {storageFromDataCenter &&
                            storageFromDataCenter.map((storage) => (
                              <option key={storage.id} value={storage.id}>
                                {storage.name}
                              </option>
                            ))}
                        </select>
                    </td>

                    <td>
                      {selectedStorageId && diskProfiles ? (
                        <select
                          value={disk.diskImageVo?.diskProfileVo?.id || ""}
                          onChange={(e) => {
                            const selectedProfile = diskProfiles.find(
                              (profile) => profile.id === e.target.value
                            );
                            if (selectedProfile) {
                              disk.diskImageVo.diskProfileVo = {
                                id: selectedProfile.id,
                                name: selectedProfile.name,
                              };
                              setForceRender((prev) => !prev);
                            }
                          }}
                        >
                          {diskProfiles.map((profile) => (
                            <option key={profile.id} value={profile.id}>
                              {profile.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>디스크 프로파일을 로드 중입니다...</span>
                      )}
                    </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {!disks || disks.length === 0 ? (
          <div className="font-bold">연결된 디스크 데이터가 없습니다.</div>
        ) : null}

        <div className="vnic-new-checkbox">
          <input
            type="checkbox"
            id="allow_all_access"
            checked={allowAllAccess}
            onChange={() => setAllowAllAccess(!allowAllAccess)}
          />
          <label htmlFor="allow_all_access">모든 사용자에게 이 템플릿 접근을 허용</label>
        </div>
        <div className="vnic-new-checkbox">
          <input
            type="checkbox"
            id="copy_vm_permissions"
            checked={copyVmPermissions}
            onChange={() => setCopyVmPermissions(!copyVmPermissions)}
          />
          <label htmlFor="copy_vm_permissions">가상 머신 권한 복사</label>
        </div>
        <div className="vnic-new-checkbox">
          <input
            type="checkbox"
            id="seal_template_linux_only"
            checked={sealTemplate}
            onChange={() => setSealTemplate(!sealTemplate)}
          />
          <label htmlFor="seal_template_linux_only">템플릿 봉인 (Linux만 해당)</label>
        </div>

        <div className="edit-footer">
          <button onClick={handleFormSubmit}>OK</button>
          <button onClick={onRequestClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default VmAddTemplateModal;
